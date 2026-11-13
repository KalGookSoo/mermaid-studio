"use client";

import { useEffect, useRef, useState } from "react";
import { GlobalNavigation } from "../components/global-navigation";
import { defaultDiagram, getDiagram } from "../diagram-catalog";
import { useLocale } from "../i18n";

const starter = defaultDiagram.code;

type Status = "ready" | "rendering" | "error";

function getErrorMessage(error: unknown, parsedError: string, checkSyntax: string) {
  if (error instanceof Error && error.message.includes("Syntax error in text")) {
    return parsedError;
  }

  return checkSyntax;
}

export default function Home() {
  const { text } = useLocale();
  const [source, setSource] = useState(starter);
  const [status, setStatus] = useState<Status>("ready");
  const [message, setMessage] = useState<string>(text.ready);
  const output = useRef<HTMLDivElement>(null);
  const renderTarget = useRef<HTMLDivElement>(null);
  const svgRef = useRef("");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("example");
    setSource(getDiagram(slug).code);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setStatus("rendering");
      setMessage(text.rendering);
      try {
        const target = renderTarget.current;
        if (!target) return;
        target.replaceChildren();
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "strict", themeVariables: { primaryColor: "#d6f3ec", primaryTextColor: "#102c26", primaryBorderColor: "#167d6b", lineColor: "#397d70", secondaryColor: "#fff5d9", tertiaryColor: "#f7fbf9", fontFamily: "ui-sans-serif, system-ui, sans-serif" } });
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, source, target);
        target.replaceChildren();
        if (svg.includes("Syntax error in text")) {
          throw new Error("Syntax error in text");
        }
        svgRef.current = svg;
        if (output.current) output.current.innerHTML = svg;
        setStatus("ready");
        setMessage(text.rendered);
      } catch (error) {
        renderTarget.current?.replaceChildren();
        svgRef.current = "";
        if (output.current) output.current.innerHTML = "";
        setStatus("error");
        setMessage(getErrorMessage(error, text.parsedError, text.checkSyntax));
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [source, text]);

  function saveBlob(blob: Blob, name: string) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function exportSvg() {
    if (!svgRef.current) return;
    saveBlob(new Blob([svgRef.current], { type: "image/svg+xml;charset=utf-8" }), "mermaid-diagram.svg");
  }

  function exportPng() {
    if (!svgRef.current) return;
    const svg = new Blob([svgRef.current], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => blob && saveBlob(blob, "mermaid-diagram.png"), "image/png");
      }
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  const statusColor = status === "error" ? "text-rose-300" : status === "rendering" ? "text-amber-300" : "text-emerald-300";

  return <main className="relative min-h-screen overflow-hidden bg-[#081410] px-5 py-5 font-sans text-[#edf8f4] selection:bg-emerald-300 selection:text-[#081410] sm:px-8 lg:px-12">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(49,164,133,0.18),transparent_24rem),radial-gradient(circle_at_95%_100%,rgba(255,184,77,0.09),transparent_30rem)]" />
    <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col">
      <GlobalNavigation />

      <section className="flex flex-col justify-between gap-7 py-12 sm:py-16 lg:flex-row lg:items-end lg:py-20" id="top">
        <div>
          <span className="font-mono text-[10px] font-medium tracking-[0.22em] text-emerald-300">{text.editorEyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl lg:text-8xl">{text.editorTitle}<br /><em className="font-normal text-emerald-300">{text.editorEmphasis}</em></h1>
        </div>
        <p className="max-w-xs text-sm leading-6 text-emerald-50/60 sm:text-base">{text.editorDescription}</p>
      </section>

      <section className="grid flex-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]" aria-label="Mermaid editor">
        <div className="flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-emerald-200/10 bg-[#0d2420] shadow-2xl shadow-black/20">
          <div className="flex h-12 items-center justify-between border-b border-emerald-200/10 px-5"><span className="font-mono text-[10px] tracking-[0.18em] text-emerald-100/60">{text.input}</span><span className="font-mono text-[9px] tracking-[0.2em] text-emerald-300/70">● ● ●</span></div>
          <textarea className="min-h-72 flex-1 resize-none bg-transparent p-6 font-mono text-sm leading-7 text-emerald-50 outline-none placeholder:text-emerald-100/30" aria-label="Mermaid source" spellCheck="false" value={source} onChange={(event) => setSource(event.target.value)} />
          <div className="flex min-h-14 items-center justify-between gap-4 border-t border-emerald-200/10 px-5"><span className={`font-mono text-[11px] ${statusColor}`}>● {status === "error" ? text.previewError : message}</span><button className="rounded-lg px-2 py-1 text-xs text-emerald-50/65 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setSource(starter)}>{text.restoreExample}</button></div>
        </div>

        <div className="flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#eff7f3] shadow-2xl shadow-black/20">
          <div className="flex h-12 items-center justify-between border-b border-[#d3e5de] px-5"><span className="font-mono text-[10px] tracking-[0.18em] text-[#47665e]">{text.previewLabel}</span><span className="rounded border border-[#b8d1c8] px-2 py-0.5 font-mono text-[10px] text-[#47665e]">SVG</span></div>
          <div className="relative flex min-h-72 flex-1 items-center justify-center overflow-auto bg-[radial-gradient(#c9ddd5_1px,transparent_1px)] bg-[size:18px_18px] p-8" aria-live="polite">
            {status === "error" ? <div className="max-w-sm rounded-2xl border border-rose-300/70 bg-[#fff5f5] p-7 text-center shadow-xl shadow-rose-950/10"><span className="mx-auto grid size-11 place-items-center rounded-full bg-rose-100 font-mono text-xl text-rose-700">!</span><p className="mt-4 font-mono text-xs font-medium tracking-[0.14em] text-rose-700">{text.syntaxError}</p><h2 className="mt-2 text-lg font-semibold text-[#4c161a]">{text.unavailable}</h2><p className="mt-2 text-sm leading-6 text-[#7f363b]">{message}</p><p className="mt-5 border-t border-rose-200 pt-4 font-mono text-[11px] text-[#9c5155]">{text.fixInput}</p></div> : null}
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 size-px overflow-hidden opacity-0" ref={renderTarget} />
            <div className={`${status === "error" ? "hidden" : "flex"} w-full items-center justify-center [&_svg]:h-auto [&_svg]:max-w-full`} ref={output} />
          </div>
          <div className="flex min-h-16 items-center gap-2 border-t border-[#d3e5de] px-5"><span className="mr-auto font-mono text-[10px] tracking-[0.14em] text-[#47665e]">{text.exportAs}</span><button className="rounded-lg border border-[#24473d] px-3 py-2 font-mono text-[11px] text-[#16352d] transition hover:bg-[#d9eee6] disabled:cursor-not-allowed disabled:opacity-35" onClick={exportSvg} disabled={status === "error" || !svgRef.current}>SVG</button><button className="rounded-lg bg-[#16352d] px-3 py-2 font-mono text-[11px] text-white shadow-sm transition hover:bg-[#245a4b] disabled:cursor-not-allowed disabled:opacity-35" onClick={exportPng} disabled={status === "error" || !svgRef.current}>PNG ↓</button></div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 pt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-100/35 sm:flex-row sm:justify-between"><span>{text.footerLeft}</span><span>{text.footerRight}</span></footer>
    </div>
  </main>;
}
