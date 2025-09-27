import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import type { Page, Persona, Job } from '../types';

interface JobDetailProps {
  jobId: string | null;
  currentPersona: Persona | null;
  scrapedJobs: Set<string>;
  onNavigate: (page: Page) => void;
  onToggleScrap: (jobId: string) => void;
}

// Mock job data
const mockJobDetail: Job = {
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
    description: '혁신적인 핀테크 서비스를 만들어갈 프론트엔드 개발자를 찾습니다. React, TypeScript, 그리고 최신 웹 기술에 대한 깊은 이해를 바탕으로 사용자 경험을 개선하고 새로운 기능을 개발하는 역할을 담당하게 됩니다.',
    jobDescription: '사용자 인터페이스를 개발하고 유지 관리하는 역할',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', '정보처리기사'],
    preferredSkills: ['Next.js', 'Tailwind CSS', '웹디자인기능사']
  },
  aiReason: '귀하의 IT/개발 분야 경험과 React 기술 스택이 이 포지션과 매우 잘 맞습니다. 특히 적응력(95%)과 성장 잠재력(90%) 점수가 높아 토스의 빠른 개발 문화에 잘 적응하실 것으로 예상됩니다.'
};

export function JobDetail({ jobId, currentPersona, scrapedJobs, onNavigate, onToggleScrap }: JobDetailProps) {
  const [isCoverLetterExpanded, setIsCoverLetterExpanded] = useState(false);

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

  const job = mockJobDetail; // In real app, fetch by jobId

  // Generate comparison data with 5 indicators
  const comparisonData = [
    { subject: '기술 전문성', persona: 88, job: 85, fullMark: 100 },
    { subject: '문제 해결력', persona: 82, job: 75, fullMark: 100 },
    { subject: '적응력', persona: 90, job: 80, fullMark: 100 },
    { subject: '협업 능력', persona: 76, job: 70, fullMark: 100 },
    { subject: '성장 잠재력', persona: 85, job: 78, fullMark: 100 }
  ];

  const getMatchAnalysis = () => {
    const strengths = comparisonData.filter(item => item.persona >= item.job);
    const weaknesses = comparisonData.filter(item => item.persona < item.job);

    return { strengths, weaknesses };
  };

  const { strengths, weaknesses } = getMatchAnalysis();

  // Mock current persona skills (기술 스택과 자격증 통합)
  const personaSkills = ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', '정보처리기사'];

  // Generate mock cover letter preview
  const generateCoverLetterPreview = () => {
    return `안녕하세요. ${job.company} ${job.title} 포지션에 지원하게 된 ${currentPersona?.jobCategory} 경력자입니다.

저는 ${currentPersona?.experience.years || 2}년간의 개발 경험을 통해 사용자 중심의 웹 애플리케이션 개발에 집중해왔습니다. 특히 React와 TypeScript를 활용한 프론트엔드 개발에 강점을 가지고 있으며, 최신 웹 기술 트렌드에 대한 높은 관심과 학습 의욕을 바탕으로 지속적으로 성장하고 있습니다.

${job.company}의 혁신적인 핀테크 서비스 철학과 사용자 경험을 중시하는 개발 문화는 제가 추구하는 가치와 일치합니다. 저의 기술적 역량과 열정을 바탕으로 ${job.company}의 성장에 기여하고 싶습니다.`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-1.5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('job-recommendations')}
            className="px-1.5"
          >
            <span>목록으로</span>
          </Button>

          <h1 className="font-medium text-sm">공고 상세</h1>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleScrap(job.id)}
              className={`${
                scrapedJobs.has(job.id)
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              {scrapedJobs.has(job.id) ? '스크랩됨' : '스크랩'}
            </Button>

            <Button
              size="sm"
              onClick={() => alert('지원 기능은 데모에서 제공되지 않습니다.')}
              className="bg-black hover:bg-gray-800 text-white"
            >
              지원하기
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - 회사 정보 & 매치 점수 */}
          <div className="bg-white rounded-xl p-2.5 mb-2.5 border border-gray-200 relative overflow-hidden">
            {/* 배경 이미지와 그라디언트 */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'url(/og-ads.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                mask: 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                WebkitMask: 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)'
              }}
            ></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-end space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">토스 프론트엔드 개발자 채용공고</h2>
                  <span className="text-sm text-gray-600">{job.company}</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div>{job.details.location}</div>
                  <div>{job.details.employmentType}</div>
                  <div className="text-red-600">마감일: {job.details.deadline}</div>
                </div>
              </div>

              {/* 매치 점수 - 텍스트만 */}
              <div className="text-right relative z-10">
                <div className="text-lg font-bold text-blue-600">{job.matchScore}%</div>
                <div className="text-xs text-gray-500">추천도</div>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5">
            {/* Left Column - 3/4 */}
            <div className="lg:col-span-3 space-y-2.5">
              {/* 역량 비교 차트 */}
              <div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-72">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-blue-700">역량 매치 분석</h3>
                  <p className="text-xs text-gray-500">내 역량과 공고 요구사항 비교</p>
                </div>

                <div className="h-48 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={comparisonData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="subject"
                        className="text-sm font-medium"
                        tick={{ fill: '#374151', fontSize: 13 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        className="text-xs"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                      />
                      <RechartsTooltip
                        formatter={(value: any, name: string) => {
                          const displayName = name === 'persona' ? '내 역량' : '공고 요구사항';
                          return [`${value}점`, displayName];
                        }}
                        labelFormatter={(label: string) => `${label} 비교`}
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          padding: '12px',
                          fontSize: '14px'
                        }}
                        labelStyle={{ color: '#374151', fontWeight: '600', marginBottom: '4px' }}
                        itemStyle={{ color: '#374151', fontSize: '13px' }}
                      />
                      <Radar
                        name="persona"
                        dataKey="persona"
                        stroke="#2563eb"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 2 }}
                      />
                      <Radar
                        name="job"
                        dataKey="job"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.15}
                        strokeWidth={2.5}
                        strokeDasharray="6 4"
                        dot={{ fill: '#f97316', strokeWidth: 2, r: 2 }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-700">내 역량</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-dashed rounded-full"></div>
                    <span className="text-xs text-gray-700">공고 요구사항</span>
                  </div>
                </div>
              </div>

              {/* 기술 스택 매치 */}
              <div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-80 overflow-y-auto">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-blue-700 mb-1">기술 스택 매치</h3>
                  <p className="text-xs text-gray-600">보유 기술과 요구 기술 비교</p>
                </div>

                <div className="space-y-4">
                  {/* 필수 요구사항 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 mb-2">
                      필수 요구사항
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.details.requiredSkills?.map((skill) => (
                        <Badge
                          key={skill}
                          className={personaSkills.includes(skill)
                            ? "bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 text-xs"
                            : "bg-gray-200 text-gray-500 border border-gray-300 px-1.5 py-0.5 text-xs opacity-60"
                          }
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 우대사항 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 mb-2">
                      우대사항
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.details.preferredSkills?.map((skill) => (
                        <Badge
                          key={skill}
                          className={personaSkills.includes(skill)
                            ? "bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 text-xs"
                            : "bg-gray-200 text-gray-500 border border-gray-300 px-1.5 py-0.5 text-xs opacity-60"
                          }
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 공고 상세 정보 */}
              <div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-120 overflow-y-auto">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-blue-700 mb-1">공고 상세 정보</h3>
                  <p className="text-xs text-gray-600">업무 내용과 지원 자격</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 필수 요건 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                      필수 요건
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <ul className="space-y-2 text-xs text-gray-700">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            React, TypeScript 기반 프론트엔드 개발 경험 2년 이상
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            웹 표준과 반응형 웹 구현 경험
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Git을 이용한 협업 경험
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 우대 사항 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                      우대 사항
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <ul className="space-y-2 text-xs text-gray-700">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Next.js, Tailwind CSS 사용 경험
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            핀테크 또는 금융 서비스 개발 경험
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            UX/UI 디자인에 대한 이해
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 복리후생 & 기업 인재상 */}
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 복리후생 */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-800 mb-3">
                          복리후생 & 혜택
                        </h4>
                        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <ul className="space-y-2 text-xs text-gray-700">
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              4대보험, 퇴직연금
                            </li>
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              자유로운 휴가 제도 (연차 자율 사용)
                            </li>
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              교육비 지원 (도서, 강의, 컨퍼런스)
                            </li>
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              최신 개발 장비 지원
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 기업 인재상 */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-800 mb-3">
                          기업 인재상
                        </h4>
                        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <ul className="space-y-2 text-xs text-gray-700">
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              끊임없는 학습과 성장 의지
                            </li>
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              협업과 소통을 중시하는 자세
                            </li>
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              사용자 경험에 대한 깊은 고민
                            </li>
                            <li className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              빠른 변화에 대한 적응력
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 맞춤 자기소개서 */}
              <div className="bg-white rounded-xl p-2.5 border border-gray-200 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-1">AI 맞춤 자기소개서</h3>
                    <p className="text-xs text-gray-600">이 공고에 특화된 자기소개서 미리보기</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCoverLetterExpanded(!isCoverLetterExpanded)}
                    className="px-1.5"
                  >
                    <span className="text-xs">{isCoverLetterExpanded ? '접기' : '미리보기'}</span>
                  </Button>
                </div>

                {isCoverLetterExpanded && (
                  <div className="space-y-4">
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <h4 className="text-xs font-semibold mb-3 text-neutral-900">{job.company} {job.title} 지원서</h4>
                      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                        {generateCoverLetterPreview()}
                      </div>
                    </div>
                    <Button
                      className="w-full bg-black hover:bg-neutral-800 text-white py-2 rounded-xl font-medium text-sm"
                      onClick={() => onNavigate('cover-letter')}
                    >
                      완전한 자기소개서 작성하기
                    </Button>
                  </div>
                )}

                {!isCoverLetterExpanded && (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">AI가 분석한 맞춤형 자기소개서를 확인해보세요</p>
                    <Button
                      onClick={() => onNavigate('cover-letter')}
                      className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded-xl font-medium text-sm"
                    >
                      자기소개서 작성하기
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - 1/4 (Sticky) */}
                <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-2.5">
                {/* AI 추천 이유 */}
                    <div className="bg-white rounded-xl p-2.5 border border-gray-200">
                  <div className="mb-3">
                        <h3 className="text-base font-bold text-yellow-600 mb-1">AI 추천 이유</h3>
                        <p className="text-xs text-gray-600">추천 근거 요약</p>
                  </div>

                  {/* 매칭 점수 그래프 */}
                  <div className="text-center mb-3">
                    <div className="relative w-12 h-12 mx-auto">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="rgb(229 231 235)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="rgb(59 130 246)"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(job.matchScore / 100) * 175.93} 175.93`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-sm font-bold text-blue-600">{job.matchScore}%</div>
                      </div>
                    </div>
                      <div className="text-xs text-gray-500 mt-1">종합 매칭 점수</div>
                  </div>

                  {/* 일치하는 요소 */}
                    <div className="mb-3">
                      <h4 className="font-medium mb-2 text-gray-900 text-xs">
                        일치하는 요소
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">귀하의 React, TypeScript 경험과 적응력이 토스의 기술 스택 및 문화와 높은 일치도를 보입니다.</p>
                  </div>

                  {/* 보완이 필요한 부분 */}
                    <div className="mb-3">
                      <h4 className="font-medium mb-2 text-gray-900 text-xs">
                        보완이 필요한 부분
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">협업 능력과 문제 해결력 부분에서 추가적인 경험과 학습이 필요할 것으로 보입니다.</p>
                  </div>

                  {/* 성장 방향 제안 */}
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 text-xs">
                      성장 방향 제안
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">핀테크 도메인 지식 확장과 최신 프론트엔드 기술 습득을 통해 경쟁력을 높여보세요.</p>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => onNavigate('cover-letter')}
                    className="bg-black hover:bg-gray-800 text-white py-2 rounded-xl font-medium text-sm"
                  >
                    자기소개서 작성
                  </Button>
                  <Button
                    onClick={() => onNavigate('interview')}
                    variant="outline"
                    className="py-2 rounded-xl font-medium border-gray-300 text-sm"
                  >
                    면접 연습하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}