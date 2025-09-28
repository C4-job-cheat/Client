import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
}

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '설정됨' : '누락됨',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId ? '설정됨' : '누락됨',
})

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({ prompt: 'select_account' })

export { app, auth, googleProvider }

