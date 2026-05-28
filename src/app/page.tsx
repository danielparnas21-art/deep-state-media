import { Hero } from "@/components/home/Hero";
import { Mission } from "@/components/home/Mission";
import { LatestWritings } from "@/components/home/LatestWritings";
import { PodcastStrip } from "@/components/home/PodcastStrip";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { listWritings } from "@/lib/writings";

export const revalidate = 600;

export default async function HomePage() {
  const writings = await listWritings();
  return (
    <>
      <Hero />
      <Mission />
      <LatestWritings items={writings.slice(0, 3)} />
      <PodcastStrip />
      <NewsletterCTA />
    </>
  );
}
