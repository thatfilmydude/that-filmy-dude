import BlogEntry from "./BlogEntry";

export default function Blogs() {
  const entries = [
    {
      date: "JUL 08 - PERSONAL TAKE",
      title: "I watched Monsoon Diaries twice. Here's what changed.",
      excerpt: "The first watch, I was annoyed by the pacing. The second, I realised that was the point.",
    },
    {
      date: "JUL 06 - HOT TAKE",
      title: "Trailers are lying to us again, and we keep falling for it",
      excerpt: "A short rant on the state of trailer-cutting, and the one recent exception that respected the audience.",
    },
    {
      date: "JUL 02 - LISTICLE",
      title: "Five character actors who deserve a lead role this year",
      excerpt: "They've been stealing every scene for years. It's time somebody wrote them the whole film.",
    },
    {
      date: "JUN 29 - DIARY",
      title: "What a 6am press screening actually feels like",
      excerpt: "Cold coffee, colder theatre, and the strange privilege of watching a film before anyone tells you what to think.",
    },
  ];

  return (
    <section id="blogs" className="px-8 md:px-16 py-24">
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">
            Off The Record
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Blogs</h2>
        </div>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition">
          All Blogs
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {entries.map(function (e, i) {
          return <BlogEntry key={i} {...e} />;
        })}
      </div>
    </section>
  );
}
