import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ArrowLeft, Bookmark, Clock, Info, Brain, Target, Zap, BarChart } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { PersonaCardHeader } from './PersonaCardHeader';
import type { Page, Persona, Job } from '../types';

interface JobRecommendationsProps {
  currentPersona: Persona | null;
  scrapedJobs: Set<string>;
  onNavigate: (page: Page) => void;
  onJobSelect: (jobId: string) => void;
  onToggleScrap: (jobId: string) => void;
}

// Mock job recommendations
const mockJobs: Job[] = [
  {
    id: '1',
    company: '토스',
    title: '프론트엔드 개발자',
    field: 'IT/개발',
    matchScore: 94,
    requirements: { 
      expertise: 85, 
      potential: 90, 
      problemSolving: 80, 
      collaboration: 85, 
      adaptability: 95
    },
    details: {
      location: '서울 강남구',
      employmentType: '정규직',
      registeredDate: '2024-03-10',
      deadline: '2024-04-10',
      description: '혁신적인 핀테크 서비스를 만들어갈 프론트엔드 개발자를 찾습니다.',
      jobDescription: '사용자 인터페이스를 개발하고 유지 관리하는 역할',
      requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', '정보처리기사']
    },
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    company: '네이버',
    title: 'UI/UX 디자이너',
    field: '디자인',
    matchScore: 87,
    requirements: { 
      expertise: 80, 
      potential: 85, 
      problemSolving: 75, 
      collaboration: 90, 
      adaptability: 85
    },
    details: {
      location: '경기 성남시',
      employmentType: '정규직',
      registeredDate: '2024-03-12',
      deadline: '2024-04-15',
      description: '사용자 중심의 디자인으로 더 나은 경험을 만들어갈 디자이너를 모집합니다.',
      jobDescription: '사용자 경험을 디자인하고 프로토타입을 제작하는 역할',
      requiredSkills: ['Figma', 'Sketch', 'Adobe Creative Suite', '컴퓨터그래픽스운용기능사']
    },
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    company: '카카오',
    title: '데이터 분석가',
    field: '데이터/분석',
    matchScore: 91,
    requirements: { 
      expertise: 90, 
      potential: 85, 
      problemSolving: 95, 
      collaboration: 80, 
      adaptability: 88
    },
    details: {
      location: '제주 제주시',
      employmentType: '정규직',
      registeredDate: '2024-03-08',
      deadline: '2024-04-05',
      description: '빅데이터를 통해 인사이트를 발견하고 비즈니스 성장을 이끌어갈 분석가를 찾습니다.',
      jobDescription: '데이터를 분석하여 비즈니스 인사이트를 도출하는 역할',
      requiredSkills: ['Python', 'SQL', 'Tableau', 'R', '데이터분석전문가', 'SQL개발자']
    },
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    company: '쿠팡',
    title: '풀스택 개발자',
    field: 'IT/개발',
    matchScore: 89,
    requirements: { 
      expertise: 88, 
      potential: 85, 
      problemSolving: 90, 
      collaboration: 85, 
      adaptability: 90
    },
    details: {
      location: '서울 송파구',
      employmentType: '정규직',
      registeredDate: '2024-03-15',
      deadline: '2024-04-20',
      description: '이커머스 플랫폼의 핵심 기능을 개발할 풀스택 개발자를 모집합니다.',
      jobDescription: '프론트엔드와 백엔드를 모두 개발하는 역할',
      requiredSkills: ['React', 'Node.js', 'Java', 'AWS', '정보처리기사', 'AWS Solutions Architect']
    },
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  }
];

