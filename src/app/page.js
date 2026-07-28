import { Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TickerStrip from "./components/TickerStrip";
import Reviews from "./components/Reviews";
import News from "./components/News";
import Articles from "./components/Articles";
import Blogs from "./components/Blogs";
import Gallery from "./components/Gallery";
import YoutubeFeed from "./components/YoutubeFeed";
import InstagramFeed from "./components/InstagramFeed";
import Footer from "./components/Footer";
import SectionSkeleton from "./components/SectionSkeleton";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Suspense fallback={null}>
        <TickerStrip />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <News />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Articles />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Blogs />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <YoutubeFeed />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <InstagramFeed />
      </Suspense>
      <Footer />
    </>
  );
}
