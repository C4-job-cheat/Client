# 홈 화면 디자인 변경 가이드

## 변경 사항

### 1. Hero Section 배경 제거
**파일**: `src/components/Home.tsx`

**변경 전**:
```tsx
<section className="h-[calc(100vh-100px)] flex flex-col items-center justify-center px-6 bg-twenty-neutral relative overflow-hidden pt-6">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-65" style={{ WebkitMaskImage: 'linear-gradient(185deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 22%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,1) 100%)', maskImage: 'linear-gradient(185deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 22%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,1) 100%)' }}>
    <div 
      className="w-full h-full"
      style={{
        position: 'absolute',
        top: '-15%',
        left: '-20%',
        width: '160%',
        height: '160%',
        backgroundImage: `url('https://framerusercontent.com/images/nqEmdwe7yDXNsOZovuxG5zvj2E.png')`,
        backgroundSize: 'auto 20px',
        backgroundRepeat: 'repeat',
        transform: 'matrix(0.961262, 0.275637, -0.275637, 0.961262, 0, 0)'
      }}
    />
  </div>
```

**변경 후**:
```tsx
<section className="h-[calc(100vh-100px)] flex flex-col items-center justify-center px-6 bg-white relative overflow-hidden pt-6">
```

### 2. 스크랩된 공고 섹션 배경 제거
**파일**: `src/components/Home.tsx`

**변경 전**:
```tsx
<section 
  className="relative px-6 pb-20 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url('https://framerusercontent.com/images/PFK7w4J7AQNXaDkPoE1teXJELY.png')`
  }}
>
  <div className="absolute inset-0 bg-white/85"></div>
```

**변경 후**:
```tsx
<section className="relative px-6 pb-20 bg-white">
```

### 3. 취업인 로고 추가
**파일**: `src/components/Home.tsx`

**추가된 코드**:
```tsx
{/* Logo */}
<div className="flex justify-center mb-8">
  <img 
    src="/job_cheat_LOGO.svg" 
    alt="취업인 로고" 
    className="w-24 h-24 md:w-32 md:h-32"
  />
</div>
```

### 4. 헤더 텍스트를 로고로 대체
**파일**: `src/components/Home.tsx`

**변경 전**:
```tsx
<h1 className="text-lg font-semibold text-gray-900">취업인</h1>
```

**변경 후**:
```tsx
<img 
  src="/job_cheat_LOGO.svg" 
  alt="취업인 로고" 
  className="h-8 w-8"
/>
```

### 5. 로고 파일 추가
**파일**: `public/job_cheat_LOGO.svg`
- 취업인 브랜드 로고 파일

### 6. 페르소나 설정 HTML 파일 미리보기 제거
**파일**: `src/components/PersonaSetup.tsx`

**변경 전**:
```tsx
{/* 파일 내용 미리보기 */}
<div className="p-4 bg-gray-50 rounded-lg border">
  <p className="text-sm font-medium text-gray-700 mb-2">파일 내용 미리보기</p>
  <div className="text-xs text-gray-600 bg-white p-3 rounded max-h-32 overflow-y-auto font-mono border">
    {formData.uploadedFile.fileContent.substring(0, 400)}
    {formData.uploadedFile.fileContent.length > 400 && '...'}
  </div>
</div>
```

**변경 후**:
```tsx
// 파일 내용 미리보기 섹션 완전 제거
```

### 7. 맞춤 공고 추천 이미지 크기 변경
**파일**: `src/components/JobRecommendations.tsx`

**변경 전**:
```tsx
<div className="relative h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
  {job.logoUrl && (
    <img
      src={job.logoUrl}
      alt={`${job.company} 로고`}
      className="w-16 h-16 object-cover rounded-lg"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  )}
```

**변경 후**:
```tsx
<div className="relative h-32 overflow-hidden bg-gray-100">
  {job.logoUrl && (
    <img
      src={job.logoUrl}
      alt={`${job.company} 로고`}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  )}
```

### 8. 맞춤 공고 추천 페이지 '역량별 세부 분석' 텍스트 제거
**파일**: `src/components/JobRecommendations.tsx`

**변경 전**:
```tsx
<div className="mb-4">
  <h3 className="text-lg font-semibold text-gray-900">AI 분석 요약</h3>
  <p className="text-sm text-gray-500">역량별 세부 분석</p>
</div>
```

**변경 후**:
```tsx
<div className="mb-4">
  <h3 className="text-lg font-semibold text-gray-900">AI 분석 요약</h3>
</div>
```

### 9. 케러셀 색상 변경
**파일**: `src/components/JobRecommendations.tsx`

**변경 전**:
```tsx
// 직무 전문성
color: 'text-blue-600',
borderColor: 'border-blue-600',
iconColor: 'text-blue-600',

// 성장 잠재력
color: 'text-green-600',
borderColor: 'border-green-600',
iconColor: 'text-green-600',

// 문제 해결력
color: 'text-purple-600',
borderColor: 'border-purple-600',
iconColor: 'text-purple-600',

// 협업 능력
color: 'text-orange-600',
borderColor: 'border-orange-600',
iconColor: 'text-orange-600',

