async function getInstagramToken() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/site-setting", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data.instagram_token || null;
  } catch (e) {
    return null;
  }
}

async function getPosts() {
  const token = await getInstagramToken();
  if (!token) return [];

  try {
    const url = "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=" + token + "&limit=8";
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    return [];
  }
}

function getDisplayImage(post) {
  if (post.media_type === "VIDEO") {
    return post.thumbnail_url;
  }
  return post.media_url;
}

export default async function InstagramFeed() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="instagram" className="px-8 md:px-16 py-24 border-t border-cream/10">
      <div className="border-b border-cream/10 pb-5 mb-12">
        <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">On The Gram</span>
        <h2 className="font-display text-4xl md:text-5xl text-cream">Latest On Instagram</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
        {posts.map(function (post, i) {
          const img = getDisplayImage(post);
          if (!img) return null;
          return (
            <a key={i} href={post.permalink} target="_blank" rel="noopener noreferrer" className="relative w-40 sm:w-48 aspect-square flex-shrink-0 rounded-md overflow-hidden border border-cream/10 hover:border-gold/50 transition group snap-start">
              <img src={img} alt="Instagram post" className="w-full h-full object-cover" />
              {post.media_type === "VIDEO" ? (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-backdrop/70 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-cream border-b-[4px] border-b-transparent ml-0.5" />
                </div>
              ) : null}
              <div className="absolute inset-0 bg-backdrop/0 group-hover:bg-backdrop/20 transition" />
            </a>
          );
        })}
      </div>

      <a href="https://www.instagram.com/thatfilmydude" target="_blank" rel="noopener noreferrer" className="inline-block mt-8 font-mono text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-1 hover:border-gold transition">
        Follow on Instagram &rarr;
      </a>
    </section>
  );
}
