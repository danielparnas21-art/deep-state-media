import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ReportCard } from "@/components/reports/ReportCard";
import { listReports, REPORTS_HOME } from "@/lib/reports";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Every dispatch from Deep State Media — published live from our Substack the moment it goes out.",
};

// Re-pull the feed every 10 minutes so new posts appear without a redeploy.
export const revalidate = 600;

export default async function ReportsPage() {
  const reports = await listReports();

  return (
    <div className="bg-[#06070d] text-paper">
      {/* ── Masthead ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-white/10 pb-16 pt-40 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.5),transparent_66%)] blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          <p className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            Live from Substack
          </p>
          <h1 className="display-stencil text-[clamp(2.8rem,8vw,7rem)] leading-[0.98]">
            Reports<span className="accent-signal">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-paper/65">
            Every investigation, dispatch, and document drop — published straight
            from the Deep State Media Substack the moment it goes live.
          </p>
          <a
            href={REPORTS_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:border-signal-500/60"
          >
            Follow on Substack
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </section>

      {/* ── Feed ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          {reports.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <li key={report.guid}>
                  <ReportCard report={report} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-signal-400">
                Transmitting
              </p>
              <h2 className="display-stencil text-[clamp(1.6rem,4vw,2.4rem)] leading-tight">
                The first reports are dropping now.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-paper/60">
                Follow the Substack and you&rsquo;ll get every one the moment it
                publishes — they&rsquo;ll appear here too.
              </p>
              <a
                href={REPORTS_HOME}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-signal-500 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
              >
                Follow on Substack
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
