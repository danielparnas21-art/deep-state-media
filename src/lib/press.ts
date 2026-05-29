export type PressItem = {
  /** Publication / outlet name. */
  outlet: string;
  title: string;
  /** ISO date — "YYYY-MM-DD". */
  date: string;
  /** Canonical link to the article. */
  url: string;
  excerpt?: string;
  /** Pins this item to the large featured slot at the top. */
  featured?: boolean;
};

/**
 * In-the-news coverage. Every entry is a REAL, linked article — never invent
 * coverage. To add a new piece as it publishes, copy a block and put it at the
 * top; set `featured: true` on the one you want pinned to the hero slot.
 *
 *   { outlet: "Outlet", title: "Headline", date: "2026-05-29",
 *     url: "https://…", excerpt: "One sentence." },
 */
export const PRESS: PressItem[] = [
  {
    outlet: "WLRN",
    title:
      "Lev Parnas, a central figure in Trump's first impeachment, launches a Florida congressional run",
    date: "2026-03-05",
    url: "https://www.wlrn.org/government-politics/2026-03-05/lev-parnas-trump-impeachment-florida-congress-candidate-salazar",
    excerpt:
      "Parnas enters the race in Florida's 27th congressional district, campaigning on accountability and transparency.",
    featured: true,
  },
  {
    outlet: "Shockya",
    title:
      "Exclusive: Jonathan Hay reveals himself as John Doe in the Sean “Diddy” Combs lawsuit",
    date: "2025-10-17",
    url: "https://www.shockya.com/news/2025/10/17/exclusive-jonathan-hay-reveals-self-as-john-doe-in-sean-diddy-combs-biggie-lawsuit/",
    excerpt:
      "Deep State Media publicist Jonathan Hay steps forward publicly to push for accountability.",
  },
  {
    outlet: "WVXU · NPR",
    title: "NBA Agent Works To Free Otto Warmbier",
    date: "2016-04-28",
    url: "https://www.wvxu.org/local-news/2016-04-28/nba-agent-works-to-free-otto-warmbier",
    excerpt:
      "Co-founder David Sugarman leverages his network and pressure-campaign playbook — after #BringBaeBack helped free Kenneth Bae — to push for the release of an American detained in North Korea.",
  },
];

/** Newest first, with any `featured` item floated to the very top. */
export function getPress(): PressItem[] {
  return [...PRESS].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (b.featured && !a.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
