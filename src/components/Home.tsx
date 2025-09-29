import { useEffect, useState, type MouseEvent } from 'react';
import { Bookmark, Building, LogOut, MapPin, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { PersonaToggle } from './PersonaToggle';
import type { Page, PersonaResponse } from '../types';
import { MOCK_JOBS } from '../constants/mockData';
import { useAuthContext } from '../context/AuthContext';

interface HomeProps {
  currentPersona: PersonaResponse | null;
  personas: PersonaResponse[];
  scrapedJobs: Set<string>;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onPersonaSelect: (persona: PersonaResponse) => void;
  onJobSelect: (jobId: string) => void;
  onToggleScrap: (jobId: string) => void;
  onPersonaDelete?: (personaId: string) => void;
}


export function Home({ currentPersona, personas, scrapedJobs, onNavigate, onPersonaSelect, onJobSelect, onToggleScrap, onPersonaDelete }: HomeProps) {
  const [showScrapedJobs, setShowScrapedJobs] = useState(false);
  const { firebaseUser, profile, logout } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrapedJobs(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredScrapedJobs = MOCK_JOBS.filter(job => scrapedJobs.has(job.id));

  return (
    <div className="min-h-screen">
      {/* Floating Header */}
      <header className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-6">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-6 py-3 shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img
              src="/job_cheat_LOGO.svg"
              alt="취업인 로고"
              className="h-8 w-8"
            />
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('cover-letter-hub')}
                className="text-gray-600 hover:text-gray-900"
              >
                자기소개서
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('interview-hub')}
                className="text-gray-600 hover:text-gray-900"
              >
                면접 연습하기
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('scraped-jobs')}
                className="text-gray-600 hover:text-gray-900"
              >
                공고 모아보기
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Persona Toggle */}
            <PersonaToggle
              currentPersona={currentPersona}
              personas={personas}
              onPersonaSelect={onPersonaSelect}
              onNavigate={onNavigate}
              onPersonaDelete={onPersonaDelete}
            />
            {firebaseUser ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">
                  {profile?.name ?? firebaseUser.displayName ?? '사용자'}님
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600"
                  onClick={() => logout().catch(console.error)}
                >
                  <LogOut className="mr-1 h-4 w-4" /> 로그아웃
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('login')}
                className="text-sm text-gray-600"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section - Twenty.com Style */}
        <section className="h-[calc(100vh-100px)] flex flex-col items-center justify-center px-6 bg-white relative overflow-hidden pt-6">
          
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/job_cheat_LOGO.svg"
              alt="취업인 로고"
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>

          <div className="relative max-w-md mx-auto space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="font-twenty text-3xl md:text-5xl font-bold text-twenty-primary leading-tight">
                나는 너의 성공을
                <br />
                알고있다.
              </h1>
            </div>
            
            <Button
              size="default"
              onClick={() => currentPersona ? onNavigate('job-recommendations') : onNavigate('persona-setup')}
              className="w-full font-twenty text-base bg-black hover:bg-gray-800 text-white border border-gray-800 py-3 rounded-lg transition-all duration-200 shadow-sm"
            >
              맞춤 공고 추천받기
            </Button>
          </div>
        </section>

        {/* Scraped Jobs Section with Background */}
        {showScrapedJobs && (
          <section className="relative px-6 pb-20 bg-white">
            <div className="relative max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-6">
                <Bookmark className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">내가 스크랩한 공고</h2>
                <Badge variant="secondary" className="ml-auto">
                  {filteredScrapedJobs.length}/50
                </Badge>
              </div>

              {filteredScrapedJobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>아직 스크랩한 공고가 없어요</p>
                  <p className="text-sm mt-1">마음에 드는 공고를 스크랩해보세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredScrapedJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onJobSelect(job.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{job.company}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{job.details.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{job.matchScore}% 매치</span>
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation();
                            onToggleScrap(job.id);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
