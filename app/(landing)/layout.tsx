import Navbar from "@/components/layout/Navbar";
import UtilityBar from "@/components/layout/UtilityBar";
import QuickAccess from "@/components/layout/QuickAccess";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import Preloader from "@/components/preloader/Preloader";
import RouteProgress from "@/components/preloader/RouteProgress";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-navy pb-16 lg:pb-0">
      <Preloader />
      <RouteProgress />
      <UtilityBar />
      <Navbar />
      <QuickAccess />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
