async function getReviews() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews?sort=createdAt:desc&pagination[limit]=5", {
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

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?sort=createdAt:desc&pagination[limit]=5", {
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

export default async function TickerStrip() {
  const reviews = await getReviews();
  const posts = await getPosts();

  const items = [];

  reviews.forEach(function (r) {
    items.push("NOW REVIEWING - " + r.title.toUpperCase());
  });

  posts.forEach(function (p) {
    const label = p.category === "Blog" ? "FROM THE BLOG - " : "JUST IN - ";
    items.push(label + p.title.toUpperCase());
  });

  if (items.length === 0) {
    return null;
  }

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
