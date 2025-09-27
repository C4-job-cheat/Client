import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from './ui/label';
import { ArrowLeft, MessageCircle, FileText, User, Play, Mic } from 'lucide-react';
import type { Page, Persona, CoverLetter, InterviewSession } from '../types';

interface InterviewPracticeProps {
  currentPersona: Persona | null;
  coverLetters: CoverLetter[];
  onNavigate: (page: Page) => void;
  onStart: (session: InterviewSession) => void;
}

export function InterviewPractice({ currentPersona, coverLetters, onNavigate, onStart }: InterviewPracticeProps) {
  const [useCoverLetter, setUseCoverLetter] = useState(false);
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<string>('');
  const [useVoiceInterview, setUseVoiceInterview] = useState(false);

  if (!currentPersona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">페르소나가 필요해요</h2>
          <p className="text-gray-600 mb-6">
            면접 연습을 시작하기 위해 먼저 페르소나를 설정해주세요
          </p>
          <Button onClick={() => onNavigate('persona-setup')}>
            페르소나 설정하기
          </Button>
        </div>
      </div>
    );
  }

  const availableCoverLetters = coverLetters.filter(cl => cl.personaId === currentPersona.id);

  const handleStart = () => {
    const session: InterviewSession = {
      id: Date.now().toString(),
      personaId: currentPersona.id,
      useCoverLetter,
      coverLetterId: useCoverLetter ? selectedCoverLetterId : undefined,
      questions: generateQuestions(),
      score: 0,
      feedback: { strengths: [], improvements: [], suggestions: [] },
      completedAt: '',
      useVoiceInterview // 음성 면접 여부 추가
    };

    // 음성 면접인 경우 안내 페이지로 이동, 아니면 바로 시작
    if (useVoiceInterview) {
      onStart(session);
      onNavigate('voice-interview-guide');
    } else {
      onStart(session);
    }
  };

  const generateQuestions = () => {
    const baseQuestions = [
      {
        id: '1',
        question: '간단한 자기소개를 부탁드립니다.',
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      },
      {
        id: '2',
        question: `${currentPersona.jobCategory} 분야를 선택한 이유가 무엇인가요?`,
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      },
      {
        id: '3',
        question: '본인의 가장 큰 장점과 단점은 무엇인가요?',
        answer: '',
        type: 'ai-recommended' as const,
        timeSpent: 0
      },
      {
        id: '4',
        question: '팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하시나요?',
        answer: '',
        type: 'ai-recommended' as const,
        timeSpent: 0
      },
      {
        id: '5',
        question: '5년 후 본인의 모습을 어떻게 그리고 계시나요?',
        answer: '',
        type: 'ai-recommended' as const,
        timeSpent: 0
      }
    ];

    const coverLetterQuestions = useCoverLetter && selectedCoverLetterId ? [
      {
        id: 'cl-1',
        question: '자기소개서에서 언급하신 강점에 대해 구체적인 사례를 들어주세요.',
        answer: '',
        type: 'cover-letter' as const,
        timeSpent: 0
      },
      {
        id: 'cl-2',
        question: '자기소개서에 적으신 프로젝트 경험에 대해 자세히 설명해주세요.',
        answer: '',
        type: 'cover-letter' as const,
        timeSpent: 0
      }
    ] : [];

    const jobSpecificQuestions = currentPersona.jobCategory === 'IT/개발' ? [
      {
        id: 'job-1',
        question: '가장 최근에 사용해본 기술 스택에 대해 설명해주세요.',
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      },
      {
        id: 'job-2',
        question: '코드 리뷰의 중요성에 대해 어떻게 생각하시나요?',
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      }
    ] : currentPersona.jobCategory === '디자인' ? [
      {
        id: 'job-1',
        question: '디자인 트렌드를 어떻게 파악하고 적용하시나요?',
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      },
      {
        id: 'job-2',
        question: '사용자 경험(UX)과 사용자 인터페이스(UI)의 차이점은 무엇인가요?',
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      }
    ] : [
      {
        id: 'job-1',
        question: `${currentPersona.jobCategory} 분야에서 가장 중요하다고 생각하는 역량은 무엇인가요?`,
        answer: '',
        type: 'job-knowledge' as const,
        timeSpent: 0
      }
    ];

    const creativeQuestions = [
      {
        id: 'creative-1',
        question: '만약 무인도에 3가지만 가져갈 수 있다면 무엇을 선택하시겠어요?',
        answer: '',
        type: 'ai-recommended' as const,
        timeSpent: 0
      },
      {
        id: 'creative-2',
        question: '본인을 동물에 비유한다면 무엇이고, 그 이유는 무엇인가요?',
        answer: '',
        type: 'ai-recommended' as const,
        timeSpent: 0
      }
    ];

    const allQuestions = [
      ...baseQuestions,
      ...coverLetterQuestions,
      ...jobSpecificQuestions,
      ...creativeQuestions
    ];

    // Return random 10 questions
    return allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Button>
          <h1 className="font-semibold">면접 연습하기</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Persona Info */}
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

          {/* Cover Letter Selection */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">자기소개서 연동</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-cover-letter"
                  checked={useCoverLetter}
                  onCheckedChange={(checked) => {
                    setUseCoverLetter(checked as boolean);
                    if (!checked) setSelectedCoverLetterId('');
                  }}
                />
                <Label htmlFor="use-cover-letter">자기소개서 기반 질문 포함하기</Label>
              </div>
              
              {useCoverLetter && (
                <div className="ml-6 space-y-3">
                  {availableCoverLetters.length === 0 ? (
                    <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 inline mr-2" />
                      작성된 자기소개서가 없습니다.
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => onNavigate('cover-letter-hub')}
                        className="ml-2 p-0 h-auto"
                      >
                        자기소개서 관리
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-sm">사용할 자기소개서를 선택하세요</Label>
                      {availableCoverLetters.map((cl) => (
                        <div
                          key={cl.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedCoverLetterId === cl.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedCoverLetterId(cl.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{cl.targetCompany}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {cl.style}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(cl.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Voice Interview Option */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">면접 방식 선택</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-voice-interview"
                  checked={useVoiceInterview}
                  onCheckedChange={(checked: CheckedState) => setUseVoiceInterview(checked === true)}
                />
                <Label htmlFor="use-voice-interview" className="flex items-center space-x-2">
                  <Mic className="h-4 w-4" />
                  <span>음성으로 테스트 보기</span>
                </Label>
              </div>
              
              {useVoiceInterview && (
                <div className="ml-6 space-y-3">
                  <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        <span>질문이 음성으로 재생되고, 음성이 끝나면 자동으로 녹음이 시작됩니다</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        <span>1분 타이머가 작동하며, 시간 초과 시 자동으로 다음 질문으로 넘어갑니다</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        <span>답변 완료 후 "다음 질문 듣기" 버튼을 클릭하면 다음 질문이 재생됩니다</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    ⚠️ 음성 기능을 사용하려면 마이크 권한이 필요합니다. 브라우저에서 마이크 접근을 허용해주세요.
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Interview Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">면접 연습 안내</h2>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <span className="font-medium">총 10개 질문</span>이 준비되어 있습니다.
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <div>
                  각 질문마다 <span className="font-medium">1분의 답변 시간</span>이 주어집니다.
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <div>
                  질문 유형: 자기소개서 기반, 직무 지식, AI 추천 질문
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">4</span>
                </div>
                <div>
                  완료 후 <span className="font-medium">100점 만점 평가</span>와 상세 피드백을 제공합니다.
                </div>
              </div>
            </div>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={handleStart}
              size="lg"
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700"
              disabled={useCoverLetter && availableCoverLetters.length > 0 && !selectedCoverLetterId}
            >
              <Play className="h-5 w-5 mr-2" />
              면접 연습 시작하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
