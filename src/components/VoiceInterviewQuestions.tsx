import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, MessageCircle, Mic, Play, Volume2 } from 'lucide-react';
import { CircularTimer } from './CircularTimer';
import { submitInterviewVoiceAnswer } from '../api/services/interviewService';
import type { Page, InterviewSession, NextQuestionResponse, InterviewCompletedResponse } from '../types';

const TOTAL_QUESTIONS = 10;

const isInterviewCompletedResponse = (
  response: NextQuestionResponse | InterviewCompletedResponse,
): response is InterviewCompletedResponse => {
  return 'questions' in response;
};

interface VoiceInterviewQuestionsProps {
  session: InterviewSession | null;
  onNavigate: (page: Page) => void;
  onComplete: (session: InterviewSession) => void;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'completed';

export function VoiceInterviewQuestions({ session, onNavigate, onComplete }: VoiceInterviewQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [recordingUrls, setRecordingUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionState, setSessionState] = useState<InterviewSession | null>(session);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!session) {
      setSessionState(null);
      setCurrentQuestionIndex(0);
      setRecordingState('idle');
      setTimeLeft(60);
      setIsTimerActive(false);
      setRecordings([]);
      setRecordingUrls([]);
      setIsQuestionPlaying(false);
      setIsPlayingRecording(false);
      return;
    }

