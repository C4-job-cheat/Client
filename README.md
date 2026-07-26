# Job-Cheat Client

> ChatGPT 대화에서 발견한 나의 역량으로 취업 준비의 다음 단계를 설계하는 웹 클라이언트

Job-Cheat은 취업 준비 과정에 흩어진 역량 분석, 채용공고 탐색, 자기소개서 작성, 모의면접을 하나의 흐름으로 연결합니다. 이 저장소는 Google 로그인과 Firebase 인증 토큰을 기반으로 API 서버와 통신하고, 사용자가 페르소나를 만들고 맞춤형 취업 준비 기능을 이용하는 React 웹 애플리케이션입니다.

## ✨ 주요 기능

| 기능 | 설명 |
| --- | --- |
| Google 로그인 | Google 계정으로 로그인하고 Firebase ID 토큰을 API 요청에 연동합니다. |
| 페르소나 생성 | 희망 직군·직무, 학력, 기술·자격과 ChatGPT 대화 HTML을 제출해 취업 페르소나를 만듭니다. |
| 맞춤 공고 추천 | 현재 페르소나를 기준으로 추천 공고 목록과 상세 정보를 확인하고 스크랩을 관리합니다. |
| AI 자기소개서 | 페르소나 정보를 바탕으로 자기소개서 초안을 만들고, 저장된 문서를 다시 확인합니다. |
| 모의면접 | 맞춤 질문으로 텍스트 또는 음성 면접을 진행하고 답변별 결과와 피드백을 확인합니다. |
| 취업 준비 허브 | 홈, 페르소나, 스크랩 공고, 자기소개서, 면접 기록을 화면 흐름 안에서 관리합니다. |

## 🧭 설계 방향

- **인증과 서비스 API의 분리:** Firebase Authentication으로 사용자 인증을 처리하고, Axios 인터셉터가 Firebase ID 토큰을 별도 API 서버 요청에 자동으로 추가합니다.
- **페르소나 중심 경험:** 선택한 페르소나를 브라우저에 유지하고, 공고·자기소개서·면접 기능이 동일한 페르소나 정보를 기준으로 동작하도록 구성합니다.

## 🛠 기술 스택

| Category | 기술 |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 7 |
| Styling & UI | Tailwind CSS, shadcn/ui, Radix UI, Lucide React |
| State & Form | React Context, Custom Hooks, React Hook Form |
| Data Visualization & Motion | Recharts, Framer Motion |
| Auth | Firebase Authentication, GoogleAuthProvider |
| API | Axios, Firebase ID Token 기반 Bearer 인증 |
| Testing & Build | ESLint, TypeScript, Vite |

## 📁 프로젝트 구조

```text
Client/
├── public/                 # 로고와 화면 안내용 정적 자산
├── src/
│   ├── api/                # Axios 클라이언트와 도메인별 API 서비스
│   ├── components/         # 페이지·기능 컴포넌트 및 재사용 UI
│   ├── context/            # Firebase 인증 상태 컨텍스트
│   ├── hooks/              # 페르소나·스크랩 상태 훅
│   ├── styles/             # 전역 스타일
│   ├── types/              # API·화면 공용 TypeScript 타입
│   ├── utils/              # 문자열·날짜 유틸리티
│   ├── App.tsx             # 화면 전환과 상위 상태 관리
│   └── firebase.ts         # Firebase 앱과 Google 인증 설정
├── package.json            # 스크립트와 의존성
├── vite.config.ts          # Vite 설정
└── tailwind.config.js      # Tailwind 설정
```

## 🚀 시작하기

### 요구 사항

- Node.js `20.19.0` 이상 또는 `22.12.0` 이상
- npm
- Google 로그인이 활성화된 Firebase 프로젝트
- Job-Cheat API 서버 주소

### 1. 저장소 내려받기

```bash
git clone https://github.com/C4-job-cheat/Client.git
cd Client
```

### 2. 설정하기

예제 파일을 복사해 `.env.local`을 만들고 Firebase 웹 앱 설정과 API 서버 주소를 입력합니다. 실제 키나 인증 정보는 저장소에 커밋하지 않습니다.

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Firebase 웹 설정값은 브라우저에 전달되므로 비밀값으로 취급하지 않습니다. 대신 Firebase Console의 Authorized Domains를 운영 도메인으로 제한하고, API 서버에서는 Firebase ID 토큰을 반드시 검증해야 합니다. 운영 API 주소에는 HTTPS를 사용합니다.

의존성을 설치합니다.

```bash
npm ci
```

### 3. 실행하기

```bash
npm run dev
```

Vite가 출력한 로컬 개발 서버 주소로 접속합니다. API 서버가 다른 주소에서 실행 중이면 `VITE_API_BASE`를 해당 주소로 설정해야 합니다.

### 4. 검증하기

```bash
npm run lint
npm run build
```

## 🔒 보안

환경변수·인증서·서비스 계정 파일·사용자 대화 원문은 커밋하지 않습니다. 취약점 제보 절차와 공개 전환 점검 항목은 [SECURITY.md](SECURITY.md)를 참고하세요.

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.
