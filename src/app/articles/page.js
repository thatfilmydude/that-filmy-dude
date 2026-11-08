import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleBoard from "../components/ArticleBoard";
import { mediaUrl, formatDate, pubTime } from "../components/feedUtils";

export const metadata = {
  title: "All Articles - That Filmy Dude",
  description: "Lists, explainers, opinions and what to watch, from That Filmy Dude.",
};

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?populate=*&sort=publishedAt:desc&pagination[pageSize]=100", {
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

export default async function AllArticles() {
  const posts = await getPosts();
  const items = posts.filter(function (p) { return p.slug; }).map(function (p) {
    return {
      key: "p" + p.id,
      href: (p.category === "Blog" ? "/blogs/" : "/articles/") + p.slug,
      title: p.title,
      excerpt: p.excerpt || "",
      img: mediaUrl(p.cover),
      category: p.category || "Article",
      date: formatDate(pubTime(p)),
      ts: pubTime(p),
      rating: 0,
      ratingText: "",
    };
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-backdrop pt-[150px] pb-24">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8">
          <span className="tfd-kick">Read more</span>
          <h1 className="tfd-h2 text-cream mt-3 mb-4" style={{ fontSize: "clamp(3.2rem,8vw,7rem)" }}>ALL ARTICLES</h1>
          <p className="italic text-xl text-cream/80 max-w-[46ch] leading-snug mb-12">Lists, explainers, opinions and what to watch this month.</p>
          {items.length === 0 ? (
            <p className="italic text-xl text-cream/70 py-16">Articles are loading. Please refresh in a minute.</p>
          ) : (
            <ArticleBoard items={items} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
