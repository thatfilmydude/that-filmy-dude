import { Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FilmStrip from "./components/FilmStrip";
import Sections from "./components/Sections";
import TicketForm from "./components/TicketForm";
import Latest from "./components/Latest";
import Reviews from "./components/Reviews";
import Stories from "./components/Stories";
import Blogs from "./components/Blogs";
import Gallery from "./components/Gallery";
import YoutubeFeed from "./components/YoutubeFeed";
import InstagramFeed from "./components/InstagramFeed";
import Footer from "./components/Footer";
import SectionSkeleton from "./components/SectionSkeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: 640 }} />}>
        <Hero />
      </Suspense>
      <Suspense fallback={null}>
        <FilmStrip />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Latest />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Sections />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Stories />
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
      <TicketForm />
      <Footer />
    </>
  );
}
