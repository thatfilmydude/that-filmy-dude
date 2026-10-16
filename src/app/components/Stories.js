import { getFeed, formatDate } from "./feedUtils";

const DAY = 24 * 60 * 60 * 1000;
const MAX_AGE_DAYS = 30;
const MIN_ITEMS = 3;
const MAX_ITEMS = 6;

export default async function Stories() {
  const feed = await getFeed();
  const shownInLatest = feed.slice(0, 4).map(function (i) { return i.key; });

  const stories = feed.filter(function (item) {
    if (item.kind !== "post") return false;
    if (item.category !== "News" && item.category !== "Article") return false;
    if (shownInLatest.indexOf(item.key) !== -1) return false;
    return Date.now() - item.ts < MAX_AGE_DAYS * DAY;
  }).slice(0, MAX_ITEMS);

  if (stories.length < MIN_ITEMS) return null;

  return (
    <section id="articles" className="px-8 md:px-16 py-24 bg-surface border-y border-cream/10">
      <span id="news" />
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">The Wire</span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Stories</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map(function (item) {
          return (
            <a key={item.key} href={item.href} className="group block">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-cream/10 mb-4">
                {item.img ? (
                  <>
                    <img src={item.img} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60" />
                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-branddark to-surface" />
                )}
              </div>
              <span className="block font-mono text-xs text-muted mb-2">{item.category.toUpperCase()} / {formatDate(item.ts)}</span>
              <h3 className="font-display text-2xl text-cream group-hover:text-gold transition leading-tight">{item.title}</h3>
              {item.excerpt ? (
                <p className="mt-2 text-sm text-cream/60 leading-relaxed line-clamp-2">{item.excerpt}</p>
              ) : null}
            </a>
          );
        })}
      </div>
    </section>
  );
}
