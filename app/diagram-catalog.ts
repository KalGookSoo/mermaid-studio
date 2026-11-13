export type FlowDirection = {
  label: string;
  description: string;
  code: string;
};

export type DiagramDefinition = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  useCase: string;
  syntax: string[];
  tips: string[];
  code: string;
  docsUrl: string;
  flowDirections?: FlowDirection[];
};

export type DiagramText = Pick<DiagramDefinition, "name" | "description" | "useCase" | "syntax" | "tips"> & { flowDirectionDescriptions?: string[] };

export const diagrams: DiagramDefinition[] = [
  {
    slug: "flowchart", name: "플로우차트", shortName: "Flowchart", description: "과정, 분기, 시스템 흐름을 노드와 연결선으로 표현합니다.", useCase: "업무 프로세스, 사용자 흐름, 알고리즘의 의사결정을 설명할 때 사용합니다.",
    syntax: ["첫 줄에 flowchart와 방향을 작성합니다.", "A[사각형], B{마름모}, C(둥근 노드)처럼 모양을 정합니다.", "-->|라벨|로 분기 조건을 연결합니다."], tips: ["방향은 TB, TD, BT, LR, RL 중 하나를 사용합니다.", "노드 이름으로 end를 쓸 때는 대괄호나 따옴표로 감싸세요."],
    code: `flowchart LR
  idea([Idea]) --> editor[Write Mermaid]
  editor --> validate{Syntax valid?}
  validate -->|No| revise[Show error and revise]
  revise --> editor
  validate -->|Yes| preview[Render preview]
  preview --> choice{Export format}
  choice -->|Vector| svg[Download SVG]
  choice -->|Raster| png[Choose PNG or JPEG]
  subgraph Browser
    editor
    validate
    preview
  end
  style preview fill:#d6f3ec,stroke:#167d6b,color:#102c26
  style revise fill:#fff5d9,stroke:#d97706,color:#102c26`, docsUrl: "https://mermaid.js.org/syntax/flowchart.html",
    flowDirections: [
      { label: "TB", description: "위에서 아래", code: "flowchart TB\n  Start --> Check{Ready?}\n  Check -->|Yes| Ship\n  Check -->|No| Fix" },
      { label: "TD", description: "위에서 아래", code: "flowchart TD\n  Start --> Check{Ready?}\n  Check -->|Yes| Ship\n  Check -->|No| Fix" },
      { label: "BT", description: "아래에서 위", code: "flowchart BT\n  Start --> Check{Ready?}\n  Check -->|Yes| Ship\n  Check -->|No| Fix" },
      { label: "LR", description: "왼쪽에서 오른쪽", code: "flowchart LR\n  Start --> Check{Ready?}\n  Check -->|Yes| Ship\n  Check -->|No| Fix" },
      { label: "RL", description: "오른쪽에서 왼쪽", code: "flowchart RL\n  Start --> Check{Ready?}\n  Check -->|Yes| Ship\n  Check -->|No| Fix" },
    ],
  },
  {
    slug: "sequence", name: "시퀀스 다이어그램", shortName: "Sequence", description: "참여자 사이의 메시지 흐름을 시간 순서대로 보여줍니다.", useCase: "API 호출, 사용자와 시스템의 상호작용, 서비스 간 통신을 문서화할 때 적합합니다.",
    syntax: ["sequenceDiagram으로 시작합니다.", "participant로 참여자 이름을 선언할 수 있습니다.", "->>, -->> 등의 화살표로 요청과 응답을 구분합니다."], tips: ["loop, alt, opt 블록으로 조건과 반복을 표현하세요.", "메시지가 많으면 participant 별칭을 짧게 유지하세요."],
    code: `sequenceDiagram
  autonumber
  actor User
  participant Editor
  participant Renderer
  participant Storage
  User->>Editor: Update Mermaid source
  Editor->>Renderer: Render source
  alt Valid syntax
    Renderer-->>Editor: SVG preview
    Editor->>Storage: Save draft
    Storage-->>Editor: Saved
    Editor-->>User: Show preview
  else Invalid syntax
    Renderer-->>Editor: Parse error
    Editor-->>User: Show error message
  end
  loop Each edit
    User->>Editor: Change source
  end`, docsUrl: "https://mermaid.js.org/syntax/sequenceDiagram.html",
  },
  {
    slug: "class", name: "클래스 다이어그램", shortName: "Class", description: "객체 지향 모델의 클래스, 속성, 메서드, 관계를 표현합니다.", useCase: "도메인 모델과 코드 구조를 설계하거나 공유할 때 사용합니다.",
    syntax: ["classDiagram으로 시작합니다.", "class 이름 { } 안에 속성과 메서드를 정의합니다.", "<|--, *--, o-- 같은 관계 화살표를 사용합니다."], tips: ["관계 라벨은 : 뒤에 작성합니다.", "공개/비공개 표기는 +와 -를 사용하세요."],
    code: `classDiagram
  class DiagramDocument {
    +string source
    +string svg
    +update(source)
    +render()
  }
  class MermaidRenderer {
    +render(source) string
  }
  class ExportService {
    +exportSvg(svg)
    +exportRaster(svg, format, scale)
  }
  class LocalDraftStore {
    +save(source)
    +load() string
    +clear()
  }
  DiagramDocument --> MermaidRenderer : renders with
  DiagramDocument --> ExportService : exports through
  DiagramDocument --> LocalDraftStore : persists to`, docsUrl: "https://mermaid.js.org/syntax/classDiagram.html",
  },
  {
    slug: "state", name: "상태 다이어그램", shortName: "State", description: "하나의 객체나 시스템이 거치는 상태와 전이를 보여줍니다.", useCase: "주문, 결제, 배포, UI 상태처럼 수명 주기를 설명할 때 유용합니다.",
    syntax: ["stateDiagram-v2로 시작합니다.", "[*]는 시작 또는 종료 상태를 나타냅니다.", "전이 뒤에 :로 이벤트 라벨을 붙입니다."], tips: ["복잡한 상태는 state 블록 안에 중첩하세요.", "전이 이름은 실제 이벤트나 조건으로 작성하세요."],
    code: `stateDiagram-v2
  [*] --> Editing
  Editing --> Rendering : input changed
  Rendering --> PreviewReady : valid source
  Rendering --> SyntaxError : invalid source
  SyntaxError --> Editing : fix source
  PreviewReady --> Editing : continue editing
  PreviewReady --> Exporting : choose format
  Exporting --> PreviewReady : export complete
  state Exporting {
    [*] --> PreparingSvg
    PreparingSvg --> Rasterizing : PNG or JPEG
    PreparingSvg --> Downloading : SVG
    Rasterizing --> Downloading
    Downloading --> [*]
  }`, docsUrl: "https://mermaid.js.org/syntax/stateDiagram.html",
  },
  {
    slug: "er", name: "ER 다이어그램", shortName: "ERD", description: "데이터베이스 엔터티의 속성과 관계를 모델링합니다.", useCase: "데이터베이스 스키마와 도메인 데이터 관계를 설계할 때 사용합니다.",
    syntax: ["erDiagram으로 시작합니다.", "ENTITY ||--o{ ENTITY : 관계 형식으로 카디널리티를 작성합니다.", "속성은 엔터티 블록 안에 타입과 이름을 함께 적습니다."], tips: ["PK, FK 같은 키 제약을 속성 뒤에 표기하세요.", "관계 이름은 동사로 간결하게 작성하세요."],
    code: `erDiagram
  USER ||--o{ DIAGRAM : creates
  DIAGRAM ||--o{ EXPORT_JOB : generates
  USER {
    string id PK
    string locale
    datetime created_at
  }
  DIAGRAM {
    string id PK
    string source
    string render_status
    datetime updated_at
  }
  EXPORT_JOB {
    string id PK
    string format
    int scale
    datetime exported_at
  }`, docsUrl: "https://mermaid.js.org/syntax/entityRelationshipDiagram.html",
  },
  {
    slug: "gantt", name: "간트 차트", shortName: "Gantt", description: "일정, 기간, 의존성을 시간 축 위에 표현합니다.", useCase: "프로젝트 계획, 출시 일정, 마일스톤 관리를 보여줄 때 적합합니다.",
    syntax: ["gantt와 title로 시작합니다.", "dateFormat을 지정한 뒤 section으로 작업을 묶습니다.", "작업에는 상태, 시작일, 기간을 작성합니다."], tips: ["crit는 핵심 경로, milestone은 이정표를 표시합니다.", "작업 ID로 다른 작업의 시작 시점을 연결할 수 있습니다."],
    code: `gantt
  title Mermaid Studio roadmap
  dateFormat YYYY-MM-DD
  axisFormat %b %d
  section Build
  Editor UI       :done, 2026-01-01, 3d
  Diagram guides  :done, 2026-01-04, 5d
  Export formats  :active, 2026-01-09, 4d
  section Release
  Accessibility QA :crit, 2026-01-13, 2d
  Launch          :milestone, 2026-01-15, 0d`, docsUrl: "https://mermaid.js.org/syntax/gantt.html",
  },
  {
    slug: "pie", name: "파이 차트", shortName: "Pie", description: "전체 대비 항목별 비율을 간단히 비교합니다.", useCase: "분포, 투표, 카테고리 점유율을 빠르게 공유할 때 사용합니다.",
    syntax: ["pie와 title로 시작합니다.", "라벨 : 값 형식으로 항목을 작성합니다.", "앞부분 YAML config에서 도넛, 범례 위치, 색상과 테두리를 설정합니다."], tips: ["항목은 5~7개 이하로 유지하세요.", "시간에 따른 변화에는 선 차트나 XY 차트를 사용하세요."],
    code: `---
config:
  pie:
    donutHole: 0.5
    legendPosition: bottom
    textPosition: 0.58
    highlightSlice: hover
  themeVariables:
    pie1: "#0f766e"
    pie2: "#14b8a6"
    pie3: "#f59e0b"
    pieOpacity: 1
    pieStrokeColor: "#eff7f9"
    pieStrokeWidth: "3px"
    pieTitleTextSize: "18px"
    pieSectionTextSize: "12px"
    pieLegendTextSize: "12px"
    pieTitleTextColor: "#16352d"
    pieLegendTextColor: "#16352d"
    pieSectionTextColor: "#ffffff"
---
pie showData
  title "Export format share"
  "SVG · Vector" : 62
  "PNG · Image" : 28
  "JPEG · Image" : 10`, docsUrl: "https://mermaid.js.org/syntax/pie.html",
  },
  {
    slug: "git-graph", name: "Git 그래프", shortName: "Git Graph", description: "브랜치와 커밋 병합 흐름을 시각화합니다.", useCase: "Git 전략, 릴리스 브랜치, 병합 정책을 설명할 때 적합합니다.",
    syntax: ["gitGraph로 시작합니다.", "commit id:로 커밋을 추가합니다.", "branch와 checkout으로 브랜치를 이동합니다."], tips: ["커밋 ID는 짧은 의미 단위로 작성하세요.", "merge 대상 브랜치를 명시해 병합 의도를 드러내세요."],
    code: `gitGraph
  commit id: "initial editor"
  branch guides
  checkout guides
  commit id: "add samples"
  commit id: "document syntax"
  checkout main
  branch export
  checkout export
  commit id: "add PNG"
  commit id: "add JPEG"
  checkout main
  commit id: "review"
  merge guides id: "merge guides"
  merge export id: "merge export"
  commit id: "release v1"`, docsUrl: "https://mermaid.js.org/syntax/gitgraph.html",
  },
  {
    slug: "mindmap", name: "마인드맵", shortName: "Mindmap", description: "중심 주제에서 하위 아이디어를 계층적으로 확장합니다.", useCase: "브레인스토밍, 문서 목차, 제품 기능 탐색에 유용합니다.",
    syntax: ["mindmap으로 시작합니다.", "들여쓰기로 부모와 자식 관계를 만듭니다.", "루트는 root((텍스트)) 형태로 강조할 수 있습니다."], tips: ["깊이를 3~4단계로 제한하세요.", "한 노드에는 하나의 짧은 개념만 넣으세요."],
    code: `mindmap
  root((Mermaid Studio))
    Editor
      Mermaid source
      Live preview
      Syntax fallback
    Export
      SVG
      PNG
      JPEG
      Resolution controls
    Guides
      Diagram samples
      Syntax tips
      Official docs
    Experience
      Local drafts
      Korean and English
      PWA install`, docsUrl: "https://mermaid.js.org/syntax/mindmap.html",
  },
  {
    slug: "timeline", name: "타임라인", shortName: "Timeline", description: "연도나 시점별 사건을 시간 순서대로 나열합니다.", useCase: "프로젝트 연혁, 제품 출시, 조직의 주요 변화를 표현할 때 사용합니다.",
    syntax: ["timeline과 title로 시작합니다.", "시간 값 뒤에 :로 사건을 씁니다.", "같은 시점에는 여러 사건을 줄바꿈으로 추가할 수 있습니다."], tips: ["시간 단위는 한 종류로 통일하세요.", "사건의 문구는 결과 중심으로 짧게 작성하세요."],
    code: `timeline
  title Mermaid Studio milestones
  2026 Q1 : Editor prototype
          : Live Mermaid rendering
          : SVG export
  2026 Q2 : Diagram guides
          : PNG and JPEG export
          : Search indexing
  2026 Q3 : PWA install
          : Offline drafts
          : Accessibility review`, docsUrl: "https://mermaid.js.org/syntax/timeline.html",
  },
  {
    slug: "user-journey", name: "사용자 여정", shortName: "User Journey", description: "사용자가 목표에 도달하는 과정과 경험 점수를 표현합니다.", useCase: "온보딩, 구매, 고객 지원 흐름에서 마찰 지점을 찾을 때 사용합니다.",
    syntax: ["journey와 title로 시작합니다.", "section으로 단계를 나눕니다.", "작업 : 점수 : 담당자 형식으로 기록합니다."], tips: ["점수는 1~5로 일관되게 매기세요.", "낮은 점수 작업을 개선 후보로 검토하세요."],
    code: `journey
  title Create and export a diagram
  section Explore
    Open Mermaid Studio: 5: User
    Browse a diagram guide: 4: User
    Choose a sample: 4: User
  section Create
    Edit Mermaid source: 3: User
    Resolve syntax feedback: 2: User
    Review the live preview: 5: User
  section Export
    Choose PNG resolution: 4: User
    Download the image: 5: User`, docsUrl: "https://mermaid.js.org/syntax/userJourney.html",
  },
  {
    slug: "quadrant", name: "사분면 차트", shortName: "Quadrant", description: "두 기준을 기준으로 항목의 상대 위치를 비교합니다.", useCase: "우선순위, 위험도, 시장 포지셔닝을 2축으로 평가할 때 사용합니다.",
    syntax: ["quadrantChart로 시작합니다.", "x-axis와 y-axis에 축의 양끝을 씁니다.", "항목: [x, y]로 0~1 좌표를 지정합니다."], tips: ["축은 서로 독립적인 판단 기준으로 정하세요.", "항목이 너무 많으면 핵심 후보만 남기세요."],
    code: `quadrantChart
  title Feature prioritization
  x-axis Low effort --> High effort
  y-axis Low impact --> High impact
  quadrant-1 Invest
  quadrant-2 Plan
  quadrant-3 Skip
  quadrant-4 Quick win
  Guides: [0.24, 0.84]
  Export options: [0.48, 0.88]
  PWA install: [0.32, 0.58]
  Theme presets: [0.72, 0.34]
  Cloud sync: [0.86, 0.62]`, docsUrl: "https://mermaid.js.org/syntax/quadrantChart.html",
  },
  {
    slug: "xy-chart", name: "XY 차트", shortName: "XY Chart", description: "범주나 수치 축 위에서 막대·선 데이터의 추이를 비교합니다.", useCase: "월별 사용량, 성과 지표, 두 데이터 시리즈의 변화를 보여줄 때 적합합니다.",
    syntax: ["xychart-beta로 시작합니다.", "x-axis와 y-axis에 제목·카테고리·범위를 지정합니다.", "bar와 line 뒤에 시리즈 이름을 쓰면 범례가 자동으로 생깁니다."], tips: ["앞부분 YAML config에서 크기, 데이터 라벨, 팔레트를 제어하세요.", "모든 데이터 배열의 길이는 x축 항목 수와 맞추세요."],
    code: `---
config:
  xyChart:
    width: 900
    height: 540
    showDataLabel: true
    showDataLabelOutsideBar: true
    showLegend: true
    legendPadding: 16
    titleFontSize: 18
    legendFontSize: 12
    xAxis:
      labelFontSize: 12
      titleFontSize: 13
      labelPadding: 4
    yAxis:
      labelFontSize: 12
      titleFontSize: 13
      labelPadding: 4
  themeVariables:
    xyChart:
      backgroundColor: "#f7fbf9"
      titleColor: "#16352d"
      dataLabelColor: "#16352d"
      legendTextColor: "#16352d"
      xAxisLabelColor: "#16352d"
      xAxisTitleColor: "#16352d"
      xAxisTickColor: "#397d70"
      xAxisLineColor: "#16352d"
      yAxisLabelColor: "#16352d"
      yAxisTitleColor: "#16352d"
      yAxisTickColor: "#397d70"
      yAxisLineColor: "#16352d"
      plotColorPalette: "#0f766e, #f97316"
---
xychart-beta
  title "Monthly export volume"
  x-axis "Month" [Jan, Feb, Mar, Apr, May]
  y-axis "Exports" 0 --> 60
  bar "PNG downloads" [20, 32, 28, 45, 52]
  line "All exports" [18, 25, 31, 40, 56]`, docsUrl: "https://mermaid.js.org/syntax/xyChart.html",
  },
];

