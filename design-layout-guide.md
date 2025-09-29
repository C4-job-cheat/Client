# 홈 화면 레이아웃 및 디자인 가이드

## 변경 사항

### 1. Hero Section 배경 제거
**파일**: `src/components/Home.tsx`
- **변경 전**: 복잡한 패턴 배경 (`bg-twenty-neutral`) + 마스크 효과
- **변경 후**: 깔끔한 흰색 배경 (`bg-white`)

### 2. 스크랩된 공고 섹션 배경 제거
**파일**: `src/components/Home.tsx`
- **변경 전**: 이미지 배경 + 반투명 오버레이 (`bg-white/85`)
- **변경 후**: 단순한 흰색 배경 (`bg-white`)

### 3. 취업인 로고 추가
**파일**: `src/components/Home.tsx`
- Hero 섹션 상단에 로고 배치
- 크기: 데스크톱 `w-32 h-32`, 모바일 `w-24 h-24`
- 중앙 정렬 + 하단 여백 `mb-8`

### 4. 헤더 텍스트를 로고로 대체
**파일**: `src/components/Home.tsx`
- **변경 전**: 텍스트 "취업인"
- **변경 후**: 로고 이미지 (`h-8 w-8`)

### 5. 페르소나 설정 HTML 파일 미리보기 제거
**파일**: `src/components/PersonaSetup.tsx`
- 파일 내용 미리보기 섹션 완전 제거
- UI 단순화

### 6. 맞춤 공고 추천 이미지 크기 변경
**파일**: `src/components/JobRecommendations.tsx`
- **변경 전**: 고정 크기 로고 (`w-16 h-16`) + 중앙 정렬
- **변경 후**: 전체 영역 채우기 (`w-full h-full object-cover`)

### 7. 맞춤 공고 추천 페이지 서브타이틀 제거
**파일**: `src/components/JobRecommendations.tsx`
- "역량별 세부 분석" 서브타이틀 제거
- 제목만 표시하여 간결함 증대

### 8. 케러셀 색상 변경
**파일**: `src/components/JobRecommendations.tsx`
- **직무 전문성**: Blue → Blue-700 (`#1D4ED8`)
- **성장 잠재력**: Green → Lime-600 (`#65A30D`)
- **문제 해결력**: Purple → Violet-600 (`#7C3AED`)
- **협업 능력**: Orange → Orange-500 (`#F97316`)
- **적응력**: Teal → Red-600 (`#DC2626`)

### 9. 케러셀 선택 버튼 레이아웃 변경
**파일**: `src/components/JobRecommendations.tsx`
- **변경 전**: 세로 나열 (`space-y-2`) + 세로 정렬
- **변경 후**: 균등 분할 (`flex-1`) + 가로 정렬

### 10. AI 추천 이유 sticky 위치 최적화
**파일**: `src/components/JobDetail.tsx`
- **변경 전**: `top-20`
- **변경 후**: `top-14`

### 11. 자기소개서 작성하기 페이지 배경 제거
**파일**: `src/components/CoverLetterSetup.tsx`
- **변경 전**: 노션 이미지 배경
- **변경 후**: 깔끔한 흰색 배경 (`bg-white`)

### 12. 자기소개서 정보 입력 컴포넌트 시각적 구분 강화
**파일**: `src/components/CoverLetterSetup.tsx`
- **변경 전**: 기본 카드 스타일
- **변경 후**: 강화된 테두리 + 그림자 (`shadow-lg border-2 border-gray-200`)

### 13. 공고 상세 페이지 Header 요소 배치를 Main Content에 맞춤
**파일**: `src/components/JobDetail.tsx`
- **변경 전**: `max-w-4xl`
- **변경 후**: `max-w-7xl`

### 14. 공고 상세 페이지 스크랩, 지원하기 버튼 크기 통일
**파일**: `src/components/JobDetail.tsx`
- 버튼 패딩 통일: `px-4 py-2`
- 동일한 시각적 크기 확보

