import { ArrowUpRight } from "lucide-react";
import type { Report } from "@/lib/reports";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * A single Substack post, dark/editorial styling to match the V1 surface.
 * Links out to the full post on Substack (opens in a new tab).
 */
export function ReportCard({ report }: { report: Report }) {
  return (
    <a
      href={report.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] transition-colors hover:border-signal-500/45 hover:bg-white/[0.05]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
        {report.cover ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            style={{ backgroundImage: `url("${report.cover}")` }}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(28,60,107,0.5),transparent_70%)]"
          >
            <span className="display-stencil text-[2.4rem] leading-none text-navy-200/40">
              DSM
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
          <span>{formatDate(report.publishedAt)}</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-paper/25" />
          <span>{report.readingTimeMin} min read</span>
        </div>
        <h3 className="font-serif text-[1.4rem] leading-snug text-paper transition-colors group-hover:text-white">
          {report.title}
        </h3>
        {report.description && (
          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-paper/60">
            {report.description}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-signal-400">
          Read on Substack
          <ArrowUpRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </a>
  );
}
