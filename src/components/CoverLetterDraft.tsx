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
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 2열 Grid: 문서 2fr / 패널 1fr(최소 360px) */}
          <div className={`grid grid-cols-1 gap-4 transition-all duration-300 ${
            isAnalysisOpen 
              ? 'lg:grid-cols-[800px_minmax(360px,1fr)]' 
              : 'lg:grid-cols-1 lg:max-w-4xl lg:mx-auto'
          }`}>
            
            {/* Left: Cover Letter Document */}
            <div className="w-full lg:w-[800px]">
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
                      <div
                        key={index}
                        onClick={() => handleParagraphClick(index.toString())}
                        className={`cursor-pointer transition-all duration-200 mb-4 ${
                          selectedParagraphId === index.toString()
                            ? 'bg-blue-200/70'
                            : 'hover:bg-yellow-100/50'
                        }`}
                      >
                        <div>
                          {paragraph.paragraph || paragraph.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-400 text-right mt-8 border-t border-gray-100 pt-4">
                    총 {paragraphs.reduce((sum, p) => sum + (p.paragraph || p.text).length, 0)}자
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content Analysis Panel (스크롤 따라오는 sticky) */}
            <aside
              className={`hidden lg:block transition-all duration-700 ease-in-out ${
                isAnalysisOpen 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              {/* sticky는 래퍼에 주고, 헤더 높이 반영해서 top 조정 (예: 56px ≈ top-14) */}
              <div className="sticky top-20 self-start">
                <Card className="min-h-[400px] max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-gradient-to-br from-slate-100 to-blue-100/50 border border-gray-300/70 shadow-xl">
                  {/* Header with Close Button */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-300/60 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-800">AI 분석</h3>
                    </div>
                    <button
                      onClick={() => setIsAnalysisOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {selectedParagraph ? (
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="space-y-4">
                        {/* Analysis Header */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800 mb-1">AI 인사이트</h4>
                            <p className="text-xs text-gray-500">이 문단에 대한 상세 분석</p>
                          </div>
                        </div>

                        {/* Analysis Content */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-300/60">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedParagraph.reason || selectedParagraph.explanation}
                          </p>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">문단을 선택해주세요</h4>
                      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                        문단을 클릭하면<br />
                        AI가 분석한 상세 인사이트를<br />
                        확인할 수 있습니다.
                      </p>
                      <div className="mt-4 flex space-x-1">
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
