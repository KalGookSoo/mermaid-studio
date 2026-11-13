import type { Metadata } from "next";
import { LandingContent } from "./components/landing-content";

export const metadata: Metadata = { title: "Mermaid Diagram Editor & Guides", description: "Write Mermaid diagrams, preview them in real time, export SVG or PNG, and explore Korean syntax guides.", alternates: { canonical: "/" } };

export default function LandingPage() {
  return <LandingContent />;
}
