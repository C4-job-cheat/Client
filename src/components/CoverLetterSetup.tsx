import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, FileText } from 'lucide-react';
import { PersonaCard } from './PersonaCard';
import type { Page, Persona, CoverLetter } from '../types';

interface CoverLetterSetupProps {
  currentPersona: Persona | null;
  onNavigate: (page: Page) => void;
  onComplete: (coverLetter: CoverLetter) => void;
}

export function CoverLetterSetup({ currentPersona, onNavigate, onComplete }: CoverLetterSetupProps) {
  const [formData, setFormData] = useState({
    targetCompany: '',
    strengths: '',
    experience: '',
    style: 'experience' as 'experience' | 'knowledge' | 'creative'
  });

  if (!currentPersona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">페르소나가 필요해요</h2>
          <p className="text-gray-600 mb-6">
            자기소개서를 작성하기 위해 먼저 페르소나를 설정해주세요
          </p>
          <Button onClick={() => onNavigate('persona-setup')}>
            페르소나 설정하기
          </Button>
        </div>
      </div>
    );
  }

  const handleGenerate = () => {
    if (!formData.targetCompany || !formData.strengths) {
      alert('목표 기업과 나의 강점을 입력해주세요.');
      return;
    }

    const coverLetter: CoverLetter = {
      id: Date.now().toString(),
      personaId: currentPersona.id,
      targetCompany: formData.targetCompany,
      strengths: formData.strengths,
      experience: formData.experience,
      style: formData.style,
      content: generateInitialContent(),
      createdAt: new Date().toISOString()
    };

    onComplete(coverLetter);
  };

  const generateInitialContent = () => {
    const baseContent = `안녕하세요. ${formData.targetCompany}에 지원하게 된 ${currentPersona.jobCategory} 전문가입니다.

저는 ${currentPersona.education.level}을 졸업하고 ${currentPersona.experience.hasExperience ? `${currentPersona.experience.years}년간의 실무 경험을` : '신입으로서 열정과 학습 의지를'} 바탕으로 성장해왔습니다.

특히 저의 강점은 ${formData.strengths}입니다. ${formData.experience && `이전 경험에서 ${formData.experience}를 통해 이러한 역량을 발휘했습니다.`}

${currentPersona.description && `저는 ${currentPersona.description}`}

${formData.targetCompany}에서 제 역량을 발휘하여 회사의 성장에 기여하고 싶습니다. 감사합니다.`;

    return baseContent;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/notion2.avif')`
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
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
          <h1 className="font-semibold">자기소개서 작성하기</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Left: Persona Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <PersonaCard persona={currentPersona} />
            </div>
          </div>

          {/* Right: Input Form */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">자기소개서 정보 입력</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company">목표 기업 *</Label>
                  <Input
                    id="company"
                    placeholder="예: 토스, 네이버, 카카오"
                    value={formData.targetCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetCompany: e.target.value }))}
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strengths">나의 강점 *</Label>
                  <Textarea
                    id="strengths"
                    placeholder="예: 빠른 학습 능력과 문제 해결 능력, 팀워크와 커뮤니케이션 능력"
                    value={formData.strengths}
                    onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
                    className="min-h-24 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">참여 프로젝트 / 직무 관련 경험</Label>
                  <Textarea
                    id="experience"
                    placeholder="예: 웹 애플리케이션 개발 프로젝트, 인턴십 경험, 동아리 활동 등"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="min-h-32 text-base"
                  />
                </div>

                <div className="space-y-4">
                  <Label>자기소개서 스타일 선택</Label>
                  <RadioGroup
                    value={formData.style}
                    onValueChange={(value: 'experience' | 'knowledge' | 'creative') => setFormData(prev => ({ ...prev, style: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="experience" id="experience" />
                      <Label htmlFor="experience">경험 중심</Label>
                      <span className="text-sm text-gray-500">- 구체적인 경험과 성과를 강조</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="knowledge" id="knowledge" />
                      <Label htmlFor="knowledge">지식 위주</Label>
                      <span className="text-sm text-gray-500">- 전문 지식과 역량을 중심으로</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="creative" id="creative" />
                      <Label htmlFor="creative">창의적</Label>
                      <span className="text-sm text-gray-500">- 독창적이고 차별화된 표현</span>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleGenerate}
                  size="lg"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.targetCompany || !formData.strengths}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  초안 생성하기
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
