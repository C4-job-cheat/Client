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
  } catch {
    return null
  }
}

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
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsProcessing(true)
    try {
      await signOut(auth)
      setProfile(null)
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

// Context 훅을 함께 내보내는 구조를 유지한다.
// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuthContext }
