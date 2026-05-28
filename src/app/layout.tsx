import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { TopTicker } from "@/components/home/TopTicker";
import { cn } from "@/lib/cn";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#06070A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://deepstate.media"),
  title: {
    default: "Deep State Media — Investigative journalism without a side",
    template: "%s — Deep State Media",
  },
  description:
    "Independent investigative journalism on the people who actually run things — left, right, and the rooms in between. Bold framing. Sourced facts.",
  openGraph: {
    title: "Deep State Media",
    description:
      "Independent investigative journalism on the people who actually run things — left, right, and the rooms in between.",
    url: "https://deepstate.media",
    siteName: "Deep State Media",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deep State Media",
    description:
      "Independent investigative journalism on the people who actually run things.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(display.variable, sans.variable, mono.variable)}
      suppressHydrationWarning
    >
      <body className="bg-ink-950 text-ink-50 font-sans antialiased">
        <CustomCursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-signal-500 focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Nav />
        <TopTicker />
        <PageTransition>
          <main id="main">{children}</main>
        </PageTransition>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
