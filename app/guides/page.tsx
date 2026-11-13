import { GuideListContent } from "../components/guide-list-content";

export const metadata = { title: "Mermaid Diagram Guides", description: "Korean Mermaid diagram guides with tested examples for flowcharts, sequence diagrams, ERD, Gantt charts, and more.", alternates: { canonical: "/guides" } };

export default function GuidesPage() {
  return <GuideListContent />;
}
