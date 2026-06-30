import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Outfit } from "next/font/google";
import { AppToaster } from "@/components/ui/app-toaster";
import "./globals.css";
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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
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
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${outfit.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
