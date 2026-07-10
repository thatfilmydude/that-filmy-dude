import ArticleCard from "./ArticleCard";

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?populate=*", {
    headers: {
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data;
  } catch (e) {
    return [];
  }
}

export default async function Articles() {
  const posts = await getPosts();
  const articles = posts.filter(function (p) {
    return p.category === "Article";
  });

  return (
    <section id="articles" className="px-8 md:px-16 py-24 bg-paper border-y border-black/10">
      <div className="flex items-end justify-between border-b border-black/15 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-branddark mb-2">
            Deep Focus
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1C1416]">Articles</h2>
        </div>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-[#1C1416]/55 border-b border-black/20 pb-1 hover:text-branddark hover:border-branddark transition">
          All Articles
        </a>
      </div>

      {articles.length === 0 ? (
        <p className="font-mono text-sm text-[#1C1416]/60">No articles published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map(function (a, i) {
            return (
              <ArticleCard
                key={i}
                tag={a.kicker ? a.kicker.toUpperCase() : "FEATURE"}
                kicker={a.kicker}
                title={a.title}
                excerpt={a.excerpt}
                meta={(a.readTime || "") + " - BY " + (a.author || "")}
                featured={a.featured}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

