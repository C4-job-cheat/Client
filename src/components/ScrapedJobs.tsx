import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MapPin, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PersonaCardHeader } from './PersonaCardHeader';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, ScrapedJobsResponse, ScrapedJob } from '../types';

interface ScrapedJobsProps {
  currentPersona: PersonaResponse | null;
  scrapedJobs: Set<string>;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onJobSelect: (jobId: string) => void;
  onToggleScrap: (jobId: string) => void;
}

export function ScrapedJobs({ 
  currentPersona, 
  scrapedJobs, 
  onNavigate, 
  onJobSelect,
  onToggleScrap
}: ScrapedJobsProps) {
  const [scrapedJobsData, setScrapedJobsData] = useState<ScrapedJobsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchScrapedJobs = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.get<ScrapedJobsResponse>('/api/job-search/scrap/list/', {
        params: {
          user_id: currentPersona.user_id,
          persona_id: currentPersona.persona_id
        }
      });
      
      console.log('🔍 스크랩된 공고 목록:', data);
      setScrapedJobsData(data);
    } catch (err) {
      console.error('스크랩된 공고 목록 조회 실패:', err);
      setError('스크랩된 공고 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchScrapedJobs();
  }, [fetchScrapedJobs]);

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
          <p className="text-gray-600">스크랩된 공고를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchScrapedJobs}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (!scrapedJobsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">스크랩된 공고 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '마감';
    if (diffDays === 0) return '오늘 마감';
    if (diffDays === 1) return '내일 마감';
    return `D-${diffDays}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2"
              disabled={!currentPersona}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>홈으로</span>
            </Button>
            <h1 className="font-semibold">공고 모아보기</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 페르소나 카드 헤더 */}
        {currentPersona ? (
          <>
            <PersonaCardHeader persona={currentPersona} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <p className="text-gray-500">직무</p>
                <p className="font-medium text-gray-900">{scrapedJobsData.persona_card.job_role ?? '직무 미지정'}</p>
              </div>
              <div>
                <p className="text-gray-500">학력</p>
                <p className="font-medium text-gray-900">{scrapedJobsData.persona_card.school_name ?? '학력 정보 없음'}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-xs text-gray-500">
            페르소나를 먼저 생성해주세요.
          </div>
        )}

        {scrapedJobList.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">스크랩한 공고가 없습니다</h3>
            <p className="text-gray-400 mb-6">관심 있는 공고를 스크랩해보세요</p>
            <Button onClick={() => onNavigate(currentPersona ? 'job-recommendations' : 'persona-waiting', 'scraped-jobs')}>
              {currentPersona ? '추천 공고 보기' : '페르소나 생성하기'}
            </Button>
          </div>
        ) : currentPersona ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-6">
            {scrapedJobsData.scraped_jobs.map((job) => (
              <div
                key={job.job_posting_id}
                className="p-4 border border-gray-200 rounded-xl hover:shadow transition-shadow"
                onClick={() => onJobSelect(job.job_posting_id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <ImageWithFallback
                    src={job.company_logo}
                    alt={`${job.company_name} 로고`}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.job_title}</h3>
                    <p className="text-xs text-gray-500">{job.company_name}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements?.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="outline" className="text-[10px]">
                        {req}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-3 h-3" />
                      <span>{job.job_category}</span>
                    </div>
                    <span className="text-red-600 font-medium">
                      {formatDeadline(job.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            페르소나를 설정하면 스크랩한 공고를 볼 수 있어요.
          </div>
        )}

        <div className="mt-12">
          {currentPersona ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead className="py-4 px-6 font-semibold text-gray-900">기업명</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900">공고명</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900">직무</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900">필요 자격증/기술 스택</TableHead>
                  <TableHead className="text-center py-4 px-6 font-semibold text-gray-900 min-w-[100px]">추천도</TableHead>
                  <TableHead className="text-center py-4 px-6 font-semibold text-gray-900 min-w-[100px]">마감일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrapedJobList.map((job) => (
                  <TableRow
                    key={job.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() => onJobSelect(job.id)}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={job.logoUrl}
                          alt={`${job.company} 로고`}
                          className="w-10 h-10 rounded-lg object-cover shadow-sm"
                        />
                        <span className="font-medium text-gray-900">{job.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 leading-tight">{job.title}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.details.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="outline" className="text-sm">
                        {job.field}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {job.details.techStack?.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {job.details.techStack && job.details.techStack.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500">
                            +{job.details.techStack.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4 px-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full font-semibold">
                        {job.matchScore}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4 px-6">
                      <Badge
                        variant={formatDeadline(job.details.deadline).includes('마감') ? 'destructive' : 'outline'}
                        className="font-medium"
                      >
                        {formatDeadline(job.details.deadline)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-400 text-sm py-10">
              페르소나 정보가 없으면 테이블을 볼 수 없습니다.
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => currentPersona ? onNavigate('job-recommendations') : onNavigate('persona-waiting', 'scraped-jobs')}
            className="px-8 py-2"
          >
            더 많은 공고 찾아보기
          </Button>
        </div>
      </div>
    </div>
  );
}