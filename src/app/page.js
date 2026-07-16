import Header from "./components/Header";
import Hero from "./components/Hero";
import TickerStrip from "./components/TickerStrip";
import Reviews from "./components/Reviews";
import News from "./components/News";
import Articles from "./components/Articles";
import Blogs from "./components/Blogs";
import Gallery from "./components/Gallery";
import YoutubeFeed from "./components/YoutubeFeed";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <TickerStrip />
      <Reviews />
      <News />
      <Articles />
      <Blogs />
      <Gallery />
      <YoutubeFeed />
      <Footer />
    </>
  );
}
