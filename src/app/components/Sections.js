import { getFeed } from "./feedUtils";
import { getReviewList } from "./home/data";
import Doors from "./Doors";

export default async function Sections() {
  const results = await Promise.all([getReviewList(3), getFeed()]);
  const reviews = results[0];
  const posts = results[1].filter(function (i) { return i.kind === "post"; });
  const lead = posts.filter(function (i) { return i.img; })[0] || posts[0];

  const doors = [
    {
      label: "Reviews",
      href: "/reviews",
      color: "#E2241A",
      live: reviews.length > 0,
      img: reviews[0] ? reviews[0].posterUrl : null,
      title: reviews[0] ? reviews[0].title : "",
      desc: "A rating out of 5 and a verdict you can read in ten seconds.",
      also: reviews.slice(1, 3).map(function (r) { return { title: r.title, href: "/reviews/" + r.slug }; }),
    },
    {
      label: "Articles",
      href: "/articles",
      color: "#E8B34C",
      live: !!lead,
      img: lead ? lead.img : null,
      title: lead ? lead.title : "",
      desc: "Lists, explainers, opinions and what to watch this month.",
      also: posts.filter(function (i) { return i !== lead; }).slice(0, 2).map(function (i) { return { title: i.title, href: i.href }; }),
    },
  ];
  return <Doors doors={doors} />;
}
