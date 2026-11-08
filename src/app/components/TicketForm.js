"use client";

import { useState } from "react";

export default function TicketForm() {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [note, setNote] = useState("");
  const [torn, setTorn] = useState(false);
  const [busy, setBusy] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (busy || torn) return;
    setBusy(true); setNote("");
    fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email, website: trap }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        setBusy(false);
        if (!res.ok) { setNote(res.j.error || "Could not sign you up."); return; }
        setTorn(true); setNote("Seat reserved. Thanks for signing up.");
      })
      .catch(function () { setBusy(false); setNote("Could not sign you up."); });
  }

  return (
    <section id="subscribe" className="py-24 px-5 md:px-8" aria-label="Subscribe">
      <form onSubmit={submit} noValidate className={"tfd-ticket" + (torn ? " torn" : "")}>
        <div className="tfd-stub"><span className="m">Admit one</span><b className="font-display text-3xl font-normal leading-none">No. 0001</b></div>
        <div className="px-6 md:px-12 py-9">
          <h2 className="tfd-h2" style={{ fontSize: "clamp(2.6rem,5vw,4.2rem)", color: "#120E0F" }}>NEVER MISS A VERDICT</h2>
          <p className="mt-3 max-w-[44ch] text-lg" style={{ color: "#120E0F" }}>Leave your email and tear the stub to claim your seat. New reviews come your way.</p>
          <div className="flex gap-3 flex-wrap mt-5">
            <input value={email} onChange={function (e) { setEmail(e.target.value); }} type="email" placeholder="Your email" aria-label="Email address" autoComplete="email" className="flex-1 min-w-[200px] rounded-full border-2 px-5 py-3" style={{ borderColor: "#120E0F", background: "#fff7e8", color: "#120E0F" }} />
            <input value={trap} onChange={function (e) { setTrap(e.target.value); }} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <button type="submit" disabled={busy} className="tfd-btn disabled:opacity-60" style={{ background: "#120E0F", color: "#E8B34C" }} data-mag>{busy ? "Reserving" : "Reserve my seat"}</button>
          </div>
          <p className="mt-3 min-h-[1.4em] font-mono text-xs font-bold" style={{ color: "#120E0F" }} role="status">{note}</p>
        </div>
      </form>
    </section>
  );
}
