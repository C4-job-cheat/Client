# Employment System

취업 지원을 위한 AI 기반 플랫폼으로, 페르소나 분석, 채용공고 추천, 자기소개서 생성, 면접 연습 등의 기능을 제공합니다.

## 🚀 주요 기능

### 1. 페르소나 관리
- 사용자 프로필 및 역량 분석
- AI 기반 맞춤형 추천 시스템
- 개인화된 취업 로드맵 제공

### 2. 채용공고 추천
- AI 기반 맞춤형 공고 추천
- 관심 공고 스크랩 및 관리
- 상세 공고 정보 제공

### 3. 자기소개서 생성
- AI 기반 자기소개서 작성 도구
- 다양한 템플릿 제공
- 실시간 편집 및 저장

### 4. 면접 연습
- 텍스트 기반 면접 시뮬레이션
- 음성 면접 연습 기능
- 면접 결과 분석 및 피드백

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Backend**: Firebase (Authentication, Firestore)
- **HTTP Client**: Axios
- **UI Components**: Radix UI + Lucide React
- **Animation**: Framer Motion
- **Forms**: React Hook Form

## 📁 프로젝트 구조

```
src/
├── components/           # 페이지 레벨 컴포넌트
│   ├── ui/              # 재사용 가능한 UI 컴포넌트
│   └── figma/           # 피그마 디자인 시스템 컴포넌트
├── context/             # React Context (인증, 상태 관리)
├── hooks/               # 커스텀 훅
├── api/                 # API 클라이언트
├── types/               # TypeScript 타입 정의
├── styles/              # 전역 스타일
└── utils/               # 유틸리티 함수
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **미리보기**
   ```bash
   npm run preview
   ```

5. **린팅**
   ```bash
   npm run lint
   ```

## 🔧 환경 설정

### Firebase 설정
1. Firebase 프로젝트 생성
2. Authentication 설정 (이메일/비밀번호)
3. Firestore 데이터베이스 생성
4. 환경 변수 설정:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 주요 페이지

- **홈**: 메인 대시보드
- **페르소나 설정**: 사용자 프로필 및 역량 분석
- **채용공고 추천**: AI 기반 맞춤형 공고 추천
- **자기소개서 허브**: 자기소개서 관리 및 생성
- **면접 허브**: 면접 연습 및 결과 분석
- **스크랩된 공고**: 관심 공고 관리

## 🎨 디자인 시스템

- **컴포넌트**: shadcn/ui 기반
- **스타일링**: Tailwind CSS
- **아이콘**: Lucide React
- **애니메이션**: Framer Motion

## 🔒 보안

- Firebase Authentication을 통한 사용자 인증
- 환경 변수를 통한 민감한 정보 관리
- HTTPS 통신 보장

## 📝 개발 가이드

### 코딩 스타일
- ESLint 설정 준수
- TypeScript strict 모드 사용
- 함수형 컴포넌트 사용
- 커스텀 훅을 통한 로직 분리

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 과정 또는 보조 도구 변경
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

