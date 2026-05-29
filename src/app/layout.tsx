import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, Inter, JetBrains_Mono, Anton } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { V1Nav } from "@/components/nav/V1Nav";
import { V1Footer } from "@/components/footer/V1Footer";
import { CodeRain } from "@/components/home/CodeRain";
import { PageTransition } from "@/components/motion/PageTransition";
import { RouteDecrypt } from "@/components/motion/RouteDecrypt";
import { TopTicker } from "@/components/home/TopTicker";
import { IntroGate } from "@/components/intro/IntroGate";
import { LAUNCHED } from "@/lib/launch";
import { cn } from "@/lib/cn";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const poster = Anton({
  subsets: ["latin"],
  variable: "--font-poster",
  weight: "400",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  // Dark to match the V1 teaser so mobile browser chrome blends in. Flip back
  // to the paper tone (#FBFAF6) when the full light site launches.
  themeColor: "#06070d",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(display.variable, poster.variable, serif.variable, sans.variable, mono.variable)}
      style={LAUNCHED ? undefined : { background: "#06070d", colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "font-sans antialiased",
          LAUNCHED ? "bg-paper text-ink-900" : "bg-[#06070d] text-paper",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-navy-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {LAUNCHED ? <Nav /> : <V1Nav />}
        {LAUNCHED && <TopTicker />}
        {!LAUNCHED && <CodeRain />}
        <PageTransition>
          <main id="main" className="relative z-10">
            {children}
          </main>
        </PageTransition>
        {LAUNCHED ? <Footer /> : <V1Footer />}
        {!LAUNCHED && <RouteDecrypt />}
        <IntroGate />
        <Analytics />
      </body>
    </html>
  );
}
