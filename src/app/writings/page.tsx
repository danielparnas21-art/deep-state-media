import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WritingsIndex } from "@/components/writings/WritingsIndex";
import {
  listWritings,
  SUBSTACK_AUTHOR,
  SUBSTACK_HOME,
  SUBSTACK_TITLE,
} from "@/lib/writings";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Writings — Lev Remembers",
  description:
    "Original column by Lev Parnas — author, public speaker, political activist, truth teller. Published on Substack, surfaced here.",
};

export default async function WritingsPage() {
  const items = await listWritings();
  return (
    <>
      <section className="relative border-b border-white/5 pb-20 pt-40">
        <Container>
          <p className="kicker mb-6 flex items-center gap-3">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-400" />
            </span>
            The Column — Lev Remembers
          </p>
          <h1 className="display-stencil text-title text-ink-50">
            Notes from
            <br />
            <span className="text-signal-500">{SUBSTACK_AUTHOR}.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-200">
            Author, public speaker, political activist, truth teller. Lev’s
            personal column — published live on{" "}
            <a
              href={SUBSTACK_HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal-300 underline underline-offset-4 hover:text-signal-200"
            >
              {SUBSTACK_TITLE}
            </a>
            , surfaced here as part of the Deep State Media masthead. Click any
            piece to read the full dispatch on Substack.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={SUBSTACK_HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-black transition-transform hover:translate-x-0.5"
            >
              Subscribe on Substack
              <ExternalLink size={14} />
            </a>
            <a
              href={`${SUBSTACK_HOME}/feed`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100 transition-colors hover:border-signal-500/60 hover:text-signal-300"
            >
              RSS
            </a>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {items.length > 0 ? (
            <WritingsIndex items={items} />
          ) : (
            <div className="rounded-md border border-dashed border-white/15 p-16 text-center">
              <p className="kicker mb-4">Feed currently unavailable</p>
              <p className="max-w-prose text-ink-200">
                We couldn&rsquo;t reach the Substack feed just now. Read the
                column directly at{" "}
                <a
                  href={SUBSTACK_HOME}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal-300 underline underline-offset-4"
                >
                  {SUBSTACK_TITLE}
                </a>
                .
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
