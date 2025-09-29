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
  const recordingsRef = useRef<Blob[]>([]);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [recordingUrls, setRecordingUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionState, setSessionState] = useState<InterviewSession | null>(session);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const questionAudioRef = useRef<HTMLAudioElement | null>(null);

  const hasStartedFirstQuestionRef = useRef(false);

  const pendingSubmitRef = useRef<((recording: Blob | null) => void) | null>(null);

  useEffect(() => {
    if (!session) {
      hasStartedFirstQuestionRef.current = false;
      pendingSubmitRef.current = null;
      recordingsRef.current = [];
      setSessionState(null);
      setCurrentQuestionIndex(0);
      setRecordingState('idle');
      setTimeLeft(60);
      setIsTimerActive(false);
      setRecordings([]);
      recordingsRef.current = [];
      setRecordingUrls([]);
      setIsQuestionPlaying(false);
      setIsPlayingRecording(false);
      return;
    }

    hasStartedFirstQuestionRef.current = false;
    pendingSubmitRef.current = null;

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
    recordingsRef.current = [];
    setRecordingUrls([]);
    setError(null);
  }, [session]);

  const hasSession = sessionState !== null;
  const currentQuestion = hasSession ? sessionState.questions[currentQuestionIndex] : null;
  const currentQuestionNumber = currentQuestion?.questionNumber ?? currentQuestionIndex + 1;
  const progress = hasSession ? (currentQuestionNumber / TOTAL_QUESTIONS) * 100 : 0;
  const questionPrompt = currentQuestion?.question && currentQuestion.question.trim().length > 0
    ? currentQuestion.question
    : currentQuestion?.audioUrl
      ? '질문 음성을 재생해 주세요.'
      : '질문을 불러오지 못했습니다.';


const currentRecordingBlob = recordings[currentQuestionIndex] ?? recordingsRef.current[currentQuestionIndex] ?? null;


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






