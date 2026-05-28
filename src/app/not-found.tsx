import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section
      aria-label="Page not found"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-paper-100"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(120%_60%_at_50%_100%,rgba(28,60,107,0.06),transparent_70%)]"
      />
      <Container className="relative">
        <p className="kicker mb-6">Status — 404</p>
        <h1 className="display-stencil text-hero leading-[0.9] text-ink-900">
          We can&rsquo;t
          <br />
          <span className="italic text-navy-600">find that page.</span>
        </h1>
        <p className="mt-8 max-w-xl text-deck text-ink-600">
          The URL you reached isn&rsquo;t in our files — yet. The story may
          have moved, or it may never have existed at this address.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-signal-600"
          >
            Back to the masthead <ArrowRight size={14} />
          </Link>
          <Link
            href="/writings"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-700 transition-colors hover:border-navy-600 hover:text-navy-600"
          >
            Read the column
          </Link>
        </div>
      </Container>
    </section>
  );
}
