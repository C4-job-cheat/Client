import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, FileText, Edit3 } from 'lucide-react';
import type { Page, CoverLetter, CoverLetterParagraph } from '../types';

interface CoverLetterDraftProps {
  coverLetter: CoverLetter | null;
  onNavigate: (page: Page) => void;
  onUpdate: (coverLetter: CoverLetter) => void;
}

export function CoverLetterDraft({ coverLetter, onNavigate, onUpdate }: CoverLetterDraftProps) {
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  // 임시 더미 데이터 (서버에서 받아올 데이터)
  const dummyParagraphs: CoverLetterParagraph[] = [
    {
      id: '1',
      text: '안녕하세요. 저는 컴퓨터공학을 전공하며 풀스택 개발자로 성장하고자 하는 김개발입니다. 귀하의 회사에서 제공하는 혁신적인 기술 환경과 성장 기회에 깊은 관심을 가지고 지원하게 되었습니다.',
      explanation: '도입부에서는 지원자의 기본 정보와 지원 동기를 명확히 제시했습니다. 회사의 특성을 언급하여 지원 의지를 구체적으로 표현했습니다.'
    },
    {
      id: '2',
      text: '대학 재학 중 다양한 프로젝트를 통해 React, Node.js, Python 등의 기술 스택을 활용한 웹 애플리케이션 개발 경험을 쌓았습니다. 특히 팀 프로젝트에서 프론트엔드와 백엔드를 모두 담당하며 전체적인 서비스 구조를 이해할 수 있었습니다.',
      explanation: '페르소나에서 설정한 기술 스택을 바탕으로 구체적인 경험을 제시했습니다. 풀스택 개발자로서의 역량을 강조하여 직무 적합성을 어필했습니다.'
    },
    {
      id: '3',
      text: '또한 지속적인 학습을 통해 최신 기술 트렌드를 파악하고 적용하려 노력하고 있습니다. 개인 블로그를 운영하며 학습한 내용을 정리하고 다른 개발자들과 지식을 공유하는 활동도 하고 있습니다.',
      explanation: '학습 능력과 지식 공유 의지를 통해 성장 잠재력을 강조했습니다. 개발자로서 중요한 커뮤니케이션 능력도 함께 어필했습니다.'
    },
    {
      id: '4',
      text: '귀하의 회사에서 더 많은 경험을 쌓고 전문성을 높여 회사의 성장에 기여할 수 있는 개발자가 되고 싶습니다. 감사합니다.',
      explanation: '마무리에서는 회사에 대한 기여 의지와 성장 목표를 명확히 제시하여 긍정적인 인상을 남기도록 구성했습니다.'
    }
  ];

  const paragraphs = coverLetter?.paragraphs || dummyParagraphs;

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
    const content = paragraphs.map(p => p.text).join('\n\n');
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${coverLetter.targetCompany}_자기소개서.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const selectedParagraph = paragraphs.find(p => p.id === selectedParagraphId);

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
                      key={paragraph.id}
                      onClick={() => handleParagraphClick(paragraph.id)}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedParagraphId === paragraph.id
                          ? 'bg-blue-200/70 font-bold text-lg'
                          : 'hover:bg-yellow-200/50'
                      }`}
                    >
                      <span>{paragraph.text}</span>
                      {index < paragraphs.length - 1 && ' '}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400 text-right mt-8 border-t border-gray-100 pt-4">
                  총 {paragraphs.reduce((sum, p) => sum + p.text.length, 0)}자
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
                      "{selectedParagraph.text}"
                    </p>
                  </div>

                  <div className="flex-1 p-6">
                    <div>
                      <div className="text-sm text-gray-700 mb-2 font-medium">구성 요소</div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedParagraph.explanation}
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
