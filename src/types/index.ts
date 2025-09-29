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
  | "voice-interview-questions"
  | "interview-results";

// 페르소나 API 타입
export interface PersonaData {
  job_category: string;
  job_role?: string;
  school_name?: string;
  major?: string;
  skills?: string[];
  certifications?: string[];
  html_file?: File;
}

// 서버 응답 타입 (실제 API 응답)
export interface ServerPersonaResponse {
  id: string;
  user_id: string;
  job_category: string;
  job_role?: string;
  school_name?: string;
  major?: string;
  skills?: string[];
  certifications?: string[];
  html_file_path: string;
  html_content_type: string;
  html_file_size: number;
  json_file_path: string;
  json_content_type: string;
  json_file_size: number;
  conversations_count: number;
  html_file_deleted: boolean;
  embedding_status: string;
  embedding_message: string;
  embeddings_count: number;
  has_embeddings: boolean;
  vectorized_competency_tags: string[];
  embedding_started_at: string | null;
  embedding_completed_at: string | null;
  core_competencies: Array<{
    name: string;
    level: string;
    description: string;
  }>;
  created_at: string;
  updated_at: string;
}

// 클라이언트에서 사용하는 페르소나 타입
export interface PersonaResponse {
  persona_id: string;
  user_id: string;
  job_category: string;
  job_role?: string;
  school_name?: string;
  major?: string;
  skills?: string[];
  certifications?: string[];
  html_file_path: string;
  html_content_type: string;
  html_file_size: number;
  json_file_path: string;
  json_content_type: string;
  json_file_size: number;
  conversations_count: number;
  html_file_deleted: boolean;
  embedding_status: string;
  embedding_message: string;
  embeddings_count: number;
  has_embeddings: boolean;
  vectorized_competency_tags: string[];
  embedding_started_at: string | null;
  embedding_completed_at: string | null;
  core_competencies: Array<{
    name: string;
    level: string;
    description: string;
  }>;
  created_at: string;
  updated_at: string;
}

// 페르소나 타입
export interface PersonaEducationInfo {
  level: string;
  school: string;
  major: string;
}

export interface PersonaSkillsInfo {
  techStack: string[];
  certifications: string[];
}



// 자기소개서 생성 API 요청 타입
export interface CoverLetterCreateRequest {
  user_id: string;
  persona_id: string;
  company_name: string;
  strengths: string;
  activities: string;
  style: string;
}

// 자기소개서 생성 API 응답 타입
export interface CoverLetterParagraph {
  paragraph: string;
  reason: string;
}

export interface CoverLetterCreateResponse {
  id: string;
  company_name: string;
  user_id: string;
  persona_id: string;
  cover_letter: CoverLetterParagraph[];
  style: string;
  character_count: number;
  created_at: string;
  updated_at: string;
}

// 자기소개서 상세 조회 API 응답 타입 (생성과 동일한 구조)
export interface CoverLetterDetailResponse {
  id: string;
  company_name: string;
  user_id: string;
  persona_id: string;
  cover_letter: CoverLetterParagraph[];
  style: string;
  character_count: number;
  created_at: string;
  updated_at: string;
}

// 자기소개서 목록 API 응답 타입
export interface CoverLetterListItem {
  id: string;
  company_name: string;
  created_at: string;
  character_count: number;
  style: string;
}

export interface CoverLetterListResponse {
  cover_letters: CoverLetterListItem[];
  total_count: number;
  persona_card: {
    school: string;
    major: string;
    job_category: string;
    job_title: string;
    skills: string[];
    certifications: string[];
  };
}

// 자기소개서 작성 페이지 API 응답 타입
export interface CoverLetterPersonaResponse {
  persona_card: {
    school: string;
    major: string;
    job_category: string;
    job_title: string;
    skills: string[];
    certifications: string[];
  };
}

// 스크랩된 공고 목록 API 응답 타입
export interface ScrapedJob {
  job_posting_id: string;
  company_name: string;
  job_category: string;
  job_title: string;
  location: string;
  requirements: string[];
  preferred: string[];
  deadline: string;
  image_url: string;
  company_logo: string;
  job_description: string;
}

export interface ScrapedJobsResponse {
  success: boolean;
  scraped_jobs: ScrapedJob[];
  total_count: number;
  persona_card: {
    user_id: string;
    persona_id: string;
    job_category: string;
    job_role: string;
    school_name: string;
    major: string;
    skills: string[];
    certifications: string[];
  };
}

// 스크랩 API 응답 타입
export interface ScrapResponse {
  success: boolean;
  message: string;
  scrap_count?: number;
}

