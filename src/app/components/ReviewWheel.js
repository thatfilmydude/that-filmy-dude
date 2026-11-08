"use client";

import { useEffect, useRef, useState } from "react";
import { filmName, fmtRating, GLOWS } from "./home/util";

export default function ReviewWheel({ reviews }) {
  const [act, setAct] = useState(0);
  const [sheet, setSheet] = useState(null);
  const [gap, setGap] = useState(260);
  const box = useRef(null);
  const drag = useRef({ x: null, moved: 0 });
  const n = reviews.length;

  useEffect(function () {
    function size() { if (box.current) setGap(Math.min(box.current.clientWidth * 0.3, 300)); }
    size();
    window.addEventListener("resize", size);
    return function () { window.removeEventListener("resize", size); };
  }, []);

  useEffect(function () {
    function onKey(e) { if (e.key === "Escape") setSheet(null); }
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }, []);

  function go(d) { setAct(function (a) { return (a + d + n) % n; }); }
  const f = reviews[act];

  function onUp(e) {
    const d = drag.current;
    if (d.x === null) return;
    d.x = null;
    if (d.moved < 99) {
      const t = e.target.closest ? e.target.closest("[data-i]") : null;
      if (t) { const i = +t.dataset.i; if (i === act) setSheet(i); else setAct(i); }
    }
  }

  return (
    <section id="reviews" className="relative overflow-hidden isolate py-24" aria-label="Reviews">
      <div className="tfd-glow" style={{ "--gc": GLOWS[act % GLOWS.length] }} aria-hidden="true" />
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <span className="tfd-kick">Latest reviews</span>
            <h2 className="tfd-h2 text-cream mt-3" style={{ fontSize: "clamp(2.8rem,6.4vw,5.6rem)" }}>SPIN THE WHEEL</h2>
          </div>
          <p className="italic text-lg text-cream/80 max-w-[36ch]">Drag, use the arrows, or tap a poster. Open one for the quick verdict.</p>
        </div>

        <div ref={box} className="tfd-cf" tabIndex={0} aria-label="Review posters" data-cur="drag"
          onKeyDown={function (e) { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); if (e.key === "Enter") setSheet(act); }}
          onPointerDown={function (e) { drag.current = { x: e.clientX, moved: 0 }; }}
          onPointerMove={function (e) { const d = drag.current; if (d.x === null) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 70) { go(dx < 0 ? 1 : -1); d.x = e.clientX; d.moved = 99; } }}
          onPointerUp={onUp} onPointerLeave={function () { drag.current.x = null; }}>
          {reviews.map(function (r, i) {
            let o = i - act;
            if (o > n / 2) o -= n;
            if (o < -n / 2) o += n;
            const ao = Math.abs(o);
            const st = {
              transform: "translate(-50%,-50%) translateX(" + o * gap + "px) translateZ(" + -ao * 170 + "px) rotateY(" + -o * 34 + "deg) scale(" + (1 - ao * 0.05) + ")",
              opacity: ao > 2 ? 0 : 1 - ao * 0.2, zIndex: 10 - ao, pointerEvents: ao > 2 ? "none" : "auto",
              backgroundColor: "#341018",
            };
            if (r.posterUrl) st.backgroundImage = 'url("' + r.posterUrl + '")';
            return (
              <div key={r.slug} data-i={i} className={"tfd-cfi" + (o === 0 ? " on" : "")} style={st}>
                {!r.posterUrl ? <div className="absolute inset-0 grid place-items-center text-center p-4 font-display text-4xl leading-[.9] text-cream">{filmName(r.title).toUpperCase()}</div> : null}
                {r.rating ? <span className="absolute left-2.5 top-2.5 bg-gold text-backdrop font-display text-2xl leading-none px-2 py-1 rounded-md">{fmtRating(r.rating)}</span> : null}
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end mt-2">
          <div aria-live="polite">
            <h3 className="tfd-h2 text-cream" style={{ fontSize: "clamp(2.6rem,5vw,4.4rem)" }}>{filmName(f.title).toUpperCase()}</h3>
            <p className="font-mono text-xs tracking-widest uppercase text-gold mt-2">{f.rating ? fmtRating(f.rating) + " / 5" : ""}{f.genre ? " · " + f.genre : ""}</p>
            {f.excerpt ? <p className="italic text-lg text-cream/80 mt-2 max-w-[56ch] line-clamp-3">{f.excerpt}</p> : null}
          </div>
          <div className="flex gap-3 items-center">
            <button type="button" onClick={function () { go(-1); }} aria-label="Previous review" className="w-[50px] h-[50px] rounded-full border-[1.5px] border-cream/50 hover:bg-cream hover:text-backdrop transition">&lsaquo;</button>
            <button type="button" onClick={function () { go(1); }} aria-label="Next review" className="w-[50px] h-[50px] rounded-full border-[1.5px] border-cream/50 hover:bg-cream hover:text-backdrop transition">&rsaquo;</button>
            <button type="button" onClick={function () { setSheet(act); }} className="tfd-btn tfd-btn-r">Open review</button>
          </div>
        </div>

        <ul className="sr-only">
          {reviews.map(function (r) { return <li key={r.slug}><a href={"/reviews/" + r.slug}>{r.title}</a></li>; })}
        </ul>
      </div>

      {sheet !== null ? <Sheet r={reviews[sheet]} onClose={function () { setSheet(null); }} /> : null}
    </section>
  );
}

function Sheet({ r, onClose }) {
  const [val, setVal] = useState(0);
  useEffect(function () {
    const s = performance.now();
    let raf;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick(now) {
      const p = reduce ? 1 : Math.min((now - s) / 1100, 1);
      setVal(r.rating * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    return function () { cancelAnimationFrame(raf); document.body.style.overflow = ""; };
  }, [r.rating]);

  return (
    <div className="fixed inset-0 z-[140] bg-backdrop/95 backdrop-blur overflow-auto px-5 py-[6vh] grid place-items-center" role="dialog" aria-modal="true" aria-label={r.title} onClick={function (e) { if (e.target === e.currentTarget) onClose(); }}>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 w-11 h-11 rounded-full border border-cream/20 text-xl">&times;</button>
      <div className="grid md:grid-cols-[.8fr_1fr] gap-10 items-center max-w-[1000px] w-full">
        <div className="aspect-[2/3] w-full max-w-[360px] justify-self-center rounded-lg shadow-2xl border border-cream/15" style={r.posterUrl ? { background: 'url("' + r.posterUrl + '") center/cover' } : { background: "linear-gradient(160deg,#7A1113,#241A1D)" }} />
        <div>
          <span className="tfd-kick">Review{r.genre ? " · " + r.genre : ""}</span>
          <h3 className="tfd-h2 text-cream mt-3" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>{filmName(r.title).toUpperCase()}</h3>
          <div className="flex items-center gap-4 my-5">
            <svg width="104" height="104" viewBox="0 0 104 104" style={{ transform: "rotate(-90deg)" }} aria-hidden="true"><circle cx="52" cy="52" r="46" fill="none" stroke="rgba(242,232,221,.14)" strokeWidth="8" /><circle cx="52" cy="52" r="46" fill="none" stroke="#E8B34C" strokeWidth="8" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 - (val / 5) * 289} /></svg>
            <div><b className="font-display text-6xl font-normal leading-[.9]">{fmtRating(Math.round(val * 100) / 100)}</b><small className="block font-mono text-[10px] tracking-[0.2em] text-muted">OUT OF 5</small></div>
          </div>
          {r.excerpt ? <p className="italic text-xl text-cream/85 leading-snug max-w-[44ch]">{r.excerpt}</p> : null}
          {r.author ? <p className="font-mono text-[11px] tracking-widest uppercase text-muted mt-3">Review by {r.author}</p> : null}
          <a href={"/reviews/" + r.slug} className="tfd-btn tfd-btn-r mt-6">Read the full review</a>
        </div>
      </div>
    </div>
  );
}
