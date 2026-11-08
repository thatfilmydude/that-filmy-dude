import { getFeed } from "./feedUtils";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const feed = await getFeed();
  const items = feed.map(function (i) {
    return { title: i.title, href: i.href, kind: i.category, sub: i.sub };
  });
  return <HeaderClient items={items} />;
}
