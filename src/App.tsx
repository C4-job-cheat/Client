import { useState } from "react";
import { Home } from "./components/Home";
import { Auth } from "./components/Auth";
import { PersonaSetup } from "./components/PersonaSetup";
import { JobRecommendations } from "./components/JobRecommendations";
import { JobDetail } from "./components/JobDetail";
import { CoverLetterHub } from "./components/CoverLetterHub";
import { CoverLetterSetup } from "./components/CoverLetterSetup";
import { CoverLetterDraft } from "./components/CoverLetterDraft";
import { InterviewHub } from "./components/InterviewHub";
import { InterviewPractice } from "./components/InterviewPractice";
import { InterviewQuestions } from "./components/InterviewQuestions";
import { InterviewResults } from "./components/InterviewResults";
import { ScrapedJobs } from "./components/ScrapedJobs";
import { PersonaWaitingPage } from "./components/PersonaWaitingPage";
import { Onboarding } from "./components/Onboarding";
import { PersonaCompleted } from "./components/PersonaCompleted";
import { Toaster } from "./components/ui/sonner";

// 중앙화된 타입들
import type {
  Page,
  Persona,
  CoverLetter,
  InterviewSession,
  NavigationSource
} from "./types";

// 커스텀 훅들
import { usePersona } from "./hooks/usePersona";
import { useJobScrap } from "./hooks/useJobScrap";


