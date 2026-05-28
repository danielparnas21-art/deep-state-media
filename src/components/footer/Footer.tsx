import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { Marquee } from "@/components/motion/Marquee";
import { NewsletterForm } from "@/components/home/NewsletterForm";

const SECTIONS = [
  {
    label: "Newsroom",
    links: [
      { href: "/writings", label: "Writings" },
      { href: "/campaign-desk", label: "Campaign Desk" },
      { href: "/podcast", label: "Podcast" },
    ],
  },
  {
    label: "Org",
    links: [
      { href: "/about", label: "About" },
      { href: "/team", label: "Team" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Signal",
    links: [
      { href: "/tip", label: "Send a Tip" },
      { href: "/ethics", label: "Editorial Ethics" },
      { href: "/corrections", label: "Corrections" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-ink-950 text-ink-100">
      <Marquee speed={48} className="border-b border-white/5 py-6">
        <MarqueeStrip />
      </Marquee>

      <Container className="grid gap-16 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Wordmark variant="stack" className="text-[clamp(2.5rem,4vw,4rem)] text-ink-50" />
          <p className="mt-6 max-w-md text-pretty text-ink-300">
            Independent investigative journalism on the people who actually run
            things. Bold framing. Sourced facts. No team jersey.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            Signal &gt; Noise. Evidence &gt; Allegiance.
          </p>

          <div className="mt-10 max-w-md">
            <p className="kicker mb-3">Briefing — weekly</p>
            <NewsletterForm />
          </div>
        </div>

        {SECTIONS.map((s) => (
          <div key={s.label}>
            <p className="kicker mb-5">{s.label}</p>
            <ul className="space-y-3">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-lg text-ink-100 transition-colors hover:text-signal-300"
                  >
                    <span className="h-px w-3 bg-white/30 transition-all duration-500 ease-out group-hover:w-8 group-hover:bg-signal-500" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/5">
        <Container className="flex flex-col items-start justify-between gap-4 py-6 text-xs text-ink-400 md:flex-row md:items-center">
          <p>
            © {year} Deep State Media, Inc. — Reader-supported. No corporate
            ownership. No party affiliation.
          </p>
          <p className="font-mono uppercase tracking-[0.22em]">
            Built independent. Built in public.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function MarqueeStrip() {
  const items = [
    "Follow the money",
    "Name the lobbyist",
    "Open the docket",
    "Cite the source",
    "Both sides. No team.",
    "Evidence over allegiance",
  ];
  return (
    <div className="flex shrink-0 items-center gap-12">
      {items.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-6 font-display text-2xl font-bold uppercase tracking-tightest text-ink-100"
        >
          {t}
          <span aria-hidden className="inline-block h-2 w-2 rotate-45 bg-signal-500" />
        </span>
      ))}
    </div>
  );
}
