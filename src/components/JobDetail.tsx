import { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
      
      console.log('🔍 공고 상세 데이터:', data);
      setJobDetailData(data);
    } catch (err) {
      console.error('공고 상세 조회 실패:', err);
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

    const techStack = currentPersona.skills ?? [];
    const certifications = currentPersona.certifications ?? [];
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

  // 서버 데이터를 기존 구조에 맞게 변환
  const radarData = Object.entries(job.required_competencies).map(([competency, score]) => ({
    subject: competency.replace('_', ' '),
    A: score,
    fullMark: 100
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

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
            <span>← 추천 공고로</span>
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {job.job_category}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleScrap(jobId)}
              className={`${scrapedJobs.has(jobId) ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
            >
              {scrapedJobs.has(jobId) ? '스크랩됨' : '스크랩'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
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
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">{job.company_name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {recommendation.recommendation_score}%
                    </div>
                    <div className="text-sm text-gray-500">매칭도</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">직무 설명</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.job_description}
                </p>
              </div>

              {/* Required Qualifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">필수 자격요건</h2>
                <ul className="space-y-2">
                  {job.required_qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700">{qualification}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preferred Qualifications */}
              {job.preferred_qualifications.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">우대 자격요건</h2>
                  <ul className="space-y-2">
                    {job.preferred_qualifications.map((qualification, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-gray-700">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">필수 기술 스택</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((skill, index) => (
                    <Badge
                      key={index}
                      variant={personaSkills.has(skill) ? "default" : "secondary"}
                      className={personaSkills.has(skill) ? "bg-green-100 text-green-800" : ""}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              {job.preferred.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">우대 기술 스택</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.preferred.map((skill, index) => (
                      <Badge
                        key={index}
                        variant={personaSkills.has(skill) ? "default" : "outline"}
                        className={personaSkills.has(skill) ? "bg-blue-100 text-blue-800" : ""}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">복리후생</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideal Candidate */}
              {job.ideal_candidate.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">인재상</h2>
                  <ul className="space-y-2">
                    {job.ideal_candidate.map((candidate, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span className="text-gray-700">{candidate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Analysis & Cover Letter */}
            <div className="space-y-6">
              {/* Competency Radar Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">요구 역량 분석</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="요구 역량"
                        dataKey="A"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 분석</h2>
                
                {/* Match Points */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-green-700 mb-2">일치점</h3>
                  <ul className="space-y-1">
                    {recommendation.reason_summary.match_points.map((point, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Points */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-orange-700 mb-2">보완점</h3>
                  <ul className="space-y-1">
                    {recommendation.reason_summary.improvement_points.map((point, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth Suggestions */}
                <div>
                  <h3 className="text-sm font-medium text-blue-700 mb-2">성장 제안</h3>
                  <ul className="space-y-1">
                    {recommendation.reason_summary.growth_suggestions.map((suggestion, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                        <span className="text-blue-500 mt-0.5">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cover Letter Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">자기소개서 미리보기</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCoverLetterExpanded(!isCoverLetterExpanded)}
                  >
                    {isCoverLetterExpanded ? '접기' : '펼치기'}
                  </Button>
                </div>
                <div className={`text-sm text-gray-700 leading-relaxed ${isCoverLetterExpanded ? '' : 'line-clamp-6'}`}>
                  {jobDetailData.cover_letter_preview}
                </div>
              </div>

              {/* Application Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">지원 정보</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">등록일</span>
                    <span className="text-gray-900">{formatDate(job.registration_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">마감일</span>
                    <span className="text-gray-900">{formatDate(job.application_deadline)}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" size="lg">
                  지원하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}