import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { X, Target, CheckCircle, MessageSquare, ChevronRight } from 'lucide-react';

interface QuestionData {
  id: string;
  question: string;
  answer: string;
  type: 'cover-letter' | 'job-knowledge' | 'ai-recommended';
  timeSpent: number;
}

interface QuestionDetailModalProps {
  question: QuestionData;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for question analysis
const getQuestionAnalysis = (question: QuestionData) => {
  const analyses = {
    'cover-letter': {
      purpose: '지원자의 자기소개서를 바탕으로 한 심화 질문으로, 작성한 내용의 진정성과 구체성을 평가합니다.',
      guide: [
        'STAR 기법(Situation, Task, Action, Result) 사용',
        '구체적인 수치나 성과 포함',
        '배운 점이나 성장한 부분 언급',
        '회사와의 연관성 설명'
      ],
      comparison: {
        strengths: ['구체적인 경험 사례 제시', '결과 중심의 설명'],
        improvements: ['STAR 기법 활용 부족', '회사와의 연관성 부족']
      }
    },
    'job-knowledge': {
      purpose: '해당 직무에 대한 전문 지식과 업계 이해도를 파악하여 실무 역량을 평가합니다.',
      guide: [
        '최신 업계 트렌드 언급',
        '실무 경험이나 프로젝트 사례',
        '기술적 깊이 있는 설명',
        '문제 해결 접근법 제시'
      ],
      comparison: {
        strengths: ['기술적 이해도 우수', '실무 경험 바탕'],
        improvements: ['최신 트렌드 언급 부족', '구체적 사례 보완 필요']
      }
    },
    'ai-recommended': {
      purpose: '지원자의 성향과 역량을 다각도로 파악하기 위한 맞춤형 질문입니다.',
      guide: [
        '자신만의 관점과 철학 표현',
        '논리적 사고 과정 설명',
        '창의적 문제 해결 능력',
        '팀워크나 리더십 경험'
      ],
      comparison: {
        strengths: ['개인적 경험 잘 활용', '진솔한 답변'],
        improvements: ['논리적 구조 보완', '구체적 예시 추가']
      }
    }
  };

  return analyses[question.type] || analyses['ai-recommended'];
};

export function QuestionDetailModal({ question, isOpen, onClose }: QuestionDetailModalProps) {
  const analysis = getQuestionAnalysis(question);

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'cover-letter': return '자기소개서 기반';
      case 'job-knowledge': return '직무 지식';
      case 'ai-recommended': return 'AI 추천';
      default: return 'AI 추천';
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'cover-letter': return 'bg-blue-100 text-blue-700';
      case 'job-knowledge': return 'bg-green-100 text-green-700';
      case 'ai-recommended': return 'bg-purple-100 text-purple-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className={`mb-3 ${getQuestionTypeColor(question.type)}`}>
                {getQuestionTypeLabel(question.type)}
              </Badge>
              <DialogTitle className="text-xl leading-relaxed pr-8">
                {question.question}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                면접 질문에 대한 상세 분석과 개선 방안을 확인할 수 있습니다.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* 1. 질문의 목적 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">질문의 목적</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{analysis.purpose}</p>
          </Card>

          {/* 2. 정답 가이드 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">좋은 답변의 핵심 포인트</h3>
            </div>
            <div className="space-y-3">
              {analysis.guide.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <ChevronRight className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. 내 답변 비교 */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">내 답변 분석</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 내 답변 */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900">내 답변</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {question.answer || '답변이 작성되지 않았습니다.'}
                  </p>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  답변 시간: {Math.floor(question.timeSpent / 60)}분 {question.timeSpent % 60}초
                </div>
              </div>

              {/* 분석 결과 */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900">분석 결과</h4>
                
                {/* 잘한 점 */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-green-700 mb-2">✓ 잘한 점</h5>
                  <div className="space-y-1">
                    {analysis.comparison.strengths.map((strength, index) => (
                      <div key={index} className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 개선점 */}
                <div>
                  <h5 className="text-sm font-medium text-orange-700 mb-2">→ 개선점</h5>
                  <div className="space-y-1">
                    {analysis.comparison.improvements.map((improvement, index) => (
                      <div key={index} className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}