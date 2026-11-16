# Mermaid Studio

Mermaid 문법을 작성하고 즉시 다이어그램으로 확인한 뒤 SVG, PNG, JPEG 파일로 내보낼 수 있는 브라우저 기반 편집기입니다. 자주 쓰이는 Mermaid 다이어그램의 예시와 문법 가이드도 함께 제공합니다.

**서비스:** [mermaid-studio-bay.vercel.app](https://mermaid-studio-bay.vercel.app/)

## 주요 기능

- Mermaid 코드를 입력하면 브라우저에서 실시간 렌더링
- SVG, PNG, JPEG 형식 및 1×, 2×, 3× 해상도 내보내기
- 전체 화면 미리보기에서 확대·축소, 방향 이동, 보기 초기화
- 문법 오류 발생 시 명확한 미리보기 오류 안내
- 마지막으로 편집한 코드를 브라우저의 `localStorage`에 자동 저장
- Flowchart, Sequence, Class, State, ERD, Gantt, Pie, Git Graph, Mindmap, Timeline, User Journey, Quadrant, XY Chart 예시 및 가이드
- 한국어·영어 인터페이스 전환
- 설치 가능한 PWA 및 오프라인 앱 셸 캐시

## 화면 구성

| 경로 | 설명 |
| --- | --- |
| `/` | Mermaid Studio 소개 및 시작 경로 |
| `/editor/` | Mermaid 작성, 실시간 미리보기, 파일 내보내기 |
| `/guides/` | 지원하는 다이어그램 유형 목록과 대표 예시 |
| `/guides/[slug]/` | 유형별 문법, 완성 예시, 사용 팁 |

가이드에서 **OPEN IN EDITOR**를 선택하면 해당 예제가 편집기에 채워진 상태로 열립니다.

## 로컬 실행

### 요구 사항

- Node.js 20 이상 권장
- npm

### 설치 및 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 프로덕션 빌드 확인

```bash
npm run build
```

이 프로젝트는 Next.js 정적 내보내기(`output: "export"`)를 사용합니다. 빌드 결과는 `out/` 디렉터리에 생성되며, 정적 호스팅 환경에 그대로 배포할 수 있습니다.

## 내보내기

편집기 하단의 **내보내기** 버튼에서 아래 옵션을 선택할 수 있습니다.

- **SVG**: 확대해도 품질이 유지되는 벡터 파일
- **PNG**: 투명 배경의 래스터 이미지
- **JPEG**: 흰 배경의 래스터 이미지
- **해상도**: PNG·JPEG는 1×, 2×, 3× 선택 가능

큰 화면 미리보기에서도 동일한 내보내기 기능을 사용할 수 있습니다.

## 데이터와 개인정보

입력한 Mermaid 소스는 서버에 전송하거나 계정에 저장하지 않습니다. 마지막 편집 내용은 현재 브라우저의 `localStorage`에만 자동 저장됩니다. **저장본 지우기** 버튼으로 이 초안을 삭제할 수 있습니다.

## 기술 스택

- [Next.js](https://nextjs.org/) 15 · React 19 · TypeScript
- [Mermaid](https://mermaid.js.org/) 다이어그램 렌더링
- [Tailwind CSS](https://tailwindcss.com/) 스타일링
- [Canvg](https://github.com/canvg/canvg) PNG·JPEG 변환
- [Heroicons](https://heroicons.com/) 인터페이스 아이콘
- [Vercel](https://vercel.com/) 정적 배포

## 배포

Vercel에서 이 저장소를 Import한 뒤 기본 Next.js 빌드 설정으로 배포할 수 있습니다. 정적 내보내기 프로젝트이므로 다른 정적 호스팅 서비스에도 `out/` 결과물을 업로드해 배포할 수 있습니다.

## 라이선스

라이선스는 아직 별도로 지정하지 않았습니다. 외부 기여 또는 재사용 전에 저장소 관리자에게 확인해 주세요.
