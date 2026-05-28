import type { Metadata } from "next";
import { Lock, Shield, Eye } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TipForm } from "@/components/tip/TipForm";

export const metadata: Metadata = {
  title: "Send a Tip",
  description:
    "Confidential tip line for whistleblowers and sources. Name optional. Message required. We don't log what we don't need.",
  robots: { index: true, follow: true },
};

const POSTURE = [
  {
    Icon: Lock,
    h: "Encrypted in transit.",
    p: "Form submissions travel over HTTPS. We do not log IP, user-agent, or referrer.",
  },
  {
    Icon: Eye,
    h: "Minimum metadata.",
    p: "We collect only what you choose to send. No telemetry pixels, no third-party trackers on this page.",
  },
  {
    Icon: Shield,
    h: "Editorial discretion.",
    p: "We publish what we can verify. We don't expose sources. Anonymous-by-default is fine — and common.",
  },
];

export default function TipPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink-900/10 bg-paper-100 pb-20 pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] bg-[radial-gradient(120%_60%_at_50%_100%,rgba(200,57,42,0.06),transparent_70%)]"
        />
        <Container className="relative">
          <p className="kicker mb-6 flex items-center gap-3">
            <Lock size={12} className="text-signal-600" />
            Secure tip line · Confidential
          </p>
          <h1 className="display-stencil text-hero text-ink-900">
            Tell us
            <br />
            <span className="italic text-navy-600">what you know.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-600">
            Documents, recordings, screenshots, names, dates. Send us anything
            — anonymously if you need it. The only required field is the
            message itself.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="rounded-md border border-ink-900/10 bg-paper p-8 sm:p-10 shadow-sm">
                <TipForm />
              </div>
            </div>

            <aside aria-label="Our security posture">
              <p className="kicker mb-5">Our posture</p>
              <ul className="space-y-6">
                {POSTURE.map((p) => (
                  <li
                    key={p.h}
                    className="rounded-md border border-ink-900/10 bg-paper-100 p-5"
                  >
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/15 text-navy-600">
                      <p.Icon size={14} />
                    </div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                      {p.h}
                    </h3>
                    <p className="mt-2 text-sm text-ink-500">{p.p}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-md border border-dashed border-ink-900/20 p-5">
                <p className="kicker mb-3">For maximum anonymity</p>
                <p className="text-sm text-ink-500">
                  Submit via Tor at our <code className="rounded bg-ink-900/5 px-1.5 py-0.5 font-mono text-[11px] text-navy-600">.onion</code> mirror
                  (coming with launch). Use ProtonMail or Signal for follow-up
                  conversations. Do not submit from a work device or work
                  network.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
