import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type InvestigationCategory =
  | "intelligence"
  | "money"
  | "campaign-desk"
  | "judiciary"
  | "foreign-influence"
  | "tech-power";

export type InvestigationFrontmatter = {
  title: string;
  deck: string;
  slug: string;
  category: InvestigationCategory;
  categoryLabel: string;
  publishedAt: string; // ISO date
  readingTimeMin: number;
  authors: string[];
  cover: string;
  coverCredit?: string;
  /** EDITORIAL GUARDRAIL: every published investigation MUST carry sources. */
  sources: Source[];
  featured?: boolean;
  kicker?: string;
};

export type Source = {
  id: string;            // e.g. "1"
  label: string;         // outlet / document / interview
  citation: string;      // exact quote / doc title / case number
  url?: string;          // optional link
  date?: string;         // ISO date
};

export type InvestigationMeta = InvestigationFrontmatter;

export type Investigation = InvestigationMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "investigations");

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

function assertSources(slug: string, sources: unknown): asserts sources is Source[] {
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error(
      `[editorial-guardrail] Investigation "${slug}" is missing required \`sources\` ` +
        `frontmatter. Every published investigation must cite at least one source.`,
    );
  }
  for (const s of sources as Source[]) {
    if (!s.id || !s.label || !s.citation) {
      throw new Error(
        `[editorial-guardrail] Investigation "${slug}" has a malformed source ` +
          `(missing id/label/citation): ${JSON.stringify(s)}`,
      );
    }
  }
}

export async function listInvestigations(): Promise<InvestigationMeta[]> {
  const files = (await readDirSafe(CONTENT_DIR)).filter((f) => f.endsWith(".mdx"));
  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      assertSources(slug, data.sources);
      return { ...(data as InvestigationFrontmatter), slug };
    }),
  );
  return items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getInvestigation(slug: string): Promise<Investigation | null> {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);
    assertSources(slug, data.sources);
    return { ...(data as InvestigationFrontmatter), slug, content };
  } catch {
    return null;
  }
}
