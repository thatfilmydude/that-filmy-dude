"use client";

import { useEffect, useRef } from "react";

// Ring cursor with a label on desktop, plus magnetic buttons. Does nothing on touch screens.
export default function Cursor() {
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(function () {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const r = ring.current, l = label.current;
    r.style.display = "block";
    let mx = -100, my = -100, px = -100, py = -100, raf;
    function move(e) {
      mx = e.clientX; my = e.clientY;
      const t = e.target.closest ? e.target.closest("[data-cur],a,button") : null;
      r.classList.toggle("big", !!t);
      const lab = t && t.dataset ? t.dataset.cur : null;
      if (lab && lab !== "tilt") { l.textContent = lab.toUpperCase(); l.style.opacity = 1; } else l.style.opacity = 0;
      document.querySelectorAll("[data-mag]").forEach(function (m) {
        const b = m.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
        m.style.transform = Math.hypot(dx, dy) < 90 ? "translate(" + dx * 0.25 + "px," + dy * 0.35 + "px)" : "";
      });
    }
    function loop() {
      px += (mx - px) * 0.2; py += (my - py) * 0.2;
      r.style.transform = "translate3d(" + px + "px," + py + "px,0)";
      l.style.transform = "translate3d(" + px + "px," + py + "px,0) translate(-50%,-50%)";
      raf = requestAnimationFrame(loop);
    }
    document.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return function () { document.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ring} className="tfd-cur" style={{ display: "none" }} aria-hidden="true" />
      <div ref={label} className="tfd-curl" aria-hidden="true" />
    </>
  );
}
