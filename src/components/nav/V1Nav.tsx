"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";

/**
 * Minimal dark chrome for the V1 teaser — wordmark plus the few places worth
 * going: Press, Contact, and the Meet the Team CTA. Transparent over the hero,
 * gaining a quiet backdrop once you scroll. (The full Nav returns with V2.)
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
      <nav className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Deep State Media — home"
          className="text-paper transition-opacity hover:opacity-80"
        >
          <Wordmark variant="inline" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/press"
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors sm:text-[11px] sm:tracking-[0.2em]",
              pathname === "/press"
                ? "text-paper"
                : "text-paper/55 hover:text-paper",
            )}
          >
            Press
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors sm:text-[11px] sm:tracking-[0.2em]",
              pathname === "/contact"
                ? "text-paper"
                : "text-paper/55 hover:text-paper",
            )}
          >
            Contact
          </Link>
          {onTeam ? (
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/70 transition-colors hover:text-paper sm:text-[11px] sm:tracking-[0.18em]"
            >
              <ArrowRight size={13} className="rotate-180" />
              Back
            </Link>
          ) : (
            <Link
              href="/team"
              className="group relative inline-flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md bg-signal-500 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_0_22px_-6px_rgba(200,57,42,0.85)] ring-1 ring-inset ring-white/20 transition-colors hover:bg-signal-600 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.16em]"
            >
              {/* CRT scanline texture — terminal/clearance feel */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* Corner stamp tick */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-1 top-1 h-1 w-1 rotate-45 bg-white/40"
              />
              <Lock size={11} className="relative shrink-0" />
              <span className="relative sm:hidden">Team</span>
              <span className="relative hidden sm:inline">Meet the team</span>
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
