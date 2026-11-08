import { mediaUrl } from "../feedUtils";

// Latest reviews as plain objects the client components can use.
export async function getReviewList(limit) {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews?populate=*&sort=publishedAt:desc&pagination[limit]=" + (limit || 8), {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map(function (r) {
      return {
        slug: r.slug,
        title: r.title,
        rating: Number(r.rating) || 0,
        excerpt: r.excerpt || "",
        author: r.author || "",
        genre: r.genre || "",
        posterUrl: mediaUrl(r.Poster),
      };
    });
  } catch (e) {
    return [];
  }
}
