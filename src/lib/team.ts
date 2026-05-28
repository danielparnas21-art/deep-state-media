export type TeamLink = { label: string; href: string };

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /**
   * One-line role detail under the main role chip (e.g., "Founder, central figure,
   * 2026 Florida 27 congressional candidate").
   */
  roleSub?: string;
  bio: string;
  /**
   * Optional sourced pull-quote rendered alongside the bio. `cite` = attribution
   * (publication + date). `source` = a stable URL the reader can verify against.
   */
  quote?: { text: string; cite: string; source?: string };
  /**
   * Direct image URL (background-image, no Next/Image remote-pattern config needed).
   * Leave undefined to render a brutalist <Monogram /> placeholder using initials.
   */
  portrait?: string;
  beats?: string[];
  links?: TeamLink[];
};

/**
 * Order is intentional: Lev (central figure) → David (co-founder, ops) →
 * Daniel (co-founder, social) → Jonathan (contributing reporter).
 *
 * Editorial sourcing note: every factual claim here is sourced and linked in
 * the member's `quote.source` or via the page's footer credits. Update with
 * care — these are real people and this is a real published surface.
 */
export const TEAM: TeamMember[] = [
  {
    slug: "lev-parnas",
    name: "Lev Parnas",
    role: "Founder · Central figure",
    roleSub: "2026 Florida 27 congressional candidate · Author, Lev Remembers",
    bio:
      "Lev Parnas was born in Odessa in 1972, emigrated from the Soviet Union with his family in 1976, and spent the next four decades in South Florida business and politics — until 2019, when his back-channel work with Rudy Giuliani to pressure Ukraine became the central thread of Donald Trump’s first impeachment. He was convicted in October 2021 on six federal counts and sentenced to 20 months in 2022. Since then he has been one of the most prolific public witnesses against the political machine he was once inside: he testified before House Oversight in March 2024 that the Biden-Ukraine corruption narrative was “false” and Kremlin-spread, published his memoir Shadow Diplomacy that same month, and writes the long-running Lev Remembers Substack column (84,000+ subscribers, top-15 in World Politics). On March 4, 2026, he announced his run as a Democrat for Florida’s 27th congressional district. He is, on the record, every step of the way.",
    quote: {
      text: "Enough is Enough is my motto, and I’m running to be your voice — to bring accountability and real solutions to Washington so families, seniors, immigrants, and small business owners in our community finally get the leadership they deserve.",
      cite: "Lev Parnas, congressional campaign announcement · March 4, 2026",
      source:
        "https://www.wlrn.org/government-politics/2026-03-05/lev-parnas-trump-impeachment-florida-congress-candidate-salazar",
    },
    portrait:
      "https://substack-post-media.s3.amazonaws.com/public/images/fa4728ad-99a5-4d28-9206-4d8efbced422_400x400.png",
    beats: [
      "Campaign Desk",
      "Lev Remembers (Substack)",
      "Trump-Ukraine",
      "Federal accountability",
    ],
    links: [
      { label: "Lev Remembers", href: "https://levremembers.substack.com" },
      { label: "Campaign — FL-27", href: "/campaign-desk" },
      { label: "Memoir", href: "https://www.amazon.com/Shadow-Diplomacy-Parnas-Brooklyn-Trumps/dp/1990823645" },
    ],
  },
  {
    slug: "david-sugarman",
    name: "David Sugarman",
    role: "Co-founder · Operations",
    roleSub: "Sports agent · Political activist · #BringBaeBack · #WeWantWarmbier",
    bio:
      "David Sugarman is a New York–native, Miami-based sports agent and activist — founder of SugarTime Inc., an NBPA- and FIBA-certified player agent representing NBA and NFL clients including Jae Crowder and Antwon Blake. Before sports, he ran roughly $250M in athlete portfolios as a Merrill Lynch VP. He is best known publicly for his humanitarian work on North Korean–held American detainees: in early 2014 he launched #BringBaeBack to pressure for Kenneth Bae’s release (Bae was freed that November), and in 2016 he launched #WeWantWarmbier for Otto Warmbier, meeting DPRK Ambassador Sin Son-ho in New York that April. At Deep State Media he runs operations, the legal review pipeline, and the reader-funding model that keeps the editorial team independent.",
    quote: {
      text: "For whatever reason God has blessed me with the ability to assist in prisoner releases with other people and I believe it’s my calling and destiny to do it.",
      cite: "David Sugarman, WVXU / NPR · April 28, 2016",
      source:
        "https://www.wvxu.org/local-news/2016-04-28/nba-agent-works-to-free-otto-warmbier",
    },
    portrait:
      "https://npr.brightspotcdn.com/dims4/default/bfe27af/2147483647/strip/true/crop/960x1280+0+0/resize/880x1173!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fwvxu%2Ffiles%2F201604%2FSugarman5.jpg",
    beats: ["Operations", "Funding", "Activism", "Sports & Power"],
    links: [
      { label: "@SugarmanSpeaks", href: "https://x.com/sugarmanspeaks" },
      { label: "SugarTime Inc.", href: "https://davidsugarman.org/" },
    ],
  },
  {
    slug: "daniel-parnas",
    name: "Daniel Parnas",
    role: "Co-founder · Social strategy",
    roleSub: "Audience, distribution, the feed",
    bio:
      "Daniel Parnas is Lev Parnas’s son and a co-founder of Deep State Media. He grew up inside the kind of rooms most reporters only read transcripts of — the Florida political circuits, the congressional fallout of 2019, the cooperation years that followed. He brings that perspective to the company’s social strategy and audience-building work: long-form reporting translated into the formats that move on Reels, TikTok, and X without sanding off the edges that make the stories matter. The newsroom does the reporting; he makes sure people see it.",
    portrait: undefined, // TODO: place file at /public/team/daniel-parnas.jpg and set this string
    beats: ["Social strategy", "Audience", "Distribution", "Reels · TikTok · X"],
    links: [{ label: "Email", href: "mailto:daniel@deepstate.media" }],
  },
  {
    slug: "jonathan-hay",
    name: "Jonathan Hay",
    role: "Contributing reporter",
    roleSub: "Music industry · Abuse of power · Survivor advocacy",
    bio:
      "Jonathan Hay is a Brooklyn-based PR executive, music producer, and survivor advocate — founder of Jonathan Hay Celebrity (formerly Jonathan Hay Publicity), with nearly three decades inside the music industry. He authored Rihanna’s first press release in 2005 (“Pon de Replay”), worked with the MJJ camp, Whitney Houston, Eric B. & Rakim, Eminem’s Shady Records, Snoop Dogg, and others, and produced three consecutive Billboard Jazz #1 albums in 2018–19. In October 2025 he publicly came forward as the John Doe plaintiff in a sexual-assault lawsuit against Sean “Diddy” Combs — using his name, in his words, “to push for criminal charges” and to give other survivors a voice. He brings that lens — the music industry, the long road to accountability, the institutions that protect predators — to Deep State Media’s reporting.",
    quote: {
      text: "It’s about pushing for criminal charges. I want all Diddy’s victims to have justice. For me, it was the right thing to do. Having a voice is important.",
      cite: "Jonathan Hay, Shockya exclusive · October 17, 2025",
      source:
        "https://www.shockya.com/news/2025/10/17/exclusive-jonathan-hay-reveals-self-as-john-doe-in-sean-diddy-combs-biggie-lawsuit/",
    },
    portrait: undefined, // TODO: replace with solo headshot URL; available source photos co-frame Hay with Combs which is inappropriate for a team page.
    beats: ["Music industry", "Power & Abuse", "Survivor advocacy"],
    links: [
      { label: "@jonathanhay", href: "https://x.com/jonathanhay" },
      { label: "Jonathan Hay Celebrity", href: "https://jonathanhaycelebrity.com/about" },
    ],
  },
];

/** Initials for the brutalist <Monogram /> portrait placeholder. */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
