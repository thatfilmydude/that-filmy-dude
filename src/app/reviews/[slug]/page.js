import { notFound } from "next/navigation";
import Link from "next/link";
import TrailerThumb from "../../components/TrailerThumb";

async function getReview(slug) {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/reviews?filters[slug][$eq]=" + slug + "&populate=*", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data && json.data.length > 0 ? json.data[0] : null;
  } catch (e) {
    return null;
  }
}

function getPosterUrl(review) {
  let raw = null;
  if (review.Poster && review.Poster.url) raw = review.Poster.url;
  else if (review.Poster && review.Poster.data && review.Poster.data.attributes && review.Poster.data.attributes.url) raw = review.Poster.data.attributes.url;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return process.env.STRAPI_URL + raw;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const review = await getReview(slug);

  if (!review) {
    return { title: "That Filmy Dude" };
  }

  const posterUrl = getPosterUrl(review);
  const images = posterUrl ? [{ url: posterUrl, width: 1200, height: 630 }] : [];

  return {
    title: review.title + " - That Filmy Dude",
    description: review.excerpt,
    openGraph: {
      title: review.title,
      description: review.excerpt,
      images: images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: review.title,
      description: review.excerpt,
      images: posterUrl ? [posterUrl] : [],
    },
  };
}

function getYoutubeVideoId(url) {
  if (!url) return null;
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
  if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
  if (url.includes("youtube.com/embed/")) return url.split("youtube.com/embed/")[1].split("?")[0];
  return null;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function renderBlocks(blocks) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map(function (block, i) {
    if (block.type === "paragraph") {
      const text = (block.children || []).map(function (c) { return c.text || ""; }).join("");
      if (text.trim() === "") return null;
      return <p key={i} className="mb-6 text-[17px]">{text}</p>;
    }
    if (block.type === "heading") {
      const text = (block.children || []).map(function (c) { return c.text || ""; }).join("");
      return <h2 key={i} className="font-display text-3xl text-cream mt-10 mb-4 tracking-wide">{text}</h2>;
    }
    if (block.type === "quote") {
      const text = (block.children || []).map(function (c) { return c.text || ""; }).join("");
      return <blockquote key={i} className="border-l-2 border-gold pl-5 py-1 italic text-gold text-xl my-8">{text}</blockquote>;
    }
    if (block.type === "image") {
      return <img key={i} src={block.image.url} alt={block.image.alternativeText || ""} className="rounded-lg my-8 w-full border border-cream/10" />;
    }
    return null;
  });
}

function RatingStub({ rating }) {
  return (
    <div className="relative inline-block bg-branddark rounded-md px-5 py-2.5 -rotate-3">
      <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-backdrop" />
      <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-backdrop" />
      <span className="font-display text-3xl text-paper tracking-wide">{rating}</span>
      <span className="font-mono text-xs text-paper/80 ml-1">/5</span>
    </div>
  );
}

function CrewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted mb-1">{label}</span>
      <span className="text-sm text-cream/90">{value}</span>
    </div>
  );
}

export default async function ReviewPage({ params }) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) notFound();

  const posterUrl = getPosterUrl(review);
  const videoId = getYoutubeVideoId(review.trailerUrl);
  const releaseDate = formatDate(review.release_date);

  return (
    <main className="min-h-screen bg-backdrop">
      <div className="max-w-3xl mx-auto px-8 md:px-0">
        <div className="relative pt-10 pb-12">
          <Link href="/#reviews" className="inline-block font-mono text-[11px] tracking-widest uppercase text-gold/80 hover:text-gold transition mb-8">&larr; Back to Reviews</Link>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {posterUrl ? (
              <img src={posterUrl} alt={review.title} className="w-40 sm:w-48 rounded-lg border border-cream/10 shadow-2xl flex-shrink-0" />
            ) : (
              <div className="w-40 sm:w-48 aspect-[2/3] rounded-lg border border-cream/10 flex-shrink-0 bg-gradient-to-br from-branddark via-[#341018] to-surface" />
            )}

            <div className="pt-2 flex-1">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-3">
                {review.genre} - {review.duration}{releaseDate ? " - " + releaseDate : ""}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl text-cream leading-[0.98] mb-6">{review.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <RatingStub rating={review.rating} />
                <span className="font-mono text-[11px] text-muted tracking-widest uppercase">Review by {review.author}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-cream/10">
                <CrewRow label="Director" value={review.director} />
                <CrewRow label="Music" value={review.music} />
                <CrewRow label="Cast" value={review.cast} />
              </div>
            </div>
          </div>
        </div>

        {videoId ? (
          <div className="mb-12">
            <TrailerThumb videoId={videoId} />
          </div>
        ) : null}

        <div className="border-t border-cream/10" />

        <article className="py-14 text-cream/80 leading-relaxed font-body">
          {renderBlocks(review.content)}
        </article>

        <div className="pb-16">
          <Link href="/#reviews" className="inline-block font-mono text-xs tracking-widest uppercase border border-cream/20 text-cream px-6 py-3 rounded-sm hover:border-gold hover:text-gold transition">&larr; Back to all reviews</Link>
        </div>
      </div>
    </main>
  );
}
