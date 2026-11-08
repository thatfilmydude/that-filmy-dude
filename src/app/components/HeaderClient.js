"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LINKS = [
  { href: "#reviews", label: "Reviews" },
  { href: "#articles", label: "Articles" },
  { href: "#blogs", label: "Blogs" },
  { href: "#gallery", label: "Galleries" },
];

export default function HeaderClient({ items }) {
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const prog = useRef(null);
  const input = useRef(null);

  useEffect(function () {
    let last = 0;
    function onScroll() {
      const y = window.scrollY || 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (prog.current) prog.current.style.transform = "scaleX(" + y / max + ")";
      if (y > last + 6 && y > 200) setHide(true);
      else if (y < last - 6) setHide(false);
      last = y;
    }
    function onKey(e) {
      if (e.key === "Escape") setSearch(false);
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && !/input|textarea/i.test(tag)) {
        e.preventDefault();
        setSearch(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    return function () {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(function () {
    if (search && input.current) input.current.focus();
  }, [search]);

  const results = items.filter(function (i) {
    return !q || i.title.toLowerCase().indexOf(q.toLowerCase()) > -1;
  }).slice(0, 8);

  return (
    <>
      <div className="tfd-prog" aria-hidden="true"><i ref={prog} /></div>
      <header className={"tfd-nav" + (hide && !open ? " hide" : "") + (open ? " bg-backdrop" : "")}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 flex items-center gap-6 h-[76px]">
          <a href="#" className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gold/70">
              <Image src="/logo.png" alt="That Filmy Dude" width={40} height={40} className="w-8 h-auto" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-wide text-cream">THAT FILMY DUDE</span>
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-gold mt-1">Reel Talk · No Filter</span>
            </span>
          </a>

          <nav className="hidden md:flex gap-8 mx-auto" aria-label="Main">
            {LINKS.map(function (l) { return <a key={l.label} href={l.href} className="tfd-link">{l.label}</a>; })}
          </nav>

          <button type="button" onClick={function () { setSearch(true); }} className="hidden md:flex items-center gap-3 rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm text-muted hover:border-gold hover:text-cream transition" aria-label="Search">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" /></svg>
            Search <kbd className="font-mono text-[10px] border border-cream/20 rounded px-1.5">/</kbd>
          </button>

          <button type="button" className="md:hidden ml-auto w-11 h-11 rounded-xl border border-cream/20 text-xl" aria-label="Menu" aria-expanded={open} onClick={function () { setOpen(!open); }}>&#9776;</button>
        </div>

        {open ? (
          <nav className="md:hidden bg-backdrop border-t border-cream/10 px-5 pb-4" aria-label="Mobile">
            {LINKS.map(function (l) {
              return <a key={l.label} href={l.href} onClick={function () { setOpen(false); }} className="block py-4 border-b border-cream/10 tfd-link">{l.label}</a>;
            })}
            <button type="button" onClick={function () { setOpen(false); setSearch(true); }} className="block py-4 tfd-link">Search</button>
          </nav>
        ) : null}
      </header>

      {search ? (
        <div className="fixed inset-0 z-[160] bg-backdrop/95 backdrop-blur px-5 pt-[12vh]" role="dialog" aria-label="Search" onClick={function (e) { if (e.target === e.currentTarget) setSearch(false); }}>
          <div className="max-w-2xl mx-auto">
            <input ref={input} value={q} onChange={function (e) { setQ(e.target.value); }} placeholder="Search reviews, articles and blogs" aria-label="Search" className="w-full rounded-2xl border-[1.5px] border-gold bg-surface px-5 py-4 text-xl text-cream placeholder-muted" />
            <div className="mt-4 grid gap-2">
              {results.length === 0 ? <p className="font-mono text-xs tracking-widest uppercase text-muted text-center mt-4">No match yet</p> : null}
              {results.map(function (r) {
                return (
                  <a key={r.href} href={r.href} className="flex items-center gap-4 rounded-xl border border-cream/10 bg-surface px-4 py-3 hover:border-gold transition">
                    <span className="font-display text-xl text-cream leading-tight">{r.title}</span>
                    <span className="ml-auto font-mono text-xs font-bold text-gold whitespace-nowrap">{r.kind}</span>
                  </a>
                );
              })}
            </div>
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted text-center mt-5">Press Esc to close</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
