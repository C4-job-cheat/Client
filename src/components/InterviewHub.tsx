import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Plus, Trophy, Clock, Target, Calendar, TrendingUp } from 'lucide-react';
import { FeatureHub } from './FeatureHub';
import { fetchInterviewHistory } from '../api/services/interviewService';
import type { Page, PersonaResponse, InterviewSession, InterviewHistoryResponse } from '../types';

interface InterviewHubProps {
  currentPersona: PersonaResponse | null;
  personas: PersonaResponse[];
  interviewSessions: InterviewSession[];
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onSessionSelect: (session: InterviewSession) => void;
}

export function InterviewHub({ 
  currentPersona,
  onNavigate, 
  onSessionSelect 
}: InterviewHubProps) {
  const [historyData, setHistoryData] = useState<InterviewHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchHistoryData = useCallback(async () => {
    if (!currentPersona) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchInterviewHistory(currentPersona.persona_id);
      
      setHistoryData(data);
    } catch {
      setError('면접 기록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
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
          <p className="text-gray-600">면접 기록을 불러오는 중...</p>
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
          <Button onClick={fetchHistoryData}>
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
        school_name: historyData?.persona_card.school || currentPersona.school_name,
        major: historyData?.persona_card.major || currentPersona.major,
        job_category: historyData?.persona_card.job_category || currentPersona.job_category,
        job_role: historyData?.persona_card.job_title || currentPersona.job_role,
        skills: historyData?.persona_card.skills || currentPersona.skills,
        certifications: historyData?.persona_card.certifications || currentPersona.certifications,
      } : null}
      onNavigate={onNavigate}
      feature={featureConfig}
      hasRecords={historyData ? historyData.total_sessions > 0 : false}
    >
      {/* 현재 페르소나의 면접 기록만 표시 */}
      {currentPersona && (
        <div className="space-y-6">
          
          {historyData && (
            <div className="space-y-6">
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{historyData.total_sessions}</div>
                  <div className="text-sm text-gray-600">총 연습 횟수</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{historyData.average_score.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">평균 점수</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{historyData.highest_score}</div>
                  <div className="text-sm text-gray-600">최고 점수</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{formatTime(historyData.total_practice_time)}</div>
                  <div className="text-sm text-gray-600">총 연습 시간</div>
                </Card>
              </div>

              {/* 면접 세션 목록 */}
              {historyData.sessions.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">면접 연습 기록</h3>
                  <div className="space-y-4">
                    {historyData.sessions.map((session) => (
                      <Card 
                        key={session.interview_session_id} 
                        className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
                        onClick={() => {
                          // 기존 InterviewSession 형태로 변환하여 전달
                          const convertedSession: InterviewSession = {
                            id: session.interview_session_id,
                            personaId: currentPersona.persona_id,
                            useCoverLetter: false,
                            questions: [],
                            score: session.score,
                            feedback: { strengths: [], improvements: [], suggestions: [] },
                            completedAt: session.completed_at,
                          };
                          onSessionSelect(convertedSession);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">면접 연습</h4>
                              <Badge variant={session.score >= 80 ? 'default' : session.score >= 60 ? 'secondary' : 'outline'}>
                                {session.grade} ({session.score}점)
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(session.completed_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTime(session.total_time)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const convertedSession: InterviewSession = {
                                  id: session.interview_session_id,
                                  personaId: currentPersona.persona_id,
                                  useCoverLetter: false,
                                  questions: [],
                                  score: session.score,
                                  feedback: { strengths: [], improvements: [], suggestions: [] },
                                  completedAt: session.completed_at,
                                };
                                onSessionSelect(convertedSession);
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
          )}
        </div>
      )}
    </FeatureHub>
  );
}
