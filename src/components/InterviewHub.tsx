import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Plus, Trophy, Clock, Target, Calendar, TrendingUp } from 'lucide-react';
import { FeatureHub } from './FeatureHub';
import type { Page, Persona, InterviewSession } from '../types';

interface InterviewHubProps {
  currentPersona: Persona | null;
  personas: Persona[];
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
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

  return (
    <FeatureHub
      currentPersona={currentPersona}
      onNavigate={onNavigate}
      feature={featureConfig}
    >
      {/* 현재 페르소나의 면접 기록만 표시 */}
      {currentPersona && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{currentPersona.jobCategory} 페르소나 면접 기록</h2>
          
          {(() => {
            const stats = getPersonaStats(currentPersona.id);
            const sessions = getSessionsByPersona(currentPersona.id);

            return (
              <div className="space-y-6">
                {/* 통계 카드 */}
                {stats ? (
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold">{stats.totalSessions}회</div>
                      <div className="text-sm text-gray-600">총 연습 횟수</div>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <Trophy className={`h-8 w-8 mx-auto mb-2 ${getScoreColor(stats.avgScore)}`} />
                      <div className={`font-semibold ${getScoreColor(stats.avgScore)}`}>
                        {Math.round(stats.avgScore)}점
                      </div>
                      <div className="text-sm text-gray-600">평균 점수</div>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getScoreColor(stats.bestScore)}`} />
                      <div className={`font-semibold ${getScoreColor(stats.bestScore)}`}>
                        {stats.bestScore}점
                      </div>
                      <div className="text-sm text-gray-600">최고 점수</div>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold">{formatTime(stats.totalPracticeTime)}</div>
                      <div className="text-sm text-gray-600">총 연습 시간</div>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-8 text-center bg-gray-50 border-dashed">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">아직 면접 연습 기록이 없어요</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      첫 번째 면접 연습을 시작해보세요
                    </p>
                    <Button 
                      onClick={() => currentPersona ? onNavigate('interview-practice') : onNavigate('persona-waiting', 'interview')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      면접 연습 시작하기
                    </Button>
                  </Card>
                )}

                {/* 면접 세션 목록 */}
                {sessions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">면접 기록 ({sessions.length}개)</h3>
                    <div className="grid gap-4">
                      {sessions.map((session) => (
                        <Card 
                          key={session.id} 
                          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            onSessionSelect(session);
                            onNavigate('interview-results');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge className={`${getScoreColor(session.score)} bg-opacity-10`}>
                                  {session.score}점 ({getScoreGrade(session.score)})
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {session.questions.length}개 질문
                                </span>
                                {session.useCoverLetter && (
                                  <Badge variant="outline">자기소개서 기반</Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(session.completedAt)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(session.questions.reduce((sum, q) => sum + q.timeSpent, 0))}</span>
                                </span>
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm">
                              상세보기
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </FeatureHub>
  );
}
