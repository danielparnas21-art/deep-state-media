import { Hero } from "@/components/home/Hero";
import { Mission } from "@/components/home/Mission";
import { LatestInvestigations } from "@/components/home/LatestInvestigations";
import { PodcastStrip } from "@/components/home/PodcastStrip";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { listInvestigations } from "@/lib/investigations";

export default async function HomePage() {
  const investigations = await listInvestigations();
  return (
    <>
      <Hero />
      <Mission />
      <LatestInvestigations items={investigations.slice(0, 3)} />
      <PodcastStrip />
      <NewsletterCTA />
    </>
  );
}
