import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDetailContent } from "../../components/guide-detail-content";
import { diagrams, getDiagram } from "../../diagram-catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return diagrams.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const diagram = diagrams.find((item) => item.slug === slug);
  if (!diagram) return {};
  return { title: `${diagram.name} 가이드`, description: diagram.description, alternates: { canonical: `/guides/${diagram.slug}` } };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!diagrams.some((item) => item.slug === slug)) notFound();
  return <GuideDetailContent diagram={getDiagram(slug)} />;
}
