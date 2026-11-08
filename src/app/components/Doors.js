"use client";

import { useState } from "react";

export default function Doors({ doors }) {
  const [on, setOn] = useState(0);
  return (
    <section className="py-24" aria-label="Explore the site">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <span className="tfd-kick">Explore</span>
        <h2 className="tfd-h2 text-cream mt-3" style={{ fontSize: "clamp(2.8rem,6.4vw,5.6rem)" }}>PICK A DOOR</h2>
        <div className="tfd-doors">
          {doors.map(function (d, i) {
            return (
              <a key={d.label} href={d.href} className={"tfd-dr" + (on === i ? " on" : "")} style={{ "--c": d.color }} data-cur="enter"
                onPointerEnter={function (e) { if (e.pointerType === "mouse") setOn(i); }}
                onFocus={function () { setOn(i); }}
                onClick={function (e) { if (on !== i) { e.preventDefault(); setOn(i); } }}>
                <div className="bgi" style={d.img ? { backgroundImage: 'url("' + d.img + '")' } : null} />
                <i className="ln" />
                <span className="vt">{d.label.toUpperCase()}</span>
                <div className="dc">
                  <h3 className="tfd-h2 text-cream" style={{ fontSize: "clamp(3.2rem,6vw,5.2rem)" }}>{d.label.toUpperCase()}</h3>
                  <p className="italic text-xl text-cream/85 max-w-[34ch] mt-2 mb-4">{d.desc}</p>
                  <span className="tfd-btn tfd-btn-r">Go to {d.label.toLowerCase()}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