const playQuestionAndStartRecording = useCallback(async (questionText: string) => {
  if (!currentQuestion) {
    return;
  }

  if (recordingState === 'recording' || isQuestionPlaying) {
    setError('녹음이 진행 중입니다. 녹음을 종료한 뒤 다시 시도해주세요.');
    return;
  }

  setError(null);
  pendingSubmitRef.current = null;

  if (speechUtteranceRef.current) {
    speechSynthesis.cancel();
    speechUtteranceRef.current = null;
  }

  const startRecording = async (targetIndex: number) => {
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
        const blob = chunks.length > 0 ? new Blob(chunks, { type: 'audio/webm' }) : null;

        if (blob) {
          setRecordings((prev) => {
            const updated = [...prev];
            updated[targetIndex] = blob;
            recordingsRef.current = updated;
            return updated;
          });
        }

        const submitAfterStop = pendingSubmitRef.current;
        pendingSubmitRef.current = null;

        if (recordingStreamRef.current) {
          recordingStreamRef.current.getTracks().forEach((track) => track.stop());
          recordingStreamRef.current = null;
        }

        if (submitAfterStop) {
          submitAfterStop(blob);
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

  const audioUrl = currentQuestion.audioUrl;
  const targetIndex = currentQuestionIndex;

  if (audioUrl) {
    try {
      if (questionAudioRef.current) {
        questionAudioRef.current.pause();
        questionAudioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      questionAudioRef.current = audio;

      audio.onplay = () => {
        setIsQuestionPlaying(true);
      };

      audio.onended = async () => {
        questionAudioRef.current = null;
        setIsQuestionPlaying(false);
        await startRecording(targetIndex);
      };

      audio.onerror = () => {
        questionAudioRef.current = null;
        setIsQuestionPlaying(false);
        console.error('질문 음성 재생 실패: ', audioUrl);
        setError('질문 음성을 재생할 수 없습니다. 텍스트로 안내합니다.');
        speechSynthesis.cancel();
        speechUtteranceRef.current = null;
        if (questionText) {
          const utterance = new SpeechSynthesisUtterance(questionText);
          utterance.lang = 'ko-KR';
          utterance.rate = 0.8;
          utterance.pitch = 1;

          speechUtteranceRef.current = utterance;

          utterance.onstart = () => {
            setIsQuestionPlaying(true);
          };

          utterance.onend = () => {
            setIsQuestionPlaying(false);
            startRecording(targetIndex);
          };

          speechSynthesis.speak(utterance);
        }
      };

      await audio.play();
      return;
    } catch {
      setError('질문 음성을 재생할 수 없습니다. 텍스트로 안내합니다.');
      questionAudioRef.current = null;
    }
  }

  if (!audioUrl && !questionText) {
    setError('질문 데이터를 불러오지 못했습니다.');
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    utterance.pitch = 1;

    speechUtteranceRef.current = utterance;

    utterance.onstart = () => {
      setIsQuestionPlaying(true);
    };

    utterance.onend = () => {
      setIsQuestionPlaying(false);
      startRecording(targetIndex);
    };

    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('음성 합성 실패:', error);
    setError('음성 재생에 실패했습니다.');
  }
}, [currentQuestion, currentQuestionIndex, isQuestionPlaying, recordingState]);

const stopRecording = useCallback(() => {
    if (speechUtteranceRef.current) {
      speechSynthesis.cancel();
      setIsQuestionPlaying(false);
      speechUtteranceRef.current = null;
    }

    if (questionAudioRef.current) {
      questionAudioRef.current.pause();
      questionAudioRef.current.currentTime = 0;
      questionAudioRef.current = null;
      setIsQuestionPlaying(false);
    }

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

  
const proceedToNext = useCallback(async (overrideRecording?: Blob | null) => {
    if (!sessionState || !currentQuestion) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const currentRecording = overrideRecording ?? recordings[currentQuestionIndex] ?? recordingsRef.current[currentQuestionIndex];
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

      const response = await submitInterviewVoiceAnswer(requestPayload);

      if (isInterviewCompletedResponse(response)) {
        const completedSession: InterviewSession = {
          ...sessionState,
          score: response.score,
          grade: response.grade,
          status: response.status,
          totalQuestions: response.total_questions,
          totalTime: response.total_time,
          averageAnswerTime: response.average_answer_time,
          averageAnswerLength: response.average_answer_length,
          questions: response.questions.map((q) => ({
            id: q.question_id,
            questionNumber: q.question_number,
            question: q.question_text ?? '',
            audioUrl: q.audio_url,
            answer: q.answer_text,
            type: q.question_type as 'job-knowledge' | 'ai-recommended' | 'cover-letter',
            timeSpent: q.time_taken
          })),
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
            question: response.question_text ?? '',
            audioUrl: response.audio_url,
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
          playQuestionAndStartRecording(response.question_text ?? '');
        }, 1000);
      }
    } catch {
      setError('답변 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, currentQuestionIndex, playQuestionAndStartRecording, recordings, sessionState, timeLeft, onComplete]);

  const handleNextQuestion = useCallback(() => {
    if (!currentQuestion) return;

    if (recordingState === 'recording') {
      pendingSubmitRef.current = (blob) => {
        if (!blob) {
          setError('녹음이 저장되지 않았습니다. 다시 시도해주세요.');
          return;
        }
        proceedToNext(blob);
      };
      stopRecording();
      return;
    }

    if (recordingState !== 'completed') {
      setError('먼저 답변을 녹음해주세요.');
      return;
    }

    proceedToNext();
  }, [currentQuestion, proceedToNext, recordingState, stopRecording]);


const playRecording = (recordingIndex: number) => {
  const urlFromState = recordingUrls[recordingIndex];
  const blob = recordingsRef.current[recordingIndex] ?? recordings[recordingIndex];

  if (!urlFromState && !blob) {
    setError('재생할 녹음이 없습니다. 다시 녹음해주세요.');
    return;
  }

  const playbackUrl = urlFromState ?? URL.createObjectURL(blob as Blob);
  setIsPlayingRecording(true);
  const audio = new Audio(playbackUrl);

  audio.onended = () => {
    setIsPlayingRecording(false);
    if (!urlFromState && blob) {
      URL.revokeObjectURL(playbackUrl);
    }
  };

  audio.onerror = () => {
    setIsPlayingRecording(false);
    if (!urlFromState && blob) {
      URL.revokeObjectURL(playbackUrl);
    }
    console.error('녹음 재생 중 오류가 발생했습니다.');
  };

  audio.play().catch(error => {
    setIsPlayingRecording(false);
    if (!urlFromState && blob) {
      URL.revokeObjectURL(playbackUrl);
    }
    console.error('녹음 재생 실패:', error);
  });
};

  



  // 타이머 효과
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (recordingState === 'recording') {
              pendingSubmitRef.current = (blob) => {
                if (!blob) {
                  setError('녹음이 저장되지 않았습니다. 다시 시도해주세요.');
                  return;
                }
                proceedToNext(blob);
              };
              stopRecording();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, proceedToNext, recordingState, timeLeft, stopRecording]);

  // 컴포넌트 마운트 시 첫 질문 재생 및 녹음 시작
  useEffect(() => {
    if (!currentQuestion) return;

    if (currentQuestionIndex === 0 && !hasStartedFirstQuestionRef.current) {
      hasStartedFirstQuestionRef.current = true;
      const timer = setTimeout(() => {
        playQuestionAndStartRecording(currentQuestion.question || questionPrompt);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentQuestion, currentQuestionIndex, playQuestionAndStartRecording, questionPrompt]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (speechUtteranceRef.current) {
        speechSynthesis.cancel();
      }
      if (questionAudioRef.current) {
        questionAudioRef.current.pause();
        questionAudioRef.current = null;
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
                      {questionPrompt}
                  </h2>
                  
                  {/* Question Play Button */}
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (recordingState === 'recording') {
                          setError('녹음 중에는 질문을 다시 들을 수 없습니다.');
                          return;
                        }

                        if (speechUtteranceRef.current) {
                          speechSynthesis.cancel();
                          speechUtteranceRef.current = null;
                        }
                        if (questionAudioRef.current) {
                          questionAudioRef.current.pause();
                          questionAudioRef.current.currentTime = 0;
                          questionAudioRef.current = null;
                        }
                        playQuestionAndStartRecording(currentQuestion.question || questionPrompt);
                      }}
                      disabled={isQuestionPlaying || recordingState === 'recording'}
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
                        onClick={() => {
                          if (speechUtteranceRef.current) {
                            speechSynthesis.cancel();
                            speechUtteranceRef.current = null;
                          }
                          if (questionAudioRef.current) {
                            questionAudioRef.current.pause();
                            questionAudioRef.current.currentTime = 0;
                            questionAudioRef.current = null;
                          }
                          playQuestionAndStartRecording(currentQuestion.question || questionPrompt);
                        }}
                        disabled={isQuestionPlaying || recordingState === 'recording'}
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

                    {recordingState === 'completed' && currentRecordingBlob && (
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => playRecording(currentQuestionIndex)}
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