// 레이더 차트 컴포넌트
function CapabilityRadarChart() {
  const personaCapabilities = [
    { subject: '직무 전문성', A: 88, fullMark: 100 },
    { subject: '성장 잠재력', A: 90, fullMark: 100 },
    { subject: '문제 해결력', A: 85, fullMark: 100 },
    { subject: '협업 능력', A: 78, fullMark: 100 },
    { subject: '적응력', A: 92, fullMark: 100 }
  ];

  const capabilityDescriptions = {
    '직무 전문성': '학력, 자격증, 기술 스택 등 직무 수행에 필요한 전문 지식과 기술',
    '성장 잠재력': '새로운 기술 학습 의욕, 커리어 목표 설정 및 달성 의지',
    '문제 해결력': '어려운 상황에서의 문제 해결 경험과 논리적 사고 능력',
    '협업 능력': '팀워크, 소통 능력, 갈등 해결 및 설득 능력',
    '적응력': '변화하는 환경과 새로운 기술에 대한 적응 및 학습 능력'
  };

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
              <p>각 항목에 마우스를 올려 상세 설명을 확인하세요</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 레이더 차트 (축 호버 시 설명/점수 툴팁 표시) */}
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={personaCapabilities}>
              <PolarGrid gridType="circle" />
              <PolarAngleAxis 
                dataKey="subject" 
                className="text-sm cursor-pointer" 
                tick={{ fill: '#4B5563', fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
              <RechartsTooltip
                formatter={(value: any) => [`${value}/100`, '점수']}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#374151', fontWeight: '500' }}
                itemStyle={{ color: '#3B82F6' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)', stroke: '#3B82F6', strokeWidth: 1 }}
              />
              <Radar
                name="내 역량"
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </RadarChart>
        </ResponsiveContainer>
        {/* 축별 설명 오버레이는 SWC 파싱 이슈로 제거하고 기본 툴팁 사용 */}
      </div>
    </div>
  );
}

// AI 종합 분석 컴포넌트
function AIAnalysisSummary() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">AI 분석 요약</h3>
        <p className="text-sm text-gray-500">현재 페르소나 기반 역량 분석 결과</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium mb-1">핵심 강점</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                적응력과 성장 잠재력이 특히 뛰어납니다. 변화하는 환경에 빠르게 적응하며,
                새로운 기술과 지식을 습득하는 의욕이 높아 IT 분야에서 성공할 가능성이 큽니다.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium mb-1">개선 영역</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                협업 능력을 더 발전시키면 팀 프로젝트에서 더욱 효과적으로 기여할 수 있을 것으로 보입니다.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium mb-1">추천 방향</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                현재 역량을 바탕으로 프론트엔드 개발이나 데이터 분석 분야에서
                높은 성과를 낼 수 있을 것으로 예상됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobRecommendations({ currentPersona, scrapedJobs, onNavigate, onJobSelect, onToggleScrap }: JobRecommendationsProps) {
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisplayedJobs(mockJobs.slice(0, 4));
  }, []);

  const loadMoreJobs = () => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const moreJobs = mockJobs.map(job => ({
        ...job,
        id: `${job.id}-${nextPage}`,
        company: `${job.company} ${nextPage}`
      }));
      
      setDisplayedJobs(prev => [...prev, ...moreJobs.slice(0, Math.min(4, 20 - prev.length))]);
      setPage(nextPage);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
        return;
      }
      
      if (displayedJobs.length < 20) {
        loadMoreJobs();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedJobs.length, loading]);

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-xl drop-shadow-sm">
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
                  <CapabilityRadarChart />
                </Card>
              </div>

              {/* 우측 7/11: AI 종합 분석 요약 */}
              <div className="lg:col-span-7">
                <Card className="p-4 h-80 flex flex-col">
                  <AIAnalysisSummary />
                </Card>
              </div>
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
                  {displayedJobs.length}개 공고
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {displayedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="group cursor-pointer rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow transition-shadow min-h-[260px]"
                    onClick={() => onJobSelect(job.id)}
                  >
                    {/* Top gradient area with small logo and match badge */}
                    <div
                      className="relative h-32 bg-no-repeat bg-center bg-cover"
                      style={{ backgroundImage: "url('/og-ads.png')" }}
                    >
                      <button
                        className={`absolute top-2 right-2 text-gray-400 hover:text-gray-600`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleScrap(job.id);
                        }}
                        aria-label="스크랩"
                      >
                        <Bookmark className={`h-4 w-4 ${scrapedJobs.has(job.id) ? 'fill-current text-blue-600' : ''}`} />
                      </button>
                      <span className="absolute bottom-2 left-2 text-[11px] px-2 py-0.5 rounded-md bg-white/80 text-blue-700 border border-blue-200">
                        {job.matchScore}% match
                      </span>
                    </div>

                    {/* Bottom info area */}
                    <div className="p-3 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.25rem]">{job.title}</h3>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="truncate">{job.details.location}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">{job.details.deadline}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="truncate font-medium text-gray-700">{job.company}</span>
                        <span className="truncate">{job.field}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 mt-2">더 많은 공고를 불러오는 중...</p>
                </div>
              )}

              {/* End of list message */}
              {displayedJobs.length >= 20 && (
                <div className="text-center py-8 text-gray-500">
                  <p>모든 추천 공고를 확인했습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}