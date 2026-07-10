export default function Gallery() {
  const items = [
    "Premiere Night",
    "On Set - Ember Road",
    "Red Carpet Looks",
    "Wrap Party",
    "First Look Stills",
    "BTS - Kaalpurush",
    "Award Season",
    "Costume Tests",
  ];

  return (
    <section id="gallery" className="px-8 md:px-16 py-24">
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">
            Frame By Frame
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Galleries</h2>
        </div>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition">
          All Galleries
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {items.map(function (label, i) {
          return (
            <div key={i} className="aspect-[3/4] rounded-md border border-cream/10 bg-gradient-to-br from-surface2 to-surface flex items-end p-3.5 hover:border-gold/40 transition">
              <span className="font-mono text-[11px] tracking-wider uppercase text-muted">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
