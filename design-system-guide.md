# Twenty.com 컴포넌트 분석 가이드

## 개요
Twenty.com 사이트에서 추출한 주요 컴포넌트들을 Hero 섹션을 제외하고 분석한 결과입니다.

## 주요 섹션 분석

### 1. Operating System 섹션 (meet-twenty-section)
**목적**: 제품의 핵심 가치 전달
**클래스**: `framer-1sl4gfa`
**스타일**:
- `padding: 64px 0px`
- `display: flex`
- `gap: 0px`

#### 구성 요소:
1. **메인 헤딩**:
   - H2: "An Operating System" (20px 색상, 56px 크기, 700 두께)
   - H2: "for your customer data" (179,179,179 회색, 56px 크기, 700 두께)

2. **백업 배지**:
   - 텍스트: "Backed by Y Combinator"
   - 스타일: 20px 크기, 중앙 정렬, 회전 변환

3. **설명 텍스트**:
   - 32px 크기, 500 두께, 41.6px 행간
   - 색상: rgb(179, 179, 179)

4. **3단계 프로세스**:
   - **1. Import**: "Import and store large amounts of customer data"
   - **2. Customize**: "Easily adapt the product to your unique needs"
   - **3. Automate**: "Connect to your systems with powerful APIs and Webhooks"

### 2. 기능 카드 섹션들

#### Import 카드 (cardSection1)
**클래스**: `framer-16rrf1y`
**배경색**: `rgb(222, 247, 229)` (연한 녹색)
**테두리**: `16px` 둥근 모서리
**레이아웃**: `display: flex, gap: 24px`

#### Customize 카드 (cardSection3/4)
**클래스**: `framer-1qmzmee`
**배경색**: `rgb(204, 249, 255)` (연한 파란색)
**테두리**: `16px` 둥근 모서리

#### Automate 카드 (cardSection6/7)
**클래스**: `framer-12xiv0l`
**배경색**: `rgb(233, 223, 255)` (연한 보라색)
**테두리**: `16px` 둥근 모서리

### 3. 고객 후기 카드들 (Testimonial Cards)

#### 카드 구조
**클래스**: `framer-us39F framer-nCtzB...` (다중 클래스)
**스타일**:
- `background: rgb(255, 255, 255)`
- `padding: 24px 24px 0px`
- `border-radius: 15px`
- `display: flex`
- `gap: 16px`

#### 후기 카드 구성 요소:
1. **사용자 이름**: 24px, 500 두께, rgb(20, 20, 20)
2. **트위터 핸들**: 16px, 400 두께, rgb(179, 179, 179)
3. **날짜**: 16px, 400 두께, rgb(179, 179, 179)
4. **후기 내용**: 20px, 500 두께, rgb(129, 129, 129)
5. **링크**: 20px, 500 두께, rgb(20, 20, 20)

### 4. Footer 섹션

#### 메인 CTA
**텍스트**: "Take Control" + "Own your CRM"
**스타일**: 대형 헤딩 스타일

#### 버튼 그룹
- "Get Started" 버튼들 (중복 표시)
- "Talk to us" 버튼들 (중복 표시)

#### 회사 로고 그리드
다양한 회사 로고들이 격자 형태로 배치:
- Notion, Slack, Airbnb, Stripe, Figma, Apple, Sequoia 등

## 색상 팔레트

### 주요 색상
- **Primary Black**: `rgb(20, 20, 20)` - 메인 텍스트
- **Secondary Gray**: `rgb(179, 179, 179)` - 보조 텍스트
- **Tertiary Gray**: `rgb(129, 129, 129)` - 설명 텍스트
- **White**: `rgb(255, 255, 255)` - 배경

### 액센트 색상
- **Success Green**: `rgb(222, 247, 229)` - Import 카드
- **Info Blue**: `rgb(204, 249, 255)` - Customize 카드
- **Creative Purple**: `rgb(233, 223, 255)` - Automate 카드
- **Neutral Light**: `rgb(250, 250, 250)` - 섹션 배경

## 타이포그래피

### 폰트 패밀리
**Primary**: `Gabarito, sans-serif`

### 헤딩 계층
- **H2 Large**: 56px, 700 두께, 61.6px 행간
- **H4**: 24px, 500 두께, 33.6px 행간

### 본문 텍스트
- **Large Body**: 20px, 500 두께, 28px 행간
- **Medium Body**: 16px, 400 두께, 24px 행간
- **Caption**: 12px, 400 두께

