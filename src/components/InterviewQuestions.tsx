import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { CircularTimer } from './CircularTimer';
import type { Page, InterviewSession } from '../types';

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

  useEffect(() => {
    if (!session) return;
    setAnswers(new Array(session.questions.length).fill(''));
  }, [session]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeLeft, isTimerActive]);

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

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    // Save current answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(updatedAnswers);

    // Update session with answer and time spent
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      answer: currentAnswer,
      timeSpent: 60 - timeLeft
    };

    if (isLastQuestion) {
      // Complete the interview
      const completedSession: InterviewSession = {
        ...session,
        questions: updatedQuestions,
        score: calculateScore(updatedQuestions),
        feedback: generateFeedback(updatedQuestions),
        completedAt: new Date().toISOString()
      };
      onComplete(completedSession);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
      setTimeLeft(60);
      setIsTimerActive(true);
    }
  };

  const calculateScore = (questions: typeof session.questions) => {
    let totalScore = 0;
    
    questions.forEach(q => {
      const answerLength = q.answer.trim().length;
      const timeEfficiency = q.timeSpent > 0 ? Math.min(q.timeSpent / 45, 1) : 0; // Optimal time around 45 seconds
      
      let questionScore = 0;
      
      if (answerLength > 50) questionScore += 30; // Content length
      if (answerLength > 100) questionScore += 20; // Good detail
      if (timeEfficiency > 0.5) questionScore += 25; // Time management
      if (q.answer.includes('경험') || q.answer.includes('프로젝트')) questionScore += 15; // Experience mention
      if (q.answer.includes('배우') || q.answer.includes('성장')) questionScore += 10; // Growth mindset
      
      totalScore += Math.min(questionScore, 100);
    });
    
    return Math.round(totalScore / questions.length);
  };

  const generateFeedback = (questions: typeof session.questions) => {
    const avgAnswerLength = questions.reduce((sum, q) => sum + q.answer.length, 0) / questions.length;
    const avgTimeSpent = questions.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length;
    
    const strengths = [];
    const improvements = [];
    const suggestions = [];
    
    if (avgAnswerLength > 100) {
      strengths.push('답변이 충분히 구체적이고 상세합니다');
    } else {
      improvements.push('답변을 더 구체적으로 작성해보세요');
    }
    
    if (avgTimeSpent > 30 && avgTimeSpent < 50) {
      strengths.push('시간 관리가 우수합니다');
    } else if (avgTimeSpent < 20) {
      improvements.push('좀 더 충분히 생각하고 답변해보세요');
    } else {
      improvements.push('간결하게 답변하는 연습이 필요합니다');
    }
    
    const experienceCount = questions.filter(q => 
      q.answer.includes('경험') || q.answer.includes('프로젝트')
    ).length;
    
    if (experienceCount > questions.length / 2) {
      strengths.push('구체적인 경험을 잘 활용하여 답변합니다');
    } else {
      suggestions.push('구체적인 경험과 사례를 더 많이 활용해보세요');
    }
    
    suggestions.push('STAR 기법(Situation, Task, Action, Result)을 활용해보세요');
    suggestions.push('답변 시 회사와 직무에 대한 관심을 더 표현해보세요');
    
    return { strengths, improvements, suggestions };
  };

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
                      disabled={currentAnswer.trim().length < 10}
                    >
                      {isLastQuestion ? '면접 완료' : '다음 질문'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
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