    setSessionState({
      ...session,
      questions: session.questions.map((q, index) => ({
        ...q,
        questionNumber: q.questionNumber ?? index + 1,
      })),
    });
    setCurrentQuestionIndex(0);
    setRecordingState('idle');
    setTimeLeft(60);
    setIsTimerActive(false);
    setRecordings([]);
    setRecordingUrls([]);
    setError(null);
  }, [session]);

  const hasSession = sessionState !== null;
  const currentQuestion = hasSession ? sessionState.questions[currentQuestionIndex] : null;
  const currentQuestionNumber = currentQuestion?.questionNumber ?? currentQuestionIndex + 1;
  const progress = hasSession ? (currentQuestionNumber / TOTAL_QUESTIONS) * 100 : 0;

  // 음성 면접 진행 상태 로그 (질문 변경 시에만 실행)
  useEffect(() => {
    if (!sessionState) return;

    console.log('🔍 음성 면접 진행 상태:', {
      questionNumber: currentQuestionNumber,
      currentQuestionIndex,
      progress: Math.round(progress),
      sessionQuestionsLength: sessionState.questions.length
    });
  }, [currentQuestionNumber, sessionState, progress, currentQuestionIndex]);

  // 녹음 URL 생성
  useEffect(() => {
    const urls = recordings.map(recording => 
      recording ? URL.createObjectURL(recording) : ''
    );
    setRecordingUrls(urls);

    // 이전 URL들 정리
    return () => {
      urls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [recordings]);

  const proceedToNext = useCallback(async () => {
    if (!sessionState || !currentQuestion) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const currentRecording = recordings[currentQuestionIndex];
      if (!currentRecording) {
        setError('녹음이 없습니다. 먼저 답변을 녹음해주세요.');
        return;
      }

      const elapsedSeconds = Math.max(60 - timeLeft, 0);

      const requestPayload = {
        persona_id: sessionState.personaId,
        interview_session_id: sessionState.id,
        question_id: currentQuestion.id,
        question_number: currentQuestion.questionNumber,
        audio_file: currentRecording,
        time_taken: elapsedSeconds
      };

      console.log('🔍 음성 답변 제출 요청:', {
        ...requestPayload,
        audio_file: `File(${currentRecording.size} bytes)`
      });

      const response = await submitInterviewVoiceAnswer(requestPayload);

      if (isInterviewCompletedResponse(response)) {
        const completedSession: InterviewSession = {
          ...sessionState,
          questions: response.questions.map((q) => ({
            id: q.question_id,
            questionNumber: q.question_number,
            question: q.question_text,
            answer: q.answer_text,
            type: q.question_type as 'job-knowledge' | 'ai-recommended' | 'cover-letter',
            timeSpent: q.time_taken
          })),
          score: response.score,
          feedback: {
            strengths: response.final_good_points,
            improvements: response.final_improvement_points,
            suggestions: []
          },
          completedAt: response.completed_at
        };

        onComplete(completedSession);
      } else {
        setSessionState((prev) => {
          if (!prev) return prev;

          const questionsWithAnswer = prev.questions.map((question, index) =>
            index === currentQuestionIndex
              ? {
                  ...question,
                  answer: question.answer || '음성 답변 제출 완료',
                  timeSpent: elapsedSeconds
                }
              : question
          );

        questionsWithAnswer.push({
            id: response.question_id,
            questionNumber: response.question_number,
            question: response.question_text,
            answer: '',
            type: response.question_type as 'job-knowledge' | 'ai-recommended' | 'cover-letter',
            timeSpent: 0
          });

          return {
            ...prev,
            questions: questionsWithAnswer
          };
        });

        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(60);
        setIsTimerActive(false);
        setRecordingState('idle');

        setTimeout(() => {
          playQuestionAndStartRecording(response.question_text);
        }, 1000);
      }
    } catch (err) {
      console.error('음성 답변 제출 실패:', err);
      setError('답변 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, currentQuestionIndex, playQuestionAndStartRecording, recordings, sessionState, timeLeft, onComplete]);

  const handleNextQuestion = useCallback(() => {
    if (!currentQuestion) return;

    if (recordingState === 'recording') {
      stopRecording();
      setTimeout(() => proceedToNext(), 500);
    } else {
      proceedToNext();
    }
  }, [currentQuestion, proceedToNext, recordingState, stopRecording]);

  const playRecording = (recordingUrl: string) => {
    if (!recordingUrl) return;

    setIsPlayingRecording(true);
    const audio = new Audio(recordingUrl);

    audio.onended = () => {
      setIsPlayingRecording(false);
    };

    audio.onerror = () => {
      setIsPlayingRecording(false);
      console.error('녹음 재생 중 오류가 발생했습니다.');
    };

    audio.play().catch(error => {
      setIsPlayingRecording(false);
      console.error('녹음 재생 실패:', error);
    });
  };

  const playQuestionAndStartRecording = useCallback(async (questionText: string) => {
    try {
      // 음성 합성으로 질문 읽기
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      utterance.pitch = 1;

      speechUtteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsQuestionPlaying(true);
      };

      utterance.onend = async () => {
        setIsQuestionPlaying(false);
        
        // 질문 읽기 완료 후 녹음 시작
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          recordingStreamRef.current = stream;
          
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          
          const chunks: BlobPart[] = [];
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const updatedRecordings = [...recordings];
            updatedRecordings[currentQuestionIndex] = blob;
            setRecordings(updatedRecordings);
            
            // 스트림 정리
            if (recordingStreamRef.current) {
              recordingStreamRef.current.getTracks().forEach(track => track.stop());
              recordingStreamRef.current = null;
            }
          };
          
          mediaRecorder.start();
          setRecordingState('recording');
          setIsTimerActive(true);
          
        } catch (error) {
          console.error('마이크 접근 실패:', error);
          setError('마이크 접근 권한이 필요합니다.');
        }
      };

      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('음성 합성 실패:', error);
      setError('음성 재생에 실패했습니다.');
    }
  }, [currentQuestionIndex, recordings]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('completed');
      setIsTimerActive(false);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      setIsTimerActive(false);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      setIsTimerActive(true);
    }
  }, []);

  // 타이머 효과
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // 1분 완료 시 자동으로 녹음 중지 후 다음 질문
            stopRecording();
            setTimeout(() => handleNextQuestion(), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [handleNextQuestion, isTimerActive, recordingState, timeLeft, stopRecording]);

  // 컴포넌트 마운트 시 첫 질문 재생 및 녹음 시작
  useEffect(() => {
    if (currentQuestion && currentQuestionIndex === 0) {
      setTimeout(() => {
        playQuestionAndStartRecording(currentQuestion.question);
      }, 1000);
    }
  }, [currentQuestion, currentQuestionIndex, playQuestionAndStartRecording]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (speechUtteranceRef.current) {
        speechSynthesis.cancel();
      }
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach(track => track.stop());
      }
      recordingUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [recordingUrls]);

  if (!hasSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">면접 세션을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">
            면접 연습을 다시 시작해주세요
          </p>
          <Button onClick={() => onNavigate('interview-practice')}>
            면접 연습 시작하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
            onClick={() => onNavigate('interview-practice')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
            <span>면접 연습</span>
            </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              질문 {currentQuestionNumber} / {TOTAL_QUESTIONS}
            </div>
            <Progress value={progress} className="w-32" />
          </div>

          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Question Section - 2 columns */}
          <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Question Header */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <Badge variant="secondary">{currentQuestion.type}</Badge>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                      {currentQuestion.question}
                  </h2>
                  
                  {/* Question Play Button */}
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (speechUtteranceRef.current) {
                          speechSynthesis.cancel();
                        }
                        playQuestionAndStartRecording(currentQuestion.question);
                      }}
                      disabled={isQuestionPlaying}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      {isQuestionPlaying ? '재생 중...' : '질문 다시 듣기'}
                    </Button>
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {recordingState === 'idle' && (
                      <Button
                        onClick={() => playQuestionAndStartRecording(currentQuestion.question)}
                        disabled={isQuestionPlaying}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        녹음 시작
                      </Button>
                    )}

                    {recordingState === 'recording' && (
                      <>
                        <Button
                          onClick={pauseRecording}
                          variant="outline"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          일시정지
                        </Button>
                        <Button
                          onClick={stopRecording}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          녹음 완료
                        </Button>
                      </>
                    )}

                    {recordingState === 'paused' && (
                      <>
                        <Button
                          onClick={resumeRecording}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          재개
                        </Button>
                        <Button
                          onClick={stopRecording}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          녹음 완료
                        </Button>
                          </>
                        )}

                    {recordingState === 'completed' && recordings[currentQuestionIndex] && (
                      <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              onClick={() => playRecording(recordingUrls[currentQuestionIndex])}
                              disabled={isPlayingRecording}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isPlayingRecording ? '재생 중...' : '답변 듣기'}
                            </Button>
                        <span className="text-sm text-green-600 font-medium">
                          ✓ 답변이 녹음되었습니다
                        </span>
                          </div>
                        )}
                      </div>

                  {/* Recording Status */}
                  <div className="text-sm text-gray-600">
                    {recordingState === 'recording' && (
                      <span className="text-red-600 font-medium">● 녹음 중...</span>
                    )}
                    {recordingState === 'paused' && (
                      <span className="text-yellow-600 font-medium">⏸ 일시정지됨</span>
                    )}
                    {recordingState === 'completed' && (
                      <span className="text-green-600 font-medium">✓ 녹음 완료</span>
                    )}
                  </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleNextQuestion}
                    disabled={isQuestionPlaying || isSubmitting}
                      className="bg-black hover:bg-gray-800"
                    >
                    {isSubmitting ? '답변 제출 중...' : (currentQuestionNumber === TOTAL_QUESTIONS ? '면접 완료' : '답변 완료')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setError(null)}
                        className="mt-2"
                      >
                        닫기
                    </Button>
                    </div>
                  )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Timer Section - 1 column */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-gray-700">남은 시간</h3>

                  <div className="flex justify-center">
                    <CircularTimer
                      timeLeft={timeLeft}
                      totalTime={60}
                      isActive={isTimerActive}
                    size={120}
                    />
                  </div>

                <div className="text-sm text-gray-600">
                  {timeLeft > 0 ? `${timeLeft}초 남음` : '시간 종료'}
                  </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    disabled={recordingState === 'completed'}
                    className="w-full"
                  >
                    {isTimerActive ? '일시정지' : '재시작'}
                  </Button>
                </div>
                </div>
              </Card>
          </div>
        </div>
      </main>
    </div>
  );
}