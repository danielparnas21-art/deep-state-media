import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section
      aria-label="Page not found"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(120%_60%_at_50%_100%,rgba(255,45,45,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <Container className="relative">
        <p className="kicker mb-6">Status — 404 · Redacted</p>
        <h1 className="display-stencil text-hero leading-[0.85] text-ink-50">
          We can&rsquo;t
          <br />
          <span className="text-signal-500">find that file.</span>
        </h1>
        <p className="mt-8 max-w-xl text-deck text-ink-200">
          The URL you reached isn&rsquo;t in the dossier — yet. The story may
          have moved. It may have been classified. It may never have existed.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-black hover:translate-x-0.5"
          >
            Back to the masthead <ArrowRight size={14} />
          </Link>
          <Link
            href="/writings"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100 hover:border-signal-500/60 hover:text-signal-300"
          >
            Read the column
          </Link>
        </div>
      </Container>
    </section>
  );
}
