"use client";

import { useEffect, useState } from "react";

// Like, dislike and comments for one review, article or blog.
// theme="dark" for reviews and blogs, theme="light" for articles.
export default function Engagement({ type, slug, theme }) {
  const light = theme === "light";
  const [data, setData] = useState({ likes: 0, dislikes: 0, mine: 0, comments: [] });
  const [off, setOff] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [trap, setTrap] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(function () {
    let live = true;
    fetch("/api/engage?type=" + type + "&slug=" + encodeURIComponent(slug))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!live) return;
        if (j.error || j.disabled) { setOff(true); return; }
        setData(j);
        try { const n = localStorage.getItem("tfd_name"); if (n) setName(n); } catch (e) {}
      })
      .catch(function () { if (live) setOff(true); });
    return function () { live = false; };
  }, [type, slug]);

  function post(payload) {
    return fetch("/api/engage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ type: type, slug: slug }, payload)),
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); });
  }

  function vote(v) {
    const next = data.mine === v ? 0 : v;
    const prev = data;
    // update the numbers right away, roll back if the request fails
    const d = Object.assign({}, data, { mine: next });
    if (data.mine === 1) d.likes--;
    if (data.mine === -1) d.dislikes--;
    if (next === 1) d.likes++;
    if (next === -1) d.dislikes++;
    setData(d);
    post({ action: "vote", value: next }).then(function (res) {
      if (res.ok) setData(res.j); else setData(prev);
    }).catch(function () { setData(prev); });
  }

  function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setNote("");
    try { localStorage.setItem("tfd_name", name); } catch (err) {}
    post({ action: "comment", name: name, text: text, website: trap }).then(function (res) {
      setBusy(false);
      if (!res.ok) { setNote(res.j.error || "Could not post your comment."); return; }
      setText("");
      if (res.j.status === "approved") {
        fetch("/api/engage?type=" + type + "&slug=" + encodeURIComponent(slug)).then(function (r) { return r.json(); }).then(setData);
        setNote("Comment posted.");
      } else {
        setNote("Thanks. Your comment will show up once it is approved.");
      }
    }).catch(function () { setBusy(false); setNote("Could not post your comment."); });
  }

  if (off) return null;

  const c = light
    ? { line: "border-black/10", text: "text-[#1C1416]", mute: "text-[#1C1416]/55", field: "bg-white/60 border-black/20 text-[#1C1416] placeholder-[#1C1416]/40", on: "bg-branddark text-paper border-branddark", off: "border-black/25 text-[#1C1416] hover:border-branddark", card: "bg-black/5" }
    : { line: "border-cream/10", text: "text-cream", mute: "text-muted", field: "bg-surface border-cream/20 text-cream placeholder-muted", on: "bg-brandred text-white border-brandred", off: "border-cream/25 text-cream hover:border-gold", card: "bg-surface" };

  const btn = "inline-flex items-center gap-2 border rounded-full px-5 py-2.5 font-mono text-xs tracking-widest uppercase transition ";

  return (
    <section aria-label="Reactions and comments" className={"border-t pt-10 pb-16 " + c.line}>
      <p className={"font-mono text-[11px] tracking-widest uppercase mb-4 " + c.mute}>Was this worth your time?</p>
      <div className="flex gap-3 flex-wrap">
        <button type="button" aria-pressed={data.mine === 1} onClick={function () { vote(1); }} className={btn + (data.mine === 1 ? c.on : c.off)}>
          <span aria-hidden="true">&#9650;</span> Like <span>{data.likes}</span>
        </button>
        <button type="button" aria-pressed={data.mine === -1} onClick={function () { vote(-1); }} className={btn + (data.mine === -1 ? c.on : c.off)}>
          <span aria-hidden="true">&#9660;</span> Dislike <span>{data.dislikes}</span>
        </button>
      </div>

      <h2 className={"font-display text-3xl mt-12 mb-6 " + c.text}>Comments{data.comments.length ? " (" + data.comments.length + ")" : ""}</h2>

      <form onSubmit={submit} className="grid gap-3 mb-10">
        <input value={name} onChange={function (e) { setName(e.target.value); }} maxLength={40} required placeholder="Your name" aria-label="Your name" className={"rounded-md border px-4 py-3 text-sm " + c.field} />
        <textarea value={text} onChange={function (e) { setText(e.target.value); }} maxLength={1000} required rows={4} placeholder="Say what you think. Be kind, be specific." aria-label="Your comment" className={"rounded-md border px-4 py-3 text-sm " + c.field} />
        <input value={trap} onChange={function (e) { setTrap(e.target.value); }} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <div className="flex items-center gap-4 flex-wrap">
          <button type="submit" disabled={busy} className={"font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-sm disabled:opacity-50 " + (light ? "bg-branddark text-paper" : "bg-brandred text-white")}>{busy ? "Posting" : "Post comment"}</button>
          {note ? <span role="status" className={"text-sm " + c.mute}>{note}</span> : null}
        </div>
      </form>

      {data.comments.length === 0 ? (
        <p className={"text-sm " + c.mute}>No comments yet. Be the first.</p>
      ) : (
        <ul className="grid gap-4">
          {data.comments.map(function (m) {
            return (
              <li key={m.id} className={"rounded-lg px-5 py-4 " + c.card}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className={"font-display text-lg " + c.text}>{m.name}</span>
                  <time className={"font-mono text-[10px] tracking-widest uppercase " + c.mute}>{new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
                </div>
                <p className={"text-sm leading-relaxed whitespace-pre-wrap break-words " + c.text + "/90"}>{m.body}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
