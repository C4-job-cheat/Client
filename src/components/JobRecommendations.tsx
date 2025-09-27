import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ArrowLeft, Bookmark, Clock, Info, Brain, Target, Zap, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
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
    logoUrl: '/og-ads.png'
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
    logoUrl: '/og-ads.png'
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
    logoUrl: '/og-ads.png'
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
    logoUrl: '/og-ads.png'
  }
];

// 레이더 차트 컴포넌트
function CapabilityRadarChart({ onCapabilityClick }: { onCapabilityClick: (index: number) => void }) {
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
            <RadarChart
              data={personaCapabilities}
              onClick={(data) => {
                if (data && data.activeLabel) {
                  const capabilityIndex = personaCapabilities.findIndex(
                    cap => cap.subject === data.activeLabel
                  );
                  if (capabilityIndex !== -1) {
                    onCapabilityClick(capabilityIndex);
                  }
                }
              }}
            >
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

// AI 종합 분석 캐러셀 컴포넌트
function AIAnalysisSummary() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const analysisData = [
    {
      title: '직무 전문성',
      score: 88,
      color: 'text-blue-600',
      borderColor: 'border-blue-600',
      iconColor: 'text-blue-600',
      icon: Target,
      summary: '컴퓨터공학 전공과 정보처리기사 자격증으로 기본기는 탄탄하나 실무 경험 보완 필요',
      details: [
        '✓ 컴퓨터공학 전공으로 체계적인 이론 지식 보유',
        '✓ 정보처리기사 자격증으로 검증된 기술 역량',
        '△ 실무 프로젝트 경험 부족으로 현장 적응력 보완 필요'
      ]
    },
    {
      title: '성장 잠재력',
      score: 90,
      color: 'text-green-600',
      borderColor: 'border-green-600',
      iconColor: 'text-green-600',
      icon: Zap,
      summary: '기술 습득 의욕과 자기계발 의지가 뛰어나며 온라인 강의를 통한 지속적 성장 중',
      details: [
        '✓ 온라인 강의 수강으로 지속적인 자기계발 실천',
        '✓ 새로운 기술에 대한 높은 관심도와 학습 의욕',
        '✓ 명확한 커리어 목표 설정 및 계획 수립'
      ]
    },
    {
      title: '문제 해결력',
      score: 85,
      color: 'text-purple-600',
      borderColor: 'border-purple-600',
      iconColor: 'text-purple-600',
      icon: Brain,
      summary: '논리적 사고력이 우수하고 알고리즘 문제 해결 경험이 풍부하여 체계적 접근 가능',
      details: [
        '✓ 알고리즘 문제 해결을 통한 논리적 사고력 검증',
        '✓ 복잡한 문제를 단계별로 분석하는 체계적 접근',
        '✓ 다양한 솔루션을 고려하는 창의적 문제 해결'
      ]
    },
    {
      title: '협업 능력',
      score: 78,
      color: 'text-orange-600',
      borderColor: 'border-orange-600',
      iconColor: 'text-orange-600',
      icon: Target,
      summary: '기본적인 팀워크는 갖추었으나 다양한 직무와의 협업 경험과 소통 스킬 향상 필요',
      details: [
        '✓ 기본적인 팀워크와 의사소통 능력 보유',
        '✓ 타인의 의견을 존중하고 수용하는 자세',
        '△ 다양한 직무와의 크로스 팀워크 경험 부족'
      ]
    },
    {
      title: '적응력',
      score: 92,
      color: 'text-teal-600',
      borderColor: 'border-teal-600',
      iconColor: 'text-teal-600',
      icon: Zap,
      summary: '변화하는 환경에 대한 적응력이 뛰어나고 새로운 기술과 트렌드에 대한 관심 높음',
      details: [
        '✓ 빠르게 변화하는 기술 트렌드에 대한 높은 관심',
        '✓ 새로운 환경과 도구에 대한 빠른 적응력',
        '✓ 변화를 기회로 인식하는 긍정적 마인드셋'
      ]
    }
  ];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentItem = analysisData[currentIndex];

  return (
    <div className="h-full flex">
      {/* 왼쪽: 캐러셀 컨텐츠 */}
      <div className="flex-1 flex flex-col mr-4">
        {/* 헤더 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI 분석 요약</h3>
          <p className="text-sm text-gray-500">역량별 세부 분석</p>
        </div>

        {/* 캐러셀 컨텐츠 */}
        <div className="flex-1 overflow-hidden">
          <div
            className={`h-full p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50 ${currentItem.borderColor} transition-all duration-300`}
          >
            {/* 제목과 점수 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h4 className={`text-lg font-semibold ${currentItem.color}`}>
                  {currentItem.title}
                </h4>
              </div>
              <div className={`text-2xl font-bold ${currentItem.color}`}>
                {currentItem.score}
              </div>
            </div>

            {/* 요약 */}
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {currentItem.summary}
            </p>

            {/* 상세 분석 */}
            <div className="space-y-2">
              {currentItem.details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-xs text-gray-600 leading-relaxed">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 오른쪽: 역량별 버튼 목록 */}
      <div className="w-40 flex flex-col space-y-2">
        {analysisData.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => goToSlide(index)}
            className={`w-full justify-start text-left h-auto py-2 px-2.5 bg-gradient-to-r from-white to-gray-50 ${
              index === currentIndex
                ? `${item.borderColor} ${item.color} border`
                : `border-gray-200 text-gray-700 hover:${item.borderColor} hover:${item.color} border`
            }`}
          >
            <div className="flex flex-col items-start w-full">
              <span className="text-xs font-medium">{item.title}</span>
              <span className="text-xs opacity-75">{item.score}점</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

// AI 종합 평가 컴포넌트
function FinalEvaluation() {
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
            전반적으로 IT 분야에서 높은 성장 가능성을 보이는 인재입니다.
            특히 적응력과 성장 잠재력이 뛰어나 빠르게 변화하는 기술 환경에 잘 적응할 수 있을 것으로 예상됩니다.
            현재 기술적 기반은 탄탄하나 실무 경험과 협업 역량을 보완한다면
            프론트엔드 개발이나 데이터 분석 분야에서 큰 성과를 낼 수 있을 것입니다.
            지속적인 학습 의욕과 문제 해결 능력을 바탕으로 장기적으로 시니어 개발자로 성장할 잠재력이 충분합니다.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function JobRecommendations({ currentPersona, scrapedJobs, onNavigate, onJobSelect, onToggleScrap }: JobRecommendationsProps) {
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState(0); // 선택된 역량 인덱스

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
                  <CapabilityRadarChart onCapabilityClick={() => {}} />
                </Card>
              </div>

              {/* 우측 7/11: AI 종합 분석 요약 */}
              <div className="lg:col-span-7">
                <Card className="p-4 h-80 flex flex-col">
                  <AIAnalysisSummary />
                </Card>
              </div>
            </div>

            {/* 종합 평가 - 전체 가로폭 */}
            <div className="mb-6">
              <FinalEvaluation />
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
                    {/* Top area with logo and match badge */}
                    <div className="relative h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {job.logoUrl && (
                        <img
                          src={job.logoUrl}
                          alt={`${job.company} 로고`}
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