import Link from "next/link";
import { diagrams } from "../diagram-catalog";

export const metadata = {
  title: "Mermaid Diagram Guides",
  description: "Korean Mermaid diagram guides with tested examples for flowcharts, sequence diagrams, ERD, Gantt charts, and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return <main className="min-h-screen bg-[#081410] px-5 py-6 font-sans text-[#edf8f4] sm:px-8 lg:px-12">
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center justify-between border-b border-white/10 pb-5"><Link className="flex items-center gap-2 text-sm font-medium text-white" href="/"><span className="grid size-7 place-items-center rounded-lg bg-emerald-300 text-base text-[#081410]">◇</span> Mermaid Studio</Link><Link className="font-mono text-[11px] tracking-[0.12em] text-emerald-200/70 transition hover:text-emerald-200" href="/">OPEN EDITOR ↗</Link></header>
      <section className="max-w-3xl py-16 sm:py-20"><p className="font-mono text-[11px] tracking-[0.2em] text-emerald-300">MERMAID GUIDES</p><h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.04em] text-white sm:text-7xl">문법을 읽고,<br /><em className="text-emerald-300">바로 그리세요.</em></h1><p className="mt-6 max-w-xl leading-7 text-emerald-50/65">13가지 핵심 Mermaid 다이어그램을 용도별 예시와 함께 제공합니다. 가이드에서 코드를 복사하거나 편집기로 바로 열어보세요.</p></section>
      <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">{diagrams.map((diagram) => <Link className="group rounded-2xl border border-emerald-100/10 bg-[#0d2420] p-6 transition hover:-translate-y-1 hover:border-emerald-300/45 hover:bg-[#12342d]" href={`/guides/${diagram.slug}`} key={diagram.slug}><p className="font-mono text-[10px] tracking-[0.16em] text-emerald-300">{diagram.shortName.toUpperCase()}</p><h2 className="mt-3 text-xl font-semibold text-white">{diagram.name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-emerald-50/60">{diagram.description}</p><span className="mt-6 inline-block font-mono text-[10px] tracking-[0.14em] text-emerald-200">GUIDE →</span></Link>)}</section>
    </div>
  </main>;
}
