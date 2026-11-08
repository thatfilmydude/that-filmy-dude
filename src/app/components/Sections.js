import { getFeed } from "./feedUtils";
import { getReviewList } from "./home/data";
import Doors from "./Doors";

const GALLERY_CATS = ["Actors", "Actresses", "Events"];

// Same URL the Gallery section uses, so the request is shared and cached.
async function latestGallery() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/gallery-photos?populate=*", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const list = (json.data || []).filter(function (p) {
      return GALLERY_CATS.indexOf(p.category) >= 0 && Array.isArray(p.image) && p.image.length > 0 && p.image[0].url;
    });
    if (list.length === 0) return null;
    const p = list[0];
    const raw = p.image[0].url;
    return { img: raw.startsWith("http") ? raw : process.env.STRAPI_URL + raw, title: p.person || p.caption || "New shoot" };
  } catch (e) {
    return null;
  }
}

export default async function Sections() {
  const results = await Promise.all([getReviewList(1), getFeed(), latestGallery()]);
  const review = results[0][0];
  const feed = results[1];
  const article = feed.filter(function (i) { return i.kind === "post" && i.category !== "Blog"; })[0];
  const blog = feed.filter(function (i) { return i.category === "Blog"; })[0];
  const gallery = results[2];
  const doors = [
    { label: "Reviews", href: "#reviews", color: "#E2241A", live: !!review, img: review ? review.posterUrl : null, title: review ? review.title : "", desc: "A rating out of 5 and a verdict you can read in ten seconds." },
    { label: "Articles", href: "#articles", color: "#E8B34C", live: !!article, img: article ? article.img : null, title: article ? article.title : "", desc: "Lists, explainers and what to watch this month." },
    { label: "Blogs", href: "#blogs", color: "#4f8fd6", live: !!blog, img: blog ? blog.img : null, title: blog ? blog.title : "", desc: "Longer takes, opinions and comparisons." },
    { label: "Galleries", href: "#gallery", color: "#46a97a", live: !!gallery, img: gallery ? gallery.img : null, title: gallery ? gallery.title : "", desc: "Stills and shoots, by actor, actress and event." },
  ];
  return <Doors doors={doors} />;
}
