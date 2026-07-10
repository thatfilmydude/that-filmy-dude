export default function Gallery() {
  const categories = [
    { name: "Actors", tiles: ["Coming Soon", "Coming Soon", "Coming Soon", "Coming Soon"] },
    { name: "Actresses", tiles: ["Coming Soon", "Coming Soon", "Coming Soon", "Coming Soon"] },
    { name: "Events", tiles: ["Coming Soon", "Coming Soon", "Coming Soon", "Coming Soon"] },
  ];

  return (
    <section id="gallery" className="px-8 md:px-16 py-24">
      <div className="border-b border-cream/10 pb-5 mb-12">
        <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">
          Frame By Frame
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-cream">Galleries</h2>
      </div>

      {categories.map(function (cat, ci) {
        return (
          <div key={ci} className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-2xl tracking-wide text-cream">{cat.name}</h3>
              <a href="#" className="font-mono text-[11px] tracking-widest uppercase text-muted border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition">
                View All
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {cat.tiles.map(function (label, i) {
                return (
                  <div key={i} className="aspect-[3/4] rounded-md border border-dashed border-cream/15 bg-surface flex items-center justify-center">
                    <span className="font-mono text-[11px] tracking-wider uppercase text-muted/50">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
