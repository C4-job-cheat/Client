import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Target, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import type { Page } from '../types';

interface OnboardingProps {
  onNavigate: (page: Page) => void;
}

export function Onboarding({ onNavigate }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "환영합니다!",
      subtitle: "취업인과 함께 시작해보세요",
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center"
            >
              <Sparkles className="h-12 w-12 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <span className="text-sm">✨</span>
            </motion.div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">가입을 축하드려요!</h2>
            <p className="text-gray-600">
              이제 AI가 분석한 맞춤 공고 추천을<br />
              받을 수 있어요
            </p>
          </div>
        </div>
      )
    },
    {
      title: "페르소나란?",
      subtitle: "나만의 취업 프로필을 만들어보세요",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4"
            >
              <Target className="h-10 w-10 text-blue-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">페르소나</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              페르소나는 나만의 취업 프로필이에요.<br />
              경력, 학력, 희망조건 등을 입력하면<br />
              AI가 딱 맞는 공고를 추천해드려요.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">개인 맞춤 공고 추천</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">AI 역량 분석 & 피드백</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">맞춤 자기소개서 생성</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3분 만에 완성",
      subtitle: "간단한 질문으로 페르소나를 만들어보세요",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4"
            >
              <Zap className="h-10 w-10 text-purple-600" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">빠르고 간단해요</h2>
            <p className="text-gray-600 text-sm">
              12개의 간단한 질문으로<br />
              나만의 페르소나를 완성할 수 있어요
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">예상 소요시간</span>
              <Badge variant="outline" className="bg-white">3분</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>기본 정보</span>
                <span>1분</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>경력 & 학력</span>
                <span>1분</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>희망 조건</span>
                <span>1분</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">팁!</p>
                <p className="text-xs text-blue-700 mt-1">
                  정확한 정보를 입력할수록 더 나은 추천을 받을 수 있어요
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 스텝에서는 페르소나 설정으로 이동
      onNavigate('persona-setup');
    }
  };

  const handleSkip = () => {
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="w-full bg-gray-100 h-1">
          <motion.div
            className="h-1 bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="max-w-sm mx-auto">
          {/* Skip Button */}
          <div className="flex justify-end mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              건너뛰기
            </Button>
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[500px] flex flex-col"
          >
            <div className="flex-1">
              {steps[currentStep].content}
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2 my-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <Button
                onClick={handleNext}
                size="lg"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl"
              >
                <span>
                  {currentStep === steps.length - 1 ? '페르소나 만들기' : '다음'}
                </span>
                {currentStep === steps.length - 1 ? (
                  <ArrowRight className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronRight className="h-5 w-5 ml-2" />
                )}
              </Button>

              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="w-full text-gray-600"
                >
                  이전
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}