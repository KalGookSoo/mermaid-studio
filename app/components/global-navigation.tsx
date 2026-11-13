"use client";

import { Bars3Icon, BookOpenIcon, ChevronDownIcon, HomeIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Locale, useLocale } from "../i18n";

const flags: Record<Locale, string> = { ko: "🇰🇷", en: "🇺🇸" };

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, text } = useLocale();

  function selectLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    setIsOpen(false);
  }

  return <div className="relative"><button aria-expanded={isOpen} className="flex h-9 items-center gap-1.5 rounded-md px-2 text-sm text-emerald-50/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setIsOpen((open) => !open)} type="button"><span aria-hidden="true">{flags[locale]}</span><ChevronDownIcon aria-hidden="true" className="size-3.5" /><span className="sr-only">{text.language}</span></button>{isOpen ? <div className="absolute right-0 top-11 z-50 w-40 rounded-lg border border-emerald-100/15 bg-[#102521] p-1.5 shadow-xl shadow-black/35"><button className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${locale === "ko" ? "bg-emerald-300 text-[#081410]" : "text-emerald-50/70 hover:bg-white/10 hover:text-white"}`} onClick={() => selectLocale("ko")} type="button"><span>🇰🇷</span>{text.korean}</button><button className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${locale === "en" ? "bg-emerald-300 text-[#081410]" : "text-emerald-50/70 hover:bg-white/10 hover:text-white"}`} onClick={() => selectLocale("en")} type="button"><span>🇺🇸</span>{text.english}</button></div> : null}</div>;
}

export function GlobalNavigation() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { text } = useLocale();
  const items = [
    { href: "/", label: text.home, Icon: HomeIcon },
    { href: "/editor", label: text.editor, Icon: PencilSquareIcon },
    { href: "/guides", label: text.guides, Icon: BookOpenIcon },
  ];
  const isCurrent = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const nav = (onNavigate?: () => void) => <nav className="grid gap-1 px-3 py-4">{items.map(({ href, label, Icon }) => <Link aria-current={isCurrent(href) ? "page" : undefined} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${isCurrent(href) ? "bg-emerald-300 font-medium text-[#081410]" : "text-emerald-100/65 hover:bg-white/10 hover:text-white"}`} href={href} key={href} onClick={onNavigate}><Icon aria-hidden="true" className="size-5" />{label}</Link>)}</nav>;

  const brand = <Link aria-label="Mermaid Studio" className="flex min-w-0 items-center gap-2.5 text-white" href="/"><img alt="" className="size-8 shrink-0 rounded-lg" src="/icon.svg" /><span className="truncate text-sm font-semibold">Mermaid Studio</span></Link>;

  return <>
    <aside aria-label="Global navigation" className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-emerald-100/10 bg-[#0b1b18] lg:block"><header className="flex h-16 items-center justify-between border-b border-emerald-100/10 px-4">{brand}<LanguageSelector /></header><div className="pt-2">{nav()}</div></aside>
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-emerald-100/10 bg-[#0b1b18]/95 px-4 backdrop-blur lg:hidden"><button aria-expanded={isMobileOpen} className="mr-3 grid size-10 place-items-center rounded-lg text-emerald-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setIsMobileOpen((open) => !open)} type="button"><span className="sr-only">{text.menu}</span>{isMobileOpen ? <XMarkIcon aria-hidden="true" className="size-5" /> : <Bars3Icon aria-hidden="true" className="size-5" />}</button>{brand}<div className="ml-auto"><LanguageSelector /></div></header>
    {isMobileOpen ? <><button aria-label="메뉴 닫기" className="fixed inset-0 z-30 bg-[#081410]/55 lg:hidden" onClick={() => setIsMobileOpen(false)} type="button" /><aside aria-label="Global navigation" className="fixed inset-y-16 left-0 z-40 w-72 border-r border-emerald-100/10 bg-[#0b1b18] shadow-2xl shadow-black/35 lg:hidden">{nav(() => setIsMobileOpen(false))}</aside></> : null}
  </>;
}
