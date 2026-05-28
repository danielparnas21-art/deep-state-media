import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ArticleHero } from "@/components/investigation/ArticleHero";
import {
  PullQuote,
  Cite,
  Chapter,
  DataMoment,
  Aside,
  SourcesPanel,
} from "@/components/investigation/ArticleParts";
import { ReadingProgress } from "@/components/investigation/ReadingProgress";
import {
  getInvestigation,
  listInvestigations,
} from "@/lib/investigations";

export async function generateStaticParams() {
  const items = await listInvestigations();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getInvestigation(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.deck,
    openGraph: {
      title: item.title,
      description: item.deck,
      type: "article",
      images: [item.cover],
    },
  };
}

const mdxComponents = {
  PullQuote,
  Cite,
  Chapter,
  DataMoment,
  Aside,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="display-stencil mt-16 mb-6 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight text-ink-50" />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="mt-12 mb-4 font-display text-2xl font-bold tracking-tight text-ink-50" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="mb-6 text-[1.075rem] leading-[1.75] text-ink-100" />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-semibold text-ink-50" />
  ),
  a: ({ href = "#", ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      {...rest}
      className="text-ink-50 underline decoration-signal-500 decoration-2 underline-offset-4 transition-colors hover:text-signal-300"
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="my-6 ml-6 list-disc space-y-2 text-ink-100 marker:text-signal-500" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="my-6 ml-6 list-decimal space-y-2 text-ink-100 marker:text-signal-400" />
  ),
  hr: () => <hr className="my-12 border-t border-white/10" />,
};

export default async function InvestigationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const item = await getInvestigation(slug);
  if (!item) notFound();

  return (
    <article>
      <ReadingProgress />
      <ArticleHero meta={item} />

      <Container size="md" className="py-24">
        <p className="kicker mb-6">Lede</p>
        <div className="prose-editorial">
          <MDXRemote source={item.content} components={mdxComponents as never} />
        </div>

        <SourcesPanel sources={item.sources} />

        <div className="mt-20 border-t border-white/10 pt-10">
          <Link
            href="/investigations"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-200 hover:text-signal-300"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-signal-500">
              <ArrowLeft size={14} />
            </span>
            Back to the dossier
          </Link>
        </div>
      </Container>
    </article>
  );
}
