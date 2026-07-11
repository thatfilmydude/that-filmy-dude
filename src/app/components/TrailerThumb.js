"use client";

import { useState } from "react";

export default function TrailerThumb({ videoId }) {
  const [playing, setPlaying] = useState(false);

  if (!videoId) {
    return null;
  }

  if (playing) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-cream/10">
        <iframe
          src={"https://www.youtube.com/embed/" + videoId + "?autoplay=1"}
          title="Trailer"
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={function () {
        setPlaying(true);
      }}
      className="relative aspect-video w-full rounded-lg overflow-hidden border border-cream/10 block group"
    >
      <img
        src={"https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg"}
        alt="Watch trailer"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-backdrop/30 group-hover:bg-backdrop/10 transition flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center group-hover:scale-105 transition">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-backdrop border-b-[10px] border-b-transparent ml-1" />
        </div>
      </div>
      <span className="absolute bottom-3 left-3 font-mono text-[11px] tracking-widest uppercase text-cream bg-backdrop/70 px-2.5 py-1 rounded">
        Watch Trailer
      </span>
    </button>
  );
}
