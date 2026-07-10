import BlogEntry from "./BlogEntry";

async function getPosts() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?populate=*", {
    headers: {
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data;
  } catch (e) {
    return [];
  }
}

export default async function Blogs() {
  const posts = await getPosts();
  const blogs = posts.filter(function (p) {
    return p.category === "Blog";
  });

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

      {blogs.length === 0 ? (
        <p className="font-mono text-sm text-muted">No blog posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {blogs.map(function (b, i) {
            return (
              <BlogEntry
                key={i}
                date={b.kicker ? b.kicker.toUpperCase() : ""}
                title={b.title}
                excerpt={b.excerpt}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

