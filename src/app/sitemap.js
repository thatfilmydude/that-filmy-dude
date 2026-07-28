async function getReviews() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    return [];
  }
}

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = "https://www.thatfilmydude.net";

  const reviews = await getReviews();
  const posts = await getPosts();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const reviewPages = reviews
    .filter(function (r) { return r.slug; })
    .map(function (r) {
      return {
        url: baseUrl + "/reviews/" + r.slug,
        lastModified: new Date(r.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

  const postPages = posts
    .filter(function (p) { return p.slug; })
    .map(function (p) {
      const section = p.category === "Blog" ? "/blogs/" : "/articles/";
      return {
        url: baseUrl + section + p.slug,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

  return staticPages.concat(reviewPages, postPages);
}
