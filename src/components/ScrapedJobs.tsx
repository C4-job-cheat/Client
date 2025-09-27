import { ArrowLeft, MapPin, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PersonaCardHeader } from './PersonaCardHeader';
import type { Page, Persona } from '../types';

// Mock data for jobs
const mockJobs = [
  {
    id: '1',
    company: '토스',
    title: '프론트엔드 개발자',
    field: '개발/프로그래밍',
    matchScore: 95,
    requirements: {
      career: 4, global: 3, environment: 5, compensation: 4, learning: 5, networking: 3
    },
    details: {
      location: '서울 강남구',
      education: '대학교 졸업',
      employmentType: '정규직',
      registeredDate: '2024-12-01',
      deadline: '2024-12-31',
      description: '토스의 프론트엔드 개발자로서 사용자 경험을 개선하고 혁신적인 서비스를 개발합니다.',
      jobDescription: '사용자 인터페이스를 개발하고 유지 관리하는 역할',
      techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      certifications: ['정보처리기사']
    },
    aiReason: '귀하의 React 및 TypeScript 경험이 토스의 기술 스택과 매우 잘 맞습니다.',
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    company: '네이버',
    title: 'UX/UI 디자이너',
    field: '디자인',
    matchScore: 88,
    requirements: {
      career: 3, global: 4, environment: 4, compensation: 4, learning: 4, networking: 4
    },
    details: {
      location: '경기 성남시',
      education: '대학교 졸업',
      employmentType: '정규직',
      registeredDate: '2024-11-28',
      deadline: '2024-12-25',
      description: '네이버의 다양한 서비스에서 사용자 경험을 디자인하고 개선합니다.',
      jobDescription: '사용자 경험을 디자인하고 프로토타입을 제작하는 역할',
      techStack: ['Figma', 'Sketch', 'Adobe Creative Suite'],
      certifications: ['컴퓨터그래픽스운용기능사']
    },
    aiReason: '디자인 포트폴리오와 사용자 경험에 대한 이해가 뛰어나십니다.',
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    company: '카카오',
    title: '백엔드 개발자',
    field: '개발/프로그래밍',
    matchScore: 82,
    requirements: {
      career: 5, global: 3, environment: 4, compensation: 5, learning: 4, networking: 3
    },
    details: {
      location: '제주도',
      education: '대학교 졸업',
      employmentType: '정규직',
      registeredDate: '2024-11-25',
      deadline: '2024-12-20',
      description: '카카오의 대규모 서비스를 지원하는 백엔드 시스템을 개발합니다.',
      jobDescription: '서버 및 데이터베이스를 관리하고 API를 개발하는 역할',
      techStack: ['Java', 'Spring', 'MySQL', 'Redis'],
      certifications: ['정보처리기사', 'AWS Solutions Architect']
    },
    aiReason: '백엔드 개발 경험과 대규모 시스템에 대한 이해가 있으십니다.',
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  }
];

interface ScrapedJobsProps {
  currentPersona: Persona | null;
  scrapedJobs: Set<string>;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onJobSelect: (jobId: string) => void;
}

export function ScrapedJobs({ 
  currentPersona, 
  scrapedJobs, 
  onNavigate, 
  onJobSelect
}: ScrapedJobsProps) {
  // 스크랩된 공고만 필터링
  const scrapedJobList = mockJobs.filter(job => scrapedJobs.has(job.id));

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
        {currentPersona && (
          <div className="mb-8">
            <PersonaCardHeader persona={currentPersona} />
          </div>
        )}

        {scrapedJobList.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">스크랩한 공고가 없습니다</h3>
            <p className="text-gray-400 mb-6">관심 있는 공고를 스크랩해보세요</p>
            <Button onClick={() => currentPersona ? onNavigate('job-recommendations') : onNavigate('persona-waiting', 'scraped-jobs')}>
              공고 추천받기
            </Button>
          </div>
        ) : (
          <>

            {/* Desktop-optimized Full-width Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
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
                          <span className="font-medium">{job.company}</span>
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
                          {job.details.techStack?.slice(0, 3).map((tech) => {
                            // Mock persona tech skills - in real app, get from currentPersona
                            const personaTechSkills = ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'];
                            const hasSkill = personaTechSkills.includes(tech);
                            return (
                              <Badge 
                                key={tech} 
                                variant={hasSkill ? "default" : "outline"}
                                className={hasSkill ? "bg-blue-600 text-white text-xs" : "bg-gray-100 text-gray-500 text-xs"}
                              >
                                {tech}
                              </Badge>
                            );
                          })}
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
          </>
        )}
      </div>
    </div>
  );
}