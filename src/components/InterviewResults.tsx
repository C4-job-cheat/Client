import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Trophy, 
  Target,
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  RotateCcw,
  Home,
  Eye
} from 'lucide-react';
import { QuestionDetailModal } from './QuestionDetailModal';
import type { Page, InterviewSession } from '../types';

interface InterviewResultsProps {
  session: InterviewSession | null;
  onNavigate: (page: Page) => void;
}

export function InterviewResults({ session, onNavigate }: InterviewResultsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuestionClick = (question: any) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">면접 결과를 찾을 수 없습니다</p>
          <Button onClick={() => onNavigate('interview-practice')}>
            면접 연습으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'D';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return '훌륭한 답변입니다! 실제 면접에서도 좋은 결과를 기대할 수 있어요.';
    if (score >= 60) return '좋은 답변이에요. 몇 가지 개선점을 보완하면 더욱 완벽해질 것 같아요.';
    if (score >= 40) return '기본기는 갖춰져 있어요. 조금 더 연습하면 훨씬 나아질 거예요.';
    return '아직 부족한 부분이 많아요. 더 많은 연습이 필요합니다.';
  };

  const avgAnswerLength = session.questions.reduce((sum, q) => sum + q.answer.length, 0) / session.questions.length;
  const avgTimeSpent = session.questions.reduce((sum, q) => sum + q.timeSpent, 0) / session.questions.length;
  const totalTimeSpent = session.questions.reduce((sum, q) => sum + q.timeSpent, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const questionTypes = {
    'cover-letter': { label: '자기소개서 기반', color: 'bg-blue-100 text-blue-700' },
    'job-knowledge': { label: '직무 지식', color: 'bg-green-100 text-green-700' },
    'ai-recommended': { label: 'AI 추천', color: 'bg-purple-100 text-purple-700' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('interview-practice')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>다시 연습하기</span>
          </Button>
          <h1 className="font-semibold">면접 결과</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>홈으로</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Score Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Trophy className={`h-12 w-12 mx-auto mb-4 ${getScoreColor(session.score)}`} />
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(session.score)}`}>
                {session.score}점
              </div>
              <div className={`text-lg font-medium mb-2 ${getScoreColor(session.score)}`}>
                {getScoreGrade(session.score)} 등급
              </div>
              <p className="text-sm text-gray-600">
                {getScoreDescription(session.score)}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-gray-400" />
                <h3 className="font-medium">시간 분석</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">총 소요 시간</span>
                  <span className="font-medium">{formatTime(totalTimeSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">평균 답변 시간</span>
                  <span className="font-medium">{formatTime(Math.round(avgTimeSpent))}</span>
                </div>
                <Progress value={(avgTimeSpent / 60) * 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  권장 시간: 45초 내외
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-gray-400" />
                <h3 className="font-medium">답변 분석</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">총 질문 수</span>
                  <span className="font-medium">{session.questions.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">평균 답변 길이</span>
                  <span className="font-medium">{Math.round(avgAnswerLength)}자</span>
                </div>
                <Progress value={Math.min((avgAnswerLength / 200) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500">
                  권장 길이: 100자 이상
                </p>
              </div>
            </Card>
          </div>

          {/* Feedback */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Strengths */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-700">잘한 점</h3>
              </div>
              <div className="space-y-2">
                {session.feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Improvements */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h3 className="font-medium text-orange-700">개선할 점</h3>
              </div>
              <div className="space-y-2">
                {session.feedback.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Suggestions */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-700">제안사항</h3>
              </div>
              <div className="space-y-2">
                {session.feedback.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Question Details */}
          <Card className="p-6">
            <h3 className="font-semibold mb-6">질문별 상세 결과</h3>
            <div className="space-y-6">
              {session.questions.map((question, index) => (
                <div key={question.id}>
                  <Card 
                    className="p-4 cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-blue-200"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Q{index + 1}.
                          </span>
                          <Badge className={questionTypes[question.type]?.color || 'bg-gray-100 text-gray-700'}>
                            {questionTypes[question.type]?.label || '일반'}
                          </Badge>
                        </div>
                        <p className="font-medium mb-2">{question.question}</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg line-clamp-2">
                          {question.answer || '답변이 입력되지 않았습니다.'}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">소요 시간</div>
                          <div className="font-medium">{formatTime(question.timeSpent)}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuestionClick(question);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                          <span>상세보기</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                  {index < session.questions.length - 1 && <div className="h-4" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => onNavigate('interview-practice')}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              다시 연습하기
            </Button>
            
            <Button
              onClick={() => onNavigate('home')}
              size="lg"
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              <Home className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </main>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
