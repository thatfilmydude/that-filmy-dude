async function getReviews() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews?sort=createdAt:desc&pagination[limit]=5", {
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

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?sort=createdAt:desc&pagination[limit]=5", {
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

export default async function TickerStrip() {
  const reviews = await getReviews();
  const posts = await getPosts();

  const combined = [];

  reviews.forEach(function (r) {
    combined.push({
      text: "NOW REVIEWING - " + r.title.toUpperCase(),
      date: new Date(r.createdAt).getTime(),
    });
  });

  posts.forEach(function (p) {
    const label = p.category === "Blog" ? "FROM THE BLOG - " : p.category === "News" ? "JUST IN - " : "NEW ARTICLE - ";
    combined.push({
      text: label + p.title.toUpperCase(),
      date: new Date(p.createdAt).getTime(),
    });
  });

  combined.sort(function (a, b) {
    return b.date - a.date;
  });

  const latest = combined.slice(0, 3).map(function (item) {
    return item.text;
  });

  if (latest.length === 0) {
    return null;
  }

  const doubled = latest.concat(latest);

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
