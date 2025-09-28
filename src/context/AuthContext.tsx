import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { apiClient } from '../api/apiClient'

interface UserProfile {
  uid: string
  user_id?: string
  email: string
  email_verified: boolean
  name: string
  picture?: string
  firebase?: {
    sign_in_provider?: string
    identities?: Record<string, string[]>
  }
  provider?: string
}

interface AuthContextValue {
  firebaseUser: User | null
  profile: UserProfile | null
  userId: string | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: (overrideUser?: User | null) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const { data } = await apiClient.post<UserProfile>('/api/auth/verify/')
    return data
  } catch (error) {
    console.error('사용자 프로필을 가져오지 못했습니다.', error)
    return null
  }
}

// 토큰 설정은 apiClient 인터셉터에서 처리하므로 제거
// function setDefaultAuthToken(user: User | null) {
//   if (!user) {
//     delete apiClient.defaults.headers.common.Authorization
//     return
//   }

//   user
//     .getIdToken()
//     .then((token) => {
//       apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
//     })
//     .catch((error) => {
//       console.error('Firebase 토큰 설정 실패', error)
//     })
// }

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const userId = profile?.user_id ?? firebaseUser?.uid ?? null

  const refreshProfile = useCallback(
    async (overrideUser?: User | null) => {
      const targetUser = overrideUser ?? firebaseUser ?? auth.currentUser
      if (!targetUser) {
        setProfile(null)
        return
      }

      const nextProfile = await fetchUserProfile()
      setProfile(nextProfile)
    },
    [firebaseUser],
  )

  // 토큰 설정은 apiClient 인터셉터에서 자동 처리됨

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      setAuthLoading(false)
      if (user) {
        void refreshProfile(user)
      } else {
        setProfile(null)
      }
    })

    return unsubscribe
  }, [refreshProfile])

  const login = useCallback(async () => {
    setIsProcessing(true)
    try {
      await signInWithPopup(auth, googleProvider)
      // setDefaultAuthToken과 refreshProfile은 onAuthStateChanged에서 자동 처리됨
    } catch (error) {
      console.error('구글 로그인 실패', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsProcessing(true)
    try {
      await signOut(auth)
      setProfile(null)
    } catch (error) {
      console.error('로그아웃 실패', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      userId,
      isLoading: authLoading || isProcessing,
      login,
      logout,
      refreshProfile,
    }),
    [firebaseUser, profile, userId, authLoading, isProcessing, login, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext는 AuthProvider 내부에서 사용해야 합니다.')
  }
  return context
}

export { AuthProvider, useAuthContext }

