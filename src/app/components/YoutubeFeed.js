async function getVideos() {
  try {
    const url = "https://www.googleapis.com/youtube/v3/search?key=" + process.env.YOUTUBE_API_KEY + "&channelId=" + process.env.YOUTUBE_CHANNEL_ID + "&part=snippet&order=date&maxResults=8&type=video";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.items || [];
  } catch (e) {
    return [];
  }
}

export default async function YoutubeFeed() {
  const videos = await getVideos();

  if (videos.length === 0) {
    return null;
  }

  const subscribeUrl = "https://www.youtube.com/channel/" + process.env.YOUTUBE_CHANNEL_ID;

  return (
    <section id="youtube" className="px-8 md:px-16 py-24">
      <div className="border-b border-cream/10 pb-5 mb-12">
        <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">Now Screening</span>
        <h2 className="font-display text-4xl md:text-5xl text-cream">Latest On YouTube</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
        {videos.map(function (v, i) {
          const videoId = v.id.videoId;
          const thumb = v.snippet.thumbnails.high.url;
          const title = v.snippet.title;
          const watchUrl = "https://www.youtube.com/watch?v=" + videoId;
          return (
            <a key={i} href={watchUrl} target="_blank" rel="noopener noreferrer" className="relative w-64 flex-shrink-0 snap-start group">
              <div className="aspect-video rounded-lg overflow-hidden border border-cream/10 relative">
                <img src={thumb} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-backdrop/20 group-hover:bg-backdrop/5 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center group-hover:scale-105 transition">
                    <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-backdrop border-b-[7px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs text-cream mt-3 leading-snug line-clamp-2">{title}</p>
            </a>
          );
        })}
      </div>

      <a href={subscribeUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 font-mono text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-1 hover:border-gold transition">
        Subscribe on YouTube &rarr;
      </a>
    </section>
  );
}
