import type { ReactNode } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import { PersonaCard } from './PersonaCard';
import type { Page, Persona } from '../types';

interface FeatureHubProps {
  currentPersona: Persona | null;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  feature: {
    type: 'cover-letter' | 'interview';
    title: string;
    subtitle: string;
    actionText: string;
    startPage: Page;
    waitingSource: 'cover-letter' | 'interview';
    icon: ReactNode;
    noPersonaTitle: string;
    noPersonaSubtitle: string;
  };
  children?: ReactNode;
  hasRecords?: boolean;
}

export function FeatureHub({
  currentPersona,
  onNavigate,
  feature,
  children,
  hasRecords = false
}: FeatureHubProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Button>
          <h1 className="font-semibold">{feature.title}</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{feature.title}</h1>
            <p className="text-gray-600">{feature.subtitle}</p>
          </div>

          {/* 메인 콘텐츠: 좌측 작성 기록 + 우측 페르소나 카드 */}
          <div className="grid md:grid-cols-3 gap-6 md:items-start">
            {/* 좌측: 작성 기록 영역 */}
            <div className="md:col-span-2 space-y-6 md:min-h-[600px] md:flex md:flex-col">
              {children}
            </div>

            {/* 우측: 페르소나 카드 + 버튼 */}
            <div className={`space-y-4 ${hasRecords ? 'md:sticky md:top-8' : ''}`}>
              {currentPersona ? (
                <>
                  <PersonaCard persona={currentPersona} />
                  <div className="text-center">
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white border border-black shadow-sm"
                      onClick={() => onNavigate(feature.startPage)}
                    >
                      {feature.actionText} 시작
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="p-8 text-center bg-yellow-50 border border-black shadow-md">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.noPersonaTitle}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.noPersonaSubtitle}</p>
                  <Button
                    className="w-full"
                    onClick={() => onNavigate('persona-waiting', feature.waitingSource)}
                  >
                    페르소나 설정하기
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
