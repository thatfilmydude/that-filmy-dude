import { getFeed, formatDate } from "./feedUtils";
import PinnedStory from "./PinnedStory";

export default async function Latest() {
  const feed = await getFeed();
  const items = feed.filter(function (i) { return i.img; }).slice(0, 5).map(function (i) {
    return { key: i.key, kind: i.category, title: i.title, excerpt: i.excerpt, img: i.img, href: i.href, date: formatDate(i.ts), sub: i.sub };
  });
  if (items.length < 2) return null;
  return <PinnedStory items={items} />;
}
