import { getFeed } from "./feedUtils";
import { getReviewList } from "./home/data";
import FilmStripClient from "./FilmStripClient";

export default async function FilmStrip() {
  const results = await Promise.all([getReviewList(8), getFeed()]);
  const urls = [];
  results[0].forEach(function (r) { if (r.posterUrl) urls.push(r.posterUrl); });
  results[1].forEach(function (i) { if (i.img && urls.indexOf(i.img) === -1) urls.push(i.img); });
  if (urls.length < 4) return null;
  return <FilmStripClient urls={urls.slice(0, 12)} />;
}
