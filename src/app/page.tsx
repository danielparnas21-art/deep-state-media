import { MovementHero } from "@/components/home/MovementHero";
import { Fronts } from "@/components/home/Fronts";
import { PodcastStrip } from "@/components/home/PodcastStrip";
import { LatestDispatches } from "@/components/home/LatestDispatches";
import { JoinMovement } from "@/components/home/JoinMovement";
import { ComingSoon } from "@/components/home/ComingSoon";
import { LAUNCHED } from "@/lib/launch";
import { listWritings } from "@/lib/writings";

export const revalidate = 600;

export default async function HomePage() {
  // V1: the gate opens onto the coming-soon teaser. The full movement homepage
  // below is preserved and returns the moment LAUNCHED flips true.
  if (!LAUNCHED) return <ComingSoon />;

  const writings = await listWritings();
  return (
    <>
      <MovementHero />
      <Fronts />
      <PodcastStrip />
      <LatestDispatches items={writings.slice(0, 3)} />
      <JoinMovement />
    </>
  );
}