// 적응력
color: 'text-teal-600',
borderColor: 'border-teal-600',
iconColor: 'text-teal-600',
```

**변경 후**:
```tsx
// 직무 전문성: Blue #1D4ED8 (tailwind blue-700)
color: 'text-blue-700',
borderColor: 'border-blue-700',
iconColor: 'text-blue-700',

// 성장 잠재력: Lime/Olive #65A30D (tailwind lime-600)
color: 'text-lime-600',
borderColor: 'border-lime-600',
iconColor: 'text-lime-600',

// 문제 해결력: Purple #7C3AED (tailwind violet-600)
color: 'text-violet-600',
borderColor: 'border-violet-600',
iconColor: 'text-violet-600',

// 협업 능력: Orange #F97316 (tailwind orange-500)
color: 'text-orange-500',
borderColor: 'border-orange-500',
iconColor: 'text-orange-500',

// 적응력: Crimson/Red #DC2626 (tailwind red-600)
color: 'text-red-600',
borderColor: 'border-red-600',
iconColor: 'text-red-600',
```

### 10. 케러셀 선택 버튼 레이아웃 변경
**파일**: `src/components/JobRecommendations.tsx`

**변경 전**:
```tsx
{/* 오른쪽: 역량별 버튼 목록 */}
<div className="w-40 flex flex-col space-y-2">
  {analysisData.map((item, index) => (
    <Button
      key={index}
      variant="outline"
      size="sm"
      onClick={() => goToSlide(index)}
      className={`w-full justify-start text-left h-auto py-2 px-2.5 bg-gradient-to-r from-white to-gray-50 ${
        index === currentIndex
          ? `${item.borderColor} ${item.color} border`
          : `border-gray-200 text-gray-700 hover:${item.borderColor} hover:${item.color} border`
      }`}
    >
      <div className="flex flex-col items-start w-full">
        <span className="text-xs font-medium">{item.title}</span>
        <span className="text-xs opacity-75">{item.score}점</span>
      </div>
    </Button>
  ))}
