import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Download, Edit3, Plus } from 'lucide-react';
import { FeatureHub } from './FeatureHub';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, CoverLetter, CoverLetterListResponse, CoverLetterDetailResponse } from '../types';

interface CoverLetterHubProps {
  currentPersona: PersonaResponse | null;
  coverLetters: CoverLetter[];
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onCoverLetterSelect: (coverLetter: CoverLetter) => void;
}

export function CoverLetterHub({ currentPersona, coverLetters, onNavigate, onCoverLetterSelect }: CoverLetterHubProps) {
  const [coverLetterListData, setCoverLetterListData] = useState<CoverLetterListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchCoverLetterList = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.get<CoverLetterListResponse>('/api/cover-letters/list/', {
        params: {
          persona_id: currentPersona.persona_id
        }
      });
      
      console.log('🔍 자기소개서 목록 데이터:', data);
      setCoverLetterListData(data);
    } catch (err) {
      console.error('자기소개서 목록 조회 실패:', err);
      setError('자기소개서 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchCoverLetterList();
  }, [fetchCoverLetterList]);

  // 기존 로컬 데이터와 서버 데이터 병합 (서버 데이터 우선)
  const availableCoverLetters = currentPersona 
    ? coverLetters.filter(cl => cl.personaId === currentPersona.persona_id)
    : [];

  const handleCoverLetterSelect = async (coverLetter: CoverLetter) => {
    if (!currentPersona) return;

    try {
      // 서버에서 자기소개서 상세 정보 조회
      const { data } = await apiClient.get<CoverLetterDetailResponse>(`/api/cover-letters/list/${coverLetter.id}/`, {
        params: {
          persona_id: currentPersona.persona_id
        }
      });

      console.log('🔍 자기소개서 상세 데이터:', data);
      console.log('🔍 cover_letter 배열:', data.cover_letter);

      // 서버 응답을 CoverLetter 형태로 변환
      const detailedCoverLetter: CoverLetter = {
        id: data.id,
        personaId: data.persona_id,
        targetCompany: data.company_name,
        strengths: coverLetter.strengths, // 기존 데이터 유지
        experience: coverLetter.experience, // 기존 데이터 유지
        style: data.style as 'experience' | 'knowledge' | 'creative',
        content: data.cover_letter.map(p => p.paragraph).join('\n\n'),
        createdAt: data.created_at,
        serverData: data // 서버 데이터를 별도로 저장
      };

      onCoverLetterSelect(detailedCoverLetter);
      onNavigate('cover-letter-draft');
    } catch (err) {
      console.error('자기소개서 상세 조회 실패:', err);
      // 실패 시 기존 로직 사용
      onCoverLetterSelect(coverLetter);
      onNavigate('cover-letter-draft');
    }
  };

  // 서버 데이터를 CoverLetter 형태로 변환하는 함수
  const convertServerDataToCoverLetter = (serverItem: any): CoverLetter => {
    return {
      id: serverItem.id,
      targetCompany: serverItem.company_name,
      content: '', // 서버에서는 내용을 제공하지 않으므로 빈 문자열
      style: serverItem.style as 'experience' | 'knowledge' | 'creative',
      strengths: '',
      experience: '',
      createdAt: serverItem.created_at,
      personaId: currentPersona?.persona_id || '',
    };
  };

  // 서버 데이터가 있으면 서버 데이터 사용, 없으면 로컬 데이터 사용
  const displayCoverLetters = coverLetterListData?.cover_letters 
    ? coverLetterListData.cover_letters.map(convertServerDataToCoverLetter)
    : availableCoverLetters;

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

  if (!currentPersona) {
    return (
      <FeatureHub
        currentPersona={null}
        onNavigate={onNavigate}
        feature={featureConfig}
        hasRecords={false}
      />
    );
  }

  if (isLoading) {
    return (
      <FeatureHub
        currentPersona={currentPersona}
        onNavigate={onNavigate}
        feature={featureConfig}
        hasRecords={false}
      >
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">자기소개서 목록을 불러오는 중...</p>
        </div>
      </FeatureHub>
    );
  }

  if (error) {
    return (
      <FeatureHub
        currentPersona={currentPersona}
        onNavigate={onNavigate}
        feature={featureConfig}
        hasRecords={false}
      >
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCoverLetterList}>
            다시 시도
          </Button>
        </div>
      </FeatureHub>
    );
  }


  return (
    <FeatureHub
      currentPersona={currentPersona ? {
        ...currentPersona,
        school_name: coverLetterListData?.persona_card.school || currentPersona.school_name,
        major: coverLetterListData?.persona_card.major || currentPersona.major,
        job_category: coverLetterListData?.persona_card.job_category || currentPersona.job_category,
        job_role: coverLetterListData?.persona_card.job_title || currentPersona.job_role,
        skills: coverLetterListData?.persona_card.skills || currentPersona.skills,
        certifications: coverLetterListData?.persona_card.certifications || currentPersona.certifications,
      } : null}
      onNavigate={onNavigate}
      feature={featureConfig}
      hasRecords={displayCoverLetters.length > 0}
    >
      {/* 자기소개서 목록 */}
      {displayCoverLetters.length > 0 ? (
        <div id="my-essays" className="space-y-4 scroll-mt-8 md:min-h-[600px]">
          <h2 className="text-xl font-semibold">작성된 자기소개서</h2>
          <div className="grid gap-4 max-w-2xl mx-auto">
            {displayCoverLetters.map((coverLetter) => (
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
                      <span>글자 수: {coverLetterListData?.cover_letters.find(item => item.id === coverLetter.id)?.character_count || coverLetter.content.length}자</span>
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
