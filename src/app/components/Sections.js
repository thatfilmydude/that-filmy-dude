import { getFeed } from "./feedUtils";
import { getReviewList } from "./home/data";
import Doors from "./Doors";

async function firstGalleryImage() {
  try {
    const res = await fetch(process.env.STRAPI_URL + "/api/gallery-photos?populate=*&pagination[limit]=1&sort=publishedAt:desc", {
      headers: { Authorization: "Bearer " + process.env.STRAPI_API_TOKEN },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const p = (json.data || [])[0];
    const img = p && Array.isArray(p.image) ? p.image[0] : null;
    if (!img || !img.url) return null;
    return img.url.startsWith("http") ? img.url : process.env.STRAPI_URL + img.url;
  } catch (e) {
    return null;
  }
}

export default async function Sections() {
  const results = await Promise.all([getReviewList(1), getFeed(), firstGalleryImage()]);
  const feed = results[1];
  const article = feed.filter(function (i) { return i.kind === "post" && i.category !== "Blog" && i.img; })[0];
  const blog = feed.filter(function (i) { return i.category === "Blog" && i.img; })[0];
  const doors = [
    { label: "Reviews", href: "#reviews", color: "#E2241A", img: results[0][0] ? results[0][0].posterUrl : null, desc: "A rating out of 5 and a verdict you can read in ten seconds." },
    { label: "Articles", href: "#articles", color: "#E8B34C", img: article ? article.img : null, desc: "Lists, explainers and what to watch this month." },
    { label: "Blogs", href: "#blogs", color: "#4f8fd6", img: blog ? blog.img : null, desc: "Longer takes, opinions and comparisons." },
    { label: "Galleries", href: "#gallery", color: "#46a97a", img: results[2], desc: "Stills and shoots, by actor, actress and event." },
  ];
  return <Doors doors={doors} />;
}