</div>
```

**변경 후**:
```tsx
{/* 오른쪽: 역량별 버튼 목록 */}
<div className="w-40 flex flex-col h-full">
  {analysisData.map((item, index) => (
    <Button
      key={index}
      variant="outline"
      size="sm"
      onClick={() => goToSlide(index)}
      className={`w-full justify-start text-left flex-1 py-3 px-2.5 bg-gradient-to-r from-white to-gray-50 ${
        index === currentIndex
          ? `${item.borderColor} ${item.color} border`
          : `border-gray-200 text-gray-700 hover:${item.borderColor} hover:${item.color} border`
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-medium">{item.title}</span>
        <span className="text-xs opacity-75">{item.score}점</span>
      </div>
    </Button>
  ))}
</div>
```

### 11. AI 추천 이유 sticky 위치 최적화
**파일**: `src/components/JobDetail.tsx`

**변경 전**:
```tsx
<div className="sticky top-20 space-y-2.5">
```

**변경 후**:
```tsx
<div className="sticky top-14 space-y-2.5">
```

### 12. 자기소개서 작성하기 페이지 배경 제거
**파일**: `src/components/CoverLetterSetup.tsx`

**변경 전**:
```tsx
<div
  className="min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url('/notion2.avif')`
  }}
>
```

**변경 후**:
```tsx
<div className="min-h-screen bg-white">
```

### 13. 자기소개서 정보 입력 컴포넌트 시각적 구분 강화
**파일**: `src/components/CoverLetterSetup.tsx`

**변경 전**:
```tsx
<Card className="p-6">
```

**변경 후**:
```tsx
<Card className="p-6 shadow-lg border-2 border-gray-200 bg-white">
```

### 14. 공고 상세 페이지 Header 요소 배치를 Main Content에 맞춤
**파일**: `src/components/JobDetail.tsx`

**변경 전**:
```tsx
<div className="max-w-4xl mx-auto flex items-center justify-between">
```

**변경 후**:
```tsx
<div className="max-w-7xl mx-auto flex items-center justify-between">
```

### 15. 공고 상세 페이지 스크랩, 지원하기 버튼 크기 통일
**파일**: `src/components/JobDetail.tsx`

**변경 전**:
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => onToggleScrap(job.id)}
  className={`${
    scrapedJobs.has(job.id)
      ? 'text-blue-600 border-blue-600 bg-blue-50'
      : 'text-gray-600'
  }`}
>
  {scrapedJobs.has(job.id) ? '스크랩됨' : '스크랩'}
</Button>

<Button
  size="sm"
  onClick={() => alert('지원 기능은 데모에서 제공되지 않습니다.')}
  className="bg-black hover:bg-gray-800 text-white"
>
  지원하기
</Button>
```

**변경 후**:
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => onToggleScrap(job.id)}
  className={`px-4 py-2 ${
    scrapedJobs.has(job.id)
      ? 'text-blue-600 border-blue-600 bg-blue-50'
      : 'text-gray-600'
  }`}
>
  {scrapedJobs.has(job.id) ? '스크랩됨' : '스크랩'}
</Button>

<Button
  variant="outline"
  size="sm"
  onClick={() => alert('지원 기능은 데모에서 제공되지 않습니다.')}
  className="px-4 py-2 bg-black hover:bg-gray-800 text-white"
>
  지원하기
</Button>
```

### 16. 지원하기 버튼에 variant="outline" 추가
**파일**: `src/components/JobDetail.tsx`

**변경 전**:
```tsx
<Button
  size="sm"
  onClick={() => alert('지원 기능은 데모에서 제공되지 않습니다.')}
  className="px-4 py-2 bg-black hover:bg-gray-800 text-white"
>
  지원하기
</Button>
```

**변경 후**:
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => alert('지원 기능은 데모에서 제공되지 않습니다.')}
  className="px-4 py-2 bg-black hover:bg-gray-800 text-white"
>
  지원하기
</Button>
```

### 17. 공고 상세 페이지 컴포넌트 내부 여백 증가
**파일**: `src/components/JobDetail.tsx`

**변경 전**:
```tsx
{/* 역량 매치 분석 */}
<div className="bg-white rounded-xl p-2.5 border border-gray-200">
  <div className="mb-3">

{/* 기술 스택 매치 */}
<div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-80 overflow-y-auto">
  <div className="mb-3">

{/* 공고 상세 정보 */}
<div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-120 overflow-y-auto">
  <div className="mb-3">

{/* AI 맞춤 자기소개서 */}
<div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-96 overflow-y-auto">
  <div className="flex items-center justify-between mb-3">
```

**변경 후**:
```tsx
{/* 역량 매치 분석 */}
<div className="bg-white rounded-xl p-4 border border-gray-200">
  <div className="mb-4">

{/* 기술 스택 매치 */}
<div className="bg-white rounded-xl p-4 border border-gray-200 max-h-80 overflow-y-auto">
  <div className="mb-4">

{/* 공고 상세 정보 */}
<div className="bg-white rounded-xl p-4 border border-gray-200 max-h-120 overflow-y-auto">
  <div className="mb-4">

{/* AI 맞춤 자기소개서 */}
<div className="bg-white rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
  <div className="flex items-center justify-between mb-4">
```

### 18. PersonaCardHeader 레이아웃 재구성
**파일**: `src/components/PersonaCardHeader.tsx`

**변경 전**:
```tsx
<div className="flex items-center justify-between mb-1">
  <div className="flex-1">
    <h3 className="text-sm font-semibold text-gray-900">내 페르소나</h3>
    <p className="text-xs text-black font-medium mt-0.5">
      {persona.jobCategory}
      {specificJob ? ` · ${specificJob}` : ''}
    </p>
  </div>
  <span className="text-xs text-gray-400">
    {persona.education.level === '고등학교'
      ? '고등학교'
      : `${persona.categorySpecific?.education?.school || '학교 미설정'} · ${persona.education.major || '전공 미설정'}`
    }
  </span>
</div>

<div className="space-y-2 text-sm">
  <div className="grid grid-cols-2 gap-2">
    {/* 보유 기술 스택 */}
    {/* 보유 자격증 */}
  </div>
</div>
```

**변경 후**:
```tsx
<div className="grid grid-cols-2 gap-4">
  {/* 좌측: 페르소나 정보 */}
  <div>
    <h3 className="text-sm font-semibold text-gray-900 mb-1">내 페르소나</h3>
    <p className="text-xs text-black font-medium">
      {persona.jobCategory}
      {specificJob ? ` · ${specificJob}` : ''}
    </p>
    <p className="text-xs text-gray-400 mt-1">
      {persona.education.level === '고등학교'
        ? '고등학교'
        : `${persona.categorySpecific?.education?.school || '학교 미설정'} · ${persona.education.major || '전공 미설정'}`
      }
    </p>
  </div>

  {/* 우측: 보유 기술 스택과 자격증 */}
  <div className="space-y-3 text-sm">
    {/* 보유 기술 스택 */}
    {/* 보유 자격증 */}
  </div>
</div>
```

### 19. PersonaCardHeader 2열 레이아웃 구성
**파일**: `src/components/PersonaCardHeader.tsx`

**변경 전**:
```tsx
<div className="mb-3">
  <h3 className="text-sm font-semibold text-gray-900 mb-1">내 페르소나</h3>
  <p className="text-xs text-black font-medium">
    {persona.jobCategory}
    {specificJob ? ` · ${specificJob}` : ''}
  </p>
  <p className="text-xs text-gray-400 mt-1">
    {persona.education.level === '고등학교'
      ? '고등학교'
      : `${persona.categorySpecific?.education?.school || '학교 미설정'} · ${persona.education.major || '전공 미설정'}`
    }
  </p>
</div>

<div className="space-y-3 text-sm">
  {/* 보유 기술 스택 */}
  {/* 보유 자격증 */}
</div>
```

**변경 후**:
```tsx
<div className="grid grid-cols-2 gap-4">
  {/* 좌측: 페르소나 정보 */}
  <div>
    <h3 className="text-sm font-semibold text-gray-900 mb-1">내 페르소나</h3>
    <p className="text-xs text-black font-medium">
      {persona.jobCategory}
      {specificJob ? ` · ${specificJob}` : ''}
    </p>
    <p className="text-xs text-gray-400 mt-1">
      {persona.education.level === '고등학교'
        ? '고등학교'
        : `${persona.categorySpecific?.education?.school || '학교 미설정'} · ${persona.education.major || '전공 미설정'}`
      }
    </p>
  </div>

  {/* 우측: 보유 기술 스택과 자격증 */}
  <div className="space-y-3 text-sm">
    {/* 보유 기술 스택 */}
    {/* 보유 자격증 */}
  </div>
</div>
```

### 20. 보유 자격증 요소 디자인 통일
**파일**: `src/components/PersonaCardHeader.tsx`

**변경 전**:
```tsx
{persona.certifications.slice(0, 6).map((cert, index) => (
  <span key={index} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200">{cert}</span>
))}
```

**변경 후**:
```tsx
{persona.certifications.slice(0, 6).map((cert, index) => (
  <span key={index} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-black border border-gray-300">{cert}</span>
))}
```

### 21. 자기소개서 초안 페이지 스타일링 개선
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 선택된 문단 스타일링
className={`cursor-pointer transition-all duration-200 ${
  selectedParagraphId === paragraph.id
    ? 'bg-blue-200/70 font-bold text-lg'
    : 'hover:bg-yellow-200/50'
}`}

// Content Analysis Panel - 원문단 내용 표시
{selectedParagraph ? (
  <>
    <div className="border-b border-gray-200 px-6 py-4">
      <p className="text-lg font-bold text-gray-900 leading-relaxed italic">
        "{selectedParagraph.text}"
      </p>
    </div>

    <div className="flex-1 p-6">
      <div>
        <div className="text-sm text-gray-700 mb-2 font-medium">구성 요소</div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {selectedParagraph.explanation}
        </p>
      </div>
    </div>
  </>
) : (
```

**변경 후**:
```tsx
// 선택된 문단 스타일링 - bold 및 text-lg 제거
className={`cursor-pointer transition-all duration-200 ${
  selectedParagraphId === paragraph.id
    ? 'bg-blue-200/70'
    : 'hover:bg-yellow-200/50'
}`}

// Content Analysis Panel - 원문단 내용 제거, 설명만 표시
{selectedParagraph ? (
  <div className="flex-1 p-6">
    <div>
      <div className="text-sm text-gray-700 mb-2 font-medium">구성 요소</div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {selectedParagraph.explanation}
      </p>
    </div>
  </div>
) : (
```

### 22. Content Analysis Panel 개선
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - 고정 크기 및 기본 배경
<div className={`absolute top-0 right-0 w-2/5 h-[400px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
  <Card className="h-full flex flex-col ml-4">

// 제목 스타일링
<div className="text-sm text-gray-700 mb-2 font-medium">구성 요소</div>
```

**변경 후**:
```tsx
// Content Analysis Panel - absolute positioning 복원, 동적 크기, 연한 파란색 배경
<div className={`absolute top-0 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
  <Card className="h-full flex flex-col ml-4 bg-blue-50/30 border-blue-200">

// 제목 스타일링 - '인사이트'로 변경, 크기 증가, 볼드 처리
<div className="text-lg text-gray-700 mb-2 font-bold">인사이트</div>
```

### 23. Content Analysis Panel 추가 개선
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - 상단 고정 위치
<div className={`absolute top-0 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>

// 인사이트 섹션 - 기본 패딩
<div className="flex-1 p-6">
```

**변경 후**:
```tsx
// Content Analysis Panel - 더 아래 위치로 조정
<div className={`absolute top-16 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>

// 인사이트 섹션 - 상단 패딩 더 줄임
<div className="flex-1 p-6 pt-2">
```

### 24. Content Analysis Panel 최종 위치 조정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - 중간 위치
<div className={`absolute top-16 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>

// 인사이트 섹션 - 중간 패딩
<div className="flex-1 p-6 pt-4">
```

**변경 후**:
```tsx
// Content Analysis Panel - 더 아래 위치로 최종 조정
<div className={`absolute top-24 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>

// 인사이트 섹션 - 최소 패딩
<div className="flex-1 p-6 pt-2">
```

### 25. Content Analysis Panel Sticky 위치 변경
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - absolute 위치
<div className={`absolute top-24 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
```

**변경 후**:
```tsx
// Content Analysis Panel - sticky 위치
<div className={`sticky top-24 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
```

### 26. Content Analysis Panel 위치 수정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - ml-auto로 인한 우측하단 위치
<div className={`sticky top-24 w-2/5 min-h-[400px] max-h-[600px] ml-auto transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
```

**변경 후**:
```tsx
// Content Analysis Panel - ml-auto 제거로 우측 위치 복원
<div className={`sticky top-24 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
```

### 27. Content Analysis Panel 스크롤 따라오기 기능
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - absolute 위치 (스크롤 시 고정)
<div className={`absolute top-24 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
```

**변경 후**:
```tsx
// Content Analysis Panel - sticky 위치 (스크롤 따라오기)
<div className={`sticky top-24 w-2/5 min-h-[400px] max-h-[600px] ml-auto transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
```

### 28. Content Analysis Panel Grid 레이아웃 수정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Main Content - overflow-hidden으로 인한 sticky 깨짐
<main className="px-6 py-8 overflow-hidden">
  <div className="max-w-6xl mx-auto relative">
    {/* Cover Letter Document */}
    <div className={`w-3/5 mx-auto transition-all duration-700 ease-in-out ${
      isAnalysisOpen
        ? 'transform -translate-x-1/3'
        : 'transform translate-x-0'
    }`}>

// Content Analysis Panel - absolute positioning
<div className={`absolute top-24 right-0 w-2/5 min-h-[400px] max-h-[600px] transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'transform translate-x-0 opacity-100'
    : 'transform translate-x-full opacity-0'
}`}>
  <Card className="h-full flex flex-col ml-4 bg-blue-50/30 border-blue-200">
```

**변경 후**:
```tsx
// Main Content - overflow-hidden 제거
<main className="px-6 py-8">
  <div className="max-w-6xl mx-auto">
    {/* Grid Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Cover Letter Document */}
      <div className={`lg:col-span-2 transition-all duration-700 ease-in-out ${
        isAnalysisOpen
          ? 'transform -translate-x-1/3'
          : 'transform translate-x-0'
      }`}>

// Content Analysis Panel - Grid 레이아웃 + sticky
<div className={`lg:col-span-1 transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'opacity-100'
    : 'opacity-0'
}`}>
  <Card className="sticky top-24 flex flex-col bg-blue-50/30 border-blue-200">
```

### 29. Content Analysis Panel 동적 크기 설정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Content Analysis Panel - 고정 높이
<Card className="sticky top-24 h-full flex flex-col bg-blue-50/30 border-blue-200">
```

**변경 후**:
```tsx
// Content Analysis Panel - 동적 크기
<Card className="sticky top-24 flex flex-col bg-blue-50/30 border-blue-200">
```

### 30. Grid 레이아웃 여백 조정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Grid Layout - 큰 여백
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

**변경 후**:
```tsx
// Grid Layout - 여백 제거
<div className="grid grid-cols-1 lg:grid-cols-3">
```

### 31. 동적 레이아웃 시스템 구현
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 고정 Grid 레이아웃
<main className="px-6 py-8">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className={`lg:col-span-2 transition-all duration-700 ease-in-out ${
        isAnalysisOpen
          ? 'lg:col-span-2'
          : 'lg:col-span-3'
      }`}>

// 우측 패널 - 조건부 렌더링
{isAnalysisOpen && (
<div className="lg:col-span-1 transition-all duration-700 ease-in-out">
  <Card className="sticky top-24 flex flex-col bg-blue-50/30 border-blue-200">
```

**변경 후**:
```tsx
// 동적 컨테이너 폭 + 조건부 레이아웃
<main className="px-6 py-8">
  <div className={`mx-auto ${isAnalysisOpen ? 'max-w-6xl' : 'max-w-3xl'}`}>
    <div className={
      isAnalysisOpen
        ? 'grid grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-2'
        : 'flex justify-center'
    }>
      <div className={`transition-all duration-700 ease-in-out ${
        isAnalysisOpen ? '-translate-x-1' : 'translate-x-0'
      }`}>

// 우측 패널 - aside 태그 + 동적 크기
{isAnalysisOpen && (
<aside className="sticky top-24 self-start transition-all duration-700 ease-in-out">
  <Card className="min-h-[400px] max-h-[600px] flex flex-col bg-blue-50/30 border-blue-200">
```

### 32. Content Analysis Panel 동적 크기 및 애니메이션 최적화
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 고정 높이 + 기본 패딩
<Card className="h-[600px] flex flex-col bg-blue-50/30 border-blue-200">
  <div className="flex-1 p-6 pt-2">
```

**변경 후**:
```tsx
// 동적 크기 + 스크롤 가능
<Card className="min-h-[400px] max-h-[600px] flex flex-col bg-blue-50/30 border-blue-200">
  <div className="flex-1 p-6 pt-2 overflow-auto">
```

### 33. 애니메이션 부드러움 복원 및 자기소개서 가로폭 고정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 컨테이너 - 애니메이션 제거됨
<div className={`mx-auto ${isAnalysisOpen ? 'max-w-6xl' : 'max-w-3xl'}`}>
  <div className={
    isAnalysisOpen
      ? 'grid grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-2'
      : 'flex justify-center'
  }>

// 자기소개서 - 가로폭 제한 없음
<div className="bg-white border border-gray-300 shadow-sm min-h-[400px] rounded-lg">
```

**변경 후**:
```tsx
// 컨테이너 - 부드러운 전환 복원
<div className={`mx-auto transition-all duration-700 ease-in-out ${isAnalysisOpen ? 'max-w-6xl' : 'max-w-3xl'}`}>
  <div className={`transition-all duration-700 ease-in-out ${
    isAnalysisOpen
      ? 'grid grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-2'
      : 'flex justify-center'
  }`}>

// 자기소개서 - 가로폭 고정 (600px)
<div className="bg-white border border-gray-300 shadow-sm min-h-[400px] w-[600px] rounded-lg">
```

### 34. Right 요소 슬라이드 인 애니메이션 및 여백 최소화
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// Grid 레이아웃 - 여백 있음
className={`transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'grid grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-2'
    : 'flex justify-center'
}`}

// 우측 패널 - 기본 애니메이션
<aside className="sticky top-24 self-start transition-all duration-700 ease-in-out">
```

**변경 후**:
```tsx
// Grid 레이아웃 - 여백 제거
className={`transition-all duration-700 ease-in-out ${
  isAnalysisOpen
    ? 'grid grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-0'
    : 'flex justify-center'
}`}

// 우측 패널 - 오른쪽에서 슬라이드 인 (CSS 애니메이션)
<aside className="sticky top-24 self-start transition-all duration-700 ease-in-out transform translate-x-full opacity-0 animate-[slideIn_0.7s_ease-in-out_forwards]">
```

### 35. CSS 슬라이드 인 애니메이션 추가
**파일**: `src/styles/globals.css`

**추가된 코드**:
```css
/* 우측 패널 슬라이드 인 애니메이션 */
@keyframes slideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### 36. Content Analysis Panel 가로폭 고정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 우측 패널 - 가로폭 제한 없음
<Card className="min-h-[200px] max-h-[1000px] flex flex-col bg-blue-50/30 border-blue-200">
```

**변경 후**:
```tsx
// 우측 패널 - 가로폭 고정 (400px)
<Card className="min-h-[200px] max-h-[1000px] w-[400px] flex flex-col bg-blue-50/30 border-blue-200">
```

### 37. Content Analysis Panel 위치 하향 조정
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 우측 패널 - 상단 위치
className="sticky top-50 self-start transition-all duration-700 ease-in-out transform translate-x-full opacity-0 animate-[slideIn_0.7s_ease-in-out_forwards]"
```

**변경 후**:
```tsx
// 우측 패널 - 하향 위치 조정
className="sticky top-80 self-start transition-all duration-700 ease-in-out transform translate-x-full opacity-0 animate-[slideIn_0.7s_ease-in-out_forwards]"
```

### 38. Content Analysis Panel 파란색 메모지 스타일 디자인
**파일**: `src/components/CoverLetterDraft.tsx`

**변경 전**:
```tsx
// 기본 카드 스타일
<Card className="min-h-[200px] max-h-[1000px] w-[400px] flex flex-col bg-blue-50/30 border-blue-200">
```

**변경 후**:
```tsx
// 파란색 메모지 스타일 디자인
<Card className="min-h-[200px] max-h-[1000px] w-[400px] flex flex-col bg-blue-50/30 border-blue-200 shadow-lg relative before:absolute before:top-0 before:right-0 before:w-8 before:h-8 before:bg-blue-200 before:clip-path-[polygon(0_0,100%_0,100%_100%)] after:absolute after:top-2 after:right-2 after:w-6 after:h-6 after:bg-blue-100 after:clip-path-[polygon(0_0,100%_0,100%_100%)]">
```

### 39. InterviewPractice 페르소나 정보 섹션 확장
**파일**: `src/components/InterviewPractice.tsx`

**변경 전**:
```tsx
// 기본 페르소나 정보만 표시
<Card className="p-6">
  <div className="flex items-center space-x-2 mb-4">
    <User className="h-5 w-5 text-blue-600" />
    <h2 className="font-semibold">선택된 페르소나</h2>
  </div>
  
  <div className="flex items-center space-x-4">
    <Badge>{currentPersona.jobCategory}</Badge>
    <span className="text-sm text-gray-600">
      {currentPersona.experience.hasExperience 
        ? `${currentPersona.experience.years}년 경력` 
        : '신입'
      }
    </span>
    <span className="text-sm text-gray-600">
      {currentPersona.education.level}
    </span>
  </div>
</Card>
```

**변경 후**:
```tsx
// 상세 페르소나 정보 표시
<Card className="p-6">
  <div className="flex items-center space-x-2 mb-4">
    <User className="h-5 w-5 text-blue-600" />
    <h2 className="font-semibold">선택된 페르소나</h2>
  </div>
  
  <div className="space-y-4">
    {/* 직군/직무 */}
    <div>
      <p className="text-xs text-gray-500 mb-1">직군/직무</p>
      <p className="font-medium text-gray-900">
        {currentPersona.jobCategory}
        {currentPersona.categorySpecific?.specificJob ? ` · ${currentPersona.categorySpecific.specificJob}` : ''}
      </p>
    </div>

    {/* 학교/학과 */}
    <div>
      <p className="text-xs text-gray-500 mb-1">학교/학과</p>
      <p className="font-medium text-gray-900">
        {currentPersona.categorySpecific?.education?.school || '학교 미설정'}
        {currentPersona.education.major ? ` · ${currentPersona.education.major}` : ''}
      </p>
    </div>

    {/* 보유 기술 스택 */}
    {currentPersona.categorySpecific?.skills?.techStack && currentPersona.categorySpecific.skills.techStack.length > 0 && (
      <div>
        <p className="text-xs text-gray-500 mb-2">보유 기술 스택</p>
        <div className="flex flex-wrap gap-2">
          {currentPersona.categorySpecific.skills.techStack.slice(0, 8).map((tech, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-1">
              {tech}
            </Badge>
          ))}
          {currentPersona.categorySpecific.skills.techStack.length > 8 && (
            <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">
              +{currentPersona.categorySpecific.skills.techStack.length - 8}
            </span>
          )}
        </div>
      </div>
    )}

    {/* 보유 자격증 */}
    {currentPersona.certifications && currentPersona.certifications.length > 0 && (
      <div>
        <p className="text-xs text-gray-500 mb-2">보유 자격증</p>
        <div className="flex flex-wrap gap-2">
          {currentPersona.certifications.slice(0, 6).map((cert, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-1">
              {cert}
            </Badge>
          ))}
          {currentPersona.certifications.length > 6 && (
            <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">
              +{currentPersona.certifications.length - 6}
            </span>
          )}
        </div>
      </div>
    )}
  </div>
</Card>
```

### 40. 페르소나 정보 표시 형태 통일
**파일**: `src/components/PersonaCardHeader.tsx`, `src/components/PersonaCard.tsx`, `src/components/InterviewPractice.tsx`

**변경 전**:
```tsx
// PersonaCardHeader.tsx - 점으로 구분
{persona.jobCategory}
{specificJob ? ` · ${specificJob}` : ''}

// PersonaCard.tsx - 분리된 필드
<p className="text-xs text-gray-500 mb-0.5">희망 분야 / 직무</p>
<p className="text-xs text-gray-500 mb-0.5">학교명</p>
<p className="text-xs text-gray-500 mb-0.5">전공</p>

// InterviewPractice.tsx - 점으로 구분
{currentPersona.jobCategory}
{currentPersona.categorySpecific?.specificJob ? ` · ${currentPersona.categorySpecific.specificJob}` : ''}
```

**변경 후**:
```tsx
// PersonaCardHeader.tsx - 슬래시로 구분
{persona.jobCategory}
{specificJob ? ` / ${specificJob}` : ''}

// PersonaCard.tsx - 통합된 필드
<p className="text-xs text-gray-500 mb-0.5">직군/직무</p>
<p className="text-xs text-gray-500 mb-0.5">학교/학과</p>

// InterviewPractice.tsx - 슬래시로 구분
{currentPersona.jobCategory}
{currentPersona.categorySpecific?.specificJob ? ` / ${currentPersona.categorySpecific.specificJob}` : ''}
```

### 41. PersonaCard 학력 수준 필드 제거
**파일**: `src/components/PersonaCard.tsx`

**변경 전**:
```tsx
<div>
  <p className="text-xs text-gray-500 mb-0.5">학력 수준</p>
  <p className="font-medium text-gray-900">{persona.education.level || '미설정'}</p>
</div>

<div>
  <p className="text-xs text-gray-500 mb-0.5">학교/학과</p>
  <p className="font-medium text-gray-900">
    {persona.categorySpecific?.education?.school || '학교 미설정'}
    {persona.education.major ? ` / ${persona.education.major}` : ''}
  </p>
</div>
```

**변경 후**:
```tsx
<div>
  <p className="text-xs text-gray-500 mb-0.5">학교/학과</p>
  <p className="font-medium text-gray-900">
    {persona.categorySpecific?.education?.school || '학교 미설정'}
    {persona.education.major ? ` / ${persona.education.major}` : ''}
  </p>
</div>
```

### 42. PersonaCardHeader 프로필 아이콘 추가
**파일**: `src/components/PersonaCardHeader.tsx`

**변경 전**:
```tsx
import type { Persona } from '../types';

// 1열: 페르소나 정보
<div>
  <h3 className="text-sm font-semibold text-gray-900 mb-1">내 페르소나</h3>
```

**변경 후**:
```tsx
import type { Persona } from '../types';
import { User } from 'lucide-react';

// 1열: 페르소나 정보
<div>
  <div className="flex items-center space-x-2 mb-1">
    <User className="h-5 w-5 text-blue-600" />
    <h3 className="text-sm font-semibold text-gray-900">내 페르소나</h3>
  </div>
```

### 43. InterviewPractice 페르소나 섹션 제목 변경
**파일**: `src/components/InterviewPractice.tsx`

**변경 전**:
```tsx
<h2 className="font-semibold">선택된 페르소나</h2>
```

**변경 후**:
```tsx
<h2 className="font-semibold">내 페르소나</h2>
```

### 44. 모든 페이지 헤더 바 디자인 통일
**파일**: `src/components/InterviewPractice.tsx`, `src/components/JobDetail.tsx`, `src/components/JobRecommendations.tsx`, `src/components/CoverLetterSetup.tsx`, `src/components/CoverLetterDraft.tsx`, `src/components/InterviewQuestions.tsx`, `src/components/InterviewResults.tsx`, `src/components/VoiceInterviewQuestions.tsx`, `src/components/VoiceInterviewGuide.tsx`, `src/components/PersonaSelectionHub.tsx`, `src/components/PersonaWaitingPage.tsx`

**변경 전**:
```tsx
// 다양한 헤더 스타일
<header className="bg-white border-b border-gray-200 px-6 py-2">
<header className="bg-white border-b border-gray-200 px-4 py-1.5 sticky top-0 z-10 shadow-sm">
<header className="bg-white border-b border-gray-200 px-6 py-2 shadow-sm">
<header className="bg-twenty-white border-b border-twenty-border px-6 py-2 flex-shrink-0">

// 다양한 컨테이너 크기
<div className="max-w-4xl mx-auto flex items-center justify-between">
<div className="max-w-7xl mx-auto relative flex items-center">
<div className="max-w-6xl mx-auto flex items-center justify-between">
<div className="max-w-5xl mx-auto flex items-center justify-between">
<div className="max-w-md mx-auto flex items-center justify-between">
```

**변경 후**:
```tsx
// 통일된 헤더 스타일
<header className="bg-white border-b border-gray-200 px-6 py-2 shadow-sm">

// 통일된 컨테이너 크기
<div className="max-w-6xl mx-auto flex items-center justify-between">

// 통일된 레이아웃 구조
<Button variant="ghost" size="sm" className="flex items-center space-x-2">
  <ArrowLeft className="h-4 w-4" />
  <span>뒤로가기</span>
</Button>

<h1 className="font-semibold">페이지 제목</h1>

<div className="flex items-center space-x-4">
  {/* 우측 정보 */}
</div>
```

### 45. 면접 결과 페이지 토글 기능 제거
**파일**: `src/components/InterviewResults.tsx`

**변경 전**:
```tsx
// 토글 상태 관리
const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

// 토글 함수
const toggleQuestionExpansion = (questionId: string) => {
  const newExpanded = new Set(expandedQuestions);
  if (newExpanded.has(questionId)) {
    newExpanded.delete(questionId);
  } else {
    newExpanded.add(questionId);
  }
  setExpandedQuestions(newExpanded);
};

// 복잡한 토글 UI
<div className="p-4 cursor-pointer" onClick={() => toggleQuestionExpansion(question.id)}>
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm font-medium text-gray-500">Q{index + 1}.</span>
        <Badge className={QUESTION_TYPE_META[question.type]?.color || 'bg-gray-100 text-gray-700'}>
          {QUESTION_TYPE_META[question.type]?.label || '일반'}
        </Badge>
      </div>
      <p className="font-medium mb-2">{question.question}</p>
      {!isExpanded && (
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg line-clamp-2">
          {question.answer || '답변이 입력되지 않았습니다.'}
        </p>
      )}
    </div>
    <div className="ml-4 flex items-center space-x-2">
      <div className="text-right">
        <div className="text-sm text-gray-500">소요 시간</div>
        <div className="font-medium">{formatTime(question.timeSpent)}</div>
      </div>
      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  </div>
</div>

{/* 확장된 콘텐츠 */}
{isExpanded && (
  <div className="px-4 pb-4 border-t border-gray-100">
    <div className="pt-4 space-y-4">
      {/* Full Answer, Quick Analysis, Action Button */}
    </div>
  </div>
)}
```

**변경 후**:
```tsx
// 토글 상태 및 함수 제거
// const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
// const toggleQuestionExpansion = (questionId: string) => { ... };

// 단순화된 UI - 토글 없이 항상 표시
<div className="p-4">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm font-medium text-gray-500">Q{index + 1}.</span>
        <Badge className={QUESTION_TYPE_META[question.type]?.color || 'bg-gray-100 text-gray-700'}>
          {QUESTION_TYPE_META[question.type]?.label || '일반'}
        </Badge>
      </div>
      <p className="font-medium mb-2">{question.question}</p>
      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg line-clamp-2">
        {question.answer || '답변이 입력되지 않았습니다.'}
      </p>
    </div>
    <div className="ml-4 flex items-center space-x-4">
      <div className="text-right">
        <div className="text-sm text-gray-500">소요 시간</div>
        <div className="font-medium">{formatTime(question.timeSpent)}</div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleQuestionClick(question)}
        className="flex items-center space-x-1"
      >
        <Eye className="h-3 w-3" />
        <span>상세 분석 보기</span>
      </Button>
    </div>
  </div>
</div>
```

### 46. 면접 결과 페이지 불필요한 import 제거
**파일**: `src/components/InterviewResults.tsx`

**변경 전**:
```tsx
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Home,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
```

**변경 후**:
```tsx
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Home,
  Eye
} from 'lucide-react';
```

### 47. 면접 결과 페이지 레이아웃 재배치
**파일**: `src/components/InterviewResults.tsx`

**변경 전**:
```tsx
// 가로 배치 - 소요 시간과 버튼이 나란히
<div className="ml-4 flex items-center space-x-4">
  <div className="text-right">
    <div className="text-sm text-gray-500">소요 시간</div>
    <div className="font-medium">{formatTime(question.timeSpent)}</div>
  </div>
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleQuestionClick(question)}
    className="flex items-center space-x-1"
  >
    <Eye className="h-3 w-3" />
    <span>상세 분석 보기</span>
  </Button>
</div>
```

**변경 후**:
```tsx
// 세로 배치 - 소요 시간 아래에 버튼 배치
<div className="ml-4 flex flex-col items-end space-y-3">
  <div className="text-right">
    <div className="text-sm text-gray-500">소요 시간</div>
    <div className="font-medium">{formatTime(question.timeSpent)}</div>
  </div>
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleQuestionClick(question)}
    className="flex items-center space-x-1"
  >
    <Eye className="h-3 w-3" />
    <span>상세 분석 보기</span>
  </Button>
</div>
```

