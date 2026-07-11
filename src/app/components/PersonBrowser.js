"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

export default function PersonBrowser({ shoots }) {
  const [activePerson, setActivePerson] = useState(null);

  const people = [];
  shoots.forEach(function (shoot) {
    if (!people.includes(shoot.person)) {
      people.push(shoot.person);
    }
  });

  if (people.length === 0) {
    return (
      <div className="w-40 aspect-[3/4] rounded-md border border-dashed border-cream/15 bg-surface flex items-center justify-center">
        <span className="font-mono text-[11px] tracking-wider uppercase text-muted/50">Coming Soon</span>
      </div>
    );
  }

  if (!activePerson) {
    return (
      <div className="flex gap-4 flex-wrap">
        {people.map(function (person) {
          const personShoots = shoots.filter(function (s) { return s.person === person; });
          const coverImg = personShoots[0].images[0];
          return (
            <button key={person} onClick={function () { setActivePerson(person); }} className="w-32 text-left group">
              <div className="aspect-[3/4] rounded-md overflow-hidden border border-cream/10 group-hover:border-gold/50 transition mb-2">
                <img src={coverImg.src} alt={person} className="w-full h-full object-cover" style={{ imageOrientation: "from-image" }} />
              </div>
              <span className="font-mono text-[11px] tracking-wider uppercase text-cream">{person}</span>
              <span className="block font-mono text-[10px] text-muted">{personShoots.length} shoot{personShoots.length !== 1 ? "s" : ""}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const personShoots = shoots.filter(function (s) { return s.person === activePerson; });

  return (
    <div>
      <button onClick={function () { setActivePerson(null); }} className="font-mono text-[11px] tracking-widest uppercase text-gold/80 hover:text-gold transition mb-5 inline-block">
        &larr; All People
      </button>

      {personShoots.map(function (shoot, i) {
        return (
          <div key={i} className="mb-8">
            <h4 className="font-display text-xl text-cream mb-3">{shoot.caption}</h4>
            <Lightbox images={shoot.images} />
          </div>
        );
      })}
    </div>
  );
}
