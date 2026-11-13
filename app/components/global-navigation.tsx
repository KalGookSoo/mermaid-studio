"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { diagrams } from "../diagram-catalog";
import { getDiagramText } from "../diagram-catalog";
import { useLocale } from "../i18n";

export function GlobalNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, text } = useLocale();
  const navigationItems = [{ href: "/", label: text.home }, { href: "/editor", label: text.editor }, { href: "/guides", label: text.guides }];
  const isCurrent = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-5">
      <Link className="flex shrink-0 items-center gap-2 text-sm font-medium text-white" href="/">
        <span className="grid size-7 place-items-center rounded-lg bg-emerald-300 text-base text-[#081410]">◇</span>
        Mermaid Studio
      </Link>
      <button aria-controls="global-menu" aria-expanded={isOpen} className="grid size-10 place-items-center rounded-lg border border-emerald-100/15 font-mono text-xs text-emerald-100 transition hover:border-emerald-300 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setIsOpen((open) => !open)} type="button">
        <span className="sr-only">{text.menu}</span>
        <span aria-hidden="true" className="space-y-1"><span className="block h-px w-4 bg-current" /><span className="block h-px w-4 bg-current" /><span className="block h-px w-4 bg-current" /></span>
      </button>
      {isOpen ? <div className="absolute right-0 top-[3.7rem] z-30 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-emerald-100/15 bg-[#0d2420] p-3 shadow-2xl shadow-black/40" id="global-menu">
        <nav aria-label="Global navigation" className="grid gap-1 border-b border-emerald-100/10 pb-3 font-mono text-[11px] tracking-[0.12em]">
          {navigationItems.map((item) => <Link aria-current={isCurrent(item.href) ? "page" : undefined} className={`rounded-lg px-3 py-3 transition ${isCurrent(item.href) ? "bg-emerald-300 text-[#081410]" : "text-emerald-100/70 hover:bg-white/10 hover:text-emerald-100"}`} href={item.href} key={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className="border-b border-emerald-100/10 py-4"><p className="px-3 font-mono text-[10px] tracking-[0.16em] text-emerald-300">{text.language}</p><div className="mt-2 flex gap-1 px-2">{(["ko", "en"] as const).map((item) => <button className={`rounded-lg px-3 py-2 text-xs transition ${locale === item ? "bg-emerald-300 text-[#081410]" : "text-emerald-50/65 hover:bg-white/10 hover:text-white"}`} key={item} onClick={() => setLocale(item)} type="button">{item === "ko" ? text.korean : text.english}</button>)}</div></div>
        <div className="pt-4"><p className="px-3 font-mono text-[10px] tracking-[0.16em] text-emerald-300">{text.guideTopics}</p><div className="mt-2 grid grid-cols-2 gap-1">{diagrams.map((diagram) => <Link className="rounded-lg px-3 py-2 text-xs text-emerald-50/65 transition hover:bg-white/10 hover:text-white" href={`/guides/${diagram.slug}`} key={diagram.slug} onClick={() => setIsOpen(false)}>{getDiagramText(diagram, locale).name}</Link>)}</div></div>
      </div> : null}
    </header>
  );
}
