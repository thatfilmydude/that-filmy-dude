import Header from "./components/Header";
import Hero from "./components/Hero";
import TickerStrip from "./components/TickerStrip";
import Reviews from "./components/Reviews";
import Articles from "./components/Articles";
import Blogs from "./components/Blogs";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <TickerStrip />
      <Reviews />
      <Articles />
      <Blogs />
      <Gallery />
      <Footer />
    </>
  );
}
