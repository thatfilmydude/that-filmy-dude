"use client";

import { useEffect, useRef } from "react";
import { filmName, fmtRating } from "./home/util";

export default function HeroBooth({ review }) {
  const hero = useRef(null), lit = useRef(null), stage = useRef(null), card = useRef(null);

  useEffect(function () {
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0.68, ty = 0.38, cx = tx, cy = ty, lastMove = 0, raf;
    const t0 = performance.now();
    function move(e) {
      const r = hero.current.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; lastMove = performance.now();
    }
    function frame(now) {
      const t = (now - t0) / 1000;
      if (now - lastMove > 2600 || !fine) { tx = 0.62 + Math.sin(t * 0.55) * 0.22; ty = 0.4 + Math.cos(t * 0.43) * 0.18; }
      cx += (tx - cx) * 0.09; cy += (ty - cy) * 0.09;
      const rad = reduce ? 300 : Math.min(t / 1.3, 1) * 320 * (t < 1 ? 0.86 + 0.14 * Math.sin(t * 38) : 1);
      const l = lit.current;
      if (l) { l.style.setProperty("--mx", cx * 100 + "%"); l.style.setProperty("--my", cy * 100 + "%"); l.style.setProperty("--r", Math.max(0, rad) + "px"); }
      if (stage.current) stage.current.style.transform = "translate3d(0," + (window.scrollY || 0) * 0.18 + "px,0)";
      const c = card.current;
      if (c && fine && !reduce) {
        c.style.transform = "perspective(1100px) rotateX(" + (0.5 - cy) * 10 + "deg) rotateY(" + (cx - 0.5) * 14 + "deg)";
        c.style.setProperty("--gx", cx * 100 + "%"); c.style.setProperty("--gy", cy * 100 + "%");
      }
      raf = requestAnimationFrame(frame);
    }
    const h = hero.current;
    h.addEventListener("pointermove", move);
    raf = requestAnimationFrame(frame);
    return function () { h.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  const bg = review && review.posterUrl ? { backgroundImage: 'url("' + review.posterUrl + '")' } : {};
  const rating = review ? fmtRating(review.rating) : "";

  return (
    <section ref={hero} className="tfd-hero" aria-label="Latest review">
      <div ref={stage} className="tfd-stage" aria-hidden="true">
        <div className="img tfd-dim" style={bg} />
        <div ref={lit} className="img tfd-lit" style={bg} />
      </div>

      <div className="relative z-[2] max-w-[1240px] mx-auto px-5 md:px-8 grid md:grid-cols-[1.05fr_.95fr] gap-8 items-center min-h-[640px] pb-[clamp(6rem,17vw,14rem)]">
        <div>
          <h1 className="sr-only">That Filmy Dude: Reel talk, no filter</h1>
          <span className="tfd-kick">{review ? "Latest review" : "Reel talk, no filter"}</span>
          <p className="mt-5 italic text-xl md:text-2xl leading-snug text-cream/85 max-w-[46ch] line-clamp-4">
            {review && review.excerpt ? review.excerpt : "Reviews that do not kiss the poster. Galleries worth stopping to scroll. The film world, minus the PR spin."}
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <a href={review ? "/reviews/" + review.slug : "#reviews"} className="tfd-btn tfd-btn-r" data-mag>Read the review</a>
            <a href="#reviews" className="tfd-btn tfd-btn-o" data-mag>All reviews</a>
          </div>
        </div>

        {review ? (
          <div className="hidden md:flex justify-end">
            <a href={"/reviews/" + review.slug} ref={card} className="tfd-pcard" style={review.posterUrl ? { backgroundImage: 'url("' + review.posterUrl + '")' } : { background: "linear-gradient(160deg,#7A1113,#241A1D)" }} data-cur="tilt" aria-label={"Read the review of " + filmName(review.title)}>
              {rating ? (
                <span className="tfd-stamp" aria-label={"Rated " + rating + " out of 5"}>
                  <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="58" fill="#e2241a" /><defs><path id="tfd-cp" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1 -90 0" /></defs><text fontFamily="monospace" fontWeight="700" fontSize="9.6" letterSpacing="3.2" fill="#fff"><textPath href="#tfd-cp">THE VERDICT · OUT OF FIVE · RATED · </textPath></text></svg>
                  <b>{rating}</b>
                </span>
              ) : null}
            </a>
          </div>
        ) : null}

        {review ? <p className="tfd-bigt" aria-hidden="true">{filmName(review.title).toUpperCase()}</p> : null}
      </div>
      <p className="hidden md:block absolute right-8 bottom-5 z-[3] font-mono text-[10px] tracking-[0.2em] uppercase text-muted">Move your cursor. The light follows.</p>
    </section>
  );
}
