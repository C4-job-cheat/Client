import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import type { Page, CoverLetter, CoverLetterParagraph } from '../types';

interface CoverLetterDraftProps {
  coverLetter: CoverLetter | null;
  onNavigate: (page: Page) => void;
}

export function CoverLetterDraft({ coverLetter, onNavigate }: CoverLetterDraftProps) {
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  // 서버 데이터가 있으면 서버 데이터 사용, 없으면 기존 로직 사용
  const paragraphs = coverLetter?.serverData?.cover_letter || coverLetter?.paragraphs || [];

  if (!coverLetter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">자기소개서를 찾을 수 없습니다</p>
          <Button onClick={() => onNavigate('cover-letter')}>
            새 자기소개서 작성하기
          </Button>
        </div>
      </div>
    );
  }

  const handleParagraphClick = (paragraphId: string) => {
    setSelectedParagraphId(paragraphId);
    setIsAnalysisOpen(true);
  };

  const handleDownload = () => {
    const content = paragraphs.map(p => p.paragraph || p.text).join('\n\n');
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${coverLetter.targetCompany}_자기소개서.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const selectedParagraph = paragraphs[parseInt(selectedParagraphId || '0')];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('cover-letter-hub')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>자기소개서 목록</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{coverLetter.targetCompany}</Badge>
            <Badge variant="outline">{coverLetter.style}</Badge>
          </div>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>다운로드</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          {/* Cover Letter Document */}
          <div className={`w-3/5 mx-auto transition-all duration-700 ease-in-out ${
            isAnalysisOpen
              ? 'transform -translate-x-1/3'
              : 'transform translate-x-0'
          }`}>
            <div className="bg-white border border-gray-300 shadow-sm min-h-[400px] rounded-lg">
              {/* Document Header */}
              <div className="border-b border-gray-200 px-8 py-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">자기소개서</h2>
                  <div className="text-sm text-gray-600">
                    {coverLetter.targetCompany} • {new Date(coverLetter.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Document Body */}
              <div className="p-8">
                <div className="leading-relaxed text-gray-800 text-base">
                  {paragraphs.map((paragraph, index) => (
                    <span
                      key={index}
                      onClick={() => handleParagraphClick(index.toString())}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedParagraphId === index.toString()
                          ? 'bg-blue-200/70 font-bold text-lg'
                          : 'hover:bg-yellow-200/50'
                      }`}
                    >
                      <span>{paragraph.paragraph || paragraph.text}</span>
                      {index < paragraphs.length - 1 && ' '}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400 text-right mt-8 border-t border-gray-100 pt-4">
                  총 {paragraphs.reduce((sum, p) => sum + (p.paragraph || p.text).length, 0)}자
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Analysis Panel */}
          <div className={`absolute top-0 right-0 w-2/5 h-[400px] transition-all duration-700 ease-in-out ${
            isAnalysisOpen
              ? 'transform translate-x-0 opacity-100'
              : 'transform translate-x-full opacity-0'
          }`}>
            <Card className="h-full flex flex-col ml-4">
              {/* Close Button */}
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setIsAnalysisOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedParagraph ? (
                <>
                  <div className="border-b border-gray-200 px-6 py-4">
                    <p className="text-lg font-bold text-gray-900 leading-relaxed italic">
                      "{selectedParagraph.paragraph || selectedParagraph.text}"
                    </p>
                  </div>

                  <div className="flex-1 p-6">
                    <div>
                      <div className="text-sm text-gray-700 mb-2 font-medium">구성 요소</div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedParagraph.reason || selectedParagraph.explanation}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h4 className="font-medium text-gray-700 mb-2">문단을 선택해주세요</h4>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    문단을 클릭하면<br />
                    상세 분석을 확인할 수 있습니다.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
