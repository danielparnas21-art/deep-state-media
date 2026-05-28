import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { IndexClient } from "@/components/investigation/IndexClient";
import { listInvestigations } from "@/lib/investigations";

export const metadata: Metadata = {
  title: "Investigations",
  description:
    "The full Deep State Media dossier — investigative reporting on money, intelligence, courts, foreign influence, and tech power.",
};

export default async function InvestigationsIndexPage() {
  const items = await listInvestigations();
  return (
    <>
      <section className="relative border-b border-white/5 pb-20 pt-40">
        <Container>
          <p className="kicker mb-6">The Dossier — Index</p>
          <h1 className="display-stencil text-title text-ink-50">
            Every investigation.
            <br />
            <span className="text-signal-500">Every source.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-deck text-ink-200">
            Filter by beat. Search by name, dollar amount, or docket number.
            Every story carries a public sources panel — open it before you
            argue about it.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <IndexClient items={items} />
        </Container>
      </section>
    </>
  );
}
