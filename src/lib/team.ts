import { existsSync } from "node:fs";
import path from "node:path";

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
    role: "CEO",
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
    roleSub: "Wall Street → SugarTime · NBA-certified agent · NK humanitarian advocate",
    bio:
      "David Sugarman is a former Wall Street executive turned NBA-certified sports agent, entrepreneur, and private equity strategist whose career has crossed finance, sports, entertainment, media, and political activism. After Vice President and advisory roles at Morgan Stanley, Deutsche Bank, Merrill Lynch, UBS, and Laidlaw, he founded SugarTime Inc. — building it into a nationally recognized brand for athlete representation, celebrity management, investor relations, and strategic business advisory. Operating from Miami with roots in New York finance culture, he has become known for his aggressive dealmaking, high-profile network, and willingness to operate at the crossroads of Wall Street, sports, entertainment, and media influence.\n\nNationally, Sugarman is recognized for his humanitarian advocacy on Americans imprisoned in North Korea — launching the viral #BringBaeBack campaign supporting Kenneth Bae’s 2014 release, then becoming publicly involved in efforts surrounding Otto Warmbier in 2016, meeting with DPRK diplomats and ambassadors while leveraging media pressure tied to prisoner releases and human-rights concerns. His advocacy has been covered by NBC New York, CNN, NPR affiliates, and other national outlets.\n\nHe is also outspoken on civil liberties, parental rights, criminal-justice reform, and Second Amendment protections — including advocacy against parental alienation and government overreach, blending legal activism with media strategy and high-profile public campaigns. Supporters describe him as a visionary connector and relentless strategist; critics call him unapologetically disruptive. At Deep State Media he runs the operational backbone — funding, legal review, and the long-game machinery that keeps the editorial team independent.",
    quote: {
      text: "This stage in my life is about making a difference. It’s not enough anymore for me to just ‘work’ without a greater purpose.",
      cite: "David Sugarman, Xappeal · May 17, 2015",
      source: "https://xappeal.net/the-edge/tough-love-david-sugarman/",
    },
    portrait:
      "https://npr.brightspotcdn.com/dims4/default/bfe27af/2147483647/strip/true/crop/960x1280+0+0/resize/880x1173!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fwvxu%2Ffiles%2F201604%2FSugarman5.jpg",
    beats: [
      "Operations",
      "Funding",
      "NK humanitarian advocacy",
      "Civil liberties",
      "Sports & Power",
    ],
    links: [
      { label: "@SugarmanSpeaks", href: "https://x.com/sugarmanspeaks" },
      { label: "SugarTime Inc.", href: "https://davidsugarman.org/" },
    ],
  },
  {
    slug: "daniel-parnas",
    name: "Daniel Parnas",
    role: "Co-founder · Social & Growth",
    bio:
      "Daniel Parnas is Lev Parnas’s son and a co-founder of Deep State Media. He grew up inside the kind of rooms most reporters only read transcripts of. From a young age he was at his father’s side, sitting in on meetings with oligarchs, sitting members of Congress, donors, defectors, and business operators most of the public will never see in a press release. He has seen every side of it — the people who run things, the people the powerful step on, and the spaces in between most newsrooms never get a look at.\n\nAt Deep State Media he leads social strategy and audience-building, and uses that platform to talk directly to a generation of young men who deserve a better script than the one currently being sold to them online. He’s unapologetically pro-ambition, pro-success, and absolutely uncompromising on the protection of women and children. The newsroom does the reporting; Daniel makes sure people see it.",
    quote: {
      text: "My generation deserves better than what they’re being sold online. That’s the version I’m putting out there.",
      cite: "Daniel Parnas, on the record · 2026",
    },
    portrait: undefined, // TODO: place file at /public/team/daniel-parnas.jpg and set this string
    beats: ["Social strategy", "Audience", "Distribution", "Reels · TikTok · X"],
    links: [{ label: "Email", href: "mailto:daniel@deepstate.media" }],
  },
  {
    slug: "jonathan-hay",
    name: "Jonathan Hay",
    role: "Publicist · Contributing reporter",
    roleSub: "Celebrity publicist · Music producer · Crisis-media strategist · Survivor advocate",
    bio:
      "Jonathan Hay is a renowned celebrity publicist and music producer who has reshaped the entertainment industry with two decades of innovative publicity campaigns — 20+ years on the inside, 1,000+ media placements, 100+ high-profile clients. His work spans iconic names: he wrote Rihanna’s first press release for “Pon de Replay” and orchestrated the publicity stunt that helped vault her to worldwide attention, promoted Whitney Houston’s $100M Arista recording contract and her #1 final album “I Look to You,” and collaborated with multi-platinum post-grunge band Days of the New on “Touch, Peel and Stand,” which topped modern rock charts for 17 weeks and was later named Billboard’s Greatest of All-Time Mainstream Rock Song.\n\nHay is recognized by The New York Times, Fox News, Marie Claire, Rolling Stone, and Billboard as a crisis-media expert. He specializes in elevating celebrities and public figures through strategic media placements, elite brand partnerships, and access to top-tier financial media — and in protecting their reputations when the story turns against them.\n\nIn October 2025 he publicly came forward as the John Doe plaintiff in a sexual-assault lawsuit against Sean “Diddy” Combs — using his name, in his words, “to push for criminal charges” and to give other survivors a voice. He brings that lens — the music industry, abuse of power, the long road to accountability, and the institutions that protect predators — to Deep State Media’s reporting.",
    quote: {
      text: "It’s about pushing for criminal charges. I want all Diddy’s victims to have justice. For me, it was the right thing to do. Having a voice is important.",
      cite: "Jonathan Hay, Shockya exclusive · October 17, 2025",
      source:
        "https://www.shockya.com/news/2025/10/17/exclusive-jonathan-hay-reveals-self-as-john-doe-in-sean-diddy-combs-biggie-lawsuit/",
    },
    portrait: undefined, // TODO: replace with solo headshot URL; available source photos co-frame Hay with Combs which is inappropriate for a team page.
    beats: [
      "Music industry",
      "Celebrity PR",
      "Crisis media",
      "Power & abuse",
      "Survivor advocacy",
    ],
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

const LOCAL_EXTS = ["png", "jpg", "jpeg", "webp", "avif"] as const;

/**
 * If a portrait file exists at /public/team/<slug>.<ext>, return the public
 * URL. Lets you drop a real photo file into the repo and have the team page
 * pick it up without a code edit. Server-side only — Next.js calls this on
 * every render in dev, and at build time in production.
 */
function resolveLocalPortrait(slug: string): string | undefined {
  const root = path.join(process.cwd(), "public", "team");
  for (const ext of LOCAL_EXTS) {
    if (existsSync(path.join(root, `${slug}.${ext}`))) {
      return `/team/${slug}.${ext}`;
    }
  }
  return undefined;
}

/**
 * Returns the team list with each member's `portrait` resolved in priority
 * order: (1) a local file at /public/team/<slug>.<ext>, (2) the URL set on
 * the member, (3) undefined → <Monogram /> placeholder.
 */
export function getTeam(): TeamMember[] {
  return TEAM.map((m) => ({
    ...m,
    portrait: resolveLocalPortrait(m.slug) ?? m.portrait,
  }));
}
