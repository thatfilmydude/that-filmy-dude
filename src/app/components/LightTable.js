"use client";

import { useEffect, useRef, useState } from "react";

const SPOTS = [
  { w: 250, x: 3, y: 5, r: -4 }, { w: 280, x: 33, y: 3, r: 3 }, { w: 210, x: 70, y: 6, r: 5 },
  { w: 220, x: 15, y: 46, r: -2 }, { w: 200, x: 44, y: 44, r: 4 }, { w: 200, x: 66, y: 42, r: -5 }, { w: 190, x: 82, y: 48, r: 6 },
];

export default function LightTable({ images }) {
  const board = useRef(null);
  const z = useRef(10);
  const [lb, setLb] = useState(null);
  const shown = images.slice(0, SPOTS.length);

  useEffect(function () {
    function onKey(e) {
      if (lb === null) return;
      if (e.key === "Escape") setLb(null);
      if (e.key === "ArrowLeft") setLb(function (i) { return (i - 1 + shown.length) % shown.length; });
      if (e.key === "ArrowRight") setLb(function (i) { return (i + 1) % shown.length; });
    }
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }, [lb, shown.length]);

  function down(e, i) {
    const f = e.currentTarget, b = board.current;
    f.setPointerCapture(e.pointerId);
    z.current += 1; f.style.zIndex = z.current; f.classList.add("drag");
    const sx = e.clientX, sy = e.clientY, ox = f.offsetLeft, oy = f.offsetTop;
    let moved = false;
    function mv(ev) {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      f.style.left = Math.max(-f.offsetWidth * 0.3, Math.min(b.clientWidth - f.offsetWidth * 0.7, ox + dx)) + "px";
      f.style.top = Math.max(-f.offsetHeight * 0.3, Math.min(b.clientHeight - f.offsetHeight * 0.7, oy + dy)) + "px";
    }
    function up() { f.removeEventListener("pointermove", mv); f.classList.remove("drag"); if (!moved) setLb(i); }
    f.addEventListener("pointermove", mv);
    f.addEventListener("pointerup", up, { once: true });
    f.addEventListener("pointercancel", up, { once: true });
  }

  if (shown.length < 3) return null;

  return (
    <div className="mb-14">
      <span className="tfd-kick">On the table</span>
      <h3 className="tfd-h2 text-cream mt-3" style={{ fontSize: "clamp(2.2rem,4.4vw,3.6rem)" }}>THE LIGHT TABLE</h3>
      <p className="italic text-lg text-cream/80 mt-3 max-w-[48ch]">Stills from the shoots. Drag them around, tap one to see it big.</p>
      <div ref={board} className="tfd-board">
        {shown.map(function (im, i) {
          const s = SPOTS[i];
          return (
            <figure key={im.src} className="tfd-ph" data-cur="drag" style={{ width: s.w, left: s.x + "%", top: s.y + "%", transform: "rotate(" + s.r + "deg)" }} onPointerDown={function (e) { down(e, i); }}>
              <img src={im.src} alt={im.caption || ""} draggable={false} />
              <figcaption>{im.caption || ""}</figcaption>
            </figure>
          );
        })}
        <span className="absolute right-4 bottom-3 font-mono text-[10px] tracking-widest uppercase text-muted pointer-events-none">Drag to rearrange</span>
      </div>

      {lb !== null ? (
        <div className="fixed inset-0 z-[150] bg-backdrop/95 grid place-items-center px-4" role="dialog" aria-modal="true" onClick={function () { setLb(null); }}>
          <img src={shown[lb].src} alt={shown[lb].caption || ""} className="max-h-[84vh] max-w-[min(92vw,1100px)] rounded shadow-2xl" onClick={function (e) { e.stopPropagation(); }} />
          <p className="absolute bottom-4 left-0 right-0 text-center italic text-muted">{shown[lb].caption || ""}</p>
          <button type="button" aria-label="Close" onClick={function () { setLb(null); }} className="absolute top-4 right-4 w-11 h-11 rounded-full border border-cream/20 text-xl">&times;</button>
          <button type="button" aria-label="Previous" onClick={function (e) { e.stopPropagation(); setLb((lb - 1 + shown.length) % shown.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-cream/20 text-2xl">&lsaquo;</button>
          <button type="button" aria-label="Next" onClick={function (e) { e.stopPropagation(); setLb((lb + 1) % shown.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-cream/20 text-2xl">&rsaquo;</button>
        </div>
      ) : null}
    </div>
  );
}
