import ArticleCard from "./ArticleCard";

export default function Articles() {
  const articles = [
    {
      tag: "FEATURE - 01",
      kicker: "Industry",
      title: "Why South Indian Cinema Keeps Winning the Pan-India Race",
      excerpt: "Budgets are still smaller. So why do these films keep outperforming at the national box office?",
      meta: "12 MIN READ - BY R. NAIR",
      featured: true,
    },
    {
      tag: "FEATURE - 02",
      kicker: "Deep Dive",
      title: "The Second Act Problem",
      excerpt: "A running theme across this year's biggest releases: strong openings, sagging middles.",
      meta: "8 MIN READ - BY A. MENON",
      featured: false,
    },
    {
      tag: "FEATURE - 03",
      kicker: "Retrospective",
      title: "The Soundtrack Decade",
      excerpt: "How background scores quietly became the most-discussed part of a film's release.",
      meta: "10 MIN READ - BY S. IYER",
      featured: false,
    },
  ];

  return (
    <section id="articles" className="px-8 md:px-16 py-24 bg-paper border-y border-black/10">
      <div className="flex items-end justify-between border-b border-black/15 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-branddark mb-2">
            Deep Focus
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#1C1416]">Articles</h2>
        </div>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-[#1C1416]/55 border-b border-black/20 pb-1 hover:text-branddark hover:border-branddark transition">
          All Articles
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map(function (a, i) {
          return <ArticleCard key={i} {...a} />;
        })}
      </div>
    </section>
  );
}
