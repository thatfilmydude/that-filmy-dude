export function mediaUrl(field) {
  if (!field) return null;
  let raw = null;
  if (field.url) raw = field.url;
  else if (field.data && field.data.attributes && field.data.attributes.url) raw = field.data.attributes.url;
  if (!raw) return null;
  return raw.startsWith("http") ? raw : process.env.STRAPI_URL + raw;
}

export function pubTime(item) {
  return new Date(item.publishedAt || item.createdAt).getTime();
}

export function formatDate(ts) {
  const d = new Date(ts);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return months[d.getMonth()] + " " + d.getDate();
}

async function strapiList(path) {
  try {
    const res = await fetch(process.env.STRAPI_URL + path, {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    return [];
  }
}

// One merged, newest first list of every review and post.
export async function getFeed() {
  const results = await Promise.all([
    strapiList("/api/posts?populate=*&sort=publishedAt:desc&pagination[limit]=20"),
    strapiList("/api/reviews?populate=*&sort=publishedAt:desc&pagination[limit]=10"),
  ]);
  const posts = results[0];
  const reviews = results[1];
  const items = [];

  reviews.forEach(function (r) {
    items.push({
      key: "review-" + r.id,
      kind: "review",
      category: "Review",
      href: "/reviews/" + r.slug,
      title: r.title,
      excerpt: r.excerpt || "",
      img: mediaUrl(r.Poster),
      sub: r.rating ? r.rating + " / 5" : "",
      ts: pubTime(r),
    });
  });

  posts.forEach(function (p) {
    items.push({
      key: "post-" + p.id,
      kind: "post",
      category: p.category || "Article",
      href: (p.category === "Blog" ? "/blogs/" : "/articles/") + p.slug,
      title: p.title,
      excerpt: p.excerpt || "",
      img: mediaUrl(p.cover),
      sub: p.kicker || "",
      ts: pubTime(p),
    });
  });

  items.sort(function (a, b) { return b.ts - a.ts; });
  return items;
}
