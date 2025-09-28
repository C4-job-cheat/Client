import { useCallback } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'
import type { Page } from '../types'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface AuthProps {
  type: 'login'
  onNavigate: (page: Page) => void
  onUserAuth?: (isNewUser: boolean) => void
}

export function Auth({ onNavigate }: AuthProps) {
  const { login, isLoading } = useAuthContext()

  const handleGoogleLogin = useCallback(async () => {
    try {
      await login()
      onNavigate('home')
    } catch (error) {
      console.error('구글 로그인 중 오류', error)
    }
  }, [login, onNavigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>돌아가기</span>
        </Button>
      </header>

      <main className="px-6 pt-16">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              다시 만나서 반가워요
            </h1>
            <p className="text-gray-600">
              맞춤 공고 추천을 계속 받아보세요
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full py-4 text-base border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="flex items-center gap-2">
                  구글 계정으로 계속하기
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </span>
              </div>
            </Button>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              아직 계정이 없으신가요?
            </p>
            <Button
              variant="ghost"
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:text-blue-700 mt-1"
            >
              로그인 화면으로 이동
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
