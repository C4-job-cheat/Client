# 디자인 시스템 실제 적용 가이드

## 🎯 현재 프로젝트에 즉시 적용 가능한 개선사항

### 1. Tailwind Config 업데이트

먼저 `tailwind.config.js` 파일을 업데이트하세요:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 크롤링된 디자인 시스템 색상 적용
        brand: {
          primary: 'rgb(129, 140, 248)',
          secondary: 'rgb(79, 70, 229)',
          accent: 'rgb(0, 172, 48)',
        },
        neutral: {
          50: 'rgb(250, 250, 250)',
          100: 'rgb(241, 241, 241)',
          200: 'rgb(235, 235, 235)',
          300: 'rgb(209, 213, 219)',
          400: 'rgb(156, 163, 175)',
          500: 'rgb(129, 129, 129)',
          600: 'rgb(71, 71, 71)',
          700: 'rgb(51, 51, 51)',
          800: 'rgb(33, 33, 33)',
          900: 'rgb(20, 20, 20)',
          950: 'rgb(17, 17, 17)',
        },
        dark: {
          900: 'rgb(17, 17, 17)',
          800: 'rgb(33, 33, 33)',
          700: 'rgb(51, 51, 51)',
          600: 'rgb(71, 71, 71)',
          500: 'rgb(129, 129, 129)',
          400: 'rgb(156, 163, 175)',
          300: 'rgb(209, 213, 219)',
        }
      },
      fontFamily: {
        'heading': ['Gabarito', 'sans-serif'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'button': '0 3px 0 0 rgb(20 20 20)',
        'button-hover': '0 1px 0 0 rgb(20 20 20)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'ring': '0 0 0 2px rgb(129 140 248)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(129, 140, 248) 0%, rgb(79, 70, 229) 100%)',
        'gradient-accent': 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(217, 70, 239) 100%)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
      }
    },
  },
  plugins: [],
}
```

### 2. CSS 변수 설정

`src/index.css`에 CSS 변수를 추가하세요:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 디자인 시스템 폰트 import */
@import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

:root {
  /* 색상 */
  --color-brand-primary: rgb(129, 140, 248);
  --color-brand-secondary: rgb(79, 70, 229);
  --color-brand-accent: rgb(0, 172, 48);

  /* 중성 색상 */
  --color-neutral-50: rgb(250, 250, 250);
  --color-neutral-100: rgb(241, 241, 241);
  --color-neutral-200: rgb(235, 235, 235);
  --color-neutral-300: rgb(209, 213, 219);
  --color-neutral-400: rgb(156, 163, 175);
  --color-neutral-500: rgb(129, 129, 129);
  --color-neutral-600: rgb(71, 71, 71);
  --color-neutral-700: rgb(51, 51, 51);
  --color-neutral-800: rgb(33, 33, 33);
  --color-neutral-900: rgb(20, 20, 20);
  --color-neutral-950: rgb(17, 17, 17);

  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 64px;

  /* 테두리 반경 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* 그림자 */
  --shadow-button: 0 3px 0 0 rgb(20 20 20);
  --shadow-button-hover: 0 1px 0 0 rgb(20 20 20);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* 다크 모드 */
.dark {
  --color-background: rgb(17, 17, 17);
  --color-surface: rgb(33, 33, 33);
  --color-border: rgb(51, 51, 51);
  --color-text: rgb(242, 242, 242);
  --color-text-secondary: rgb(156, 163, 175);
}

/* 글로벌 스타일 */
body {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  color: var(--color-neutral-900);
  background-color: var(--color-neutral-50);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Gabarito', sans-serif;
  font-weight: 600;
}

.display-text {
  font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
}
```

### 3. 컴포넌트 스타일 가이드

#### 개선된 버튼 컴포넌트

