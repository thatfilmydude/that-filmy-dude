export default function TickerStrip() {
  const items = [
    "NOW REVIEWING - MONSOON DIARIES",
    "TRENDING - FIRST LOOK: EMBER ROAD",
    "JUST IN - BOX OFFICE WEEK 3 REPORT",
    "GALLERY - BEHIND THE SCENES: KAALPURUSH",
  ];

  const doubled = items.concat(items);

  return (
    <div className="flex overflow-hidden border-b border-cream/10 bg-surface whitespace-nowrap">
      <div className="flex animate-scroll">
        {doubled.map(function (text, i) {
          return (
            <span key={i} className="px-8 py-3 font-mono text-xs tracking-widest uppercase text-muted border-r border-cream/10">
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
