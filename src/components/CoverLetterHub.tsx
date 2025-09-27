import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Download, Edit3, Plus } from 'lucide-react';
import { FeatureHub } from './FeatureHub';
import type { Page, Persona, CoverLetter } from '../types';

interface CoverLetterHubProps {
  currentPersona: Persona | null;
  coverLetters: CoverLetter[];
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onCoverLetterSelect: (coverLetter: CoverLetter) => void;
}

export function CoverLetterHub({ currentPersona, coverLetters, onNavigate, onCoverLetterSelect }: CoverLetterHubProps) {
  const availableCoverLetters = currentPersona 
    ? coverLetters.filter(cl => cl.personaId === currentPersona.id)
    : [];

  const handleCoverLetterSelect = (coverLetter: CoverLetter) => {
    onCoverLetterSelect(coverLetter);
    onNavigate('cover-letter-draft');
  };


  const featureConfig = {
    type: 'cover-letter' as const,
    title: '',
    subtitle: '',
    actionText: '새 자기소개서 작성',
    startPage: 'cover-letter' as Page,
    waitingSource: 'cover-letter' as const,
    icon: <Plus className="h-8 w-8 text-blue-600" />,
    noPersonaTitle: '페르소나 설정이 필요해요',
    noPersonaSubtitle: '자기소개서를 작성하기 위해 먼저 페르소나를 설정해주세요'
  };

  return (
    <FeatureHub
      currentPersona={currentPersona}
      onNavigate={onNavigate}
      feature={featureConfig}
      hasRecords={availableCoverLetters.length > 0}
    >
      {/* 기존 자기소개서 목록 */}
      {availableCoverLetters.length > 0 ? (
        <div id="my-essays" className="space-y-4 scroll-mt-8 md:min-h-[600px]">
          <h2 className="text-xl font-semibold">작성된 자기소개서</h2>
          <div className="grid gap-4 max-w-2xl mx-auto">
            {availableCoverLetters.map((coverLetter) => (
              <Card
                key={coverLetter.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-black shadow-md"
                onClick={() => handleCoverLetterSelect(coverLetter)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold">{coverLetter.targetCompany} 지원용</h3>
                      <Badge variant="outline">
                        {coverLetter.style === 'experience' ? '경험 중심' :
                         coverLetter.style === 'knowledge' ? '지식 위주' : '창의적'}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>작성일: {new Date(coverLetter.createdAt).toLocaleDateString()}</span>
                      <span>글자 수: {coverLetter.content.length}자</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality
                        const element = document.createElement('a');
                        const file = new Blob([coverLetter.content], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${coverLetter.targetCompany}_자기소개서.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCoverLetterSelect(coverLetter)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center bg-gray-50 border border-dashed border-black shadow-md md:h-[332px] md:flex md:flex-col md:justify-center md:overflow-hidden">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">아직 자기소개서 기록이 없어요</h3>
          <p className="text-sm text-gray-600">
            첫 번째 자기소개서를 작성해보세요
          </p>
        </Card>
      )}

    </FeatureHub>
  );
}
