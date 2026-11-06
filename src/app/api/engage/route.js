import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseReady, sbSelect, sbUpsert, sbInsert, sbDelete } from "../../../lib/supabase";

const TYPES = ["review", "article", "blog"];
const SLUG = /^[a-z0-9][a-z0-9-]{0,120}$/i;
const COOKIE = "tfd_vid";

function valid(type, slug) {
  return TYPES.indexOf(type) > -1 && typeof slug === "string" && SLUG.test(slug);
}

async function voterId(create) {
  const jar = await cookies();
  const existing = jar.get(COOKIE);
  if (existing && existing.value) return { id: existing.value, fresh: false };
  if (!create) return { id: null, fresh: false };
  return { id: randomUUID(), fresh: true };
}

function withCookie(res, v) {
  if (v.fresh) {
    res.cookies.set(COOKIE, v.id, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}

async function load(type, slug, vid) {
  const q = "post_type=eq." + type + "&slug=eq." + encodeURIComponent(slug);
  const results = await Promise.all([
    sbSelect("reactions", "select=value,voter_id&" + q + "&limit=100000"),
    sbSelect("comments", "select=id,name,body,created_at&" + q + "&status=eq.approved&order=created_at.desc&limit=100"),
  ]);
  let likes = 0, dislikes = 0, mine = 0;
  results[0].forEach(function (r) {
    if (r.value === 1) likes++;
    else dislikes++;
    if (vid && r.voter_id === vid) mine = r.value;
  });
  return { likes: likes, dislikes: dislikes, mine: mine, comments: results[1] };
}

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const type = p.get("type"), slug = p.get("slug");
  if (!valid(type, slug)) return NextResponse.json({ error: "bad request" }, { status: 400 });
  if (!supabaseReady()) return NextResponse.json({ likes: 0, dislikes: 0, mine: 0, comments: [], disabled: true });
  try {
    const v = await voterId(false);
    return NextResponse.json(await load(type, slug, v.id));
  } catch (e) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

export async function POST(req) {
  if (!supabaseReady()) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  let body;
  try { body = await req.json(); } catch (e) { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (!valid(body.type, body.slug)) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const v = await voterId(true);
  const q = "post_type=eq." + body.type + "&slug=eq." + encodeURIComponent(body.slug) + "&voter_id=eq." + encodeURIComponent(v.id);

  try {
    if (body.action === "vote") {
      const value = body.value === 1 ? 1 : body.value === -1 ? -1 : 0;
      if (value === 0) {
        await sbDelete("reactions", q);
      } else {
        await sbUpsert("reactions", { post_type: body.type, slug: body.slug, voter_id: v.id, value: value }, "post_type,slug,voter_id");
      }
      return withCookie(NextResponse.json(await load(body.type, body.slug, v.id)), v);
    }

    if (body.action === "comment") {
      if (body.website) return NextResponse.json({ ok: true, status: "pending" }); // honeypot: pretend it worked
      const name = String(body.name || "").trim().slice(0, 40);
      const text = String(body.text || "").trim().slice(0, 1000);
      if (!name || text.length < 2) return NextResponse.json({ error: "Add your name and a comment." }, { status: 400 });
      if ((text.match(/https?:\/\//gi) || []).length > 1) return NextResponse.json({ error: "Please keep links to one or none." }, { status: 400 });

      const since = new Date(Date.now() - 60 * 1000).toISOString();
      const recent = await sbSelect("comments", "select=id&voter_id=eq." + encodeURIComponent(v.id) + "&created_at=gte." + since + "&limit=3");
      if (recent.length >= 2) return NextResponse.json({ error: "Slow down a little and try again in a minute." }, { status: 429 });

      const status = process.env.COMMENTS_AUTO_APPROVE === "true" ? "approved" : "pending";
      await sbInsert("comments", { post_type: body.type, slug: body.slug, voter_id: v.id, name: name, body: text, status: status });
      return withCookie(NextResponse.json({ ok: true, status: status }), v);
    }
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 503 });
  }
  return NextResponse.json({ error: "bad request" }, { status: 400 });
}
