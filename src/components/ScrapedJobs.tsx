import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MapPin, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PersonaCardHeader } from './PersonaCardHeader';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, ScrapedJobsResponse } from '../types';

interface ScrapedJobsProps {
  currentPersona: PersonaResponse | null;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onJobSelect: (jobId: string) => void;
}

export function ScrapedJobs({ 
  currentPersona, 
  onNavigate, 
  onJobSelect
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
      
      setScrapedJobsData(data);
    } catch {
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
    if (!deadline || deadline.trim() === '') {
      return '마감일 미정';
    }
    
    // ISO 8601 형식 파싱 (2025-10-31T23:59:59+09:00)
    const date = new Date(deadline);
    
    // 유효하지 않은 날짜 처리
    if (isNaN(date.getTime())) {
      return '마감일 미정';
    }
    
    // 현재 시간 (로컬 시간)
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
        {currentPersona && <PersonaCardHeader persona={currentPersona} />}

        {scrapedJobsData.scraped_jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">스크랩한 공고가 없습니다</h3>
            <p className="text-gray-400 mb-6">관심 있는 공고를 스크랩해보세요</p>
            <Button onClick={() => onNavigate(currentPersona ? 'job-recommendations' : 'persona-waiting', 'scraped-jobs')}>
              {currentPersona ? '추천 공고 보기' : '페르소나 생성하기'}
            </Button>
          </div>
        ) : null}

        <div className="mt-12">
          {currentPersona ? (
            <Table className="rounded-xl overflow-hidden shadow-lg border border-gray-200/50">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-gray-50 border-b-2 border-blue-200">
                  <TableHead className="py-4 px-6 font-semibold text-gray-900 text-left first:rounded-tl-xl">기업명</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900 text-left">공고명</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900 text-left">직무</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900 text-left">필요 자격증/기술 스택</TableHead>
                  <TableHead className="text-center py-4 px-6 font-semibold text-gray-900 min-w-[100px]">추천도</TableHead>
                  <TableHead className="text-center py-4 px-6 font-semibold text-gray-900 min-w-[100px] last:rounded-tr-xl">마감일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrapedJobsData.scraped_jobs.map((job, index) => (
                  <TableRow
                    key={job.job_posting_id}
                    className={`cursor-pointer hover:bg-blue-50/50 transition-all duration-200 border-b-2 ${
                      index % 2 === 0 
                        ? 'bg-white border-gray-200/60' 
                        : 'bg-gray-50/50 border-gray-300/60'
                    } hover:shadow-md hover:scale-[1.01] rounded-lg`}
                    onClick={() => onJobSelect(job.job_posting_id)}
                  >
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={job.company_logo}
                          alt={`${job.company_name} 로고`}
                          className="w-12 h-12 rounded-xl object-cover shadow-md border border-gray-200/50"
                        />
                        <span className="font-semibold text-gray-900 text-base">{job.company_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <div className="space-y-2">
                        <p className="font-bold text-gray-900 leading-tight text-lg">{job.job_title}</p>
                        <div className="flex items-center text-sm text-gray-600 bg-gray-100/50 px-3 py-1 rounded-full w-fit">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {job.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full">
                        {job.job_category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {job.requirements?.slice(0, 3).map((req, index) => {
                          // 페르소나의 보유 기술/자격증과 비교
                          const personaSkills = [
                            ...(currentPersona?.skills || []),
                            ...(currentPersona?.certifications || [])
                          ].flat();
                          
                          // 문자열 파싱 (JSON 또는 쉼표로 구분된 문자열)
                          const parsePersonaSkills = (skills: string[]): string[] => {
                            return skills.flatMap(skill => {
                              if (typeof skill === 'string') {
                                try {
                                  const parsed = JSON.parse(skill);
                                  return Array.isArray(parsed) ? parsed : [skill];
                                } catch {
                                  return skill.split(',').map(s => s.trim().replace(/['"]/g, ''));
                                }
                              }
                              return skill;
                            });
                          };
                          
                          const parsedPersonaSkills = parsePersonaSkills(personaSkills);
                          const isOwned = parsedPersonaSkills.some(skill => 
                            skill.toLowerCase().trim() === req.toLowerCase().trim()
                          );
                          
                          return (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className={`text-xs px-3 py-1 rounded-full ${
                                isOwned 
                                  ? 'text-blue-700 bg-blue-100/70 border-blue-200/70 font-medium' 
                                  : 'text-gray-600 bg-gray-100 border-gray-200'
                              }`}
                            >
                              {req}
                            </Badge>
                          );
                        })}
                        {job.requirements && job.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                            +{job.requirements.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5 px-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-xl font-bold text-sm shadow-md border border-blue-200/50">
                        {job.recommendation_score ? `${job.recommendation_score}%` : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5 px-6">
                      <Badge
                        variant={formatDeadline(job.deadline).includes('마감') ? 'destructive' : 'outline'}
                        className="font-semibold px-4 py-2 rounded-full text-sm"
                      >
                        {formatDeadline(job.deadline)}
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
