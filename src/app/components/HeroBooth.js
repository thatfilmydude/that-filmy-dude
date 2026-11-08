"use client";

import { useEffect, useRef, useState } from "react";
import FilmSet from "./FilmSet";

// Opening banner: a film set that a cursor driven flashlight reveals, drifting dust in the lights,
// and a clapperboard that claps on load. Click the board to clap again.
export default function HeroBooth() {
  const hero = useRef(null), lit = useRef(null), stage = useRef(null), dust = useRef(null), board = useRef(null);
  const [clap, setClap] = useState(0);

  useEffect(function () {
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0.62, ty = 0.5, cx = tx, cy = ty, lastMove = 0, raf;
    const t0 = performance.now();
    const cv = dust.current, ctx = cv.getContext("2d");
    let W = 0, H = 0, motes = [];
    function size() {
      const r = hero.current.getBoundingClientRect();
      W = cv.width = r.width; H = cv.height = r.height;
      motes = Array.from({ length: reduce ? 0 : 70 }, function () { return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4, v: Math.random() * 0.25 + 0.05, a: Math.random() * 0.5 + 0.15 }; });
    }
    size();
    window.addEventListener("resize", size);
    function move(e) {
      const r = hero.current.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; lastMove = performance.now();
    }
    function frame(now) {
      const t = (now - t0) / 1000;
      if (now - lastMove > 2600 || !fine) { tx = 0.55 + Math.sin(t * 0.5) * 0.28; ty = 0.5 + Math.cos(t * 0.4) * 0.16; }
      cx += (tx - cx) * 0.09; cy += (ty - cy) * 0.09;
      const rad = reduce ? 340 : Math.min(t / 1.3, 1) * 340 * (t < 1 ? 0.86 + 0.14 * Math.sin(t * 38) : 1);
      const l = lit.current;
      if (l) { l.style.setProperty("--mx", cx * 100 + "%"); l.style.setProperty("--my", cy * 100 + "%"); l.style.setProperty("--r", Math.max(0, rad) + "px"); }
      if (stage.current) stage.current.style.transform = "translate3d(0," + (window.scrollY || 0) * 0.18 + "px,0)";
      ctx.clearRect(0, 0, W, H);
      motes.forEach(function (m) {
        m.y -= m.v; m.x += Math.sin((m.y + m.x) * 0.01) * 0.2;
        if (m.y < -5) { m.y = H + 5; m.x = Math.random() * W; }
        const d = Math.hypot(m.x - cx * W, m.y - cy * H);
        const glow = d < 340 ? 1 - d / 340 : 0;
        ctx.globalAlpha = Math.min(1, m.a * (0.25 + glow * 1.6));
        ctx.fillStyle = "#ffe3a0";
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }
    const h = hero.current;
    h.addEventListener("pointermove", move);
    raf = requestAnimationFrame(frame);
    return function () { h.removeEventListener("pointermove", move); window.removeEventListener("resize", size); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={hero} className="tfd-hero" aria-label="Welcome">
      <div ref={stage} className="tfd-stage" aria-hidden="true">
        <div className="img tfd-dim"><FilmSet p="d" /></div>
        <div ref={lit} className="img tfd-lit"><FilmSet p="l" /></div>
      </div>
      <canvas ref={dust} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden="true" />
      <div key={clap} className="tfd-flash" aria-hidden="true" />

      <div className="relative z-[2] max-w-[1240px] mx-auto px-5 md:px-8 grid md:grid-cols-[1.1fr_.9fr] gap-10 items-center min-h-[660px] pb-24">
        <div>
          <span className="tfd-kick">Now showing, opinions uncut</span>
          <h1 className="font-display text-[clamp(4rem,9vw,8rem)] leading-[.9] text-cream mt-4">
            REEL TALK,<br /><span className="text-gold">NO FILTER</span>
          </h1>
          <p className="mt-6 italic text-xl text-cream/80 max-w-[40ch] leading-snug">Reviews that do not kiss the poster. Articles worth stopping for. The film world, minus the PR spin.</p>
          <div className="mt-8 flex gap-3 flex-wrap">
            <a href="#reviews" className="tfd-btn tfd-btn-r" data-mag>Latest reviews</a>
            <a href="#articles" className="tfd-btn tfd-btn-o" data-mag>Read articles</a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <button type="button" ref={board} key={"b" + clap} onClick={function () { setClap(clap + 1); }} className="tfd-clap" data-cur="clap" aria-label="Clapperboard. Press to clap.">
            <span className="tfd-arm" aria-hidden="true" />
            <span className="tfd-slate">
              <span className="r"><i>PROD</i><b>THAT FILMY DUDE</b></span>
              <span className="r"><i>ROLL</i><b>REEL TALK</b></span>
              <span className="r two"><span><i>SCENE</i><b>1</b></span><span><i>TAKE</i><b>1</b></span></span>
              <span className="r"><i>CAMERA</i><b>NO FILTER</b></span>
            </span>
          </button>
        </div>
      </div>
      <p className="hidden md:block absolute right-8 bottom-5 z-[3] font-mono text-[10px] tracking-[0.2em] uppercase text-muted">Move your cursor. The set lights up.</p>
    </section>
  );
}
