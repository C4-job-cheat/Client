import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ArrowLeft, Bookmark, Clock, Info, Target, BarChart } from 'lucide-react';
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
              onClick={(data: any) => onCapabilityClick(data.subject)}
              className="cursor-pointer"
            />
            <RechartsTooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// AI 역량 분석 컴포넌트 (버튼 선택 방식)
function AIAnalysisSummary({ 
  competencyData,
  selectedCapability,
  onCapabilitySelect
}: { 
  competencyData: Record<string, { score: number; score_explanation: string; key_insights: string[]; evaluated_at: string; }>;
  selectedCapability: string | null;
  onCapabilitySelect: (capability: string) => void;
}) {
  // 각 역량별 색상 정의
  const capabilityColors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600', progress: 'bg-blue-500' },
    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600', progress: 'bg-green-500' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600', progress: 'bg-purple-500' },
    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600', progress: 'bg-orange-500' },
    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-600', progress: 'bg-pink-500' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600', progress: 'bg-indigo-500' },
    { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'text-teal-600', progress: 'bg-teal-500' },
    { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600', progress: 'bg-red-500' }
  ];

  const capabilities = Object.entries(competencyData).map(([capability, data], index) => ({
    key: capability,
    title: capability.replace('_', ' '),
    score: data.score,
    color: data.score >= 70 ? 'text-green-600' : data.score >= 40 ? 'text-yellow-600' : 'text-red-600',
    borderColor: data.score >= 70 ? 'border-green-600' : data.score >= 40 ? 'border-yellow-600' : 'border-red-600',
    iconColor: data.score >= 70 ? 'text-green-600' : data.score >= 40 ? 'text-yellow-600' : 'text-red-600',
    summary: data.score_explanation,
    details: data.key_insights.map(insight => `✓ ${insight}`),
    themeColor: capabilityColors[index % capabilityColors.length]
  }));

  if (capabilities.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">역량 분석 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const selectedData = selectedCapability 
    ? capabilities.find(cap => cap.key === selectedCapability) || capabilities[0]
    : capabilities[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex gap-4">
        {/* 좌측: 역량 선택 버튼들 */}
        <div className="w-1/3 space-y-2">
          {capabilities.map((capability) => (
            <button
              key={capability.key}
              onClick={() => onCapabilitySelect(capability.key)}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                selectedCapability === capability.key
                  ? `${capability.themeColor.border} ${capability.themeColor.bg} ${capability.themeColor.text}`
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{capability.title}</span>
                <span className={`text-xs font-bold ${capability.color}`}>
                  {capability.score}점
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${capability.themeColor.progress}`}
                  style={{ width: `${capability.score}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* 우측: 선택된 역량 상세 정보 */}
        <div className="flex-1">
          <div className={`p-2 rounded-lg border-2 ${selectedData.themeColor.border} bg-white h-full`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Target className={`h-3 w-3 ${selectedData.themeColor.icon}`} />
                <h4 className={`text-sm font-semibold ${selectedData.themeColor.text}`}>{selectedData.title}</h4>
              </div>
              <div className={`text-sm font-bold ${selectedData.color}`}>
                {selectedData.score}점
              </div>
            </div>
            
            <p className={`text-sm font-semibold text-gray-700 mb-1.5 leading-relaxed`}>
              {selectedData.summary}
            </p>
            
            <div className="space-y-0.5">
              {selectedData.details.map((detail, index) => (
                <p key={index} className={`text-xs ${selectedData.themeColor.text}`}>
                  {detail}
                </p>
              ))}
            </div>
          </div>
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
            <Target className="w-6 h-6 text-blue-600" />
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
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);

  // API 호출 함수
  const fetchRecommendations = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.get<JobRecommendationResponse>('/api/job-search/recommendations/', {
        params: {
          user_id: currentPersona.user_id,
          persona_id: currentPersona.persona_id
        }
      });
      
      // company_logo 디버깅을 위한 로그만 유지
      if (data?.recommendations && data.recommendations.length > 0) {
        console.log('🔍 첫 번째 공고의 company_logo:', data.recommendations[0].company_logo);
        console.log('🔍 배경 이미지 적용 확인:', {
          hasCompanyLogo: !!data.recommendations[0].company_logo,
          logoUrl: data.recommendations[0].company_logo
        });
      }
      
      setRecommendationData(data);
    } catch (err: any) {
      console.error('❌ 추천 공고 조회 실패:', err);
      setError('추천 공고를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // 데이터가 로드되면 첫 번째 역량을 자동 선택
  useEffect(() => {
    if (recommendationData?.competency?.details && Object.keys(recommendationData.competency.details).length > 0) {
      const firstCapability = Object.keys(recommendationData.competency.details)[0];
      setSelectedCapability(firstCapability);
    }
  }, [recommendationData]);

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
        <main className="px-6 py-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* 상단: 페르소나 카드 */}
            <div className="mb-4">
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
                    selectedCapability={selectedCapability}
                    onCapabilitySelect={setSelectedCapability}
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
                {(recommendationData.recommendations || []).map((job) => {
                  // 배경 이미지 디버깅
                  console.log(`🎨 공고 ${job.job_posting_id} 배경 이미지 설정:`, {
                    company_logo: job.company_logo,
                    hasLogo: !!job.company_logo,
                    backgroundStyle: job.company_logo ? `url(${job.company_logo})` : 'none'
                  });
                  
                  return (
                  <div
                    key={job.job_posting_id}
                    className="group cursor-pointer rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow transition-shadow min-h-[260px]"
                    onClick={() => onJobSelect(job.job_posting_id)}
                  >
                    {/* Top area with background image and match badge */}
                    <div 
                      className="relative h-32 overflow-hidden bg-gray-100 flex items-center justify-center"
                      style={{
                        backgroundImage: job.company_logo ? `url(${job.company_logo})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      {/* 배경 이미지가 있을 때 오버레이 추가 */}
                      {job.company_logo && (
                        <div className="absolute inset-0 bg-black/20"></div>
                      )}
                      
                      {/* 회사 로고는 제거하고 배경 이미지만 사용 */}
                      
                      <button
                        className={`absolute top-2 right-2 text-white hover:text-gray-200 z-20`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleScrap(job.job_posting_id);
                        }}
                        aria-label="스크랩"
                      >
                        <Bookmark className={`h-4 w-4 ${scrapedJobs.has(job.job_posting_id) ? 'fill-current text-blue-400' : ''} drop-shadow-sm`} />
                      </button>
                      <span className="absolute bottom-2 left-2 text-[11px] px-2 py-0.5 rounded-md bg-white/90 text-blue-700 border border-blue-200 z-10">
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
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}