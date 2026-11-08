"use client";

import { useEffect, useRef } from "react";

export default function FilmStripClient({ urls }) {
  const reel = useRef(null);
  useEffect(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = reel.current;
    let x = 0, last = window.scrollY, vel = 0, raf;
    function loop() {
      const y = window.scrollY, d = y - last; last = y;
      vel += (d - vel) * 0.15;
      const w = el.scrollWidth / 2;
      x -= 0.55 + Math.abs(vel) * 0.5;
      if (x < -w) x += w;
      el.style.transform = "translate3d(" + x + "px,0,0) skewX(" + Math.max(-10, Math.min(10, vel * -0.35)) + "deg)";
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return function () { cancelAnimationFrame(raf); };
  }, []);

  const all = urls.concat(urls);
  return (
    <div className="tfd-strip" aria-hidden="true">
      <div ref={reel} className="tfd-reel">
        {all.map(function (u, i) {
          return <div key={i} className="tfd-fr"><i style={{ backgroundImage: 'url("' + u + '")' }} /></div>;
        })}
      </div>
    </div>
  );
}
