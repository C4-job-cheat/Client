// 페이지 타입
export type Page =
  | "home"
  | "login"
  | "signup"
  | "onboarding"
  | "persona-setup"
  | "persona-completed"
  | "persona-waiting"
  | "job-recommendations"
  | "job-detail"
  | "scraped-jobs"
  | "cover-letter-hub"
  | "cover-letter"
  | "cover-letter-draft"
  | "interview-hub"
  | "interview-practice"
  | "interview-questions"
  | "voice-interview-guide"
  | "voice-interview-questions"
  | "interview-results";

// 페르소나 타입
export interface Persona {
  id: string;
  jobCategory: string;
  experience: {
    hasExperience: boolean;
    years?: number;
  };
  education: {
    level: string;
    major?: string;
  };
  preferredRegions: string[];
  minSalary: number;
  languages: Array<{
    language: string;
    level: string;
  }>;
  workStyle: {
    location: string;
    type: string;
  };
  certifications: string[];
  achievements: string;
  categorySpecific: Record<string, any>;
  description: string;
}

// 공고 타입
export interface Job {
  id: string;
  company: string;
  title: string;
  field: string;
  matchScore: number;
  requirements: {
    expertise: number;        // 직무 전문성
    potential: number;        // 성장 잠재력
    problemSolving: number;   // 문제 해결력
    collaboration: number;    // 협업 능력
    adaptability: number;     // 적응력
  };
  details: {
    location: string;
    employmentType: string;
    registeredDate: string;
    deadline: string;
    description: string;
    jobDescription?: string;
    requiredSkills?: string[];  // 기술 스택과 자격증을 통합
    education?: string;
    techStack?: string[];
    certifications?: string[];
  };
  aiReason?: string;
  logoUrl?: string;
}

// 자기소개서 타입
export interface CoverLetterParagraph {
  id: string;
  text: string;
  explanation: string;
}

export interface CoverLetter {
  id: string;
  personaId: string;
  targetCompany: string;
  jobId?: string;
  strengths: string;
  experience: string;
  style: "experience" | "knowledge" | "creative";
  content: string;
  paragraphs?: CoverLetterParagraph[];
  createdAt: string;
}

// 면접 세션 타입
export interface InterviewSession {
  id: string;
  personaId: string;
  useCoverLetter: boolean;
  coverLetterId?: string;
  useVoiceInterview?: boolean;
  questions: Array<{
    id: string;
    question: string;
    answer: string;
    type: "cover-letter" | "job-knowledge" | "ai-recommended";
    timeSpent: number;
  }>;
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  completedAt: string;
}

// 공통 네비게이션 타입
export type NavigationSource = 'cover-letter' | 'interview' | 'scraped-jobs' | 'general';

// 공통 Props 타입들
export interface BaseNavigationProps {
  onNavigate: (page: Page, source?: NavigationSource) => void;
}

export interface PersonaProps {
  currentPersona: Persona | null;
}

export interface JobProps {
  selectedJobId?: string | null;
  scrapedJobs?: Set<string>;
  onJobSelect?: (jobId: string) => void;
  onToggleScrap?: (jobId: string) => void;
}

