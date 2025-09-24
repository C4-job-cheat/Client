import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowLeft, Download, FileText, Edit3 } from 'lucide-react';
import type { Page, CoverLetter } from '../types';

interface CoverLetterDraftProps {
  coverLetter: CoverLetter | null;
  onNavigate: (page: Page) => void;
  onUpdate: (coverLetter: CoverLetter) => void;
}

export function CoverLetterDraft({ coverLetter, onNavigate, onUpdate }: CoverLetterDraftProps) {  const [editableContent, setEditableContent] = useState(coverLetter?.content || '');

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

  const handleContentChange = (newContent: string) => {
    setEditableContent(newContent);
    const updatedCoverLetter = { ...coverLetter, content: newContent };
    onUpdate(updatedCoverLetter);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([editableContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${coverLetter.targetCompany}_자기소개서.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Left: Editable Cover Letter */}
          <div className="lg:col-span-3">
            <Card className="p-8 min-h-[600px]">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold">자기소개서 편집</h2>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">{coverLetter.targetCompany} 지원 자기소개서</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    작성일: {new Date(coverLetter.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <Textarea
                  value={editableContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="min-h-[400px] leading-relaxed text-gray-800 border-0 bg-white shadow-sm p-6 rounded-lg resize-none"
                  placeholder="자기소개서 내용을 편집하세요..."
                />
                
                <div className="text-xs text-gray-500 text-right">
                  {editableContent.length}자
                </div>
              </div>
            </Card>
          </div>

          {/* Right: AI Analysis */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[600px] flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">작성 과정 설명</h3>
                <p className="text-sm text-gray-500">AI가 이렇게 작성한 이유를 알려드려요</p>
              </div>

              <div className="flex-1 bg-gray-50 rounded-lg p-6">
                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    이 자기소개서는 귀하의 페르소나 정보를 기반으로 AI가 분석하여 작성되었습니다.
                    {coverLetter.style === 'experience' ? '실무 경험과 프로젝트 성과' : coverLetter.style === 'knowledge' ? '전문 지식과 학습 능력' : '창의적 사고와 문제 해결 능력'}을
                    중심으로 구성하여 {coverLetter.targetCompany}에 가장 적합한 형태로 최적화했습니다.
                  </p>

                  <p>
                    문체는 {coverLetter.targetCompany}의 기업 문화에 맞춰 {coverLetter.style === 'experience' ? '실무 중심적이고 성과 지향적인' : coverLetter.style === 'knowledge' ? '전문성을 강조하는 학구적인' : '혁신적이고 창의적인'}
                    톤으로 설정했으며, 도입부에서는 지원 동기를 명확히 하고, 본문에서는 핵심 역량과 관련 경험을 체계적으로 제시했습니다.
                  </p>

                  <p>
                    특히 페르소나에서 강조하신 "{coverLetter.strengths}" 등의 개인적 강점을 바탕으로 다른 지원자와 차별화된 내용을 담았습니다.
                    좌측에서 내용을 직접 수정하여 더욱 개인화된 자기소개서로 완성해보세요.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
