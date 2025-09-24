import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Page } from "../types";

interface AuthProps {
  type: "login" | "signup";
  onNavigate: (page: Page) => void;
  onUserAuth?: (isNewUser: boolean) => void;
}

export function Auth({ type, onNavigate, onUserAuth }: AuthProps) {
  const isLogin = type === "login";

  const handleSocialAuth = (provider: "google" | "naver") => {
    // Mock authentication - differentiate between login and signup
    if (isLogin) {
      // 기존 사용자 로그인
      toast.success(`${provider}로 로그인 성공!`);
      setTimeout(() => {
        onNavigate("home");
      }, 1000);
    } else {
      // 신규 사용자 회원가입
      toast.success(`${provider}로 회원가입 성공! 잠시 후 안내를 시작합니다.`);
      onUserAuth?.(true); // 신규 사용자임을 알림
      setTimeout(() => {
        onNavigate("onboarding"); // 온보딩 페이지로 이동
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("home")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>돌아가기</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="px-6 pt-16">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? "다시 만나서 반가워요" : "취업인과 함께해요"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "맞춤 공고 추천을 계속 받아보세요"
                : "AI가 분석한 맞춤 공고 추천을 받아보세요"}
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <Button
              onClick={() => handleSocialAuth("google")}
              variant="outline"
              size="lg"
              className="w-full py-4 text-base border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    G
                  </span>
                </div>
                <span>
                  구글로 {isLogin ? "로그인" : "회원가입"}
                </span>
              </div>
            </Button>

            <Button
              onClick={() => handleSocialAuth("naver")}
              variant="outline"
              size="lg"
              className="w-full py-4 text-base border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    N
                  </span>
                </div>
                <span>
                  네이버로 {isLogin ? "로그인" : "회원가입"}
                </span>
              </div>
            </Button>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              {isLogin
                ? "아직 계정이 없으신가요?"
                : "이미 계정이 있으신가요?"}
            </p>
            <Button
              variant="ghost"
              onClick={() =>
                onNavigate(isLogin ? "signup" : "login")
              }
              className="text-blue-600 hover:text-blue-700 mt-1"
            >
              {isLogin ? "회원가입하기" : "로그인하기"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
