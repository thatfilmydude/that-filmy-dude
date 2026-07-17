import GalleryTabs from "./GalleryTabs";

function getImageUrls(photo) {
  const imgs = Array.isArray(photo.image) ? photo.image : [];
  return imgs.map(function (img) {
    let raw = img.url;
    if (!raw) return null;
    if (raw.startsWith("http")) return { src: raw, caption: photo.caption };
    return { src: process.env.STRAPI_URL + raw, caption: photo.caption };
  }).filter(function (x) { return x !== null; });
}

async function getPhotos() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/gallery-photos?populate=*", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch (e) {
    return [];
  }
}

export default async function Gallery() {
  const photos = await getPhotos();
  if (photos.length === 0) return null;

  const categoryDefs = [
    { name: "Actors", key: "Actors" },
    { name: "Actresses", key: "Actresses" },
    { name: "Events", key: "Events" },
  ];

  const categories = categoryDefs
    .map(function (def) {
      const shoots = photos
        .filter(function (p) { return p.category === def.key; })
        .map(function (p) { return { caption: p.caption, person: p.person, images: getImageUrls(p) }; })
        .filter(function (s) { return s.images.length > 0; });
      return { name: def.name, key: def.key, shoots: shoots };
    })
    .filter(function (cat) { return cat.shoots.length > 0; });

  if (categories.length === 0) return null;

  return (
    <section id="gallery" className="px-8 md:px-16 py-24">
      <div className="border-b border-cream/10 pb-5 mb-12">
        <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">Frame By Frame</span>
        <h2 className="font-display text-4xl md:text-5xl text-cream">Galleries</h2>
      </div>
      <GalleryTabs categories={categories} />
    </section>
  );
}
