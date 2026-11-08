const CREDITS = [
  ["Reviews", "Rated out of five, with a one line verdict"],
  ["Articles", "What to watch and where"],
  ["Blogs", "Longer takes and opinions"],
  ["Galleries", "Stills and shoots"],
  ["Shorts", "On YouTube"],
  ["Posts", "On Instagram"],
  ["Opinions", "Uncut"],
];

export default function Footer() {
  const rolls = CREDITS.concat(CREDITS);
  const word = "THAT FILMY DUDE".split("");
  return (
    <footer className="bg-[#080506] border-t border-cream/10 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-8 items-center pt-16 pb-4">
        <div>
          <h2 className="tfd-h2 text-cream" style={{ fontSize: "clamp(2.4rem,4.6vw,4rem)" }}>BUILT FOR PEOPLE WHO WATCH THE CREDITS</h2>
          <div className="flex gap-3 mt-6 flex-wrap">
            <a href="https://www.instagram.com/thatfilmydude" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition border border-cream/15 rounded-full px-4 py-2.5">Instagram</a>
            <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition border border-cream/15 rounded-full px-4 py-2.5">X</a>
            <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition border border-cream/15 rounded-full px-4 py-2.5">YouTube</a>
          </div>
        </div>
        <div className="tfd-crw" aria-hidden="true">
          <div className="tfd-roll">
            {rolls.map(function (c, i) {
              return (
                <div key={i} className="grid grid-cols-2 gap-5 py-3">
                  <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-muted text-right pt-1">{c[0]}</span>
                  <b className="font-display text-3xl font-normal tracking-wide leading-tight text-cream">{c[1]}</b>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="tfd-wm" aria-hidden="true">
        {word.map(function (ch, i) { return <span key={i}>{ch === " " ? " " : ch}</span>; })}
      </div>
      <div className="border-t border-cream/10 py-5 px-5 md:px-8 font-mono text-[10px] tracking-wide text-muted flex justify-between gap-4 flex-wrap max-w-[1240px] mx-auto w-full">
        <span>COPYRIGHT 2026 - THAT FILMY DUDE</span>
        <span>thatfilmydude.net</span>
      </div>
    </footer>
  );
}
