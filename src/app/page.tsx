import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Journey from "@/components/Education";
import Projects from "@/components/Projects";

import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import Loading from "@/components/Loading";

export default function Home() {
  return (
    <>
    <Loading/>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <Skills />
          <Journey />
          <Projects />
          <Contact/>
        </main>
        <Footer />
        <ScrollToTop/>
      </SmoothScroll>
    </>
  );
}