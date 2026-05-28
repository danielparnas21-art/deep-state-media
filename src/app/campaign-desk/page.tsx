import type { Metadata } from "next";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { DistrictOutline } from "@/components/campaign/DistrictOutline";
import { Countdown } from "@/components/campaign/Countdown";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { MagneticButton } from "@/components/motion/MagneticButton";

export const metadata: Metadata = {
  title: "The Campaign Desk",
  description:
    "Inside Lev Parnas's 2026 congressional run for Florida's 27th district. A serial Deep State Media investigation, filed in real time.",
};

export default function CampaignDeskPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/5 pb-20 pt-40">
        {/* Backdrop grid + horizon glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 100% 60% at 50% 40%, black 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(120%_60%_at_50%_100%,rgba(255,45,45,0.12),transparent_70%)]"
        />

        <Container className="relative">
          <p className="kicker mb-6 flex items-center gap-3">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-400" />
            </span>
            Standing dispatch — filing soon
          </p>

          <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h1 className="display-stencil text-hero text-ink-50">
                The
                <br />
                Campaign
                <br />
                <span className="text-signal-500">Desk.</span>
              </h1>
              <p className="mt-10 max-w-xl text-deck text-ink-200">
                A serial inside-the-room report on{" "}
                <strong className="text-ink-50">Lev Parnas&rsquo;s</strong>{" "}
                2026 congressional run for Florida&rsquo;s 27th district —
                filed in real time, from the bus, the war room, the donor
                dinners, and the door knocks. <strong className="text-ink-50">Bold framing. Sourced facts.</strong>
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <MagneticButton
                  as="a"
                  href="#first-dispatch"
                  className="group inline-flex items-center gap-3 rounded-full bg-signal-500 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-black transition-transform hover:translate-x-0.5"
                >
                  Be first on the briefing
                  <ArrowRight size={14} />
                </MagneticButton>
                <a
                  href="https://levremembers.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-100 hover:border-signal-500/60 hover:text-signal-300"
                >
                  Read Lev directly
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <RevealOnScroll>
              <DistrictOutline className="aspect-[5/4] w-full" />
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* Manifesto strip */}
      <section className="relative border-b border-white/5 bg-ink-950 py-32">
        <Container size="lg">
          <p className="kicker mb-8">The Charter — Campaign Desk</p>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="display-stencil text-title text-ink-50">
                We&rsquo;re not
                <br />
                covering Lev.
                <br />
                <span className="text-signal-500">We&rsquo;re with him.</span>
              </h2>
              <p className="mt-8 max-w-prose text-ink-200">
                Deep State Media is publishing the inside view of an actual
                congressional run — the strategy meetings, the polling, the
                opposition research, the moments the rest of the press is
                locked out of. Lev Parnas is our central figure and our
                principal subject. He is, on the record, every step of the way.
              </p>
              <p className="mt-6 max-w-prose text-ink-300">
                We will publish the parts most newsrooms cut: the donor calls,
                the consultant pitches, the polling crosstabs we paid for, the
                door-knock tallies, the moments Lev was wrong and corrected
                course. You will know what we know. You will see the receipts.
              </p>
            </div>

            <ul className="grid gap-4 self-center">
              {[
                { n: "01", t: "On-the-record access", d: "Every interview is recorded. Every claim sourced." },
                { n: "02", t: "Crosstabs published", d: "Our internal polling drops with the methodology attached." },
                { n: "03", t: "Receipts inline", d: "FEC filings, donor lists, and vendor invoices linked from the prose." },
                { n: "04", t: "Wins AND losses", d: "We don't bury the bad nights. The losing weeks get filed too." },
              ].map((p) => (
                <li
                  key={p.n}
                  className="group relative overflow-hidden rounded-md border border-white/10 bg-ink-900/40 p-5 hover:border-signal-500/40"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-400">
                    {p.n}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink-50">
                    {p.t}
                  </h3>
                  <p className="mt-1 text-sm text-ink-300">{p.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Countdown to Election Day */}
      <section className="relative isolate overflow-hidden border-b border-white/5 bg-ink-900 py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-10 select-none font-display text-[clamp(12rem,20vw,26rem)] font-bold leading-none tracking-tightest text-white/[0.025]"
        >
          27
        </div>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="kicker mb-4">Time on the clock</p>
              <h2 className="display-stencil text-title text-ink-50">
                Election
                <br />
                Day —
                <br />
                <span className="text-signal-500">Nov 3, 2026.</span>
              </h2>
              <p className="mt-6 max-w-md text-ink-300">
                We&rsquo;ll publish from now through the closing of the polls.
                Every dispatch is dated, sourced, and signed.
              </p>
            </div>
            <Countdown />
          </div>
        </Container>
      </section>

      {/* First dispatch CTA */}
      <section
        id="first-dispatch"
        className="relative isolate overflow-hidden border-b border-white/5 bg-ink-950 py-32"
      >
        <Container size="lg">
          <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="kicker mb-4">First dispatch — coming</p>
              <h2 className="display-stencil text-title text-ink-50">
                Get the first
                <br />
                <span className="text-signal-500">cable home.</span>
              </h2>
              <p className="mt-6 max-w-prose text-ink-200">
                The first Campaign Desk dispatch lands in subscriber inboxes
                before it lands on this site. Sign up once. Read it first.
              </p>
            </div>
            <div>
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
