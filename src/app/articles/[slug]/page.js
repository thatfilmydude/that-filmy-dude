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

function getCoverUrl(post) {
  let raw = null;
  if (post.cover && post.cover.url) raw = post.cover.url;
  else if (post.cover && post.cover.data && post.cover.data.attributes && post.cover.data.attributes.url) raw = post.cover.data.attributes.url;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return process.env.STRAPI_URL + raw;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "That Filmy Dude" };
  }

  const coverUrl = getCoverUrl(post);
  const images = coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : [];

  return {
    title: post.title + " - That Filmy Dude",
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: coverUrl ? [coverUrl] : [],
    },
  };
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
      return <h2 key={i} className="font-display text-3xl text-[#1C1416] mt-10 mb-4 tracking-wide">{text}</h2>;
    }
    if (block.type === "quote") {
      const text = (block.children || []).map(function (c) { return c.text || ""; }).join("");
      return <blockquote key={i} className="border-l-2 border-branddark pl-5 py-1 italic text-branddark text-xl my-8">{text}</blockquote>;
    }
    if (block.type === "image") {
      return <img key={i} src={block.image.url} alt={block.image.alternativeText || ""} className="rounded-lg my-8 w-full border border-black/10" />;
    }
    return null;
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const coverUrl = getCoverUrl(post);

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-8 md:px-0">
        <div className="pt-10 pb-8">
          <a href="/#articles" className="inline-block font-mono text-[11px] tracking-widest uppercase text-branddark/80 hover:text-branddark transition mb-8">&larr; Back to Articles</a>

          {coverUrl ? (
            <img src={coverUrl} alt={post.title} className="w-full aspect-video object-cover rounded-lg border border-black/10 mb-8" />
          ) : null}

          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-branddark mb-3">{post.kicker}</span>
          <h1 className="font-display text-3xl sm:text-5xl text-[#1C1416] leading-[0.98] mb-6">{post.title}</h1>
          <span className="font-mono text-[11px] text-[#1C1416]/50 tracking-widest uppercase">{post.readTime} - By {post.author}</span>
        </div>

        <div className="border-t border-black/10" />

        <article className="py-14 text-[#1C1416]/80 leading-relaxed font-body">
          {renderBlocks(post.content)}
        </article>

        <div className="pb-16">
          <a href="/#articles" className="inline-block font-mono text-xs tracking-widest uppercase border border-black/20 text-[#1C1416] px-6 py-3 rounded-sm hover:border-branddark hover:text-branddark transition">&larr; Back to all articles</a>
        </div>
      </div>
    </main>
  );
}
