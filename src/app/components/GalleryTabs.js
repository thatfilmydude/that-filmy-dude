"use client";

import { useState } from "react";
import PersonBrowser from "./PersonBrowser";

export default function GalleryTabs({ categories }) {
  const [active, setActive] = useState(categories[0].key);
  const activeCategory = categories.find(function (c) {
    return c.key === active;
  });

  return (
    <div>
      <div className="flex gap-2.5 mb-6 flex-wrap">
        {categories.map(function (cat) {
          const isActive = cat.key === active;
          return (
            <button
              key={cat.key}
              onClick={function () { setActive(cat.key); }}
              className={
                "font-mono text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border transition " +
                (isActive
                  ? "bg-gold text-backdrop border-gold font-bold"
                  : "text-muted border-cream/15 hover:border-gold/50 hover:text-gold")
              }
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <PersonBrowser shoots={activeCategory.shoots} />
    </div>
  );
}
