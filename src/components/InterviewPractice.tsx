import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Label } from './ui/label';
import { ArrowLeft, MessageCircle, FileText, User, Play, Mic } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, CoverLetter, InterviewSession, InterviewQuestionGenerateRequest, InterviewQuestionGenerateResponse } from '../types';

interface InterviewPracticeProps {
  currentPersona: PersonaResponse | null;
  coverLetters: CoverLetter[];
  onNavigate: (page: Page) => void;
  onStart: (session: InterviewSession) => void;
}

export function InterviewPractice({ currentPersona, coverLetters, onNavigate, onStart }: InterviewPracticeProps) {
  const [useCoverLetter, setUseCoverLetter] = useState(false);
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<string>('');
  const [useVoiceInterview, setUseVoiceInterview] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const availableCoverLetters = coverLetters.filter(cl => cl.personaId === currentPersona.persona_id);

  const handleStart = async () => {
    if (!currentPersona) return;

    setIsStarting(true);
    setError(null);

    try {
      const requestData: InterviewQuestionGenerateRequest = {
        persona_id: currentPersona.persona_id,
        cover_letter_id: useCoverLetter ? selectedCoverLetterId : undefined,
        use_voice: useVoiceInterview
      };

      console.log('🔍 면접 질문 생성 요청:', requestData);
      
      const { data } = await apiClient.post<InterviewQuestionGenerateResponse>('/api/interviews/questions/generate/', requestData);
      
      console.log('🔍 면접 질문 생성 응답:', data);

      // 서버 응답을 InterviewSession 형태로 변환
      const session: InterviewSession = {
        id: data.interview_session_id,
        personaId: currentPersona.persona_id,
        useCoverLetter,
        coverLetterId: useCoverLetter ? selectedCoverLetterId : undefined,
        questions: [{
          id: data.question.question_id,
          question: data.question.question_text,
          type: data.question.question_type as 'job-knowledge' | 'ai-recommended' | 'cover-letter',
          timeSpent: 0,
          answer: ''
        }],
        score: 0,
        feedback: { strengths: [], improvements: [], suggestions: [] },
        completedAt: '',
        useVoiceInterview
      };

      // 음성 면접인 경우 안내 페이지로 이동, 아니면 바로 시작
      if (useVoiceInterview) {
        onStart(session);
        onNavigate('voice-interview-guide');
      } else {
        onStart(session);
      }
    } catch (err) {
      console.error('면접 질문 생성 실패:', err);
      setError('면접 질문 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('interview-hub')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>면접 연습 목록</span>
          </Button>
          <h1 className="font-semibold">면접 연습하기</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Persona Info */}
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{currentPersona.job_category} 개발자</h2>
                <p className="text-gray-600">{currentPersona.school_name} · {currentPersona.major}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{currentPersona.job_role}</Badge>
                  {currentPersona.skills && currentPersona.skills.length > 0 && (
                    <Badge variant="outline">{currentPersona.skills[0]}</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Interview Options */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">면접 설정</h3>
            
            <div className="space-y-6">
              {/* Cover Letter Option */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useCoverLetter"
                    checked={useCoverLetter}
                    onCheckedChange={(checked: CheckedState) => {
                      setUseCoverLetter(checked as boolean);
                      if (!checked) setSelectedCoverLetterId('');
                    }}
                  />
                  <Label htmlFor="useCoverLetter" className="text-base font-medium">
                    자기소개서 기반 면접 연습
                  </Label>
                </div>
                
                {useCoverLetter && (
                  <div className="ml-6 space-y-3">
                    {availableCoverLetters.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">자기소개서 선택</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availableCoverLetters.map((coverLetter) => (
                            <Card
                              key={coverLetter.id}
                              className={`p-4 cursor-pointer transition-all duration-200 ${
                                selectedCoverLetterId === coverLetter.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedCoverLetterId(coverLetter.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{coverLetter.targetCompany}</h4>
                                  <p className="text-sm text-gray-600">
                                    {new Date(coverLetter.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <Badge variant="outline" className="text-xs">
                                    {coverLetter.style}
                                  </Badge>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          작성된 자기소개서가 없습니다. 먼저 자기소개서를 작성해주세요.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => onNavigate('cover-letter')}
                        >
                          자기소개서 작성하기
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Voice Interview Option */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useVoiceInterview"
                    checked={useVoiceInterview}
                    onCheckedChange={(checked: CheckedState) => setUseVoiceInterview(checked as boolean)}
                  />
                  <Label htmlFor="useVoiceInterview" className="text-base font-medium">
                    음성 면접 연습
                  </Label>
                </div>
                
                {useVoiceInterview && (
                  <div className="ml-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mic className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">음성 면접 모드</span>
                    </div>
                    <p className="text-sm text-green-700">
                      실제 면접과 유사한 환경에서 음성으로 답변하는 연습을 할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={handleStart}
              size="lg"
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700"
              disabled={useCoverLetter && availableCoverLetters.length > 0 && !selectedCoverLetterId || isStarting}
            >
              <Play className="h-5 w-5 mr-2" />
              {isStarting ? '면접 질문 생성 중...' : '면접 연습 시작하기'}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="mt-2"
                >
                  닫기
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}