"use client";

import Link from "next/link";
import { DiagramDefinition, getDiagramText } from "../diagram-catalog";
import { useLocale } from "../i18n";
import { CopyCodeButton } from "./copy-code-button";
import { GlobalNavigation } from "./global-navigation";

export function GuideDetailContent({ diagram }: { diagram: DiagramDefinition }) {
  const { locale, text } = useLocale();
  const guide = getDiagramText(diagram, locale);
  return <main data-app-layout className="min-h-screen bg-[#081410] px-5 py-6 font-sans text-[#edf8f4] sm:px-8 lg:px-12"><div className="mx-auto max-w-5xl"><GlobalNavigation />
    <article className="py-14 sm:py-20"><p className="font-mono text-[11px] tracking-[0.2em] text-emerald-300">{diagram.shortName.toUpperCase()}</p><h1 className="mt-4 font-display text-5xl tracking-[-0.04em] text-white sm:text-7xl">{guide.name}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/65">{guide.description}</p><p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-100/45">{guide.useCase}</p>
      <div className="mt-10 flex flex-wrap gap-3"><Link className="rounded-lg bg-emerald-300 px-4 py-2.5 font-mono text-[11px] font-medium tracking-[0.1em] text-[#081410] transition hover:bg-emerald-200" href={`/editor?example=${diagram.slug}`}>{text.openInEditor}</Link><a className="rounded-lg border border-emerald-100/20 px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] text-emerald-100 transition hover:bg-white/10" href={diagram.docsUrl} target="_blank" rel="noreferrer">{text.officialDocs}</a></div>
      <section className="mt-14 rounded-2xl border border-emerald-100/10 bg-[#0d2420]"><div className="flex items-center justify-between border-b border-emerald-100/10 px-5 py-4"><span className="font-mono text-[10px] tracking-[0.18em] text-emerald-200/70">{text.completeExample}</span><CopyCodeButton code={diagram.code} /></div><pre className="overflow-x-auto p-6 font-mono text-sm leading-7 text-emerald-50"><code>{diagram.code}</code></pre></section>
      <section className="mt-12 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/4 p-6"><h2 className="font-mono text-[11px] tracking-[0.16em] text-emerald-300">{text.syntaxEssentials}</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-emerald-50/70">{guide.syntax.map((item) => <li className="flex gap-3" key={item}><span className="text-emerald-300">•</span>{item}</li>)}</ul></div><div className="rounded-2xl border border-white/10 bg-white/4 p-6"><h2 className="font-mono text-[11px] tracking-[0.16em] text-emerald-300">{text.guideNotes}</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-emerald-50/70">{guide.tips.map((item) => <li className="flex gap-3" key={item}><span className="text-emerald-300">•</span>{item}</li>)}</ul></div></section>
      {diagram.flowDirections ? <section className="mt-12"><h2 className="font-display text-3xl text-white">{text.changeDirection}</h2><p className="mt-2 text-sm leading-6 text-emerald-50/60">{text.directionDescription}</p><div className="mt-6 grid gap-4 md:grid-cols-2">{diagram.flowDirections.map((direction, index) => <div className="rounded-2xl border border-emerald-100/10 bg-[#0d2420] p-5" key={direction.label}><div className="flex items-center justify-between"><div><p className="font-mono text-sm text-emerald-300">{direction.label}</p><p className="mt-1 text-xs text-emerald-50/55">{guide.flowDirectionDescriptions?.[index] ?? direction.description}</p></div><CopyCodeButton code={direction.code} /></div><pre className="mt-5 overflow-x-auto border-t border-emerald-100/10 pt-4 font-mono text-xs leading-6 text-emerald-50"><code>{direction.code}</code></pre></div>)}</div></section> : null}
    </article>
  </div></main>;
}
