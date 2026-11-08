"use client";

import { useMemo, useState } from "react";

const STEP = 12;

function tilt(e) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", ((x - 0.5) * 14).toFixed(2) + "deg");
  el.style.setProperty("--rx", ((0.5 - y) * 14).toFixed(2) + "deg");
  el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
  el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
}

function untilt(e) {
  const el = e.currentTarget;
  el.style.setProperty("--ry", "0deg");
  el.style.setProperty("--rx", "0deg");
}

export default function ReviewWall({ items }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [min, setMin] = useState(0);
  const [shown, setShown] = useState(STEP);

  const list = useMemo(function () {
    const needle = q.trim().toLowerCase();
    const out = items.filter(function (i) {
      if (min && i.rating < min) return false;
      if (!needle) return true;
      return (i.title + " " + i.excerpt).toLowerCase().indexOf(needle) > -1;
    });
    out.sort(function (a, b) {
      if (sort === "top") return (b.rating - a.rating) || (b.ts - a.ts);
      return b.ts - a.ts;
    });
    return out;
  }, [items, q, sort, min]);

  function setAnd(fn, v) { fn(v); setShown(STEP); }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-10">
        <input
          value={q}
          onChange={function (e) { setAnd(setQ, e.target.value); }}
          placeholder="Search reviews"
          aria-label="Search reviews"
          className="flex-1 min-w-[220px] rounded-full bg-surface border border-cream/15 px-5 py-3 text-cream placeholder:text-muted outline-none focus:border-gold"
        />

        <div className="tfd-meter" role="group" aria-label="Minimum rating">
          <span className="lbl">Rated</span>
          {[1, 2, 3, 4, 5].map(function (n) {
            return (
              <button key={n} type="button" aria-pressed={min === n} aria-label={n + " out of 5 and above"}
                className={"seg" + (min >= n ? " lit" : "")}
                onClick={function () { setAnd(setMin, min === n ? 0 : n); }} />
            );
          })}
          <span className="val">{min ? min + " and above" : "Any rating"}</span>
        </div>

        <div className="flex gap-2">
          {[["new", "Newest"], ["top", "Top rated"]].map(function (s) {
            return (
              <button key={s[0]} type="button" onClick={function () { setAnd(setSort, s[0]); }}
                className={"font-mono text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full border transition " + (sort === s[0] ? "bg-cream text-backdrop border-cream" : "border-cream/20 text-cream hover:border-gold")}>
                {s[1]}
              </button>
            );
          })}
        </div>
      </div>

      <p className="font-mono text-xs tracking-widest uppercase text-muted mb-8">{list.length} {list.length === 1 ? "review" : "reviews"} on the wall</p>

      {list.length === 0 ? (
        <p className="italic text-xl text-cream/70 py-16">Nothing matches. Try a shorter search or a lower rating.</p>
      ) : (
        <div className="grid gap-x-7 gap-y-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.slice(0, shown).map(function (i) {
            return (
              <a key={i.key} href={i.href} className="tfd-pc group block min-w-0" data-cur="open" onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="tfd-pc-in">
                  <div className="tfd-pc-face">
                    {i.img ? (
                      <img src={i.img} alt={i.title} loading="lazy" />
                    ) : (
                      <div className="fb"><span>{i.title}</span></div>
                    )}
                    <div className="vd">
                      <small>The verdict</small>
                      <p>{i.excerpt || "Read the full review."}</p>
                      <b>Read review</b>
                    </div>
                    <i className="gl" />
                  </div>
                  {i.rating ? <span className="stamp">{i.ratingText}<em>/5</em></span> : null}
                </div>
                <span className="block font-mono text-[11px] tracking-widest uppercase text-gold mt-4 mb-1.5">{i.date}</span>
                <h3 className="font-display text-2xl leading-tight text-cream group-hover:text-gold transition">{i.title}</h3>
              </a>
            );
          })}
        </div>
      )}

      {list.length > shown ? (
        <div className="mt-16 text-center">
          <button type="button" onClick={function () { setShown(shown + STEP); }} className="tfd-btn tfd-btn-o" data-mag>Show more</button>
        </div>
      ) : null}
    </div>
  );
}
