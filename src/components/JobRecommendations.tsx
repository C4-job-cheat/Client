import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ArrowLeft, Bookmark, Clock, Info, Brain, Target, Zap, BarChart } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { PersonaCardHeader } from './PersonaCardHeader';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, JobRecommendationResponse } from '../types';

interface JobRecommendationsProps {
  currentPersona: PersonaResponse | null;
  scrapedJobs: Set<string>;
  onNavigate: (page: Page) => void;
  onJobSelect: (jobId: string) => void;
  onToggleScrap: (jobId: string) => void;
}

// 레이더 차트 컴포넌트
function CapabilityRadarChart({ 
  competencyData, 
  onCapabilityClick 
}: { 
  competencyData: Record<string, { score: number; score_explanation: string; key_insights: string[]; evaluated_at: string; }>;
  onCapabilityClick: (capability: string) => void;
}) {
  const personaCapabilities = Object.entries(competencyData).map(([capability, data]) => ({
    subject: capability.replace('_', ' '),
    A: data.score,
    fullMark: 100
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BarChart className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">내 현재 역량</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>각 역량을 클릭하면 상세 분석을 확인할 수 있습니다</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={personaCapabilities}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="역량 점수"
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              onClick={(data) => onCapabilityClick(data.subject)}
              className="cursor-pointer"
            />
            <RechartsTooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// AI 종합 분석 캐러셀 컴포넌트
function AIAnalysisSummary({ 
  competencyData 
}: { 
  competencyData: Record<string, { score: number; score_explanation: string; key_insights: string[]; evaluated_at: string; }>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const analysisData = Object.entries(competencyData).map(([capability, data]) => ({
    title: capability.replace('_', ' '),
    score: data.score,
    color: data.score >= 70 ? 'text-green-600' : data.score >= 40 ? 'text-yellow-600' : 'text-red-600',
    borderColor: data.score >= 70 ? 'border-green-600' : data.score >= 40 ? 'border-yellow-600' : 'border-red-600',
    iconColor: data.score >= 70 ? 'text-green-600' : data.score >= 40 ? 'text-yellow-600' : 'text-red-600',
    icon: Target,
    summary: data.score_explanation,
    details: data.key_insights.map(insight => `✓ ${insight}`)
  }));

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // currentIndex가 유효한 범위를 벗어나면 자동으로 조정
  useEffect(() => {
    if (analysisData.length > 0 && currentIndex >= analysisData.length) {
      setCurrentIndex(0);
    }
  }, [analysisData.length, currentIndex]);

  // 데이터가 없거나 인덱스가 유효하지 않은 경우 처리
  if (analysisData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">AI 역량 분석</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">역량 분석 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  // currentIndex가 유효한 범위를 벗어난 경우 0으로 리셋
  const validIndex = currentIndex >= analysisData.length ? 0 : currentIndex;
  const currentItem = analysisData[validIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">AI 역량 분석</h3>
      </div>

      <div className="flex-1 space-y-4">
        {/* 현재 분석 항목 */}
        <div className={`p-4 rounded-lg border-2 ${currentItem.borderColor} bg-white`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <currentItem.icon className={`h-5 w-5 ${currentItem.iconColor}`} />
              <h4 className="font-semibold text-gray-900">{currentItem.title}</h4>
            </div>
            <div className={`text-2xl font-bold ${currentItem.color}`}>
              {currentItem.score}점
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {currentItem.summary}
          </p>
          
          <div className="space-y-1">
            {currentItem.details.map((detail, index) => (
              <p key={index} className="text-xs text-gray-600">
                {detail}
              </p>
            ))}
          </div>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="flex space-x-2 justify-center">
          {analysisData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === validIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// AI 종합 평가 컴포넌트
function FinalEvaluation({ 
  finalEvaluation 
}: { 
  finalEvaluation: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">종합 평가</h3>
          <p className="text-sm text-gray-800 leading-relaxed">
            {finalEvaluation}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function JobRecommendations({ currentPersona, scrapedJobs, onNavigate, onJobSelect, onToggleScrap }: JobRecommendationsProps) {
  const [recommendationData, setRecommendationData] = useState<JobRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchRecommendations = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 API 요청 시작:', {
        url: '/api/job-search/recommendations/',
        params: {
          user_id: currentPersona.user_id,
          persona_id: currentPersona.persona_id
        }
      });
      
      const { data } = await apiClient.get<JobRecommendationResponse>('/api/job-search/recommendations/', {
        params: {
          user_id: currentPersona.user_id,
          persona_id: currentPersona.persona_id
        }
      });
      
      console.log('✅ 서버 응답 성공!');
      console.log('📊 전체 응답 데이터:', data);
      
      // persona_card 데이터 검증
      console.log('👤 persona_card 데이터:', data?.persona_card);
      if (data?.persona_card) {
        console.log('  - 학교:', data.persona_card.school);
        console.log('  - 전공:', data.persona_card.major);
        console.log('  - 직무 카테고리:', data.persona_card.job_category);
        console.log('  - 직무명:', data.persona_card.job_title);
        console.log('  - 스킬 개수:', data.persona_card.skills?.length || 0);
        console.log('  - 자격증 개수:', data.persona_card.certifications?.length || 0);
      }
      
      // competency 데이터 검증
      console.log('🧠 competency 데이터:', data?.competency);
      if (data?.competency) {
        console.log('  - details 키 개수:', Object.keys(data.competency.details || {}).length);
        console.log('  - details 키 목록:', Object.keys(data.competency.details || {}));
        console.log('  - final_evaluation:', data.competency.final_evaluation);
        
        // 각 역량별 상세 정보
        Object.entries(data.competency.details || {}).forEach(([key, value]) => {
          console.log(`  - ${key}:`, {
            score: value.score,
            score_explanation: value.score_explanation?.substring(0, 50) + '...',
            key_insights_count: value.key_insights?.length || 0,
            evaluated_at: value.evaluated_at
          });
        });
      }
      
      // recommendations 데이터 검증
      console.log('💼 recommendations 데이터:', data?.recommendations);
      if (data?.recommendations) {
        console.log('  - 추천 공고 개수:', data.recommendations.length);
        console.log('  - total_count:', data.total_count);
        
        // 첫 번째 추천 공고 상세 정보
        if (data.recommendations.length > 0) {
          const firstJob = data.recommendations[0];
          console.log('  - 첫 번째 공고:', {
            job_posting_id: firstJob.job_posting_id,
            recommendation_score: firstJob.recommendation_score,
            company_name: firstJob.company_name,
            job_title: firstJob.job_title,
            location: firstJob.location,
            application_deadline: firstJob.application_deadline
          });
        }
      }
      
      setRecommendationData(data);
    } catch (err) {
      console.error('❌ 추천 공고 조회 실패:', err);
      console.error('에러 상세:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data
      });
      setError('추천 공고를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (!currentPersona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">페르소나를 먼저 설정해주세요</p>
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
          <p className="text-gray-600">추천 공고를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRecommendations}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (!recommendationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">추천 공고 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-2 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>홈으로</span>
            </Button>
            <h1 className="font-semibold">맞춤 공고 추천</h1>
            <div className="w-20" />
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* 상단: 페르소나 카드 */}
            <div className="mb-6">
              <PersonaCardHeader persona={currentPersona} />
            </div>

            {/* 하단: 레이더 차트 + AI 분석 (4:7 비율) */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 mb-6">
              {/* 좌측 4/11: 레이더 차트 */}
              <div className="lg:col-span-4">
                <Card className="p-4 h-80">
                  <CapabilityRadarChart 
                    competencyData={recommendationData.competency?.details || {}}
                    onCapabilityClick={() => {}} 
                  />
                </Card>
              </div>

              {/* 우측 7/11: AI 종합 분석 요약 */}
              <div className="lg:col-span-7">
                <Card className="p-4 h-80 flex flex-col">
                  <AIAnalysisSummary 
                    competencyData={recommendationData.competency?.details || {}}
                  />
                </Card>
              </div>
            </div>

            {/* 종합 평가 - 전체 가로폭 */}
            <div className="mb-6">
              <FinalEvaluation 
                finalEvaluation={recommendationData.competency?.final_evaluation || '종합 평가 데이터가 없습니다.'}
              />
            </div>

          </div>
        </main>

        {/* Job Recommendations Section - 별도 배경 */}
        <section className="px-6 py-4">
          <div className="max-w-7xl mx-auto">
            {/* Job Recommendations */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">추천 공고</h2>
                <Badge variant="secondary">
                  {recommendationData.total_count || 0}개 공고
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {(recommendationData.recommendations || []).map((job) => (
                  <div
                    key={job.job_posting_id}
                    className="group cursor-pointer rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow transition-shadow min-h-[260px]"
                    onClick={() => onJobSelect(job.job_posting_id)}
                  >
                    {/* Top area with logo and match badge */}
                    <div className="relative h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {job.company_logo && (
                        <img
                          src={job.company_logo}
                          alt={`${job.company_name} 로고`}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <button
                        className={`absolute top-2 right-2 text-gray-400 hover:text-gray-600`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleScrap(job.job_posting_id);
                        }}
                        aria-label="스크랩"
                      >
                        <Bookmark className={`h-4 w-4 ${scrapedJobs.has(job.job_posting_id) ? 'fill-current text-blue-600' : ''}`} />
                      </button>
                      <span className="absolute bottom-2 left-2 text-[11px] px-2 py-0.5 rounded-md bg-white/80 text-blue-700 border border-blue-200">
                        {job.recommendation_score}% match
                      </span>
                    </div>

                    {/* Bottom info area */}
                    <div className="p-3 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.25rem]">{job.job_title}</h3>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="truncate">{job.location}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">{new Date(job.application_deadline).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="truncate font-medium text-gray-700">{job.company_name}</span>
                        <span className="truncate">{job.job_category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}