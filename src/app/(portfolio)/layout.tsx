import SmoothScroll from "@/components/SmoothScroll";
import Sidebar from "@/components/Sidebar";
import ParticleBackground from "@/components/ParticleBackground";
import Cursor from "@/components/Cursor";
import SettingsInit from "@/components/SettingsInit";
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
      <Cursor />
      <SettingsInit />
      <CommandPalette />
      <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
        <MobileNav />
        <div className="portfolio-content-wrap" style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ width: "100%", maxWidth: "1320px", display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: "32px", padding: "36px 0", minHeight: "100vh", alignItems: "stretch" }}>
            <Sidebar />
            <SmoothScroll>
              <main style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
