"use client";

import { useMemo, useState } from "react";

const STEP = 9;

export default function ArticleBoard({ items }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [cat, setCat] = useState("All");
  const [shown, setShown] = useState(STEP);

  const cats = useMemo(function () {
    const seen = ["All"];
    items.forEach(function (i) { if (i.category && seen.indexOf(i.category) < 0) seen.push(i.category); });
    return seen;
  }, [items]);

  const list = useMemo(function () {
    const needle = q.trim().toLowerCase();
    const out = items.filter(function (i) {
      if (cat !== "All" && i.category !== cat) return false;
      if (!needle) return true;
      return (i.title + " " + i.excerpt).toLowerCase().indexOf(needle) > -1;
    });
    out.sort(function (a, b) { return sort === "old" ? a.ts - b.ts : b.ts - a.ts; });
    return out;
  }, [items, q, sort, cat]);

  function setAnd(fn, v) { fn(v); setShown(STEP); }

  const lead = list[0];
  const rest = list.slice(1, shown);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-12">
        <input
          value={q}
          onChange={function (e) { setAnd(setQ, e.target.value); }}
          placeholder="Search the cuttings"
          aria-label="Search articles"
          className="flex-1 min-w-[220px] rounded-full bg-surface border border-cream/15 px-5 py-3 text-cream placeholder:text-muted outline-none focus:border-gold"
        />
        {cats.length > 2 ? (
          <div className="flex gap-2 flex-wrap">
            {cats.map(function (c) {
              return (
                <button key={c} type="button" onClick={function () { setAnd(setCat, c); }}
                  className={"font-mono text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full border transition " + (cat === c ? "bg-gold text-backdrop border-gold" : "border-cream/20 text-cream hover:border-gold")}>
                  {c}
                </button>
              );
            })}
          </div>
        ) : null}
        <div className="flex gap-2">
          {[["new", "Newest"], ["old", "Oldest"]].map(function (s) {
            return (
              <button key={s[0]} type="button" onClick={function () { setAnd(setSort, s[0]); }}
                className={"font-mono text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full border transition " + (sort === s[0] ? "bg-cream text-backdrop border-cream" : "border-cream/20 text-cream hover:border-gold")}>
                {s[1]}
              </button>
            );
          })}
        </div>
      </div>

      {!lead ? (
        <p className="italic text-xl text-cream/70 py-16">Nothing matches that search. Try a shorter word.</p>
      ) : (
        <>
          <a href={lead.href} className="tfd-lead group" data-cur="open">
            <div className="tfd-cl lead-img" style={{ "--r": "-1.2deg" }}>
              <i className="tape" />
              <div className="img">
                {lead.img ? <img src={lead.img} alt={lead.title} /> : <div className="fb"><span>{lead.title}</span></div>}
              </div>
            </div>
            <div className="lead-tx">
              <span className="tfd-kick">{sort === "old" ? "From the archive" : "Front page"}</span>
              <h2 className="tfd-h2 text-cream mt-4 mb-5" style={{ fontSize: "clamp(2.4rem,4.6vw,4rem)" }}>{lead.title}</h2>
              {lead.excerpt ? <p className="italic text-xl text-cream/80 leading-snug max-w-[40ch] mb-7">{lead.excerpt}</p> : null}
              <span className="tfd-btn tfd-btn-r">Read it</span>
            </div>
          </a>

          {rest.length > 0 ? (
            <div className="tfd-clips">
              {rest.map(function (i) {
                return (
                  <a key={i.key} href={i.href} className="tfd-cl" data-cur="open">
                    <i className="tape" />
                    <div className="img">
                      {i.img ? <img src={i.img} alt={i.title} loading="lazy" /> : <div className="fb"><span>{i.title}</span></div>}
                    </div>
                    <span className="k">{i.category} / {i.date}</span>
                    <h3>{i.title}</h3>
                    {i.excerpt ? <p>{i.excerpt}</p> : null}
                  </a>
                );
              })}
            </div>
          ) : null}

          {list.length - 1 > rest.length ? (
            <div className="mt-16 text-center">
              <button type="button" onClick={function () { setShown(shown + STEP); }} className="tfd-btn tfd-btn-o" data-mag>Show more</button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
