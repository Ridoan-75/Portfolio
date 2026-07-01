import SmoothScroll from "@/components/SmoothScroll";
import Sidebar from "@/components/Sidebar";
import ParticleBackground from "@/components/ParticleBackground";

import Loading from "@/components/Loading";
import ScrollToTop from "@/components/ScrollToTop";
import MobileNav from "@/components/MobileNav";
import CommandPalette from "@/components/CommandPalette";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Loading />
      <ParticleBackground />
      <CommandPalette />
      <div
        style={{ display: "flex", minHeight: "100vh", position: "relative" }}
      >
        <MobileNav />
        <div
          className="portfolio-content-wrap"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <div
            className="portfolio-grid"
            style={{
              width: "100%",
              maxWidth: "1320px",
              display: "grid",
              gridTemplateColumns: "280px minmax(0, 1fr)",
              gap: "0",
              padding: "0",
              minHeight: "100vh",
              alignItems: "stretch",
            }}
          >
            <Sidebar />
            <SmoothScroll>
              <main
                className="portfolio-main"
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  padding: "0 0 0 28px",
                  minWidth: 0,
                }}
              >
                {children}
              </main>
              <ScrollToTop />
            </SmoothScroll>
          </div>
        </div>
      </div>
    </>
  );
}
