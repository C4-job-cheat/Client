# Mock Data Usage Guide

이 프로젝트는 백엔드/API 연동 전 단계로 여러 곳에서 mock 데이터를 사용하고 있습니다. 실제 API 연동 시 아래 위치의 데이터를 우선적으로 대체하거나 삭제하면 됩니다.

## 1. 공고 데이터
- **파일**: `src/constants/mockData.ts`
  - `MOCK_JOBS`: 홈 화면(`Home`), 공고 추천(`JobRecommendations`), 스크랩 공고(`ScrapedJobs`)에서 재사용되는 기본 공고 목록입니다.
  - `DEFAULT_PERSONA_CAPABILITIES`: 공고 추천 페이지의 역량 레이더 차트에서 사용됩니다.
- **파일**: `src/components/JobRecommendations.tsx`
  - `const mockJobs`: 공고 추천 전용 목록입니다. API 연동 시 `MOCK_JOBS` 혹은 서버 응답 데이터로 대체하세요.
  - `loadMoreJobs`는 페이징 시 mock 데이터를 복제하도록 되어 있으므로 API 호출로 교체해야 합니다.
- **파일**: `src/components/JobDetail.tsx`
  - `const mockJobDetail`: 상세 공고 화면이 참조하는 단일 공고 데이터입니다.
- **파일**: `src/components/ScrapedJobs.tsx`
  - `const mockJobs`: 스크랩한 공고 목록을 표시하기 위한 mock 데이터입니다. 실제 스크랩 API 결과로 치환해야 합니다.

## 2. 자기소개서 데이터
- **파일**: `src/components/CoverLetterDraft.tsx`
  - `const dummyParagraphs`: 자기소개서 내용이 없을 때 표시하는 더미 문단입니다. 서버에서 문단 데이터를 제공하는 경우 교체하세요.

## 3. 페르소나/설정 관련
- **파일**: `src/constants/jobCategories.ts`
  - 직군/직무, 학력, 자격증 등 선택지를 위한 정적 mock 데이터입니다. 필요 시 API 기반으로 변경하거나 최신화하세요.

## 4. 기타 참고 사항
- mock 데이터는 TypeScript 타입(`src/types/index.ts`)에 맞추어 작성되어 있으므로 API 연동 시 반환 JSON을 동일한 구조로 맞추면 마이그레이션이 수월합니다.
- mock 데이터를 제거한 뒤에는 관련 상태 초기화 로직(`usePersona`, `useJobScrap` 등)도 실제 API 호출 결과를 반영하도록 수정해야 합니다.
