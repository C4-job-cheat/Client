import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, MessageCircle, Mic, Play, Volume2 } from 'lucide-react';
import { CircularTimer } from './CircularTimer';
import type { Page, InterviewSession } from '../types';

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!session) return;
    setRecordings(new Array(session.questions.length).fill(null));
    setRecordingUrls(new Array(session.questions.length).fill(''));

    // 첫 번째 질문 자동 재생과 동시에 녹음 시작
    playQuestionAndStartRecording(session.questions[0].question);
  }, [session, playQuestionAndStartRecording]);

  const playQuestionAndStartRecording = useCallback(async (questionText: string) => {
    setIsQuestionPlaying(true);
    setRecordingState('idle');
    setIsTimerActive(false);
    setTimeLeft(60);

    // 질문 재생 후 녹음 시작
    const playPromise = new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setIsQuestionPlaying(false);
        resolve();
      };

      speechUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    });

    // 질문이 끝난 후 1초 대기 후 녹음 시작
    await playPromise;
    setTimeout(() => {
      startRecording();
    }, 1000);
  }, [startRecording]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && recordingState === 'recording') {
      // 1분 완료 시 자동으로 녹음 중지 후 다음 질문
      stopRecording();
      setTimeout(() => handleNextQuestion(), 500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [handleNextQuestion, isTimerActive, recordingState, timeLeft, stopRecording]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (speechUtteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;

      // MP3 지원 여부 확인 후 MediaRecorder 생성
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/mp3')) {
        mimeType = 'audio/mp3';
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const updatedRecordings = [...recordings];
        updatedRecordings[currentQuestionIndex] = blob;
        setRecordings(updatedRecordings);

        // 녹음 파일을 다운로드 가능한 URL로 변환하여 저장
        const audioUrl = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        // 파일 확장자를 MIME 타입에 따라 결정
        let fileExtension = 'webm';
        if (mimeType.includes('mp3')) {
          fileExtension = 'mp3';
        } else if (mimeType.includes('ogg')) {
          fileExtension = 'ogg';
        }

        const fileName = `voice-interview-q${currentQuestionIndex + 1}-${timestamp}.${fileExtension}`;

        // URL을 배열에 저장하여 재생 가능하게 함
        const updatedUrls = [...recordingUrls];
        updatedUrls[currentQuestionIndex] = audioUrl;
        setRecordingUrls(updatedUrls);

        // 자동으로 파일 다운로드
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log(`녹음 파일이 저장되었습니다: ${fileName}`);

        // 스트림 정리
        if (recordingStreamRef.current) {
          recordingStreamRef.current.getTracks().forEach(track => track.stop());
          recordingStreamRef.current = null;
        }
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setIsTimerActive(true);
      setTimeLeft(60);

    } catch (error) {
      console.error('녹음을 시작할 수 없습니다:', error);
      alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해주세요.');
    }
  }, [currentQuestionIndex, recordingUrls, recordings]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('completed');
      setIsTimerActive(false);
    }
  }, [recordingState]);

  const calculateScore = useCallback((questions: InterviewSession['questions']) => {
    // 음성 면접의 경우 녹음이 있는지와 시간 사용량을 기준으로 점수 계산
    let totalScore = 0;
    questions.forEach((question, index) => {
      const hasRecording = recordings[index] !== null && recordings[index] !== undefined;
      const timeUsed = question.timeSpent;

      if (hasRecording) {
        totalScore += 70; // 기본 점수
        if (timeUsed >= 30) totalScore += 20; // 충분한 시간 사용
        if (timeUsed >= 45) totalScore += 10; // 더 충분한 시간 사용
      }
    });

    return Math.min(Math.round(totalScore / questions.length), 100);
  }, [recordings]);

  const generateFeedback = useCallback((questions: InterviewSession['questions']) => {
    const recordedCount = recordings.filter((r) => r !== null && r !== undefined).length;
    const avgTime = questions.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length;

    return {
      strengths: [
        recordedCount === questions.length ? "모든 질문에 음성으로 답변하셨습니다." : `${recordedCount}개 질문에 답변하셨습니다.`,
        avgTime >= 45 ? "충분한 시간을 활용해 답변하셨습니다." : "답변 시간 관리를 잘 하셨습니다."
      ],
      improvements: [
        recordedCount < questions.length ? "일부 질문에서 답변을 완료하지 못했습니다." : "",
        avgTime < 30 ? "더 구체적이고 상세한 답변을 해보세요." : ""
      ].filter(Boolean),
      suggestions: [
        "음성 면접에서는 명확한 발음과 적절한 속도로 답변하는 것이 중요합니다.",
        "실제 면접과 같은 환경에서 더 많은 연습을 해보세요.",
        "각 질문에 대해 구체적인 사례를 들어 답변해보세요."
      ]
    };
  }, [recordings]);

  const proceedToNext = useCallback(() => {
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      answer: recordings[currentQuestionIndex] ? 'Voice Recording' : '',
      timeSpent: 60 - timeLeft,
    };

    if (isLastQuestion) {
      const completedSession: InterviewSession = {
        ...session,
        questions: updatedQuestions,
        score: calculateScore(updatedQuestions),
        feedback: generateFeedback(updatedQuestions),
        completedAt: new Date().toISOString(),
      };
      onComplete(completedSession);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(60);
      setIsTimerActive(false);
      setRecordingState('idle');

      setTimeout(() => {
        playQuestionAndStartRecording(session.questions[currentQuestionIndex + 1].question);
      }, 1000);
    }
  }, [calculateScore, currentQuestion, currentQuestionIndex, generateFeedback, isLastQuestion, onComplete, playQuestionAndStartRecording, recordings, session, timeLeft]);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">면접 세션을 찾을 수 없습니다</p>
          <Button onClick={() => onNavigate('interview-practice')}>
            면접 연습으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'cover-letter': return 'bg-purple-100 text-purple-800';
      case 'job-knowledge': return 'bg-blue-100 text-blue-800';
      case 'ai-recommended': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'cover-letter': return '자기소개서';
      case 'job-knowledge': return '직무지식';
      case 'ai-recommended': return 'AI 추천';
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('면접을 중단하시겠습니까? 진행 상황이 저장되지 않습니다.')) {
                  if (recordingStreamRef.current) {
                    recordingStreamRef.current.getTracks().forEach(track => track.stop());
                  }
                  if (speechUtteranceRef.current) {
                    speechSynthesis.cancel();
                  }
                  onNavigate('interview-practice');
                }
              }}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>중단</span>
            </Button>

            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} / {session.questions.length}
              </span>

              {/* Recording status */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {recordingState === 'recording' && (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>녹음 중</span>
                  </>
                )}
                {recordingState === 'completed' && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>녹음 완료</span>
                  </>
                )}
                {recordingState === 'idle' && !isQuestionPlaying && (
                  <span>대기 중</span>
                )}
              </div>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Question Section - 3 columns */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Question Header */}
                  <div className="space-y-3">
                    <Badge className={getQuestionTypeColor(currentQuestion.type)}>
                      {getQuestionTypeLabel(currentQuestion.type)}
                    </Badge>

                    <h1 className="text-2xl font-semibold leading-relaxed">
                      {currentQuestion.question}
                    </h1>
                  </div>

                  {/* Voice Recording Info */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      음성으로 답변해주세요
                    </label>
                    <div className={`min-h-32 rounded-lg border-2 border-dashed flex items-center justify-center p-6 transition-all duration-500 ${
                      recordingState === 'recording'
                        ? 'bg-red-50 border-red-300 shadow-lg shadow-red-100'
                        : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="text-center space-y-2">
                        {recordingState === 'recording' ? (
                          <>
                            <div className="relative">
                              <Mic className="h-10 w-10 text-red-500 mx-auto" />
                              <div className="absolute -inset-1 bg-red-500 rounded-full opacity-25 animate-ping"></div>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-red-600 font-semibold text-lg tracking-wider">ON AIR</span>
                            </div>
                            <p className="text-sm text-red-600 font-medium">
                              지금 녹음 중입니다
                            </p>
                          </>
                        ) : (
                          <>
                            <Mic className="h-8 w-8 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-600">
                              질문을 듣고 음성으로 답변하세요
                            </p>
                            <p className="text-xs text-gray-500">
                              질문이 끝나면 자동으로 녹음이 시작됩니다
                            </p>
                          </>
                        )}

                        {/* 녹음 완료 후 재생 버튼 */}
                        {recordingState === 'completed' && recordingUrls[currentQuestionIndex] && (
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => playRecording(recordingUrls[currentQuestionIndex])}
                              disabled={isPlayingRecording}
                              className="flex items-center space-x-2"
                            >
                              {isPlayingRecording ? (
                                <>
                                  <Volume2 className="h-4 w-4 animate-pulse" />
                                  <span>재생 중...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  <span>내 답변 듣기</span>
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleNextQuestion}
                      disabled={isQuestionPlaying}
                      className="bg-black hover:bg-gray-800"
                    >
                      {isLastQuestion ? '면접 완료' : '답변 완료'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
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
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    질문당 1분씩 주어집니다
                  </div>

                  {timeLeft <= 10 && (
                    <div className="text-xs text-red-600 font-medium animate-pulse">
                      시간이 얼마 남지 않았어요!
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}