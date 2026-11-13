"use client";

import Link from "next/link";
import { diagrams, getDiagramText } from "../diagram-catalog";
import { useLocale } from "../i18n";
import { GlobalNavigation } from "./global-navigation";

export function GuideListContent() {
  const { locale, text } = useLocale();
  return <main className="min-h-screen bg-[#081410] px-5 py-6 font-sans text-[#edf8f4] sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><GlobalNavigation />
    <section className="max-w-3xl py-16 sm:py-20"><p className="font-mono text-[11px] tracking-[0.2em] text-emerald-300">{text.guidesEyebrow}</p><h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.04em] text-white sm:text-7xl">{text.guidesTitle}<br /><em className="text-emerald-300">{text.guidesEmphasis}</em></h1><p className="mt-6 max-w-xl leading-7 text-emerald-50/65">{text.guidesDescription}</p></section>
    <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">{diagrams.map((diagram) => { const guide = getDiagramText(diagram, locale); return <Link className="group rounded-2xl border border-emerald-100/10 bg-[#0d2420] p-6 transition hover:-translate-y-1 hover:border-emerald-300/45 hover:bg-[#12342d]" href={`/guides/${diagram.slug}`} key={diagram.slug}><p className="font-mono text-[10px] tracking-[0.16em] text-emerald-300">{diagram.shortName.toUpperCase()}</p><h2 className="mt-3 text-xl font-semibold text-white">{guide.name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-emerald-50/60">{guide.description}</p><span className="mt-6 inline-block font-mono text-[10px] tracking-[0.14em] text-emerald-200">{text.guide}</span></Link>; })}</section>
  </div></main>;
}
