export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  portrait: string; // placeholder until real assets ship
  beats?: string[];
  links?: { label: string; href: string }[];
};

export const TEAM: TeamMember[] = [
  {
    slug: "daniel-parnas",
    name: "Daniel Parnas",
    role: "Co-founder",
    bio: "Daniel co-founded Deep State Media to build a newsroom that doesn’t flinch when the story walks into its own party. He oversees editorial direction, sourcing standards, and the long-running Campaign Desk series. Replace this paragraph with the official bio.",
    portrait:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    beats: ["Money", "Intelligence", "Campaign Desk"],
    links: [
      { label: "Email", href: "mailto:daniel@deepstate.media" },
      { label: "Signal", href: "#" },
    ],
  },
  {
    slug: "david-sugarman",
    name: "David Sugarman",
    role: "Co-founder · Operations",
    bio: "David runs the business and operational backbone of Deep State Media — the reader-funding model, the legal review pipeline, and the day-to-day machinery that lets the editorial team move fast. Replace this paragraph with the official bio.",
    portrait:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80",
    beats: ["Operations", "Funding", "Legal"],
    links: [{ label: "Email", href: "mailto:david@deepstate.media" }],
  },
  {
    slug: "lev-parnas",
    name: "Lev Parnas",
    role: "Central figure · Columnist",
    bio: "Lev is the central figure of Deep State Media’s Campaign Desk and the author of the Lev Remembers column. Author, public speaker, political activist, truth teller — he is, on the record, every step of his 2026 congressional run for Florida’s 27th district. Replace this paragraph with the official bio.",
    portrait:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    beats: ["Campaign Desk", "Lev Remembers (Substack)"],
    links: [
      { label: "Substack", href: "https://levremembers.substack.com" },
      { label: "Press", href: "/contact" },
    ],
  },
  {
    slug: "jonathan-hay",
    name: "Jonathan Hay",
    role: "Contributing reporter",
    bio: "Jonathan files long-form investigations on money in politics, foreign influence, and the consultant class. His reporting focuses on the people one rung behind the names you already know. Replace this paragraph with the official bio.",
    portrait:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80",
    beats: ["Money", "Foreign Influence", "Vendor patterns"],
    links: [{ label: "Email", href: "mailto:jonathan@deepstate.media" }],
  },
];
