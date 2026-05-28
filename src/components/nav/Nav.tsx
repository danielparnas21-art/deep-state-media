"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/writings", label: "Writings" },
  { href: "/campaign-desk", label: "Campaign Desk" },
  { href: "/podcast", label: "Podcast" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled
          ? "border-b border-white/5 bg-ink-950/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Deep State Media — Home"
          className="group relative inline-flex items-center"
        >
          <Wordmark variant="inline" className="text-ink-50" />
          <motion.span
            aria-hidden
            initial={false}
            animate={{ width: scrolled ? 0 : 28 }}
            transition={{ duration: 0.4 }}
            className="ml-3 hidden h-px bg-white/30 md:block"
          />
          <span className="ml-3 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-300 md:inline">
            EST. 2026 — Independent
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
                  active ? "text-ink-50" : "text-ink-300 hover:text-ink-50",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-signal-500 transition-transform duration-500 ease-out group-hover:scale-x-100",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <MagneticButton
            as="a"
            href="/tip"
            data-cursor-label="Securely"
            className="group hidden items-center gap-2 rounded-full border border-signal-500/60 bg-signal-500/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-signal-100 transition-colors hover:bg-signal-500 hover:text-black md:inline-flex"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-300" />
            </span>
            Send a Tip
          </MagneticButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-50 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="md:hidden"
          >
            <div className="border-t border-white/5 bg-ink-950/95 backdrop-blur-xl">
              <ul className="flex flex-col px-6 py-6">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : i * 0.04 }}
                    className="border-b border-white/5 last:border-b-0"
                  >
                    <Link
                      href={item.href}
                      className="block py-5 font-display text-3xl font-bold tracking-tightest text-ink-50"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <li className="pt-6">
                  <Link
                    href="/tip"
                    className="inline-flex items-center gap-2 rounded-full bg-signal-500 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-black"
                  >
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-pulse-dot rounded-full bg-black/70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black" />
                    </span>
                    Send a Tip
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
