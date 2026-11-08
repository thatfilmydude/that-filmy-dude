"use client";

import { useEffect, useRef, useState } from "react";
import { filmName, fmtRating } from "./home/util";

const STEMS = [80, 150, 110, 180];

export default function RatingRuler({ reviews }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const [val, setVal] = useState(4);
  const [drop, setDrop] = useState(false);

  useEffect(function () {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setDrop(true); return; }
    const io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setDrop(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return function () { io.disconnect(); };
  }, []);

  if (reviews.length === 0) return null;

  // spread reviews that share a rating so their posters do not overlap
  const groups = {};
  reviews.forEach(function (r) { (groups[r.rating] = groups[r.rating] || []).push(r); });
  const pins = [];
  let k = 0;
  Object.keys(groups).forEach(function (key) {
    const g = groups[key];
    g.forEach(function (r, i) { pins.push({ r: r, dx: (i - (g.length - 1) / 2) * 68, sh: STEMS[(k + i) % STEMS.length], idx: k++ }); });
  });

  function setFromEvent(e) {
    const b = ref.current.getBoundingClientRect();
    const v = Math.max(0, Math.min(5, ((e.clientX - b.left) / b.width) * 5));
    setVal(Math.round(v * 4) / 4);
  }

  let best = 99;
  reviews.forEach(function (r) { best = Math.min(best, Math.abs(r.rating - val)); });
  const near = reviews.filter(function (r) { return Math.abs(r.rating - val) === best; });

  return (
    <section id="scale" className="bg-surface border-y border-cream/10 py-20 overflow-x-clip" aria-label="Rating scale">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <span className="tfd-kick">Where they land</span>
        <h2 className="tfd-h2 text-cream mt-3" style={{ fontSize: "clamp(2.8rem,6.4vw,5.6rem)" }}>ONE LINE, EVERY VERDICT</h2>
        <p className="italic text-lg text-cream/80 mt-4 max-w-[48ch]">Drag the needle to the rating you are in the mood for. The closest review lights up.</p>

        <div ref={ref} className="tfd-ruler" data-cur="drag"
          onPointerDown={function (e) { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFromEvent(e); }}
          onPointerMove={function (e) { if (dragging.current) setFromEvent(e); }}
          onPointerUp={function () { dragging.current = false; }}>
          <div className="tfd-rl" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (t) {
            return <div key={t} className={"tfd-tick" + (t % 2 ? "" : " m")} style={{ left: t * 10 + "%" }}>{t % 2 ? null : <span>{t / 2}</span>}</div>;
          })}
          {pins.map(function (p) {
            const isNear = Math.abs(p.r.rating - val) === best;
            return (
              <a key={p.r.slug} href={"/reviews/" + p.r.slug} className={"tfd-pin2" + (drop ? " drop" : "") + (isNear ? " near" : "")} style={{ left: "calc(" + (p.r.rating / 5) * 100 + "% + " + p.dx + "px)", "--d": p.idx * 0.12 + "s" }} aria-label={p.r.title + ", " + fmtRating(p.r.rating) + " out of 5"}>
                <div className="pt" style={p.r.posterUrl ? { backgroundImage: 'url("' + p.r.posterUrl + '")' } : null}>{p.r.posterUrl ? null : filmName(p.r.title).toUpperCase().slice(0, 12)}</div>
                <div className="st" style={{ height: p.sh }} />
              </a>
            );
          })}
          <div className="tfd-needle" style={{ left: (val / 5) * 100 + "%" }}><b>{fmtRating(val)}</b></div>
        </div>

        <div className="mt-6 flex gap-5 items-center flex-wrap min-h-[60px]" role="status" aria-live="polite">
          <b className="font-display text-4xl font-normal text-gold">{fmtRating(near[0].rating)} / 5</b>
          <p className="italic text-lg text-cream/85">{best === 0 ? "Right on your mood: " : "Closest review: "}<a className="underline decoration-gold/60 underline-offset-4" href={"/reviews/" + near[0].slug}>{near.map(function (r) { return filmName(r.title); }).join(" and ")}</a></p>
        </div>
      </div>
    </section>
  );
}
