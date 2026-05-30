"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Dark chrome for the V1 teaser. The places worth going — Reports, Press,
 * Contact, and the Meet the Team CTA — sit inline on desktop and collapse into
 * a tidy dropdown on mobile (four destinations + the wordmark don't fit one
 * phone row). Transparent over the hero, gaining a quiet backdrop on scroll.
 */
const LINKS = [
  { href: "/reports", label: "Reports" },
  { href: "/press", label: "Press" },
  { href: "/contact", label: "Contact" },
];

export function V1Nav() {
  const pathname = usePathname();
  const onTeam = pathname === "/team";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const teamCta = onTeam ? (
    <Link
      href="/"
      className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-paper"
    >
      <ArrowRight size={13} className="rotate-180" />
      Back
    </Link>
  ) : (
    <Link
      href="/team"
      className="group relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-md bg-signal-500 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_22px_-6px_rgba(200,57,42,0.85)] ring-1 ring-inset ring-white/20 transition-colors hover:bg-signal-600"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-1 top-1 h-1 w-1 rotate-45 bg-white/40"
      />
      <Lock size={11} className="relative shrink-0" />
      <span className="relative">Meet the team</span>
    </Link>
  );

  return (
    <motion.header
      initial={false}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-[#06070d]/90 backdrop-blur-md"
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

        {/* Desktop: everything inline */}
        <div className="hidden items-center gap-6 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
                pathname === l.href
                  ? "text-paper"
                  : "text-paper/55 hover:text-paper",
              )}
            >
              {l.label}
            </Link>
          ))}
          {teamCta}
        </div>

        {/* Mobile: a menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-paper transition-colors hover:text-paper sm:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
            className="overflow-hidden border-b border-white/10 bg-[#06070d]/95 backdrop-blur-md sm:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-1">
              {[{ href: "/reports", label: "Reports" }, { href: "/team", label: "Meet the team" }, ...LINKS.filter((l) => l.href !== "/reports")].map(
                (l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors",
                      pathname === l.href
                        ? "bg-white/[0.06] text-paper"
                        : "text-paper/70 hover:bg-white/[0.04] hover:text-paper",
                    )}
                  >
                    {l.label}
                    <ArrowRight size={13} className="text-paper/40" />
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
