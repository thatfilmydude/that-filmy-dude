import { notFound } from "next/navigation";

async function getPost(slug) {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/posts?filters[slug][$eq]=" + slug + "&populate=*", {
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

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-backdrop">
      <div className="max-w-3xl mx-auto px-8 md:px-0">
        <div className="pt-10 pb-8">
          <a href="/#blogs" className="inline-block font-mono text-[11px] tracking-widest uppercase text-gold/80 hover:text-gold transition mb-8">&larr; Back to Blogs</a>

          <span className="block font-mono text-[11px] tracking-widest uppercase text-muted mb-3">{post.kicker}</span>
          <h1 className="font-body italic font-semibold text-3xl sm:text-5xl text-cream leading-tight mb-6">{post.title}</h1>
          <span className="font-mono text-[11px] text-muted tracking-widest uppercase">By {post.author}</span>
        </div>

        <div className="border-t border-cream/10" />

        <article className="py-14 text-cream/80 leading-relaxed font-body">
          {renderBlocks(post.content)}
        </article>

        <div className="pb-16">
          <a href="/#blogs" className="inline-block font-mono text-xs tracking-widest uppercase border border-cream/20 text-cream px-6 py-3 rounded-sm hover:border-gold hover:text-gold transition">&larr; Back to all blogs</a>
        </div>
      </div>
    </main>
  );
}
