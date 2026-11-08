"use client";

import { useEffect, useRef, useState } from "react";

export default function PinnedStory({ items }) {
  const wrap = useRef(null);
  const [cur, setCur] = useState(0);
  const n = items.length;

  useEffect(function () {
    function onScroll() {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / total));
      setCur(Math.min(n - 1, Math.floor(p * n)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return function () { window.removeEventListener("scroll", onScroll); };
  }, [n]);

  function jump(i) {
    const el = wrap.current;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: "smooth" });
  }

  return (
    <section id="latest" ref={wrap} className="tfd-story" style={{ height: "calc(100svh + " + (n - 1) + " * 80svh)", minHeight: 2000 }} aria-label="Latest, one story at a time">
      <div className="tfd-pin">
        <div className="w-full max-w-[1240px] mx-auto px-5 md:px-8 tfd-sg">
          <div className="tfd-sl">
            <span className="tfd-kick">Just published</span>
            <p className="font-display text-5xl leading-[.9] text-cream mt-3 mb-6">LATEST</p>
            <div className="tfd-chaps">
              {items.map(function (it, i) {
                return <button key={it.key} type="button" className={i === cur ? "on" : ""} onClick={function () { jump(i); }}>{it.kind}</button>;
              })}
            </div>
          </div>

          <div className="tfd-frame" aria-hidden="true">
            {items.map(function (it, i) {
              const cls = "tfd-fi" + (i === cur ? " on" : i < cur ? " past" : "");
              return <div key={it.key} className={cls} style={{ backgroundImage: 'url("' + it.img + '")' }} />;
            })}
            <span className="absolute left-4 bottom-3 z-[3] font-display text-3xl text-cream" style={{ textShadow: "0 2px 14px #000" }}>{"0" + (cur + 1)}</span>
          </div>

          <div className="tfd-sr">
            {items.map(function (it, i) {
              return (
                <div key={it.key} className={"tfd-ch" + (i === cur ? " on" : "")} aria-hidden={i !== cur}>
                  <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-gold">{it.kind} / {it.date}{it.sub ? " / " + it.sub : ""}</span>
                  <h2 className="tfd-h2 text-cream mt-3 mb-4" style={{ fontSize: "clamp(2.2rem,4.4vw,4rem)" }}>{it.title}</h2>
                  {it.excerpt ? <p className="text-lg md:text-xl leading-snug text-cream/80 max-w-[34ch] line-clamp-4 mb-6">{it.excerpt}</p> : null}
                  <a href={it.href} tabIndex={i === cur ? 0 : -1} className="tfd-btn tfd-btn-r" data-mag>Read it</a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
