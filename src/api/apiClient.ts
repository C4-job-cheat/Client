import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

import { auth } from '../firebase'

const apiBaseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: false,
})

async function attachFirebaseToken(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  const currentUser = auth.currentUser

  if (currentUser) {
    const token = await currentUser.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  if (typeof config.baseURL === 'string' && config.baseURL.includes('ngrok-free.app')) {
    if (config.params instanceof URLSearchParams) {
      if (!config.params.has('ngrok-skip-browser-warning')) {
        config.params.set('ngrok-skip-browser-warning', 'true')
      }
    } else {
      const params =
        config.params && typeof config.params === 'object' && !Array.isArray(config.params)
          ? (config.params as Record<string, unknown>)
          : {}
      config.params = {
        ...params,
        'ngrok-skip-browser-warning': 'true',
      }
    }
  }

  return config
}

apiClient.interceptors.request.use(attachFirebaseToken)

export { apiClient }
