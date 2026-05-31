import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Journey from "@/components/Education";
import Projects from "@/components/Projects";
import PracticalBackground from "../components/ParticleBackground"
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import Loading from "@/components/Loading";
import SiteCustomizer from "@/components/SiteCustomizer";

export default function Home() {
  return (
    <>
      <Loading />
      <PracticalBackground />
      <Cursor />
      <SiteCustomizer />
      <SmoothScroll>
        <Navbar />
        <main style={{ position: "relative", zIndex: 1 }}>
          <Hero />
          <Skills />
          <Journey />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </SmoothScroll>
    </>
  );
}