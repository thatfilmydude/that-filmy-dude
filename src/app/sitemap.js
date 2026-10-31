async function fetchAll(path) {
  try {
    const res = await fetch(
      process.env.STRAPI_URL + "/api/" + path + "?pagination[pageSize]=100&sort=publishedAt:desc",
      { headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) { return []; }
}
function safeDate(value) { const d = new Date(value); return isNaN(d.getTime()) ? new Date() : d; }
export default async function sitemap() {
  const baseUrl = "https://www.thatfilmydude.net";
  const reviews = await fetchAll("reviews");
  const posts = await fetchAll("posts");
  const staticPages = [{ url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 }];
  const reviewPages = reviews.filter(function (r) { return r.slug; }).map(function (r) {
    return { url: baseUrl + "/reviews/" + r.slug, lastModified: safeDate(r.updatedAt), changeFrequency: "weekly", priority: 0.8 };
  });
  const postPages = posts.filter(function (p) { return p.slug; }).map(function (p) {
    const section = p.category === "Blog" ? "/blogs/" : "/articles/";
    return { url: baseUrl + section + p.slug, lastModified: safeDate(p.updatedAt), changeFrequency: "weekly", priority: 0.7 };
  });
  return staticPages.concat(reviewPages, postPages);
}