// Shared renderer for Strapi "Blocks" rich text.
// Handles links, bold/italic/underline/strike/code, lists, headings, quotes,
// code blocks, images and standalone YouTube links (shown as an embedded player).

const YT = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/;

export function youtubeId(url) {
  if (typeof url !== "string") return null;
  const m = url.match(YT);
  return m ? m[1] : null;
}

export function YouTubeEmbed({ url }) {
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <div className="relative w-full aspect-video my-8 rounded-lg overflow-hidden border border-white/10 bg-black">
      <iframe
        src={"https://www.youtube-nocookie.com/embed/" + id}
        title="YouTube video"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch (e) {
    return "";
  }
}

function isAffiliateUrl(url) {
  const host = hostOf(url);
  return /(^|\.)(amazon\.[a-z.]+|amzn\.[a-z.]+|link\.amazon)$/.test(host);
}

function isInternalUrl(url) {
  if (typeof url !== "string") return false;
  if (url.startsWith("/") || url.startsWith("#")) return true;
  const host = hostOf(url);
  return host === "thatfilmydude.net" || host === "www.thatfilmydude.net";
}

// "light" is for the paper themed articles page, "dark" for blogs and reviews.
const THEMES = {
  light: {
    link: "text-branddark font-medium underline underline-offset-4 decoration-branddark/40 hover:decoration-branddark transition",
    strong: "font-semibold text-[#1C1416]",
    code: "font-mono text-[0.9em] bg-black/5 px-1 rounded",
    pre: "font-mono text-sm bg-black/5 rounded-lg p-4 my-8 overflow-x-auto",
    heading: "text-[#1C1416]",
    quote: "border-l-2 border-branddark pl-5 py-1 italic text-branddark text-xl my-8",
    img: "rounded-lg my-8 w-full border border-black/10",
  },
  dark: {
    link: "text-gold font-medium underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition",
    strong: "font-semibold text-cream",
    code: "font-mono text-[0.9em] bg-cream/10 px-1 rounded",
    pre: "font-mono text-sm bg-cream/10 rounded-lg p-4 my-8 overflow-x-auto",
    heading: "text-cream",
    quote: "border-l-2 border-gold pl-5 py-1 italic text-gold text-xl my-8",
    img: "rounded-lg my-8 w-full border border-cream/10",
  },
};

function plainText(children) {
  if (!Array.isArray(children)) return "";
  return children
    .map(function (c) {
      if (c.type === "link" || Array.isArray(c.children)) return plainText(c.children);
      return c.text || "";
    })
    .join("");
}

function renderInline(children, t) {
  if (!Array.isArray(children)) return null;
  return children.map(function (c, i) {
    if (c.type === "link") {
      const url = c.url || "#";
      if (isInternalUrl(url)) {
        return <a key={i} href={url} className={t.link}>{renderInline(c.children, t)}</a>;
      }
      const rel = isAffiliateUrl(url)
        ? "sponsored nofollow noopener noreferrer"
        : "noopener noreferrer";
      return (
        <a key={i} href={url} target="_blank" rel={rel} className={t.link}>
          {renderInline(c.children, t)}
        </a>
      );
    }
    let el = c.text || "";
    if (el === "") return null;
    if (c.code) el = <code className={t.code}>{el}</code>;
    if (c.bold) el = <strong className={t.strong}>{el}</strong>;
    if (c.italic) el = <em>{el}</em>;
    if (c.underline) el = <u>{el}</u>;
    if (c.strikethrough) el = <s>{el}</s>;
    return <span key={i}>{el}</span>;
  });
}

function standaloneYouTubeUrl(children) {
  if (!Array.isArray(children)) return null;
  const real = children.filter(function (c) {
    return !(c.type !== "link" && (c.text || "").trim() === "");
  });
  if (real.length !== 1) return null;
  const only = real[0];
  if (only.type === "link") return youtubeId(only.url) ? only.url : null;
  const t = (only.text || "").trim();
  return youtubeId(t) && /^https?:\/\/\S+$/.test(t) ? t : null;
}

function renderList(block, key, t) {
  const ordered = block.format === "ordered";
  const Tag = ordered ? "ol" : "ul";
  const cls = (ordered ? "list-decimal" : "list-disc") + " pl-6 mb-6 space-y-2 text-[17px]";
  return (
    <Tag key={key} className={cls}>
      {(block.children || []).map(function (item, j) {
        if (item.type === "list") return <li key={j} className="list-none">{renderList(item, j, t)}</li>;
        const nested = (item.children || []).filter(function (c) { return c.type === "list"; });
        const inline = (item.children || []).filter(function (c) { return c.type !== "list"; });
        return (
          <li key={j}>
            {renderInline(inline, t)}
            {nested.map(function (n, k) { return renderList(n, k, t); })}
          </li>
        );
      })}
    </Tag>
  );
}

export function renderBlocks(blocks, theme) {
  if (!Array.isArray(blocks)) return null;
  const t = THEMES[theme] || THEMES.light;
  return blocks.map(function (block, i) {
    if (block.type === "paragraph") {
      if (plainText(block.children).trim() === "") return null;
      const yt = standaloneYouTubeUrl(block.children);
      if (yt) return <YouTubeEmbed key={i} url={yt} />;
      return <p key={i} className="mb-6 text-[17px]">{renderInline(block.children, t)}</p>;
    }
    if (block.type === "heading") {
      const level = block.level || 2;
      if (level <= 2) {
        return <h2 key={i} className={"font-display text-3xl " + t.heading + " mt-10 mb-4 tracking-wide"}>{renderInline(block.children, t)}</h2>;
      }
      if (level === 3) {
        return <h3 key={i} className={"font-display text-2xl " + t.heading + " mt-8 mb-3 tracking-wide"}>{renderInline(block.children, t)}</h3>;
      }
      return <h4 key={i} className={"font-display text-xl " + t.heading + " mt-6 mb-3 tracking-wide"}>{renderInline(block.children, t)}</h4>;
    }
    if (block.type === "list") return renderList(block, i, t);
    if (block.type === "quote") {
      return <blockquote key={i} className={t.quote}>{renderInline(block.children, t)}</blockquote>;
    }
    if (block.type === "code") {
      return <pre key={i} className={t.pre}>{plainText(block.children)}</pre>;
    }
    if (block.type === "image" && block.image && block.image.url) {
      return <img key={i} src={block.image.url} alt={block.image.alternativeText || ""} className={t.img} />;
    }
    return null;
  });
}
