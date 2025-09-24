import { Button } from './ui/button';
import { ArrowLeft, User, Sparkles, Target, FileText } from 'lucide-react';
import type { Page } from '../types';

interface PersonaWaitingPageProps {
  onNavigate: (page: Page) => void;
  source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general';
}

export function PersonaWaitingPage({ onNavigate, source = 'general' }: PersonaWaitingPageProps) {
  const getSourceInfo = () => {
    switch (source) {
      case 'cover-letter':
        return {
          icon: <FileText className="h-8 w-8 text-blue-600" />,
          title: '자기소개서 작성을 위해\n페르소나를 설정해주세요',
          description: '맞춤형 자기소개서를 작성하기 위해 먼저 나만의 페르소나를 만들어보세요.',
          benefit: '설정한 페르소나를 기준으로 AI가 개인화된 자기소개서를 작성해드립니다.'
        };
      case 'interview':
        return {
          icon: <Target className="h-8 w-8 text-blue-600" />,
          title: '면접 연습을 위해\n페르소나를 설정해주세요',
          description: '실전과 같은 면접 연습을 위해 먼저 나만의 페르소나를 만들어보세요.',
          benefit: '설정한 페르소나를 기준으로 AI가 맞춤형 면접 질문을 제공합니다.'
        };
      case 'scraped-jobs':
        return {
          icon: <Sparkles className="h-8 w-8 text-blue-600" />,
          title: '공고 추천을 위해\n페르소나를 설정해주세요',
          description: '나에게 딱 맞는 공고를 찾기 위해 먼저 나만의 페르소나를 만들어보세요.',
          benefit: '설정한 페르소나를 기준으로 AI가 최적화된 공고를 추천해드립니다.'
        };
      default:
        return {
          icon: <User className="h-8 w-8 text-blue-600" />,
          title: '서비스 이용을 위해\n페르소나를 설정해주세요',
          description: '개인화된 서비스를 제공하기 위해 먼저 나만의 페르소나를 만들어보세요.',
          benefit: '설정한 페르소나를 기준으로 AI가 맞춤형 서비스를 제공합니다.'
        };
    }
  };

  const sourceInfo = getSourceInfo();

  return (
    <div className="h-screen bg-twenty-neutral flex flex-col">
      {/* Minimal Header */}
      <header className="bg-twenty-white border-b border-twenty-border px-6 py-4 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="font-twenty flex items-center space-x-2 text-twenty-tertiary hover:text-twenty-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Button>
          <div className="flex-1" />
        </div>
      </header>

      {/* Main Content - 위쪽 정렬 */}
      <main className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Hero Section - 크기 축소 */}
          <div className="w-16 h-16 bg-twenty-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            {sourceInfo.icon}
          </div>
          
          <h1 className="font-twenty text-2xl lg:text-3xl font-bold text-twenty-primary leading-tight mb-4 whitespace-pre-line">
            {sourceInfo.title}
          </h1>
          
          <p className="font-twenty text-sm text-twenty-secondary leading-relaxed mb-6 max-w-lg mx-auto">
            {sourceInfo.description}
          </p>

          {/* Simple Feature List - 크기 축소 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-twenty-success rounded-xl flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-twenty-primary" />
              </div>
              <h3 className="font-twenty text-sm font-semibold text-twenty-primary mb-1">맞춤 공고 추천</h3>
              <p className="font-twenty text-xs text-twenty-tertiary">나에게 딱 맞는 공고만</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-twenty-info rounded-xl flex items-center justify-center mb-3">
                <FileText className="h-5 w-5 text-twenty-primary" />
              </div>
              <h3 className="font-twenty text-sm font-semibold text-twenty-primary mb-1">AI 자기소개서</h3>
              <p className="font-twenty text-xs text-twenty-tertiary">개인화된 자동 생성</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-twenty-creative rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-twenty-primary" />
              </div>
              <h3 className="font-twenty text-sm font-semibold text-twenty-primary mb-1">맞춤 면접 연습</h3>
              <p className="font-twenty text-xs text-twenty-tertiary">실전 면접 질문</p>
            </div>
          </div>

          {/* Single CTA - 홈 스타일과 동일 */}
          <Button
            onClick={() => onNavigate('persona-setup')}
            size="default"
            className="w-full font-twenty text-base bg-black hover:bg-gray-800 text-white border border-gray-800 py-3 rounded-lg transition-all duration-200 shadow-sm max-w-md mx-auto"
          >
            페르소나 설정하기
          </Button>
        </div>
      </main>
    </div>
  );
}