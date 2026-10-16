import { getFeed, formatDate } from "./feedUtils";

const DAY = 24 * 60 * 60 * 1000;

export default async function Latest() {
  const feed = await getFeed();
  const items = feed.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section id="latest" className="px-8 md:px-16 pt-16 pb-8">
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-10 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">Just Published</span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Latest</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(function (item) {
          const fresh = Date.now() - item.ts < 2 * DAY;
          return (
            <a key={item.key} href={item.href} className="group block">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-cream/10 bg-surface mb-4">
                {item.img ? (
                  <>
                    <img src={item.img} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60" />
                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-branddark to-surface" />
                )}
                <span className="absolute top-3 left-3 z-10 font-mono text-[10px] tracking-widest uppercase bg-black/70 text-gold px-2 py-1 rounded-sm">{item.category}</span>
                {fresh ? (
                  <span className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-widest uppercase bg-[#E2241A] text-white px-2 py-1 rounded-sm">New</span>
                ) : null}
              </div>
              <span className="block font-mono text-xs text-muted mb-2">{formatDate(item.ts)}{item.sub ? " / " + item.sub : ""}</span>
              <h3 className="font-display text-xl md:text-2xl text-cream group-hover:text-gold transition leading-tight line-clamp-3">{item.title}</h3>
            </a>
          );
        })}
      </div>
    </section>
  );
}
