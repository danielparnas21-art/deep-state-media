import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Deep State Media — tips, press, partnerships. Drop a note and we'll read it.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#06070d] text-paper">
      {/* ── Masthead ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-white/10 pb-20 pt-40 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,60,107,0.5),transparent_66%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(120,150,199,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,199,0.7) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 sm:px-8 lg:px-12">
          <p className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-500" />
            Get in touch
          </p>
          <h1 className="display-stencil text-[clamp(2.8rem,8vw,7rem)] leading-[0.98]">
            Say <span className="accent-signal">something.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-paper/65">
            Tips, press, partnerships, or just a message — we read everything
            that comes through. No phone trees, no runaround. Drop a note and the
            right person sees it.
          </p>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[680px] px-6 sm:px-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