// 공고 상세 정보 API 응답 타입
export interface JobDetailResponse {
  job_posting: {
    benefits: string[];
    job_category: string;
    company_logo: string;
    title: string;
    hires_count: number;
    job_title: string;
    required_qualifications: string[];
    company_name: string;
    required_competencies: Record<string, number>;
    preferred_qualifications: string[];
    application_deadline: string;
    work_conditions: {
      location: string;
      employment_type: string;
      position: string;
    };
    job_description: string;
    registration_date: string;
    preferred: string[];
    requirements: string[];
    ideal_candidate: string[];
  };
  recommendation: {
    recommendation_score: number;
    reason_summary: {
      match_points: string[];
      improvement_points: string[];
      growth_suggestions: string[];
    };
  };
  cover_letter_preview: string;
}

// 공고 추천 API 응답 타입
export interface JobRecommendationResponse {
  persona_card: {
    school: string;
    major: string;
    job_category: string;
    job_title: string;
    skills: string[];
    certifications: string[];
  };
  competency: {
    details: Record<string, {
      score: number;
      score_explanation: string;
      key_insights: string[];
      evaluated_at: string;
    }>;
    final_evaluation: string;
  };
  recommendations: Array<{
    job_posting_id: string;
    recommendation_score: number;
    company_name: string;
    company_logo: string;
    job_category: string;
    job_title: string;
    location: string;
    application_deadline: string;
  }>;
  total_count: number;
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
  serverData?: CoverLetterCreateResponse | CoverLetterDetailResponse; // 서버 데이터를 별도로 저장
}

// 면접 답변 제출 API 요청 타입 (텍스트)
export interface InterviewAnswerSubmitRequest {
  persona_id: string;
  interview_session_id: string;
  question_id: string;
  question_number: number;
  answer_text: string;
  time_taken: number;
}

// 면접 답변 제출 API 요청 타입 (음성) - FormData로 전송
export interface InterviewAnswerSubmitVoiceRequest {
  persona_id: string;
  interview_session_id: string;
  question_id: string;
  question_number: number;
  audio_file: File;
  time_taken: number;
}

// 다음 질문 응답 타입
export interface NextQuestionResponse {
  question_id: string;
  question_number: number;
  question_type: string;
  question_text: string;
}

// 면접 완료 응답 타입
export interface InterviewCompletedQuestion {
  question_id: string;
  question_number: number;
  question_type: string;
  question_text: string;
  answer_text: string;
  time_taken: number;
}

export interface InterviewCompletedResponse {
  interview_session_id: string;
  user_id: string;
  persona_id: string;
  total_questions: number;
  total_time: number;
  average_answer_time: number;
  total_answers: number;
  average_answer_length: number;
  score: number;
  grade: string;
  status: string;
  use_voice: boolean;
  questions: InterviewCompletedQuestion[];
  final_good_points: string[];
  final_improvement_points: string[];
  created_at: string;
  updated_at: string;
  completed_at: string;
}

// 면접 질문 생성 API 요청 타입
export interface InterviewQuestionGenerateRequest {
  persona_id: string;
  cover_letter_id?: string;
  use_voice: boolean;
}

// 면접 질문 생성 API 응답 타입
export interface InterviewQuestion {
  question_id: string;
  question_number: number;
  question_type: string;
  question_text: string;
}

export interface InterviewQuestionGenerateResponse {
  interview_session_id: string;
  question: InterviewQuestion;
}

// 면접 준비 데이터 API 응답 타입
export interface InterviewPreparationCoverLetter {
  id: string;
  company_name: string;
  created_at: string;
  character_count: number;
  style: string;
}

export interface InterviewPreparationResponse {
  persona_card: {
    school: string;
    major: string;
    job_category: string;
    job_title: string;
    skills: string[];
    certifications: string[];
  };
  cover_letters: InterviewPreparationCoverLetter[];
}

// 면접 연습 기록 응답 타입
export interface InterviewHistoryResponse {
  total_sessions: number;
  average_score: number;
  highest_score: number;
  total_practice_time: number;
  sessions: InterviewHistorySession[];
  persona_card: {
    school: string;
    major: string;
    job_category: string;
    job_title: string;
    skills: string[];
    certifications: string[];
  };
}

export interface InterviewHistorySession {
  interview_session_id: string;
  score: number;
  grade: string;
  total_time: number;
  created_at: string;
  completed_at: string;
}

// 면접 질문 상세 조회 응답 타입
export interface InterviewQuestionDetailResponse {
  id: string;
  question_id: string;
  question_number: number;
  question_type: string;
  question_text: string;
  answer_text: string;
  answer_length: number;
  time_taken: number;
  is_answered: boolean;
  question_score: number;
  good_points: string[];
  improvement_points: string[];
  sample_answer: string;
  question_intent: string[];
  created_at: string;
  updated_at: string;
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
    questionNumber: number;
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

export interface JobProps {
  selectedJobId?: string | null;
  scrapedJobs?: Set<string>;
  onJobSelect?: (jobId: string) => void;
  onToggleScrap?: (jobId: string) => void;
}