export default function App() {
  // 페이지 관리
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [personaWaitingSource, setPersonaWaitingSource] = 
    useState<NavigationSource>('general');
  const [isNewUser, setIsNewUser] = useState(false);

  // 커스텀 훅 사용
  const {
    personas,
    currentPersona,
    addPersona,
    deletePersona,
    selectPersona,
    setCurrentPersona
  } = usePersona();

  const {
    toggleScrap,
    getScrapedJobs
  } = useJobScrap();

  // 자기소개서 관리
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetter | null>(null);

  // 면접 관리  
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [currentInterviewSession, setCurrentInterviewSession] = useState<InterviewSession | null>(null);
  
  const navigateTo = (page: Page, source?: NavigationSource) => {
    if (page === 'persona-waiting' && source) {
      setPersonaWaitingSource(source);
    }
    setCurrentPage(page);
  };

  const handlePersonaComplete = (persona: Persona) => {
    addPersona(persona);
    setCurrentPage("persona-completed");
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentPage("job-detail");
  };

  const handleToggleScrap = (jobId: string) => {
    if (!currentPersona) return;
    toggleScrap(jobId, currentPersona.id);
  };

  // 현재 페르소나의 스크랩된 공고 가져오기  
  const getCurrentPersonaScrapedJobs = () => {
    return getScrapedJobs(currentPersona?.id);
  };

  const handleCoverLetterComplete = (
    coverLetter: CoverLetter,
  ) => {
    setCoverLetters((prev) => [...prev, coverLetter]);
    setCurrentCoverLetter(coverLetter);
    setCurrentPage("cover-letter-draft");
  };

  const handleCoverLetterUpdate = (
    updatedCoverLetter: CoverLetter,
  ) => {
    setCoverLetters((prev) =>
      prev.map((cl) =>
        cl.id === updatedCoverLetter.id
          ? updatedCoverLetter
          : cl,
      ),
    );
    setCurrentCoverLetter(updatedCoverLetter);
  };

  const handleInterviewStart = (session: InterviewSession) => {
    setCurrentInterviewSession(session);
    setCurrentPage("interview-questions");
  };

  const handleInterviewComplete = (
    completedSession: InterviewSession,
  ) => {
    setInterviewSessions((prev) => [...prev, completedSession]);
    setCurrentInterviewSession(completedSession);
    setCurrentPage("interview-results");
  };

  const handlePersonaDelete = (personaId: string) => {
    deletePersona(personaId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            currentPersona={currentPersona}
            personas={personas}
            scrapedJobs={getCurrentPersonaScrapedJobs()}
            onNavigate={navigateTo}
            onPersonaSelect={selectPersona}
            onJobSelect={handleJobSelect}
            onToggleScrap={handleToggleScrap}
            onPersonaDelete={handlePersonaDelete}
          />
        );
      case "login":
      case "signup":
        return (
          <Auth 
            type={currentPage} 
            onNavigate={navigateTo}
            onUserAuth={setIsNewUser}
          />
        );

      case "onboarding":
        return (
          <Onboarding
            onNavigate={navigateTo}
          />
        );
      case "persona-setup":
        return (
          <PersonaSetup
            onComplete={handlePersonaComplete}
            onNavigate={navigateTo}
          />
        );
      case "persona-completed":
        return (
          <PersonaCompleted
            persona={currentPersona!}
            onNavigate={navigateTo}
            isNewUser={isNewUser}
          />
        );
      case "persona-waiting":
        return (
          <PersonaWaitingPage
            onNavigate={navigateTo}
            source={personaWaitingSource}
          />
        );
      case "job-recommendations":
        return (
          <JobRecommendations
            currentPersona={currentPersona}
            scrapedJobs={getCurrentPersonaScrapedJobs()}
            onNavigate={navigateTo}
            onJobSelect={handleJobSelect}
            onToggleScrap={handleToggleScrap}
          />
        );
      case "job-detail":
        return (
          <JobDetail
            jobId={selectedJobId}
            currentPersona={currentPersona}
            scrapedJobs={getCurrentPersonaScrapedJobs()}
            onNavigate={navigateTo}
            onToggleScrap={handleToggleScrap}
          />
        );
      case "scraped-jobs":
        return (
          <ScrapedJobs
            currentPersona={currentPersona}
            scrapedJobs={getCurrentPersonaScrapedJobs()}
            onNavigate={navigateTo}
            onJobSelect={handleJobSelect}
          />
        );
      case "cover-letter-hub":
        return (
          <CoverLetterHub
            currentPersona={currentPersona}
            coverLetters={coverLetters}
            onNavigate={navigateTo}
            onCoverLetterSelect={setCurrentCoverLetter}
          />
        );
      case "cover-letter":
        return (
          <CoverLetterSetup
            currentPersona={currentPersona}
            onNavigate={navigateTo}
            onComplete={handleCoverLetterComplete}
          />
        );
      case "cover-letter-draft":
        return (
          <CoverLetterDraft
            coverLetter={currentCoverLetter}
            onNavigate={navigateTo}
            onUpdate={handleCoverLetterUpdate}
          />
        );
      case "interview-hub":
        return (
          <InterviewHub
            currentPersona={currentPersona}
            personas={personas}
            interviewSessions={interviewSessions}
            onNavigate={navigateTo}
            onSessionSelect={setCurrentInterviewSession}
          />
        );
      case "interview-practice":
        return (
          <InterviewPractice
            currentPersona={currentPersona}
            coverLetters={coverLetters}
            onNavigate={navigateTo}
            onStart={handleInterviewStart}
          />
        );
      case "interview-questions":
        return (
          <InterviewQuestions
            session={currentInterviewSession}
            onNavigate={navigateTo}
            onComplete={handleInterviewComplete}
          />
        );
      case "interview-results":
        return (
          <InterviewResults
            session={currentInterviewSession}
            onNavigate={navigateTo}
          />
        );
      default:
        return (
          <Home
            currentPersona={currentPersona}
            personas={personas}
            scrapedJobs={getCurrentPersonaScrapedJobs()}
            onNavigate={navigateTo}
            onPersonaSelect={setCurrentPersona}
            onJobSelect={handleJobSelect}
            onToggleScrap={handleToggleScrap}
            onPersonaDelete={handlePersonaDelete}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {renderCurrentPage()}
      <Toaster />
    </div>
  );
}
