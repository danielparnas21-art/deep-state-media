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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-ink-900/10 backdrop-blur-xl transition-[background-color,box-shadow] duration-500",
        scrolled
          ? "bg-paper/95 shadow-[0_1px_24px_-12px_rgba(20,18,14,0.35)]"
          : "bg-paper/90",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Deep State Media — Home"
          className="group relative inline-flex items-center"
        >
          <Wordmark variant="inline" className="text-ink-900" />
          <motion.span
            aria-hidden
            initial={false}
            animate={{ width: scrolled ? 0 : 26 }}
            transition={{ duration: 0.4 }}
            className="ml-3 hidden h-px bg-ink-900/20 md:block"
          />
          <span className="ml-3 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400 md:inline">
            Est. 2026 — Independent
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
                  "group relative text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors",
                  active ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-navy-600 transition-transform duration-500 ease-out group-hover:scale-x-100",
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
            className="group hidden items-center gap-2 rounded-full bg-signal-500 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600 md:inline-flex"
          >
            Send a Tip
          </MagneticButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 md:hidden"
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
            <div className="border-t border-ink-900/10 bg-paper/97 backdrop-blur-xl">
              <ul className="flex flex-col px-6 py-6">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : i * 0.04 }}
                    className="border-b border-ink-900/10 last:border-b-0"
                  >
                    <Link
                      href={item.href}
                      className="block py-5 font-display text-3xl font-semibold tracking-tight text-ink-900"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <li className="pt-6">
                  <Link
                    href="/tip"
                    className="inline-flex items-center gap-2 rounded-full bg-signal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white"
                  >
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
