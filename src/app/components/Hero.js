export default function Hero() {
  const bulbs = Array.from({ length: 14 });

  return (
    <section className="relative px-8 py-28 text-center overflow-hidden border-b border-cream/10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(122,19,19,0.45),transparent_70%)]" />

      <div className="relative inline-block px-10 md:px-24 py-10 border-2 border-gold/40 rounded-md">
        <div className="absolute -top-[7px] left-4 right-4 flex justify-between">
          {bulbs.map(function (_, i) {
            return (
              <span key={"top-" + i} className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_1.5px_rgba(232,179,76,0.9)] animate-flicker" style={{ animationDelay: (i % 4) * 0.3 + "s" }} />
            );
          })}
        </div>

        <p className="font-mono text-xs tracking-[0.3em] uppercase text-gold mb-4">Now Showing - Opinions, Uncut</p>

        <h1 className="font-display text-6xl md:text-8xl leading-[0.92] text-cream">
          REEL TALK,
          <br />
          <span className="text-gold">NO FILTER</span>
        </h1>

        <p className="max-w-md mx-auto mt-6 text-muted italic leading-relaxed">Reviews that do not kiss the poster. Galleries worth stopping to scroll. The film world, minus the PR spin.</p>

        <div className="mt-9 flex gap-4 justify-center flex-wrap">
          <a href="#reviews" className="font-mono text-xs tracking-widest uppercase bg-gold text-backdrop font-bold px-7 py-3.5 rounded-sm hover:-translate-y-0.5 transition">Latest Reviews</a>
          <a href="#gallery" className="font-mono text-xs tracking-widest uppercase border border-cream/20 text-cream px-7 py-3.5 rounded-sm hover:border-gold hover:text-gold transition">Browse Galleries</a>
        </div>

        <div className="absolute -bottom-[7px] left-4 right-4 flex justify-between">
          {bulbs.map(function (_, i) {
            return (
              <span key={"bottom-" + i} className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_1.5px_rgba(232,179,76,0.9)] animate-flicker" style={{ animationDelay: (i % 4) * 0.3 + "s" }} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
