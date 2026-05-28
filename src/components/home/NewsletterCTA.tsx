"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export function NewsletterCTA() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative isolate overflow-hidden border-t border-white/5 bg-ink-950 py-32"
    >
      <motion.div
        aria-hidden
        animate={
          reduce
            ? undefined
            : {
                backgroundPosition: ["0% 0%", "100% 100%"],
              }
        }
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(800px 400px at 20% 20%, rgba(255,45,45,0.15), transparent 60%), radial-gradient(700px 400px at 80% 80%, rgba(245,230,99,0.05), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />
      <Container size="lg" className="relative">
        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="kicker mb-4">The Briefing — weekly intelligence</p>
            <h2
              id="newsletter-heading"
              className="display-stencil text-title text-ink-50"
            >
              What we&rsquo;re
              <br />
              <span className="text-signal-500">working on next.</span>
            </h2>
            <p className="mt-6 max-w-prose text-ink-200">
              Saturdays. Five minutes. The leads we&rsquo;re chasing, the
              documents we just FOIA&rsquo;d, the names we&rsquo;re about to
              name. No ads. No sponsors. No party line.
            </p>
          </div>
          <div>
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
