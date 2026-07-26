import { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, JobDetailResponse } from '../types';

interface JobDetailProps {
  jobId: string | null;
  currentPersona: PersonaResponse | null;
  scrapedJobs: Set<string>;
  onNavigate: (page: Page) => void;
  onToggleScrap: (jobId: string) => void;
}

export function JobDetail({ jobId, currentPersona, scrapedJobs, onNavigate, onToggleScrap }: JobDetailProps) {
  const [isCoverLetterExpanded, setIsCoverLetterExpanded] = useState(false);
  const [isMatchPointsExpanded, setIsMatchPointsExpanded] = useState(false);
  const [isImprovementPointsExpanded, setIsImprovementPointsExpanded] = useState(false);
  const [isGrowthSuggestionsExpanded, setIsGrowthSuggestionsExpanded] = useState(false);
  const [jobDetailData, setJobDetailData] = useState<JobDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchJobDetail = useCallback(async () => {
    if (!jobId || !currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.get<JobDetailResponse>(`/api/job-search/recommendations/${jobId}/`, {
        params: {
          user_id: currentPersona.user_id,
          persona_id: currentPersona.persona_id
        }
      });
      
      setJobDetailData(data);
    } catch {
      setError('공고 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [jobId, currentPersona]);

  useEffect(() => {
    fetchJobDetail();
  }, [fetchJobDetail]);

  const personaSkills = useMemo(() => {
    if (!currentPersona) {
      return new Set<string>();
    }

    // 배열 내 문자열 파싱 함수
    const parseData = (data: string[] | string | undefined): string[] => {
      if (!data) return [];
      if (Array.isArray(data) && data.length === 1 && typeof data[0] === 'string') {
        try {
          return JSON.parse(data[0]);
        } catch {
          return data[0].split(',').map(item => item.trim().replace(/['"]/g, ''));
        }
      }
      if (Array.isArray(data)) return data;
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch {
          return data.split(',').map(item => item.trim().replace(/['"]/g, ''));
        }
      }
      return [];
    };

    const techStack = parseData(currentPersona.skills);
    const certifications = parseData(currentPersona.certifications);
    return new Set<string>([...techStack, ...certifications]);
  }, [currentPersona]);

  if (!jobId || !currentPersona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">공고 정보를 불러올 수 없습니다</p>
          <Button onClick={() => onNavigate('job-recommendations')}>
            추천 공고로 돌아가기
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
          <p className="text-gray-600">공고 상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchJobDetail}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (!jobDetailData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">공고 상세 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const job = jobDetailData.job_posting;
  const recommendation = jobDetailData.recommendation;

  // 서버 데이터를 레이더 차트용으로 변환 (내 역량 vs 공고 역량)
  const radarData = Object.entries(job.required_competencies).map(([competency, requiredScore]) => {
    // 한국어 역량명 매핑
    const competencyMapping: Record<string, string> = {
      'Debugging': '디버깅',
      'Coding_Skills': '구현 역량', 
      'Problem_Solving': '문제 분해',
      'Continuous_Learning': '학습 지속성',
      'Collaboration': '협업 규범'
    };
    
    const koreanName = competencyMapping[competency] || competency.replace('_', ' ');
    const myScore = jobDetailData?.persona_competency_scores?.[koreanName] || 0;
    
    return {
      subject: koreanName,
      A: requiredScore, // 공고 요구 역량
      B: myScore,       // 내 역량
      fullMark: 100
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('job-recommendations')}
            className="flex items-center space-x-2"
          >
            <span>목록으로</span>
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">공고 상세</h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleScrap(jobId)}
              className={`${scrapedJobs.has(jobId) ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
            >
              {scrapedJobs.has(jobId) ? '스크랩됨' : '스크랩'}
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              지원하기
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-40 py-6">
        <div className="max-w-none mx-auto">
          {/* Job Header */}
          <div 
            className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4"
            style={{
              backgroundImage: job.company_logo ? `url(${job.company_logo})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* 왼쪽에서 오른쪽으로 흐릿해지는 그라데이션 오버레이 */}
            {job.company_logo && (
              <div 
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.8) 100%)'
                }}
              ></div>
            )}
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {job.title}
                </h1>
                <p className="text-base text-gray-600 mb-1">{job.company_name}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{job.work_conditions.location}</span>
                  <span>•</span>
                  <span>{job.work_conditions.employment_type}</span>
                  <span>•</span>
                  <span>{job.work_conditions.position}</span>
                  <span>•</span>
                  <span>채용 {job.hires_count}명</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {recommendation.recommendation_score}%
                </div>
                <div className="text-xs text-gray-500">매칭도</div>
              </div>
            </div>
          </div>

          {/* Main Layout - 10분할 기준 */}
          <div className="grid grid-cols-10 gap-4">
            {/* Left 7/10 Area */}
            <div className="col-span-7 space-y-4">
              {/* Radar Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">역량 매치 분석</h2>
                <p className="text-sm text-gray-600 mb-3">내 역량과 공고 요구사항 비교</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="내 역량"
                        dataKey="B"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="공고 요구 역량"
                        dataKey="A"
                        stroke="#6B7280"
                        fill="#6B7280"
                        fillOpacity={0.1}
                        strokeDasharray="5 5"
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tech Stack Match */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">기술 스택 매치</h2>
                <p className="text-sm text-gray-600 mb-3">공고 요구 기술과 내 보유 기술 비교</p>
                
                {/* Required Skills */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">필수 기술/자격증</h3>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.map((skill, index) => {
                      const isOwned = personaSkills.has(skill);
                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                            isOwned
                              ? 'text-blue-700 bg-blue-100/70 border border-blue-200/70 hover:bg-blue-100/80'
                              : 'text-gray-400 bg-gray-100/50 border border-gray-200/50 cursor-not-allowed opacity-70'
                          }`}
                        >
                          {isOwned && <span className="mr-1">✓</span>}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Skills */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">선호 기술/자격증</h3>
                  <div className="flex flex-wrap gap-1">
                    {job.preferred.map((skill, index) => {
                      const isOwned = personaSkills.has(skill);
                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                            isOwned
                              ? 'text-blue-700 bg-blue-100/70 border border-blue-200/70 hover:bg-blue-100/80'
                              : 'text-gray-400 bg-gray-100/50 border border-gray-200/50 cursor-not-allowed opacity-70'
                          }`}
                        >
                          {isOwned && <span className="mr-1">✓</span>}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">공고 상세 정보</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Required Qualifications */}
                    <div className="bg-gray-50 rounded-xl p-3 h-40 flex flex-col">
                      <h3 className="text-xs font-medium text-blue-700 mb-2">필수 요건</h3>
                      <ul className="space-y-1 flex-1">
                        {job.required_qualifications.map((qualification, index) => (
                          <li key={index} className="text-xs text-gray-700 flex items-start space-x-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{qualification}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    {job.benefits.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 h-40 flex flex-col">
                        <h3 className="text-xs font-medium text-blue-700 mb-2">복리후생 & 혜택</h3>
                        <ul className="space-y-1 flex-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="text-xs text-gray-700 flex items-start space-x-2">
                              <span className="text-blue-500 mt-0.5">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Preferred Qualifications */}
                    {job.preferred_qualifications.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 h-40 flex flex-col">
                        <h3 className="text-xs font-medium text-blue-700 mb-2">우대 사항</h3>
                        <ul className="space-y-1 flex-1">
                          {job.preferred_qualifications.map((qualification, index) => (
                            <li key={index} className="text-xs text-gray-700 flex items-start space-x-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{qualification}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ideal Candidate */}
                    {job.ideal_candidate.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 h-40 flex flex-col">
                        <h3 className="text-xs font-medium text-blue-700 mb-2">인재상</h3>
                        <ul className="space-y-1 flex-1">
                          {job.ideal_candidate.map((candidate, index) => (
                            <li key={index} className="text-xs text-gray-700 flex items-start space-x-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{candidate}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Cover Letter Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">AI 맞춤 자기소개서</h2>
                    <p className="text-sm text-gray-600">이 공고에 특화된 자기소개서 미리보기</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCoverLetterExpanded(!isCoverLetterExpanded)}
                    className="text-sm px-3 py-2"
                  >
                    {isCoverLetterExpanded ? '접기' : '미리보기'}
                  </Button>
                </div>
                
                {isCoverLetterExpanded && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <h3 className="font-medium text-gray-900 text-sm mb-2">{job.company_name} 지원서</h3>
                      <div className="text-xs text-gray-700 leading-relaxed">
                        {jobDetailData.cover_letter_preview}
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      완전한 자기소개서 작성하기
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right 3/10 Area - Sticky AI Recommendation */}
            <div className="col-span-3">
              <div className="sticky top-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-2">AI 추천 이유</h2>
                  <p className="text-xs text-gray-600 mb-3">추천 근거 요약</p>
                  
                  {/* Overall Matching Score */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      {/* Circular Progress Bar */}
                      <div className="w-24 h-24 relative">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background Circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          {/* Progress Circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - recommendation.recommendation_score / 100)}`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        {/* Score Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {recommendation.recommendation_score}
                            </div>
                            <div className="text-xs font-medium text-gray-500">%</div>
                          </div>
                        </div>
                      </div>
                      {/* Label */}
                      <div className="text-center mt-2">
                        <div className="text-sm font-semibold text-gray-800">종합 매칭 점수</div>
                        <div className="text-xs text-gray-500">AI 분석 결과</div>
                      </div>
                    </div>
                  </div>

                  {/* Match Points */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-medium text-green-700">매칭 강점</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMatchPointsExpanded(!isMatchPointsExpanded)}
                        className="text-xs px-1 py-0 h-auto text-green-700 hover:text-green-800"
                      >
                        {isMatchPointsExpanded ? '접기' : '펼치기'}
                      </Button>
                    </div>
                    {isMatchPointsExpanded && (
                      <ul className="space-y-0.5">
                        {recommendation.reason_summary.match_points.map((point, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Improvement Points */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-medium text-orange-700">개선 포인트</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsImprovementPointsExpanded(!isImprovementPointsExpanded)}
                        className="text-xs px-1 py-0 h-auto text-orange-700 hover:text-orange-800"
                      >
                        {isImprovementPointsExpanded ? '접기' : '펼치기'}
                      </Button>
                    </div>
                    {isImprovementPointsExpanded && (
                      <ul className="space-y-0.5">
                        {recommendation.reason_summary.improvement_points.map((point, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Growth Suggestions */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-medium text-blue-700">성장 제안</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsGrowthSuggestionsExpanded(!isGrowthSuggestionsExpanded)}
                        className="text-xs px-1 py-0 h-auto text-blue-700 hover:text-blue-800"
                      >
                        {isGrowthSuggestionsExpanded ? '접기' : '펼치기'}
                      </Button>
                    </div>
                    {isGrowthSuggestionsExpanded && (
                      <ul className="space-y-0.5">
                        {recommendation.reason_summary.growth_suggestions.map((suggestion, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                            <span className="text-blue-500 mt-0.5">→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full bg-black text-white hover:bg-gray-800 text-xs py-2">
                      자기소개서 작성
                    </Button>
                    <Button variant="outline" className="w-full text-xs py-2">
                      면접 연습하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
