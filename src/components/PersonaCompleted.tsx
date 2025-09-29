import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Page, PersonaResponse } from '../types';

interface PersonaCompletedProps {
  persona: PersonaResponse;
  onNavigate: (page: Page) => void;
  isNewUser?: boolean;
}

export function PersonaCompleted({ persona, onNavigate, isNewUser = false }: PersonaCompletedProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 브라우저 알림만 표시 (토스트 알림 제거)
    const requestNotificationAndShow = async () => {
      try {
        // 브라우저가 알림을 지원하는지 확인
        if (!('Notification' in window)) {
          console.log('이 브라우저는 데스크톱 알림을 지원하지 않습니다.');
          return;
        }

        // 알림 권한 상태 확인
        if (Notification.permission === 'default') {
          // 권한 요청
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            showNotification();
          }
        } else if (Notification.permission === 'granted') {
          // 이미 권한이 있으면 바로 알림 표시
          showNotification();
        }
      } catch (error) {
        console.error('알림 권한 요청 중 오류:', error);
      }
    };

    const showNotification = () => {
      const notification = new Notification('페르소나 생성 완료되었습니다!', {
        body: `${persona.job_category} 분야 페르소나가 성공적으로 생성되었습니다. 이제 취업인을 즐겨보세용가리리!`,
        icon: '/favicon.ico',
        tag: 'persona-completed',
        requireInteraction: false,
      });

      // 알림 클릭 시 브라우저 탭으로 포커스 이동
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 5초 후 자동으로 알림 닫기
      setTimeout(() => {
        notification.close();
      }, 5000);
    };

    // 1초 후에 알림 표시
    const notificationTimer = setTimeout(() => {
      requestNotificationAndShow();
    }, 1000);

    // 1초 후에 자동으로 홈 페이지로 이동
    const stepTimer = setTimeout(() => {
      onNavigate('home');
    }, 1000);

    return () => {
      clearTimeout(notificationTimer);
      clearTimeout(stepTimer);
    };
  }, [onNavigate, persona.job_category]);

  const steps = [
    {
      content: (
        <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center space-y-6 lg:space-y-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 lg:h-20 lg:w-20 text-white" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-12 h-12 lg:w-16 lg:h-16 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </motion.div>
          </motion.div>

          <div className="space-y-3 lg:space-y-6 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl lg:text-5xl font-bold text-gray-900"
            >
              {isNewUser ? '축하해요!' : '페르소나 완성!'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-gray-600 lg:text-xl leading-relaxed"
            >
              {isNewUser
                ? '첫 번째 페르소나가 성공적으로 생성되었어요! 이제 AI가 분석한 맞춤 공고를 받아보세요.'
                : '새로운 페르소나가 생성되었어요. 다양한 관점에서 공고를 추천받을 수 있어요.'
              }
            </motion.p>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="space-y-6 lg:space-y-8">
          <div className="text-center lg:text-left space-y-2 lg:space-y-4">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">내 페르소나</h2>
            <p className="text-gray-600 lg:text-lg">생성된 페르소나 정보를 확인해보세요</p>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
            <Card className="p-6 lg:p-8 space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 lg:text-lg">직무 분야</h3>
                <Badge className="bg-blue-600 text-white lg:text-sm lg:px-3 lg:py-1">{persona.job_category}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 lg:text-lg">학력</h3>
                <span className="text-sm lg:text-base text-gray-600">{persona.school_name ?? '학력 정보 없음'}</span>
              </div>

              {persona.job_role && (
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 lg:text-lg">직무</h3>
                  <span className="text-sm lg:text-base text-gray-600">{persona.job_role}</span>
                </div>
              )}

              {persona.certifications && persona.certifications.length > 0 && (
                <div className="space-y-2 lg:space-y-3">
                  <h3 className="font-semibold text-gray-900 lg:text-lg">보유 자격증</h3>
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {persona.certifications.slice(0, 3).map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs lg:text-sm">
                        {cert}
                      </Badge>
                    ))}
                    {persona.certifications.length > 3 && (
                      <Badge variant="outline" className="text-xs lg:text-sm">
                        +{persona.certifications.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 lg:p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2 lg:mb-4 lg:text-lg">이제 무엇을 할 수 있나요?</h4>
                  <ul className="space-y-1 lg:space-y-2 text-sm lg:text-base text-blue-700">
                    <li>• AI 맞춤 공고 추천 받기</li>
                    <li>• 자동 자기소개서 생성</li>
                    <li>• 면접 연습 및 피드백</li>
                    <li>• 역량 분석 및 성장 가이드</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="space-y-6 lg:space-y-8">
          <div className="text-center lg:text-left space-y-2 lg:space-y-4">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">시작해볼까요?</h2>
            <p className="text-gray-600 lg:text-lg">첫 번째 추천 공고를 확인해보세요</p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            <Card className="p-6 lg:p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <TrendingUp className="h-12 w-12 lg:h-16 lg:w-16 mx-auto mb-4 lg:mb-6" />
              <h3 className="font-semibold mb-2 lg:mb-4 lg:text-xl">맞춤 공고 추천</h3>
              <p className="text-sm lg:text-base text-blue-100">
                AI가 당신의 페르소나를 분석하여<br />
                가장 적합한 공고를 추천해드려요
              </p>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <Card
                className="p-4 lg:p-6 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNavigate('cover-letter-hub')}
              >
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 rounded-full mx-auto mb-2 lg:mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-sm lg:text-lg">✍️</span>
                </div>
                <h4 className="font-medium text-sm lg:text-base text-gray-900">자기소개서</h4>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">맞춤 작성</p>
              </Card>

              <Card
                className="p-4 lg:p-6 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNavigate('interview-hub')}
              >
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-orange-100 rounded-full mx-auto mb-2 lg:mb-4 flex items-center justify-center">
                  <span className="text-orange-600 text-sm lg:text-lg">🎯</span>
                </div>
                <h4 className="font-medium text-sm lg:text-base text-gray-900">면접 연습</h4>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">AI 피드백</p>
              </Card>

              <Card
                className="p-4 lg:p-6 text-center cursor-pointer hover:shadow-md transition-shadow lg:block hidden"
                onClick={() => onNavigate('scraped-jobs')}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📎</span>
                </div>
                <h4 className="font-medium text-base text-gray-900">스크랩 공고</h4>
                <p className="text-sm text-gray-500 mt-1">관심 목록</p>
              </Card>

              <Card
                className="p-4 lg:p-6 text-center cursor-pointer hover:shadow-md transition-shadow lg:block hidden"
                onClick={() => onNavigate('home')}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">🏠</span>
                </div>
                <h4 className="font-medium text-base text-gray-900">홈으로</h4>
                <p className="text-sm text-gray-500 mt-1">대시보드</p>
              </Card>
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <Button
              onClick={() => onNavigate('job-recommendations')}
              size="lg"
              className="w-full lg:w-auto lg:mx-auto lg:block lg:px-12 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl lg:text-lg"
            >
              맞춤 공고 추천받기
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="w-full lg:w-auto lg:mx-auto lg:block lg:px-8 text-gray-600 lg:hidden"
            >
              나중에 둘러보기
            </Button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onNavigate('job-recommendations');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Content - 첫 번째 단계만 표시 */}
      <main className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-16">
        <div className="max-w-sm lg:max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[600px] lg:min-h-[500px] flex flex-col justify-center"
          >
            {steps[0].content}
          </motion.div>
        </div>
      </main>
    </div>
  );
}