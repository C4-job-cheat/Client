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
}

export function FeatureHub({ 
  currentPersona, 
  onNavigate, 
  feature,
  children 
}: FeatureHubProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/notion2.avif')`
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-xl">
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

          {/* Action Button + Persona Card Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 새 기능 시작 */}
            <Card 
              className="p-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-blue-300 hover:border-blue-400"
              onClick={() => currentPersona ? onNavigate(feature.startPage) : onNavigate('persona-waiting', feature.waitingSource)}
            >
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.actionText}</h3>
                  <p className="text-sm text-gray-600">
                    AI와 함께 맞춤형 {feature.type === 'cover-letter' ? '자기소개서를' : '면접 연습을'} {feature.type === 'cover-letter' ? '작성해보세요' : '해보세요'}
                  </p>
                </div>
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white border border-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentPersona) {
                      onNavigate(feature.startPage);
                    } else {
                      onNavigate('persona-waiting', feature.waitingSource);
                    }
                  }}
                >
                  {feature.actionText} 시작
                </Button>
              </div>
            </Card>

            {/* 페르소나 카드 또는 페르소나 설정 필요 안내 */}
            {currentPersona ? (
              <PersonaCard persona={currentPersona} />
            ) : (
              <Card className="p-8 text-center bg-yellow-50 border-yellow-200">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.noPersonaTitle}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.noPersonaSubtitle}</p>
                <Button onClick={() => onNavigate('persona-waiting', feature.waitingSource)}>
                  페르소나 설정하기
                </Button>
              </Card>
            )}
          </div>

          {/* Additional Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
