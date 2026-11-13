import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "./i18n";
import { PwaRegistration } from "./components/pwa-registration";
import { siteName, siteUrl } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteName} — Mermaid Diagram Editor`,
  description: "Create Mermaid flowcharts, sequence diagrams, and UML diagrams, then export them as SVG or PNG.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteName} — Mermaid Diagram Editor`,
    description: "Create Mermaid diagrams and export them as SVG or PNG.",
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${siteName} — Mermaid Diagram Editor`,
    description: "Create Mermaid diagrams and export them as SVG or PNG.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><LocaleProvider><PwaRegistration />{children}</LocaleProvider></body></html>;
}
