import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleBoard from "../components/ArticleBoard";
import { mediaUrl, formatDate, pubTime } from "../components/feedUtils";

export const metadata = {
  title: "All Articles - That Filmy Dude",
  alternates: { canonical: "/articles" },
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
          {items.length > 0 ? (
            <nav aria-label="Every article, in one list" className="mt-24 pt-10 border-t border-cream/10">
              <h2 className="tfd-h2 text-cream mb-6" style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)" }}>EVERY ARTICLE, IN ONE LIST</h2>
              <ul className="columns-1 md:columns-2 gap-12 list-none p-0 m-0">
                {items.map(function (i) {
                  return (
                    <li key={i.key} className="break-inside-avoid py-1.5">
                      <a href={i.href} className="text-cream/80 hover:text-gold transition">{i.title}</a>
                      <span className="font-mono text-[11px] tracking-widest uppercase text-muted ml-3">{i.date}</span>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
