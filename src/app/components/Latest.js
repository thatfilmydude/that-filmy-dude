import { getFeed, formatDate } from "./feedUtils";
import PinnedStory from "./PinnedStory";

export default async function Latest() {
  const feed = await getFeed();
  const withImg = feed.filter(function (i) { return i.img; });
  const reviews = withImg.filter(function (i) { return i.category === "Review"; }).slice(0, 2);
  const writing = withImg.filter(function (i) { return i.category !== "Review"; }).slice(0, 2);
  let picked = reviews.concat(writing);
  if (picked.length < 4) {
    const rest = withImg.filter(function (i) { return picked.indexOf(i) < 0; });
    picked = picked.concat(rest.slice(0, 4 - picked.length));
  }
  picked.sort(function (a, b) { return b.ts - a.ts; });
  const items = picked.map(function (i) {
    return { key: i.key, kind: i.category, title: i.title, excerpt: i.excerpt, img: i.img, href: i.href, date: formatDate(i.ts), sub: i.sub };
  });
  if (items.length < 2) return null;
  return <PinnedStory items={items} />;
}
