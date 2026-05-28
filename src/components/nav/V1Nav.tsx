"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";

/**
 * Minimal dark chrome for the V1 teaser. Just the wordmark and a single way
 * forward — Meet the Team. Transparent over the hero, gaining a quiet backdrop
 * once you scroll. (The full multi-link Nav returns with V2.)
 */
export function V1Nav() {
  const pathname = usePathname();
  const onTeam = pathname === "/team";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#06070d]/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Deep State Media — home"
          className="text-paper transition-opacity hover:opacity-80"
        >
          <Wordmark variant="inline" />
        </Link>

        {onTeam ? (
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-paper"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back
          </Link>
        ) : (
          <Link
            href="/team"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-signal-500 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-signal-600"
          >
            Meet the team
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </nav>
    </motion.header>
  );
}
