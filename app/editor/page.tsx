"use client";

import { useEffect, useRef, useState } from "react";
import { GlobalNavigation } from "../components/global-navigation";
import { defaultDiagram, getDiagram } from "../diagram-catalog";
import { useLocale } from "../i18n";
import { getLogger } from "../logger";

const starter = defaultDiagram.code;
const STORAGE_KEY = "mermaid-studio:source";
const logger = getLogger("editor");

type Status = "ready" | "rendering" | "error";
type SaveStatus = "idle" | "saving" | "saved" | "cleared";
type ExportFormat = "svg" | "png" | "jpeg";

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [hasLoadedSource, setHasLoadedSource] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportScale, setExportScale] = useState(2);
  const [exportError, setExportError] = useState("");
  const output = useRef<HTMLDivElement>(null);
  const renderTarget = useRef<HTMLDivElement>(null);
  const svgRef = useRef("");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("example");
    const savedSource = window.localStorage.getItem(STORAGE_KEY);
    setSource(slug ? getDiagram(slug).code : savedSource ?? starter);
    setHasLoadedSource(true);
    logger.info("source.loaded", { source: slug ? "example" : savedSource ? "saved" : "starter" });
  }, []);

  useEffect(() => {
    if (!hasLoadedSource) return;
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, source);
      setSaveStatus("saved");
      logger.debug("source.saved", { length: source.length });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [hasLoadedSource, source]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setStatus("rendering");
      setMessage(text.rendering);
      logger.debug("render.started", { length: source.length });
      try {
        const target = renderTarget.current;
        if (!target) return;
        target.replaceChildren();
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "strict", flowchart: { htmlLabels: false }, themeVariables: { background: "#f7fbf9", primaryColor: "#d6f3ec", primaryTextColor: "#102c26", primaryBorderColor: "#167d6b", lineColor: "#397d70", secondaryColor: "#fff5d9", tertiaryColor: "#eff7f3", textColor: "#16352d", fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: "13px" } });
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
        logger.info("render.succeeded", { svgLength: svg.length, usesForeignObject: svg.includes("<foreignObject") });
      } catch (error) {
        renderTarget.current?.replaceChildren();
        svgRef.current = "";
        if (output.current) output.current.innerHTML = "";
        setStatus("error");
        setMessage(getErrorMessage(error, text.parsedError, text.checkSyntax));
        logger.error("render.failed", error);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [source, text]);

  function saveBlob(blob: Blob, name: string) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  function getSvgDimensions(svg: string) {
    const document = new DOMParser().parseFromString(svg, "image/svg+xml");
    const root = document.documentElement;
    const viewBox = root.getAttribute("viewBox")?.trim().split(/\s+/).map(Number);
    const width = viewBox?.[2] || Number.parseFloat(root.getAttribute("width") || "") || 1200;
    const height = viewBox?.[3] || Number.parseFloat(root.getAttribute("height") || "") || 800;
    return { width, height };
  }

  async function exportDiagram() {
    if (!svgRef.current) return;
    setExportError("");
    if (exportFormat === "svg") {
      saveBlob(new Blob([svgRef.current], { type: "image/svg+xml;charset=utf-8" }), "mermaid-diagram.svg");
      logger.info("export.succeeded", { format: exportFormat, scale: 1 });
      setIsExportOpen(false);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const { width, height } = getSvgDimensions(svgRef.current);
      canvas.width = Math.ceil(width * exportScale);
      canvas.height = Math.ceil(height * exportScale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 2D context is unavailable.");
      if (exportFormat === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      const { Canvg } = await import("canvg");
      const renderer = await Canvg.fromString(context, svgRef.current, { ignoreAnimation: true, ignoreDimensions: true });
      await renderer.render();
      const mimeType = exportFormat === "jpeg" ? "image/jpeg" : "image/png";
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.92));
      if (!blob) throw new Error("Image export did not produce a file.");
      saveBlob(blob, `mermaid-diagram.${exportFormat}`);
      logger.info("export.succeeded", { format: exportFormat, scale: exportScale, width: canvas.width, height: canvas.height });
      setIsExportOpen(false);
    } catch (error) {
      logger.error("export.failed", { format: exportFormat, scale: exportScale, error });
      setExportError(text.exportFailed);
    }
  }

  function clearSavedSource() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSaveStatus("cleared");
    logger.info("source.cleared");
  }

  const statusColor = status === "error" ? "text-rose-300" : status === "rendering" ? "text-amber-300" : "text-emerald-300";
  const saveMessage = saveStatus === "saving" ? text.saving : saveStatus === "saved" ? text.saved : saveStatus === "cleared" ? text.clearedSaved : "";

  return <main data-app-layout className="relative min-h-screen overflow-hidden bg-[#081410] px-5 py-5 font-sans text-[#edf8f4] selection:bg-emerald-300 selection:text-[#081410] sm:px-8 lg:px-12">
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
          <div className="flex min-h-14 items-center justify-between gap-4 border-t border-emerald-200/10 px-5"><div><span className={`font-mono text-[11px] ${statusColor}`}>● {status === "error" ? text.previewError : message}</span>{saveMessage ? <p aria-live="polite" className="mt-1 font-mono text-[9px] tracking-[0.08em] text-emerald-100/40">{saveMessage}</p> : null}</div><div className="flex items-center gap-1"><button className="rounded-lg px-2 py-1 text-xs text-emerald-50/65 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={clearSavedSource}>{text.clearSaved}</button><button className="rounded-lg px-2 py-1 text-xs text-emerald-50/65 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setSource(starter)}>{text.restoreExample}</button></div></div>
        </div>

        <div className="flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#eff7f3] shadow-2xl shadow-black/20">
          <div className="flex h-12 items-center justify-between border-b border-[#d3e5de] px-5"><span className="font-mono text-[10px] tracking-[0.18em] text-[#47665e]">{text.previewLabel}</span><span className="rounded border border-[#b8d1c8] px-2 py-0.5 font-mono text-[10px] text-[#47665e]">SVG</span></div>
          <div className="relative flex min-h-72 flex-1 items-center justify-center overflow-auto bg-[radial-gradient(#c9ddd5_1px,transparent_1px)] bg-[size:18px_18px] p-8" aria-live="polite">
            {status === "error" ? <div className="max-w-sm rounded-2xl border border-rose-300/70 bg-[#fff5f5] p-7 text-center shadow-xl shadow-rose-950/10"><span className="mx-auto grid size-11 place-items-center rounded-full bg-rose-100 font-mono text-xl text-rose-700">!</span><p className="mt-4 font-mono text-xs font-medium tracking-[0.14em] text-rose-700">{text.syntaxError}</p><h2 className="mt-2 text-lg font-semibold text-[#4c161a]">{text.unavailable}</h2><p className="mt-2 text-sm leading-6 text-[#7f363b]">{message}</p><p className="mt-5 border-t border-rose-200 pt-4 font-mono text-[11px] text-[#9c5155]">{text.fixInput}</p></div> : null}
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 size-px overflow-hidden opacity-0" ref={renderTarget} />
            <div className={`${status === "error" ? "hidden" : "flex"} w-full items-center justify-center [&_svg]:h-auto [&_svg]:max-w-full`} ref={output} />
          </div>
          <div className="flex min-h-16 items-center gap-2 border-t border-[#d3e5de] px-5"><span className="mr-auto font-mono text-[10px] tracking-[0.14em] text-[#47665e]">{text.exportAs}</span><button className="rounded-lg bg-[#16352d] px-4 py-2 font-mono text-[11px] text-white shadow-sm transition hover:bg-[#245a4b] disabled:cursor-not-allowed disabled:opacity-35" onClick={() => { setExportError(""); setIsExportOpen(true); }} disabled={status === "error" || !svgRef.current}>{text.exportAction} ↓</button></div>
        </div>
      </section>

      {isExportOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#081410]/70 p-5" role="dialog" aria-modal="true" aria-labelledby="export-title"><div className="w-full max-w-md rounded-2xl border border-emerald-100/15 bg-[#102521] p-6 shadow-2xl shadow-black/40"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[0.16em] text-emerald-300">{text.exportAs}</p><h2 className="mt-2 text-xl font-semibold text-white" id="export-title">{text.exportDiagram}</h2></div><button aria-label={text.close} className="rounded-lg px-2 py-1 text-lg text-emerald-100/60 transition hover:bg-white/10 hover:text-white" onClick={() => setIsExportOpen(false)} type="button">×</button></div><fieldset className="mt-7"><legend className="font-mono text-[10px] tracking-[0.14em] text-emerald-200/70">{text.exportFormat}</legend><div className="mt-3 grid gap-2">{([{ value: "svg", label: "SVG", description: text.svgDescription }, { value: "png", label: "PNG", description: text.pngDescription }, { value: "jpeg", label: "JPEG", description: text.jpegDescription }] as const).map((option) => <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${exportFormat === option.value ? "border-emerald-300 bg-emerald-300/10" : "border-emerald-100/10 hover:border-emerald-100/30"}`} key={option.value}><span><span className="font-mono text-sm text-white">{option.label}</span><span className="ml-3 text-xs text-emerald-50/55">{option.description}</span></span><input checked={exportFormat === option.value} className="accent-emerald-300" name="format" onChange={() => setExportFormat(option.value)} type="radio" /></label>)}</div></fieldset>{exportFormat !== "svg" ? <fieldset className="mt-6"><legend className="font-mono text-[10px] tracking-[0.14em] text-emerald-200/70">{text.exportResolution}</legend><div className="mt-3 grid grid-cols-3 gap-2">{[1, 2, 3].map((scale) => <button className={`rounded-lg border px-3 py-2.5 font-mono text-xs transition ${exportScale === scale ? "border-emerald-300 bg-emerald-300 text-[#081410]" : "border-emerald-100/15 text-emerald-50/70 hover:bg-white/10"}`} key={scale} onClick={() => setExportScale(scale)} type="button">{scale}×</button>)}</div></fieldset> : null}{exportError ? <p className="mt-5 rounded-lg border border-rose-300/30 bg-rose-950/25 px-3 py-2 text-sm leading-6 text-rose-100">{exportError}</p> : null}<button className="mt-8 w-full rounded-lg bg-emerald-300 px-4 py-3 font-mono text-xs font-medium tracking-[0.12em] text-[#081410] transition hover:bg-emerald-200" onClick={exportDiagram} type="button">{text.exportAction}</button></div></div> : null}

      <footer className="flex flex-col gap-2 pt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-100/35 sm:flex-row sm:justify-between"><span>{text.footerLeft}</span><span>{text.footerRight}</span></footer>
    </div>
  </main>;
}
