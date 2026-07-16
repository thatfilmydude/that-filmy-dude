function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return months[d.getMonth()] + " " + d.getDate();
}

function getCoverUrl(item) {
  let raw = null;
  if (item.cover && item.cover.url) {
    raw = item.cover.url;
  } else if (
    item.cover &&
    item.cover.data &&
    item.cover.data.attributes &&
    item.cover.data.attributes.url
  ) {
    raw = item.cover.data.attributes.url;
  }
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return process.env.STRAPI_URL + raw;
}

async function getNews() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?filters[category][$eq]=News&sort=createdAt:desc&pagination[limit]=8&populate=*", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch (e) {
    return [];
  }
}

export default async function News() {
  const news = await getNews();

  if (news.length === 0) {
    return null;
  }

  return (
    <section id="news" className="px-8 md:px-16 py-24 bg-surface border-y border-cream/10">
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">
            The Wire
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Fresh Off The Set</h2>
        </div>
      </div>

      <div className="flex flex-col">
        {news.map(function (item, i) {
          const coverUrl = getCoverUrl(item);
          return (
            <div key={i} className="flex items-center gap-6 py-6 border-b border-cream/10 hover:pl-2 transition-all group">
              {coverUrl ? (
                <div className="w-28 h-20 sm:w-40 sm:h-28 rounded-lg overflow-hidden border border-cream/10 flex-shrink-0">
                  <img src={coverUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-28 h-20 sm:w-40 sm:h-28 rounded-lg bg-gradient-to-br from-branddark to-surface flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs text-muted block mb-2">{formatDate(item.createdAt)}</span>
                <h4 className="text-lg sm:text-xl text-cream group-hover:text-gold transition leading-snug">{item.title}</h4>
              </div>

              <span className="text-gold-dim text-2xl flex-shrink-0">&#8599;</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
