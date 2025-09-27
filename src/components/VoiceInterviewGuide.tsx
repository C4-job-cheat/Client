import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Mic, Volume2, Clock, CheckCircle } from 'lucide-react';
import type { Page, InterviewSession } from '../types';

interface VoiceInterviewGuideProps {
  session: InterviewSession | null;
  onNavigate: (page: Page) => void;
  onStart: () => void;
}

export function VoiceInterviewGuide({ session, onNavigate, onStart }: VoiceInterviewGuideProps) {
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">면접 세션을 찾을 수 없습니다</p>
          <Button onClick={() => onNavigate('interview-practice')}>
            면접 연습으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('interview-practice')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>돌아가기</span>
          </Button>
          <h1 className="font-semibold">음성 면접 연습</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">음성 면접 연습 시작</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                실제 면접처럼 음성으로 답변하는 연습을 해보세요.
                총 {session.questions.length}개의 질문이 준비되어 있습니다.
              </p>
            </div>
          </Card>

          {/* Instructions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Volume2 className="h-5 w-5 text-blue-600 mr-2" />
                진행 방식
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>질문이 음성으로 자동 재생됩니다</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>질문이 끝나면 바로 녹음이 시작됩니다</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>답변을 마치면 '답변 완료' 버튼을 클릭하세요</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>다음 질문으로 자동으로 넘어갑니다</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 text-orange-600 mr-2" />
                주의사항
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>각 질문당 1분의 답변 시간이 주어집니다</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>마이크 권한을 허용해주세요</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>조용한 환경에서 진행해주세요</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>시간이 끝나면 자동으로 다음 질문으로 넘어갑니다</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">면접 질문 미리보기</h3>
            <div className="space-y-3">
              {session.questions.slice(0, 3).map((question, index) => (
                <div key={question.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded">
                    Q{index + 1}
                  </span>
                  <p className="text-sm text-gray-700">{question.question}</p>
                </div>
              ))}
              {session.questions.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  외 {session.questions.length - 3}개의 질문이 더 있습니다
                </div>
              )}
            </div>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={onStart}
              size="lg"
              className="bg-black hover:bg-gray-800 px-8 py-3"
            >
              <Mic className="h-5 w-5 mr-2" />
              음성 면접 시작하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}