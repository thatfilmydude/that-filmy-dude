import ArticleCard from "./ArticleCard";

function getCoverInfo(post) {
  let raw = null;
  let focalX = null;
  let focalY = null;

  if (post.cover && post.cover.url) {
    raw = post.cover.url;
    if (post.cover.focalPoint) {
      focalX = post.cover.focalPoint.x;
      focalY = post.cover.focalPoint.y;
    }
  } else if (post.cover && post.cover.data && post.cover.data.attributes) {
    raw = post.cover.data.attributes.url;
    if (post.cover.data.attributes.focalPoint) {
      focalX = post.cover.data.attributes.focalPoint.x;
      focalY = post.cover.data.attributes.focalPoint.y;
    }
  }

  if (!raw) return { coverUrl: null, focalX: null, focalY: null };

  const coverUrl = raw.startsWith("http") ? raw : process.env.STRAPI_URL + raw;
  return { coverUrl: coverUrl, focalX: focalX, focalY: focalY };
}

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?populate=*&sort=createdAt:desc", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch (e) {
    return [];
  }
}

export default async function Articles() {
  const posts = await getPosts();
  const articles = posts.filter(function (p) { return p.category === "Article"; });
  if (articles.length === 0) return null;

  return (
    <section id="articles" className="px-8 md:px-16 py-24 bg-paper border-y border-black/10">
      <div className="flex items-end justify-between border-b border-black/15 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-branddark mb-2">Deep Focus</span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1C1416]">Articles</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map(function (a, i) {
          const cover = getCoverInfo(a);
          return (
            <ArticleCard key={i} slug={a.slug} coverUrl={cover.coverUrl} focalX={cover.focalX} focalY={cover.focalY} tag={a.kicker ? a.kicker.toUpperCase() : "FEATURE"} kicker={a.kicker} title={a.title} excerpt={a.excerpt} meta={(a.readTime || "") + " - BY " + (a.author || "")} featured={a.featured} />
          );
        })}
      </div>
    </section>
  );
}
