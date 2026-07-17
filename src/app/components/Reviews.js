import ReviewCard from "./ReviewCard";

function getPosterUrl(review) {
  let raw = null;
  if (review.Poster && review.Poster.url) raw = review.Poster.url;
  else if (review.Poster && review.Poster.data && review.Poster.data.attributes && review.Poster.data.attributes.url) raw = review.Poster.data.attributes.url;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return process.env.STRAPI_URL + raw;
}

async function getReviews() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews?populate=*", {
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

export default async function Reviews() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="px-8 md:px-16 py-24">
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">In Theatres</span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Latest Reviews</h2>
        </div>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition">All Reviews</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map(function (r, i) {
          return (
            <ReviewCard key={i} slug={r.slug} posterUrl={getPosterUrl(r)} genre={r.genre} duration={r.duration} title={r.title} excerpt={r.excerpt} rating={r.rating + " out of 5 stars"} author={r.author} />
          );
        })}
      </div>
    </section>
  );
}
