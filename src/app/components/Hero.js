import HeroBooth from "./HeroBooth";
import { getReviewList } from "./home/data";

export default async function Hero() {
  const reviews = await getReviewList(1);
  return <HeroBooth review={reviews[0] || null} />;
}
