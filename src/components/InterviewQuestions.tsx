import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { CircularTimer } from './CircularTimer';
import { apiClient } from '../api/apiClient';
import type { Page, InterviewSession, InterviewAnswerSubmitRequest, NextQuestionResponse, InterviewCompletedResponse } from '../types';

interface InterviewQuestionsProps {
  session: InterviewSession | null;
  onNavigate: (page: Page) => void;
  onComplete: (session: InterviewSession) => void;
}



export function InterviewQuestions({ session, onNavigate, onComplete }: InterviewQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    setAnswers(new Array(session.questions.length).fill(''));
  }, [session]);

  const hasSession = session !== null;
  const currentQuestion = hasSession ? session.questions[currentQuestionIndex] : null;
  const isLastQuestion = hasSession ? currentQuestionIndex === session.questions.length - 1 : false;
  const progress = hasSession ? ((currentQuestionIndex + 1) / session.questions.length) * 100 : 0;

  const handleNextQuestion = useCallback(async () => {
    if (!session || !currentQuestion) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const requestData: InterviewAnswerSubmitRequest = {
        persona_id: session.personaId,
        interview_session_id: session.id,
        question_id: currentQuestion.id,
        question_number: currentQuestionIndex + 1,
        answer_text: currentAnswer,
        time_taken: 60 - timeLeft
      };

      console.log('🔍 답변 제출 요청:', requestData);
      
      const { data } = await apiClient.post<NextQuestionResponse | InterviewCompletedResponse>('/api/interviews/answers/submit-and-next/', requestData);
      
      console.log('🔍 답변 제출 응답:', data);

      // 현재 답변 저장
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(updatedAnswers);

      // 면접 완료인지 확인
      if ('status' in data && data.status === 'completed') {
        // 면접 완료 - 서버 데이터로 세션 업데이트
        const completedSession: InterviewSession = {
          ...session,
          questions: data.questions.map(q => ({
            id: q.question_id,
            question: q.question_text,
            answer: q.answer_text,
            type: q.question_type as 'job-knowledge' | 'ai-recommended' | 'cover-letter',
            timeSpent: q.time_taken
          })),
          score: data.score,
          feedback: {
            strengths: data.final_good_points,
            improvements: data.final_improvement_points,
            suggestions: []
          },
          completedAt: data.completed_at
        };
        onComplete(completedSession);
      } else {
        // 다음 질문 - 서버에서 받은 질문 추가
        const nextQuestion = data as NextQuestionResponse;
        const updatedQuestions = [...session.questions];
        updatedQuestions.push({
          id: nextQuestion.question_id,
          question: nextQuestion.question_text,
          answer: '',
          type: nextQuestion.question_type as 'job-knowledge' | 'ai-recommended' | 'cover-letter',
          timeSpent: 0
        });

        const updatedSession: InterviewSession = {
          ...session,
          questions: updatedQuestions
        };

        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentAnswer('');
        setTimeLeft(60);
        setIsTimerActive(true);
      }
    } catch (err) {
      console.error('답변 제출 실패:', err);
      setError('답변 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, currentAnswer, currentQuestion, currentQuestionIndex, onComplete, session, timeLeft]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [handleNextQuestion, isTimerActive, timeLeft]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">면접 세션을 찾을 수 없습니다</p>
          <Button onClick={() => onNavigate('interview-practice')}>
            면접 연습으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'cover-letter': return 'bg-blue-100 text-blue-700';
      case 'job-knowledge': return 'bg-green-100 text-green-700';
      case 'ai-recommended': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'cover-letter': return '자기소개서 기반';
      case 'job-knowledge': return '직무 지식';
      case 'ai-recommended': return 'AI 추천';
      default: return '일반';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('면접을 중단하시겠습니까? 진행 상황이 저장되지 않습니다.')) {
                  onNavigate('interview-practice');
                }
              }}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>중단</span>
            </Button>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} / {session.questions.length}
              </span>
              
              {/* Total elapsed time */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>총 소요시간: {formatTime(totalElapsedTime)}</span>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Question Section - 3 columns */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Question Header */}
                  <div className="space-y-3">
                    <Badge className={getQuestionTypeColor(currentQuestion.type)}>
                      {getQuestionTypeLabel(currentQuestion.type)}
                    </Badge>
                    
                    <h1 className="text-2xl font-semibold leading-relaxed">
                      {currentQuestion.question}
                    </h1>
                  </div>

                  {/* Answer Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      답변을 작성해주세요
                    </label>
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="구체적인 경험과 사례를 포함하여 답변해주세요..."
                      className="min-h-32 text-base"
                      autoFocus
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{currentAnswer.length} 글자</span>
                      <span>최소 50글자 이상 권장</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsTimerActive(!isTimerActive);
                      }}
                      className="text-gray-600"
                    >
                      {isTimerActive ? '타이머 일시정지' : '타이머 재시작'}
                    </Button>
                    
                    <Button
                      onClick={handleNextQuestion}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={currentAnswer.trim().length < 10 || isSubmitting}
                    >
                      {isSubmitting ? '답변 제출 중...' : (isLastQuestion ? '면접 완료' : '다음 질문')}
                      <ArrowRight className="h-4 w-4 ml-2" />
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
              </Card>
            </div>

            {/* Timer Section - 1 column */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-gray-700">남은 시간</h3>
                  
                  <div className="flex justify-center">
                    <CircularTimer timeLeft={timeLeft} totalTime={60} />
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    질문당 1분씩 주어집니다
                  </div>
                  
                  {timeLeft <= 10 && (
                    <div className="text-xs text-red-600 font-medium animate-pulse">
                      시간이 얼마 남지 않았어요!
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
