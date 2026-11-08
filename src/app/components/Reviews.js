import ReviewWheel from "./ReviewWheel";
import RatingRuler from "./RatingRuler";
import { getReviewList } from "./home/data";

export default async function Reviews() {
  const reviews = await getReviewList(8);
  if (reviews.length === 0) return null;
  return (
    <>
      <ReviewWheel reviews={reviews} />
      <RatingRuler reviews={reviews.filter(function (r) { return r.rating > 0; })} />
    </>
  );
}
