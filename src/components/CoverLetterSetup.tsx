import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, FileText } from 'lucide-react';
import { PersonaCard } from './PersonaCard';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, CoverLetter, CoverLetterPersonaResponse, CoverLetterCreateRequest, CoverLetterCreateResponse } from '../types';

interface CoverLetterSetupProps {
  currentPersona: PersonaResponse | null;
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

  const [personaCardData, setPersonaCardData] = useState<CoverLetterPersonaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // API 호출 함수
  const fetchPersonaCard = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.get<CoverLetterPersonaResponse>('/api/cover-letters/', {
        params: {
          persona_id: currentPersona.persona_id
        }
      });
      
      setPersonaCardData(data);
    } catch {
      setError('페르소나 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchPersonaCard();
  }, [fetchPersonaCard]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페르소나 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPersonaCard}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (!personaCardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">페르소나 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!formData.targetCompany || !formData.strengths) {
      alert('목표 기업과 나의 강점을 입력해주세요.');
      return;
    }

    if (!currentPersona) {
      alert('페르소나 정보가 없습니다.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const requestData: CoverLetterCreateRequest = {
        user_id: currentPersona.user_id,
        persona_id: currentPersona.persona_id,
        company_name: formData.targetCompany,
        strengths: formData.strengths,
        activities: formData.experience,
        style: formData.style
      };

      const { data } = await apiClient.post<CoverLetterCreateResponse>('/api/cover-letters/create/', requestData);

      // 서버 응답을 CoverLetter 형태로 변환
      const coverLetter: CoverLetter = {
        id: data.id,
        personaId: data.persona_id,
        targetCompany: data.company_name,
        strengths: formData.strengths,
        experience: formData.experience,
        style: data.style as 'experience' | 'knowledge' | 'creative',
        content: data.cover_letter.map(p => p.paragraph).join('\n\n'),
        createdAt: data.created_at,
        serverData: data // 서버 데이터를 별도로 저장
      };

      onComplete(coverLetter);
    } catch {
      setError('자기소개서 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCreating(false);
    }
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
              <PersonaCard persona={{
                ...currentPersona,
                school_name: personaCardData.persona_card.school,
                major: personaCardData.persona_card.major,
                job_category: personaCardData.persona_card.job_category,
                job_role: personaCardData.persona_card.job_title,
                skills: personaCardData.persona_card.skills,
                certifications: personaCardData.persona_card.certifications,
              }} />
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
                  disabled={!formData.targetCompany || !formData.strengths || isCreating}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  {isCreating ? '자기소개서 생성 중...' : '초안 생성하기'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