```tsx
// src/components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const buttonVariants = cva(
  "font-body font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-neutral-900 text-white shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-50",
        gradient: "bg-gradient-primary text-white hover:opacity-90 shadow-md",
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        outline: "border border-neutral-300 bg-white hover:bg-neutral-50 hover:text-neutral-900"
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-button",
        md: "px-6 py-3 text-base rounded-button",
        lg: "px-8 py-4 text-lg rounded-button"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 개선된 카드 컴포넌트

```tsx
// src/components/ui/Card.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const cardVariants = cva(
  "bg-white border rounded-card transition-shadow duration-200",
  {
    variants: {
      variant: {
        default: "border-neutral-200 shadow-card",
        featured: "border-brand-primary border-2 shadow-lg",
        elevated: "border-neutral-200 shadow-lg hover:shadow-xl"
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md"
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card, cardVariants }
```

#### 개선된 입력 컴포넌트

```tsx
// src/components/ui/Input.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const inputVariants = cva(
  "font-body w-full bg-white border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-neutral-300 text-neutral-900 placeholder-neutral-500",
        error: "border-red-300 text-red-900 placeholder-red-400 focus:ring-red-500"
      },
      size: {
        sm: "px-3 py-2 text-sm rounded-input",
        md: "px-4 py-3 text-base rounded-input",
        lg: "px-4 py-4 text-lg rounded-input"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
```

### 4. 기존 컴포넌트 업데이트 예시

#### PersonaCard 업데이트

```tsx
// src/components/PersonaCard.tsx
const PersonaCard = ({ persona, className = '', expanded = false }: PersonaCardProps) => {
  if (expanded) {
    return (
      <Card variant="featured" padding="lg" className={`hover:shadow-xl transition-shadow duration-300 ${className}`}>
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl font-bold text-neutral-900">{persona.jobCategory}</h3>
              <p className="font-body text-lg text-neutral-600">{specificJob}</p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 학력 정보 */}
            <div className="space-y-3">
              <h4 className="font-heading font-semibold text-neutral-900">학력 정보</h4>
              <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">학력</span>
                  <span className="font-medium">{persona.education.level}</span>
                </div>
                {persona.education.major && (
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">전공</span>
                    <Badge variant="outline">{persona.education.major}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* 기술 스택 */}
            {mainStrengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-heading font-semibold text-neutral-900">보유 기술</h4>
                <div className="flex flex-wrap gap-2">
                  {mainStrengths.map((strength, index) => (
                    <Badge key={index} className="bg-brand-primary text-white">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="elevated" className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="space-y-4">
        {/* 기존 내용을 디자인 시스템에 맞게 업데이트 */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-neutral-900">{persona.jobCategory}</h3>
            <p className="font-body text-neutral-600">{specificJob}</p>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-neutral-400" />
            <span className="font-body text-sm text-neutral-600">{persona.education.level}</span>
            {persona.education.major && (
              <Badge variant="outline" className="text-xs">
                {persona.education.major}
              </Badge>
            )}
          </div>

          {mainStrengths.length > 0 && (
            <div className="flex items-start space-x-2">
              <Award className="h-4 w-4 text-neutral-400 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {mainStrengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
```

### 5. 페이지 레벨 개선

#### Home 페이지 업데이트

```tsx
// src/components/Home.tsx
const Home = ({ currentPersona, personas, scrapedJobs, onNavigate, onPersonaSelect, onJobSelect, onToggleScrap }: HomeProps) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 네비게이션 바 */}
      <nav className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-neutral-900">
              취업이ver.2
            </h1>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm">로그인</Button>
              <Button variant="primary" size="sm">회원가입</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-5xl font-bold text-white mb-6">
            AI가 추천하는
            <br />
            당신만의 맞춤 공고
          </h2>
          <p className="font-body text-xl text-blue-100 mb-8">
            개인화된 페르소나 분석으로 가장 적합한 채용공고를 찾아보세요
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => currentPersona ? onNavigate('job-recommendations') : onNavigate('persona-setup')}
            className="font-body text-lg px-8 py-4"
          >
            지금 시작하기 →
          </Button>
        </div>
      </section>

      {/* 기능 카드 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl font-bold text-neutral-900 mb-4">
              모든 취업 과정을 한 곳에서
            </h3>
            <p className="font-body text-lg text-neutral-600">
              페르소나 생성부터 면접 준비까지, 완전한 취업 솔루션
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="featured" padding="lg" className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
                맞춤 공고 추천
              </h4>
              <p className="font-body text-neutral-600">
                AI가 분석한 당신의 페르소나에 맞는 최적의 채용공고를 추천합니다
              </p>
            </Card>

            <Card variant="featured" padding="lg" className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
                자동 자기소개서
              </h4>
              <p className="font-body text-neutral-600">
                페르소나 정보를 바탕으로 맞춤형 자기소개서를 자동으로 생성합니다
              </p>
            </Card>

            <Card variant="featured" padding="lg" className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
                AI 면접 연습
              </h4>
              <p className="font-body text-neutral-600">
                실제 면접과 같은 환경에서 연습하고 개선점을 받아보세요
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
```

### 6. 즉시 적용 가능한 개선사항

1. **색상 일관성**: 모든 컴포넌트에서 `neutral-*`, `brand-*` 색상 사용
2. **타이포그래피**: `font-heading`, `font-body`, `font-display` 클래스 활용
3. **간격 통일**: Tailwind의 spacing scale 일관성 있게 사용
4. **인터랙션**: hover, focus 상태에 대한 일관된 피드백
5. **그림자**: `shadow-card`, `shadow-button` 등 정의된 그림자 사용

### 7. 성능 최적화

```javascript
// tailwind.config.js에 추가
module.exports = {
  // ... 기존 설정
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    // 사용하지 않는 CSS 제거
    safelist: [
      'bg-gradient-primary',
      'bg-gradient-accent',
      // 동적으로 생성되는 클래스들
    ]
  },
  // JIT 모드 활성화
  mode: 'jit',
}
```

이 가이드를 따라 구현하면 일관성 있고 현대적인 디자인 시스템을 갖춘 애플리케이션을 만들 수 있습니다.