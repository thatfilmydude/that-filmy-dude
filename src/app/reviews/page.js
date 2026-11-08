import Header from "../components/Header";
import Footer from "../components/Footer";
import ReviewWall from "../components/ReviewWall";
import { mediaUrl, formatDate, pubTime } from "../components/feedUtils";

export const metadata = {
  title: "All Reviews - That Filmy Dude",
  description: "Every movie review on That Filmy Dude, with a rating out of 5 and a verdict you can read in ten seconds.",
};

async function getReviews() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews?populate=*&sort=publishedAt:desc&pagination[pageSize]=100", {
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

export default async function AllReviews() {
  const reviews = await getReviews();
  const items = reviews.filter(function (r) { return r.slug; }).map(function (r) {
    const rating = Number(r.rating) || 0;
    return {
      key: "r" + r.id,
      href: "/reviews/" + r.slug,
      title: r.title,
      excerpt: r.excerpt || "",
      img: mediaUrl(r.Poster),
      category: "Review",
      date: formatDate(pubTime(r)),
      ts: pubTime(r),
      rating: rating,
      ratingText: String(Math.round(rating * 100) / 100),
    };
  });

  const rated = items.filter(function (i) { return i.rating > 0; });
  const avg = rated.length ? Math.round((rated.reduce(function (t, i) { return t + i.rating; }, 0) / rated.length) * 10) / 10 : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-backdrop pt-[150px] pb-24">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8">
          <span className="tfd-kick">Every verdict</span>
          <h1 className="tfd-h2 text-cream mt-3 mb-4" style={{ fontSize: "clamp(3.2rem,8vw,7rem)" }}>ALL REVIEWS</h1>
          <p className="italic text-xl text-cream/80 max-w-[46ch] leading-snug mb-12">Every film we have reviewed{items.length > 0 ? ", " + items.length + " so far, averaging " + avg + " out of 5" : ""}. Hover a poster for the verdict, or light up the rating bars to see only the best.</p>
          {items.length === 0 ? (
            <p className="italic text-xl text-cream/70 py-16">Reviews are loading. Please refresh in a minute.</p>
          ) : (
            <ReviewWall items={items} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
