"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "ko" | "en";

const copy = {
  ko: {
    home: "홈", editor: "에디터", guides: "가이드", menu: "메뉴 열기", guideTopics: "가이드 주제", language: "언어", korean: "한국어", english: "English",
    landingEyebrow: "MERMAID, MADE PRACTICAL", landingTitle: "Diagram ideas.", landingEmphasis: "Made visible.", landingDescription: "Mermaid 문법을 입력하면 브라우저에서 바로 다이어그램으로 확인하고 SVG·PNG로 내보낼 수 있습니다. 필요한 문법은 한국어 가이드와 검증된 예제로 바로 찾아보세요.", openEditor: "EDITOR 열기 ↗", exploreGuides: "GUIDES 둘러보기 →", workflow: "WORKFLOW", write: "Write", writeDescription: "Mermaid 문법을 입력합니다.", preview: "Preview", previewDescription: "렌더링 결과를 실시간으로 확인합니다.", export: "Export", exportDescription: "SVG 또는 PNG로 바로 내보냅니다.", create: "CREATE", learn: "LEARN", private: "PRIVATE", liveEditor: "Live editor", liveEditorDescription: "작성, 미리 보기, 내보내기를 한 화면에서 처리합니다.", guideCount: "13 diagram guides", guideCountDescription: "플로우차트부터 XY 차트까지 예시와 문법을 제공합니다.", browserOnly: "In your browser", browserOnlyDescription: "입력한 다이어그램은 브라우저 안에서 렌더링됩니다.",
    guidesEyebrow: "MERMAID GUIDES", guidesTitle: "문법을 읽고,", guidesEmphasis: "바로 그리세요.", guidesDescription: "13가지 핵심 Mermaid 다이어그램을 용도별 예시와 함께 제공합니다. 가이드에서 코드를 복사하거나 편집기로 바로 열어보세요.", guide: "GUIDE →", openInEditor: "EDITOR에서 열기 ↗", officialDocs: "공식 문서 ↗", completeExample: "완성 예시", syntaxEssentials: "문법 핵심", guideNotes: "사용 팁", changeDirection: "방향 바꾸기", directionDescription: "flowchart 선언 뒤의 방향 키워드 하나로 전체 노드의 정렬 방향을 바꿉니다.", copy: "복사", copied: "복사됨",
    editorEyebrow: "DIAGRAM, FAST", editorTitle: "Write the logic.", editorEmphasis: "See the shape.", editorDescription: "Mermaid 문법을 시각적 흐름으로 바꾸고, 필요한 형식으로 바로 내보내세요.", input: "MERMAID INPUT", previewLabel: "LIVE PREVIEW", exportAs: "EXPORT AS", restoreExample: "예시 복원", ready: "렌더링 준비", rendering: "렌더링 중…", rendered: "렌더링 완료", previewError: "미리 보기 오류", syntaxError: "문법 오류", unavailable: "다이어그램을 미리 볼 수 없습니다", fixInput: "입력을 수정하면 미리 보기가 복원됩니다.", checkSyntax: "입력 패널의 Mermaid 문법을 확인한 뒤 다시 시도하세요.", parsedError: "Mermaid 문법을 해석할 수 없습니다.", footerLeft: "Built for thinking in systems.", footerRight: "Rendered in your browser.",
  },
  en: {
    home: "HOME", editor: "EDITOR", guides: "GUIDES", menu: "Open menu", guideTopics: "GUIDE TOPICS", language: "LANGUAGE", korean: "한국어", english: "English",
    landingEyebrow: "MERMAID, MADE PRACTICAL", landingTitle: "Diagram ideas.", landingEmphasis: "Made visible.", landingDescription: "Write Mermaid syntax, preview diagrams in your browser, and export them as SVG or PNG. Find tested examples and guidance whenever you need them.", openEditor: "OPEN EDITOR ↗", exploreGuides: "EXPLORE GUIDES →", workflow: "WORKFLOW", write: "Write", writeDescription: "Enter Mermaid syntax.", preview: "Preview", previewDescription: "See the rendered result instantly.", export: "Export", exportDescription: "Export directly as SVG or PNG.", create: "CREATE", learn: "LEARN", private: "PRIVATE", liveEditor: "Live editor", liveEditorDescription: "Write, preview, and export in one place.", guideCount: "13 diagram guides", guideCountDescription: "Explore examples and syntax from flowcharts to XY charts.", browserOnly: "In your browser", browserOnlyDescription: "Your diagrams are rendered in the browser.",
    guidesEyebrow: "MERMAID GUIDES", guidesTitle: "Read the syntax.", guidesEmphasis: "Draw with confidence.", guidesDescription: "Explore 13 core Mermaid diagram types with practical examples. Copy the code or open it directly in the editor.", guide: "GUIDE →", openInEditor: "OPEN IN EDITOR ↗", officialDocs: "OFFICIAL DOCS ↗", completeExample: "COMPLETE EXAMPLE", syntaxEssentials: "SYNTAX ESSENTIALS", guideNotes: "GUIDE NOTES", changeDirection: "Change direction", directionDescription: "Change the keyword after the flowchart declaration to switch the alignment of every node.", copy: "COPY", copied: "COPIED",
    editorEyebrow: "DIAGRAM, FAST", editorTitle: "Write the logic.", editorEmphasis: "See the shape.", editorDescription: "Turn Mermaid syntax into visual flows and export them in the format you need.", input: "MERMAID INPUT", previewLabel: "LIVE PREVIEW", exportAs: "EXPORT AS", restoreExample: "Restore example", ready: "Ready to render", rendering: "Rendering diagram…", rendered: "Rendered successfully", previewError: "Preview error", syntaxError: "SYNTAX ERROR", unavailable: "Diagram preview unavailable", fixInput: "Fix the input to restore the preview.", checkSyntax: "Check the Mermaid syntax in the input panel and try again.", parsedError: "Mermaid syntax could not be parsed.", footerLeft: "Built for thinking in systems.", footerRight: "Rendered in your browser.",
  },
} as const;

type CopyText = { [Key in keyof typeof copy.ko]: string };
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; text: CopyText };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("mermaid-studio-locale");
    if (savedLocale === "en" || savedLocale === "ko") {
      document.documentElement.lang = savedLocale;
      setLocale(savedLocale);
    }
  }, []);

  function changeLocale(nextLocale: Locale) {
    window.localStorage.setItem("mermaid-studio-locale", nextLocale);
    document.documentElement.lang = nextLocale;
    setLocale(nextLocale);
  }

  return <LocaleContext.Provider value={{ locale, setLocale: changeLocale, text: copy[locale] }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
