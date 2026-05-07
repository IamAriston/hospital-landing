import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import UtilityBar from "@/components/layout/UtilityBar";
import QuickAccess from "@/components/layout/QuickAccess";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import Preloader from "@/components/preloader/Preloader";
import RouteProgress from "@/components/preloader/RouteProgress";
import { siteConfig } from "@/config/site";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.fullName,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-navy antialiased pb-16 lg:pb-0">
        <Preloader />
        <RouteProgress />
        <UtilityBar />
        <Navbar />
        <QuickAccess />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
