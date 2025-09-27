# 프로젝트 디렉터리 개요

## 루트 (`/`)
- `package.json`, `package-lock.json`: 프로젝트 의존성과 스크립트 정의.
- `tsconfig*.json`: TypeScript 설정 (앱/노드 별도 구성).
- `vite.config.ts`: Vite 빌드/개발 서버 설정.
- `tailwind.config.js`, `postcss.config.js`: 스타일링 관련 설정.
- `README.md`: 기본 프로젝트 안내 문서.
- `mock-guide.md`: mock 데이터 사용 위치 안내 (추가 작성).
- `PROJECT_STRUCTURE.md`: 현재 문서.
- `design-system*`: 디자인 시스템 관련 문서 및 설정.
- `dist/`: 빌드 결과물 (gitignore 대상).
- `node_modules/`: 의존성 패키지.
- `public/`: 정적 자산 (이미지, favicon 등).

## `src/`
- `main.tsx`: React 엔트리 포인트.
- `App.tsx`: 페이지 라우팅/상태를 담당하는 최상위 컴포넌트.
- `assets/`: 이미지 등 추가 자산.
- `styles/globals.css`: 전역 스타일 정의.
- `constants/`: 정적 데이터 및 선택지(mock) 모음 (`mockData.ts`, `jobCategories.ts`).
- `hooks/`: 커스텀 훅 (`usePersona`, `useJobScrap`).
- `types/`: TypeScript 공유 타입 정의.
- `utils/`: 공통 유틸 함수 (`dateUtils`, `stringUtils`).
- `components/`: UI 및 도메인 컴포넌트 모음
  - `Home.tsx` 등 페르소나/공고/면접 관련 페이지 수준 컴포넌트.
  - `ui/`: 버튼, 배지, 폼, 차트 등 재사용 가능한 UI 컴포넌트와 variant 정의.
  - `figma/`, `Persona*`, `Interview*` 등 기능별 하위 컴포넌트.
  - `VoiceInterview*`, `CoverLetter*`, `Job*` 등 도메인 기능 구현 컴포넌트.

## `public/`
- `notion*.avif`, `og-ads.png`: 배경 이미지 및 로고 자산.
- `recordings/`: 음성 인터뷰 녹음 파일 저장용 디렉터리(현재 비어 있음).

## 기타
- `test.html`: 실험용 정적 파일 (사용하지 않을 경우 삭제 가능).
- `travelin.md`: 참고 문서/데이터 (필요 시 정리).
