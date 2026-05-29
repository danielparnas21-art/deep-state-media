"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export function NewsletterCTA() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative isolate overflow-hidden border-t border-ink-900/10 bg-paper py-28"
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
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(800px 400px at 18% 15%, rgba(28,60,107,0.07), transparent 60%), radial-gradient(700px 400px at 85% 90%, rgba(200,57,42,0.05), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />
      <Container size="lg" className="relative">
        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="kicker mb-4">The Briefing — weekly intelligence</p>
            <h2
              id="newsletter-heading"
              className="display-stencil text-title text-ink-900"
            >
              What we&rsquo;re
              <br />
              <span className="italic text-navy-600">working on next.</span>
            </h2>
            <p className="mt-6 max-w-prose text-ink-600">
              Saturdays. Five minutes. The leads we&rsquo;re chasing, the
              documents we just FOIA&rsquo;d, the names we&rsquo;re about to
              name. No spam. No spin.
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