export const defaultDiagram = diagrams[0];

export function getDiagram(slug: string | null | undefined) {
  return diagrams.find((diagram) => diagram.slug === slug) ?? defaultDiagram;
}

const englishDiagramText: Record<string, DiagramText> = {
  flowchart: { name: "Flowchart", description: "Visualize processes, decisions, and system flows with nodes and connectors.", useCase: "Use it for business processes, user flows, and algorithm decisions.", syntax: ["Start with flowchart and a direction.", "Choose shapes such as A[rectangle], B{diamond}, or C(round node).", "Use -->|label| to create labeled branches."], tips: ["Use one of TB, TD, BT, LR, or RL for direction.", "Wrap node names such as end in brackets or quotes."], flowDirectionDescriptions: ["Top to bottom", "Top to bottom", "Bottom to top", "Left to right", "Right to left"] },
  sequence: { name: "Sequence Diagram", description: "Show messages between participants in chronological order.", useCase: "Use it to document API calls, system interactions, and service communication.", syntax: ["Start with sequenceDiagram.", "Use participant to declare actors.", "Use arrows such as ->> and -->> for requests and responses."], tips: ["Use loop, alt, and opt blocks for repetition and conditions.", "Keep participant aliases short when there are many messages."] },
  class: { name: "Class Diagram", description: "Model classes, properties, methods, and relationships in an object-oriented system.", useCase: "Use it to design or share a domain model and code structure.", syntax: ["Start with classDiagram.", "Define properties and methods inside class Name { }.", "Use relationship arrows such as <|--, *--, and o--."], tips: ["Add relationship labels after a colon.", "Use + and - for public and private members."] },
  state: { name: "State Diagram", description: "Show the states and transitions of an object or system.", useCase: "Use it for lifecycles such as orders, payments, deployments, and UI state.", syntax: ["Start with stateDiagram-v2.", "[*] represents the initial or final state.", "Add an event label after a colon."], tips: ["Nest complex states in a state block.", "Name transitions after actual events or conditions."] },
  er: { name: "Entity Relationship Diagram", description: "Model database entities, attributes, and relationships.", useCase: "Use it when designing a database schema or domain data model.", syntax: ["Start with erDiagram.", "Write cardinality as ENTITY ||--o{ ENTITY : relationship.", "List a type and name for each entity attribute."], tips: ["Mark key constraints such as PK and FK.", "Use concise verbs for relationship names."] },
  gantt: { name: "Gantt Chart", description: "Visualize schedules, durations, and dependencies on a timeline.", useCase: "Use it for project plans, release schedules, and milestones.", syntax: ["Start with gantt and title.", "Set dateFormat, then group work with section.", "Add status, start date, and duration to each task."], tips: ["Use crit for a critical task and milestone for milestones.", "Reference task IDs to link start dates."] },
  pie: { name: "Pie Chart", description: "Compare category proportions within a whole.", useCase: "Use it to share distributions, votes, and category share at a glance.", syntax: ["Start with pie and title.", "Write entries as label : value.", "Use YAML config to set the donut, legend placement, colors, and strokes."], tips: ["Keep the number of categories to five to seven.", "Use a line or XY chart for change over time."] },
  "git-graph": { name: "Git Graph", description: "Visualize branches, commits, and merges.", useCase: "Use it to explain Git strategy, release branches, and merge policy.", syntax: ["Start with gitGraph.", "Add a commit with commit id:.", "Use branch and checkout to move between branches."], tips: ["Keep commit IDs short and meaningful.", "Name the merge target to make intent clear."] },
  mindmap: { name: "Mindmap", description: "Expand ideas hierarchically from a central topic.", useCase: "Use it for brainstorming, document outlines, and feature exploration.", syntax: ["Start with mindmap.", "Use indentation for parent and child relationships.", "Use root((text)) to emphasize the root."], tips: ["Limit depth to three or four levels.", "Keep one short concept per node."] },
  timeline: { name: "Timeline", description: "List events in chronological order by year or period.", useCase: "Use it for project history, product releases, and key organizational events.", syntax: ["Start with timeline and title.", "Write an event after a colon following the time value.", "Add multiple events at the same time on new lines."], tips: ["Use a single time unit consistently.", "Keep event copy short and outcome-focused."] },
  "user-journey": { name: "User Journey", description: "Show a user path and its experience scores.", useCase: "Use it to find friction in onboarding, purchase, and support flows.", syntax: ["Start with journey and title.", "Divide stages with section.", "Write activities as task : score : actor."], tips: ["Score consistently from one to five.", "Review lower-scoring tasks as improvement candidates."] },
  quadrant: { name: "Quadrant Chart", description: "Compare the relative position of items against two criteria.", useCase: "Use it to evaluate priorities, risk, or market positioning on two axes.", syntax: ["Start with quadrantChart.", "Write both ends of x-axis and y-axis.", "Set positions from 0 to 1 with Item: [x, y]."], tips: ["Choose independent criteria for each axis.", "Keep only the most important items when the list grows."] },
  "xy-chart": { name: "XY Chart", description: "Compare bar and line data across categories or a numeric axis.", useCase: "Use it for monthly usage, performance metrics, and series trends.", syntax: ["Start with xychart-beta.", "Define titles, categories, and ranges for both axes.", "Name bar and line series to show them in a legend."], tips: ["Use YAML config to control dimensions, data labels, and the palette.", "Match every data array to the x-axis item count."] },
};

export function getDiagramText(diagram: DiagramDefinition, locale: "ko" | "en"): DiagramText {
  if (locale === "en") return englishDiagramText[diagram.slug];
  return { name: diagram.name, description: diagram.description, useCase: diagram.useCase, syntax: diagram.syntax, tips: diagram.tips, flowDirectionDescriptions: diagram.flowDirections?.map((direction) => direction.description) };
}
