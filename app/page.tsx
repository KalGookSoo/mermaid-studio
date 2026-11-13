"use client";

import { useEffect, useRef, useState } from "react";

const starter = `flowchart LR
    idea([Idea]) --> draft[Write Mermaid]
    draft --> preview{Preview}
    preview -->|SVG| share[Share]
    preview -->|PNG| download[Download]`;

type Status = "ready" | "rendering" | "error";

export default function Home() {
  const [source, setSource] = useState(starter);
  const [status, setStatus] = useState<Status>("ready");
  const [message, setMessage] = useState("Ready to render");
  const output = useRef<HTMLDivElement>(null);
  const svgRef = useRef("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setStatus("rendering");
      setMessage("Rendering diagram…");
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "strict", themeVariables: { primaryColor: "#d6f3ec", primaryTextColor: "#102c26", primaryBorderColor: "#167d6b", lineColor: "#397d70", secondaryColor: "#fff5d9", tertiaryColor: "#f7fbf9", fontFamily: "ui-sans-serif, system-ui, sans-serif" } });
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, source);
        svgRef.current = svg;
        if (output.current) output.current.innerHTML = svg;
        setStatus("ready");
        setMessage("Rendered successfully");
      } catch (error) {
        if (output.current) output.current.innerHTML = "";
        setStatus("error");
        setMessage(error instanceof Error ? error.message.replace(/^Parse error.*?\n/, "Parse error: ") : "Could not render this Mermaid code.");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [source]);

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

  return <main>
    <header>
      <a className="brand" href="#top"><span>◇</span> Mermaid Studio</a>
      <p>Diagram playground</p>
    </header>
    <section className="hero" id="top">
      <div><span className="eyebrow">DIAGRAM, FAST</span><h1>Write the logic.<br/><em>See the shape.</em></h1></div>
      <p>Turn Mermaid syntax into clear, shareable diagrams—without leaving your browser.</p>
    </section>
    <section className="workspace" aria-label="Mermaid editor">
      <div className="panel editor-panel">
        <div className="panel-bar"><span className="label">MERMAID INPUT</span><span className="dots">● ● ●</span></div>
        <textarea aria-label="Mermaid source" spellCheck="false" value={source} onChange={(event) => setSource(event.target.value)} />
        <div className="editor-footer"><span className={`status ${status}`}>● {message}</span><button className="ghost" onClick={() => setSource(starter)}>Reset example</button></div>
      </div>
      <div className="panel preview-panel">
        <div className="panel-bar"><span className="label">LIVE PREVIEW</span><span className="format">SVG</span></div>
        <div className="diagram-wrap" ref={output} aria-live="polite" />
        <div className="export-bar"><span>EXPORT AS</span><button onClick={exportSvg} disabled={!svgRef.current}>SVG</button><button className="primary" onClick={exportPng} disabled={!svgRef.current}>PNG</button></div>
      </div>
    </section>
    <footer><span>Built for thinking in systems.</span><span>All rendering happens locally.</span></footer>
  </main>;
}
