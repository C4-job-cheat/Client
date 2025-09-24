import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Zap, Target, Star, Clock, CheckCircle } from 'lucide-react';
import type { Page } from '../types';

interface PersonaSelectionHubProps {
  onNavigate: (page: Page) => void;
  onPersonaTypeSelect: (type: 'simple' | 'professional') => void;
}

export function PersonaSelectionHub({ onNavigate, onPersonaTypeSelect }: PersonaSelectionHubProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>뒤로</span>
          </Button>
          <h1 className="font-semibold">페르소나 생성</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Introduction */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">어떤 방식으로 시작할까요?</h2>
            <p className="text-gray-600">
              목적에 맞는 페르소나 생성 방식을 선택해주세요
            </p>
          </div>

          {/* Option Cards */}
          <div className="space-y-4">
            {/* 가볍게 페르소나 만들기 */}
            <Card 
              className="p-6 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-200"
              onClick={() => onPersonaTypeSelect('simple')}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">가볍게 페르소나 만들기</h3>
                      <p className="text-sm text-gray-600">빠르고 간단하게</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">3분</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    기본적인 정보만으로 빠르게 페르소나를 생성합니다. 
                    공고 추천을 바로 받아볼 수 있어요.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      기본 정보
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      선호도 설정
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      즉시 추천
                    </Badge>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  바로 시작하기
                </Button>
              </div>
            </Card>

            {/* 전문적 페르소나 만들기 */}
            <Card 
              className="p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-blue-200 bg-blue-50 relative"
              onClick={() => onPersonaTypeSelect('professional')}
            >
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                추천
              </Badge>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">전문적 페르소나 만들기</h3>
                      <p className="text-sm text-blue-700 font-medium">정확한 매칭을 위한 선택</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">8분</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    상세한 정보를 통해 더욱 정확한 공고 매칭을 제공합니다. 
                    맞춤형 자기소개서와 면접 준비까지 가능해요.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      상세 경력 분석
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      기술 스택 매칭
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AI 역량 분석
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      맞춤 자기소개서
                    </Badge>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  정확한 매칭 시작하기
                </Button>
              </div>
            </Card>
          </div>

          {/* Bottom Info */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              언제든지 페르소나 정보를 수정하거나 새로 만들 수 있습니다
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}