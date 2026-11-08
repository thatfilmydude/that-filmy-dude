import { NextResponse } from "next/server";
import { supabaseReady, sbUpsert } from "../../../lib/supabase";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export async function POST(req) {
  if (!supabaseReady()) return NextResponse.json({ error: "Subscriptions are not set up yet." }, { status: 503 });
  let body;
  try { body = await req.json(); } catch (e) { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  try {
    await sbUpsert("subscribers", { email: email }, "email");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 503 });
  }
}
