import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Plus, Trophy, Clock, Target, Calendar, TrendingUp } from 'lucide-react';
import { FeatureHub } from './FeatureHub';
import { apiClient } from '../api/apiClient';
import type { Page, PersonaResponse, InterviewSession, InterviewPreparationResponse } from '../types';

interface InterviewHubProps {
  currentPersona: PersonaResponse | null;
  personas: PersonaResponse[];
  interviewSessions: InterviewSession[];
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onSessionSelect: (session: InterviewSession) => void;
}

export function InterviewHub({ 
  currentPersona,
  interviewSessions, 
  onNavigate, 
  onSessionSelect 
}: InterviewHubProps) {
  const [preparationData, setPreparationData] = useState<InterviewPreparationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchPreparationData = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await apiClient.get<InterviewPreparationResponse>('/api/interviews/preparation/', {
        params: {
          persona_id: currentPersona.persona_id
        }
      });
      
      console.log('🔍 면접 준비 데이터:', data);
      setPreparationData(data);
    } catch (err) {
      console.error('면접 준비 데이터 조회 실패:', err);
      setError('면접 준비 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchPreparationData();
  }, [fetchPreparationData]);

  const getSessionsByPersona = (personaId: string) => {
    return interviewSessions
      .filter(session => session.personaId === personaId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  };

  const getPersonaStats = (personaId: string) => {
    const sessions = getSessionsByPersona(personaId);
    if (sessions.length === 0) return null;

    const avgScore = sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length;
    const bestScore = Math.max(...sessions.map(session => session.score));
    const totalPracticeTime = sessions.reduce((sum, session) => 
      sum + session.questions.reduce((qSum, question) => qSum + question.timeSpent, 0), 0
    );

    return {
      totalSessions: sessions.length,
      avgScore,
      bestScore,
      totalPracticeTime,
      latestSession: sessions[0]
    };
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'D';
  };

  const featureConfig = {
    type: 'interview' as const,
    title: '',
    subtitle: '',
    actionText: '새 면접 연습 시작',
    startPage: 'interview-practice' as Page,
    waitingSource: 'interview' as const,
    icon: <Plus className="h-8 w-8 text-blue-600" />,
    noPersonaTitle: '페르소나 설정이 필요해요',
    noPersonaSubtitle: '면접 연습을 위해 먼저 페르소나를 설정해주세요'
  };

  if (!currentPersona) {
    return (
      <FeatureHub
        currentPersona={null}
        onNavigate={onNavigate}
        feature={featureConfig}
        hasRecords={false}
      />
    );
  }

  if (isLoading) {
    return (
      <FeatureHub
        currentPersona={currentPersona}
        onNavigate={onNavigate}
        feature={featureConfig}
        hasRecords={false}
      >
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">면접 준비 데이터를 불러오는 중...</p>
        </div>
      </FeatureHub>
    );
  }

  if (error) {
    return (
      <FeatureHub
        currentPersona={currentPersona}
        onNavigate={onNavigate}
        feature={featureConfig}
        hasRecords={false}
      >
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPreparationData}>
            다시 시도
          </Button>
        </div>
      </FeatureHub>
    );
  }

  return (
    <FeatureHub
      currentPersona={currentPersona ? {
        ...currentPersona,
        school_name: preparationData?.persona_card.school || currentPersona.school_name,
        major: preparationData?.persona_card.major || currentPersona.major,
        job_category: preparationData?.persona_card.job_category || currentPersona.job_category,
        job_role: preparationData?.persona_card.job_title || currentPersona.job_role,
        skills: preparationData?.persona_card.skills || currentPersona.skills,
        certifications: preparationData?.persona_card.certifications || currentPersona.certifications,
      } : null}
      onNavigate={onNavigate}
      feature={featureConfig}
      hasRecords={currentPersona ? getSessionsByPersona(currentPersona.persona_id).length > 0 : false}
    >
      {/* 현재 페르소나의 면접 기록만 표시 */}
      {currentPersona && (
        <div className="space-y-6">
          
          {(() => {
            const stats = getPersonaStats(currentPersona.persona_id);
            const sessions = getSessionsByPersona(currentPersona.persona_id);

            return (
              <div className="space-y-6">
                {/* 통계 카드 */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
                      <div className="text-sm text-gray-600">총 연습 횟수</div>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">평균 점수</div>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stats.bestScore}</div>
                      <div className="text-sm text-gray-600">최고 점수</div>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{formatTime(stats.totalPracticeTime)}</div>
                      <div className="text-sm text-gray-600">총 연습 시간</div>
                    </Card>
                  </div>
                )}

                {/* 자기소개서 목록 (서버 데이터 사용) */}
                {preparationData?.cover_letters && preparationData.cover_letters.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">작성된 자기소개서</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {preparationData.cover_letters.map((coverLetter) => (
                        <Card key={coverLetter.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{coverLetter.company_name}</h4>
                            <Badge variant="outline">{coverLetter.style}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(coverLetter.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {coverLetter.character_count}자
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* 면접 세션 목록 */}
                {sessions.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">면접 연습 기록</h3>
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <Card 
                          key={session.id} 
                          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
                          onClick={() => onSessionSelect(session)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold">
                                  {session.useCoverLetter ? '자기소개서 기반 면접' : '일반 면접 연습'}
                                </h4>
                                <Badge variant={session.score >= 80 ? 'default' : session.score >= 60 ? 'secondary' : 'outline'}>
                                  {getScoreGrade(session.score)} ({session.score}점)
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(session.completedAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatTime(session.questions.reduce((sum, q) => sum + q.timeSpent, 0))}
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {session.questions.length}개 질문
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSessionSelect(session);
                                }}
                              >
                                결과 보기
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-8 text-center bg-gray-50 border border-dashed border-gray-300">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">아직 면접 연습 기록이 없어요</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      첫 번째 면접 연습을 시작해보세요
                    </p>
                    <Button onClick={() => onNavigate('interview-practice')}>
                      면접 연습 시작하기
                    </Button>
                  </Card>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </FeatureHub>
  );
}