## 레이아웃 시스템

### 컨테이너 크기
- **Main Container**: `1264.67px` 너비
- **Card Width**: 다양한 크기 (196px, 120px 등)

### 간격 시스템
- **Section Padding**: `64px 0px`, `128px 0px`
- **Card Gap**: `16px`, `24px`, `80px`
- **Element Padding**: `24px`, `8px`

### 테두리 반경
- **Small**: `8px`
- **Medium**: `12px`, `15px`
- **Large**: `16px`
- **Circle**: `50px`

## 컴포넌트 패턴

### 카드 컴포넌트
1. **기능 카드**: 컬러풀한 배경 + 일러스트레이션
2. **후기 카드**: 흰색 배경 + 구조화된 콘텐츠
3. **로고 카드**: 단순한 컨테이너 + 중앙 정렬

### 버튼 패턴
- **Primary**: 검은색 배경 + 흰색 텍스트
- **Secondary**: 흰색 배경 + 검은색 텍스트 + 테두리

### 링크 패턴
- **인라인 링크**: 볼드 처리 + 기본 색상
- **소셜 링크**: @핸들 형태 + 외부 링크

## 반응형 고려사항

### 브레이크포인트별 표시/숨김
- `hidden-88wark`: 모바일에서 숨김
- `hidden-jxqlgx`: 태블릿에서 숨김
- `ssr-variant`: 서버 사이드 렌더링 변형

## 프로젝트 적용 가이드

### 1. Tailwind CSS 색상 확장
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        twenty: {
          primary: 'rgb(20, 20, 20)',
          secondary: 'rgb(179, 179, 179)',
          tertiary: 'rgb(129, 129, 129)',
          success: 'rgb(222, 247, 229)',
          info: 'rgb(204, 249, 255)',
          creative: 'rgb(233, 223, 255)',
          neutral: 'rgb(250, 250, 250)',
        }
      },
      fontFamily: {
        'twenty': ['Gabarito', 'sans-serif'],
      },
      borderRadius: {
        'twenty': '16px',
        'card': '15px',
      }
    },
  },
}
```

### 2. 컴포넌트 예시

#### Operating System 섹션
```tsx
const OperatingSystemSection = () => {
  return (
    <section className="py-16 bg-twenty-neutral">
      <div className="max-w-[1264px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-twenty text-[56px] font-bold leading-[61.6px] text-twenty-primary mb-2">
            An Operating System
          </h2>
          <h2 className="font-twenty text-[56px] font-bold leading-[61.6px] text-twenty-secondary">
            for your customer data
          </h2>
        </div>

        <div className="flex justify-center items-center gap-20">
          {/* 3단계 프로세스 카드들 */}
          <ProcessCard
            number="1"
            title="Import"
            description="Import and store large amounts of customer data"
            bgColor="bg-twenty-success"
          />
          <ProcessCard
            number="2"
            title="Customize"
            description="Easily adapt the product to your unique needs"
            bgColor="bg-twenty-info"
          />
          <ProcessCard
            number="3"
            title="Automate"
            description="Connect to your systems with powerful APIs and Webhooks"
            bgColor="bg-twenty-creative"
          />
        </div>
      </div>
    </section>
  );
};
```

#### 후기 카드
```tsx
const TestimonialCard = ({ name, handle, date, content, links }) => {
  return (
    <div className="bg-white p-6 pb-0 rounded-card flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-twenty text-2xl font-medium text-twenty-primary">
          {name}
        </h3>
        <p className="text-base text-twenty-secondary">{handle}</p>
        <p className="text-base text-twenty-secondary">{date}</p>
      </div>

      <p className="text-xl font-medium text-twenty-tertiary leading-7">
        {content}
      </p>

      {links && (
        <div className="flex gap-2 flex-wrap">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-xl font-medium text-twenty-primary hover:underline"
            >
              {link.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 3. 레이아웃 유틸리티
```tsx
// 섹션 컨테이너
const SectionContainer = ({ children, className = '' }) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-[1264px] mx-auto px-6">
        {children}
      </div>
    </section>
  );
};

// 카드 그리드
const CardGrid = ({ children, columns = 3 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  );
};
```

이 분석을 바탕으로 Twenty.com의 깔끔하고 현대적인 디자인을 프로젝트에 적용할 수 있습니다.