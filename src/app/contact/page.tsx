import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Lock, Briefcase, Megaphone, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Deep State Media — editorial tips, press, partnerships, corrections.",
};

const CHANNELS = [
  {
    Icon: Lock,
    label: "Tips & whistleblowers",
    head: "Send a tip — anonymously",
    body: "Documents, recordings, screenshots. Name optional. Message required. Encrypted in transit.",
    cta: { label: "Open tip line", href: "/tip" },
  },
  {
    Icon: Mail,
    label: "Editorial",
    head: "editorial@deepstate.media",
    body: "Story pitches, freelance, source verification, corrections.",
    cta: { label: "Email editorial", href: "mailto:editorial@deepstate.media" },
  },
  {
    Icon: Megaphone,
    label: "Press & media",
    head: "press@deepstate.media",
    body: "Interview requests, podcast bookings, public-record requests.",
    cta: { label: "Email press", href: "mailto:press@deepstate.media" },
  },
  {
    Icon: Briefcase,
    label: "Business & partnerships",
    head: "ops@deepstate.media",
    body: "Advertising, partnerships, syndication, hiring.",
    cta: { label: "Email operations", href: "mailto:ops@deepstate.media" },
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative border-b border-ink-900/10 bg-paper-100 pb-20 pt-40">
        <Container>
          <p className="kicker mb-6">The Doorway</p>
          <h1 className="display-stencil text-hero text-ink-900">
            We answer.
            <br />
            <span className="italic text-navy-600">Pick a door.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-600">
            We read everything that comes in. We don&rsquo;t respond to
            everything — but we respond more than most newsrooms do. If you
            need a guaranteed reply, send a tip.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2">
            {CHANNELS.map((c) => {
              const external = c.cta.href.startsWith("mailto:");
              const Anchor = external
                ? ({ children, ...rest }: { children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
                    <a {...rest}>{children}</a>
                  )
                : ({ children, ...rest }: { children: React.ReactNode } & React.ComponentProps<typeof Link>) => (
                    <Link {...rest}>{children}</Link>
                  );
              return (
                <li
                  key={c.label}
                  className="group relative overflow-hidden rounded-md border border-ink-900/10 bg-paper p-8 transition-colors hover:border-navy-600/40 hover:shadow-sm"
                >
                  <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/15 text-navy-600 transition-colors group-hover:border-navy-600/60 group-hover:bg-navy-50">
                    <c.Icon size={16} />
                  </div>
                  <p className="kicker">{c.label}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-900 break-words">
                    {c.head}
                  </h3>
                  <p className="mt-3 text-ink-500">{c.body}</p>
                  <Anchor
                    href={c.cta.href}
                    className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy-600 hover:text-navy-700"
                  >
                    {c.cta.label}
                    <ArrowRight size={14} />
                  </Anchor>
                </li>
              );
            })}
          </ul>

          <div className="mt-16 rounded-md border border-dashed border-ink-900/20 bg-paper-100 p-8">
            <p className="kicker mb-3">Slow lane</p>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              Postal mail
            </h3>
            <p className="mt-3 max-w-prose text-ink-500">
              For court filings, certified documents, and analog tips:
              <br />
              <span className="mt-3 inline-block text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                Deep State Media · PO Box 0001 · Washington, DC 20001
                <br />
                (Replace with the real mailing address before launch.)
              </span>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
