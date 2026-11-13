import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mermaid Diagram Editor",
  description: "Write Mermaid diagrams, preview them in real time, and export SVG or PNG.",
  alternates: { canonical: "/editor" },
};

export default function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
