"use client";

import { useEffect, useRef, useState } from "react";

export default function Doors({ doors }) {
  const [hover, setHover] = useState(-1);
  const [peek, setPeek] = useState(-1);
  const root = useRef(null);

  // One tease when the section scrolls into view: each curtain opens in turn, then closes.
  useEffect(function () {
    const el = root.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timers = [];
    let done = false;
    const io = new IntersectionObserver(function (entries) {
      if (done || !entries[0].isIntersecting) return;
      done = true;
      io.disconnect();
      doors.forEach(function (d, i) {
        if (d.live) timers.push(setTimeout(function () { setPeek(i); }, 500 + i * 1300));
      });
      timers.push(setTimeout(function () { setPeek(-1); }, 500 + doors.length * 1300));
    }, { threshold: 0.45 });
    io.observe(el);
    return function () { io.disconnect(); timers.forEach(clearTimeout); };
  }, [doors]);

  return (
    <section className="py-24" aria-label="Explore the site" ref={root}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <span className="tfd-kick">Explore</span>
        <h2 className="tfd-h2 text-cream mt-3" style={{ fontSize: "clamp(2.8rem,6.4vw,5.6rem)" }}>PICK A SCREEN</h2>
        <div className="tfd-scr-row">
          {doors.map(function (d, i) {
            const isOn = d.live && (hover === i || (hover < 0 && peek === i));
            const Tag = d.live ? "a" : "div";
            const live = d.live ? {
              href: d.href,
              "data-cur": "enter",
              onPointerEnter: function (e) { if (e.pointerType === "mouse") setHover(i); },
              onPointerLeave: function (e) { if (e.pointerType === "mouse") setHover(-1); },
              onFocus: function () { setHover(i); },
              onBlur: function () { setHover(-1); },
              onClick: function (e) { if (hover !== i) { e.preventDefault(); setHover(i); } },
            } : {};
            return (
              <Tag key={d.label} className={"tfd-sc" + (isOn ? " on" : "") + (d.live ? "" : " off")} style={{ "--c": d.color }} {...live}>
                <div className="tfd-sc-st">
                  {d.img ? (
                    <div className="pic" style={{ backgroundImage: 'url("' + d.img + '")' }} />
                  ) : (
                    <div className="pic fb"><span>{d.title}</span></div>
                  )}
                  {d.img && d.title ? <div className="cap"><small>Now showing</small><b>{d.title}</b></div> : null}
                  <i className="cu l" />
                  <i className="cu r" />
                  <i className="val" />
                </div>
                <div className="plq">
                  <span className="nm">{d.label.toUpperCase()}</span>
                  <span className="ds">{d.desc}</span>
                  <span className="go">{d.live ? "Go to " + d.label.toLowerCase() : "Opening soon"}</span>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