### 15. 공고 상세 페이지 컴포넌트 내부 여백 증가
**파일**: `src/components/JobDetail.tsx`
- **변경 전**: 작은 패딩 (`p-2.5`, `mb-3`)
- **변경 후**: 큰 패딩 (`p-4`, `mb-4`)

### 16. PersonaCardHeader 레이아웃 재구성
**파일**: `src/components/PersonaCardHeader.tsx`
- **변경 전**: 세로 레이아웃
- **변경 후**: 2열 그리드 레이아웃 (`grid-cols-2 gap-4`)
- 좌측: 페르소나 정보, 우측: 기술스택/자격증

### 17. 보유 자격증 요소 디자인 통일
**파일**: `src/components/PersonaCardHeader.tsx`
- **변경 전**: 연한 회색 (`text-gray-700 border-gray-200`)
- **변경 후**: 진한 텍스트 (`text-black border-gray-300`)

### 18. 자기소개서 초안 페이지 스타일링 개선
**파일**: `src/components/CoverLetterDraft.tsx`
- **선택된 문단**: bold 및 text-lg 제거, 배경색만 유지
- **원문단 내용**: 상단 표시 제거, 설명만 표시

### 19. Content Analysis Panel 개선
**파일**: `src/components/CoverLetterDraft.tsx`
- **배경**: 연한 파란색 (`bg-blue-50/30 border-blue-200`)
- **제목**: "구성 요소" → "인사이트" + 크기 증가 + 볼드
- **위치**: sticky positioning으로 스크롤 따라오기

### 20. 동적 레이아웃 시스템 구현
**파일**: `src/components/CoverLetterDraft.tsx`
- **컨테이너**: 동적 폭 변경 (`max-w-3xl` ↔ `max-w-6xl`)
- **그리드**: 조건부 레이아웃 (중앙정렬 ↔ 2열 그리드)
- **자기소개서**: 고정 폭 (`w-[600px]`)
- **분석 패널**: 고정 폭 (`w-[400px]`)

### 21. CSS 슬라이드 인 애니메이션 추가
**파일**: `src/styles/globals.css`
- 우측 패널 등장 시 슬라이드 인 효과
- 오른쪽에서 왼쪽으로 이동하며 페이드 인

### 22. Content Analysis Panel 파란색 메모지 스타일 디자인
**파일**: `src/components/CoverLetterDraft.tsx`
- 메모지 느낌의 모서리 접힌 효과
- 그림자 + 테두리 강화

### 23. InterviewPractice 페르소나 정보 섹션 확장
**파일**: `src/components/InterviewPractice.tsx`
- **변경 전**: 기본 정보만 (직군, 경력, 학력)
- **변경 후**: 상세 정보 (직군/직무, 학교/학과, 기술스택, 자격증)
- 카테고리별 그룹핑 + 태그 형태 표시

### 24. 페르소나 정보 표시 형태 통일
**파일**: 여러 컴포넌트
- **변경 전**: 점(·) 구분자
- **변경 후**: 슬래시(/) 구분자
- 학력 수준 필드 제거로 간소화

### 25. PersonaCardHeader 프로필 아이콘 추가
**파일**: `src/components/PersonaCardHeader.tsx`
- User 아이콘 추가 (`text-blue-600`)
- 제목과 나란히 배치

### 26. 모든 페이지 헤더 바 디자인 통일
**파일**: 여러 컴포넌트
- **통일된 스타일**: `bg-white border-b border-gray-200 px-6 py-2 shadow-sm`
- **통일된 컨테이너**: `max-w-6xl mx-auto`
- **통일된 레이아웃**: 뒤로가기 - 제목 - 우측정보

### 27. 면접 결과 페이지 토글 기능 제거
**파일**: `src/components/InterviewResults.tsx`
- **변경 전**: 복잡한 펼치기/접기 UI
- **변경 후**: 항상 표시 + 상세 분석 보기 버튼

### 28. 면접 결과 페이지 레이아웃 재배치
**파일**: `src/components/InterviewResults.tsx`
- **변경 전**: 소요 시간과 버튼 가로 배치
- **변경 후**: 세로 배치 (`flex-col items-end space-y-3`)
