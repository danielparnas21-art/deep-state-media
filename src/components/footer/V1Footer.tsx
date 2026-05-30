import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * Minimal dark footer for the V1 teaser — wordmark, one line of intent, and the
 * legal line. No site map yet (there's nothing to map to), so it stays quiet.
 * The full footer with newsletter + link columns returns with V2.
 */
export function V1Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 bg-[#06070d]/65 text-paper">
      <div className="mx-auto w-full max-w-[1480px] px-6 py-10 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <Wordmark variant="inline" className="text-paper" />
            <p className="mt-4 max-w-sm text-sm text-paper/55">
              Independent investigative media. Corruption on both sides — named,
              sourced, and coming soon.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">
            <Link href="/reports" className="transition-colors hover:text-paper">
              Reports
            </Link>
            <Link href="/team" className="transition-colors hover:text-paper">
              Meet the team
            </Link>
            <Link href="/press" className="transition-colors hover:text-paper">
              Press
            </Link>
            <Link href="/contact" className="transition-colors hover:text-paper">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 pt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/35 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Deep State Media</span>
          <span>Independent · Both sides · No spin</span>
        </div>
      </div>
    </footer>
  );
}
