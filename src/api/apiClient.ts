import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

import { auth } from '../firebase'

const apiBaseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

console.log('API Base URL:', apiBaseUrl)

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // ngrok 경고 ?�이지 ?�회
  },
  withCredentials: false,
})

async function attachFirebaseToken(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  console.log('?�� ?�큰 첨�? ?�작:', {
    url: config.url,
    method: config.method,
    hasUser: !!auth.currentUser,
    userEmail: auth.currentUser?.email,
  })

  const currentUser = auth.currentUser

  if (!currentUser) {
    console.log('???�재 ?�용?��? ?�음, ?�큰 첨�? 건너?�')
    return config
  }

  try {
    // ?�큰 강제 ?�로고침
    const token = await currentUser.getIdToken(true)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('??Firebase ?�큰 첨�? ?�료:', {
        url: config.url,
        tokenLength: token.length,
        tokenStart: token.substring(0, 20) + '...',
      })
    } else {
      console.warn('?�️ Firebase ?�큰??비어?�음')
    }
  } catch (error) {
    console.error('??Firebase ?�큰 ?�득 ?�패:', error)
    // ?�큰 ?�득 ?�패 ?�에???�청?� 계속 진행
  }

  // FormData ?�송 ??Content-Type ?�더 ?�거 (axios가 ?�동?�로 ?�정?�도�?
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
    console.log('?�� FormData 감�?, Content-Type ?�더 ?�거')
  }

  // 로그???�드?�인???�청 ?�이??로그 출력
  if (config.url?.includes('/api/auth/verify')) {
    console.log('?�� 로그???�청 ?�세 ?�보:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
    })
  }

  // 공고 추천 ?�드?�인???�청 ?�이??로그 출력
  if (config.url?.includes('/api/job-search/recommendations')) {
    console.log('?�� 공고 추천 ?�청 ?�세 ?�보:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
      fullUrl: `${config.baseURL}${config.url}`,
    })
    
    // ?�라미터 ?�세 로그
    if (config.params) {
      console.log('?�� ?�청 ?�라미터:', config.params)
    }
    
    // ?�더 ?�세 로그
    console.log('?�� ?�청 ?�더:', {
      'Content-Type': config.headers['Content-Type'],
      'Authorization': config.headers['Authorization'] ? 
        `${String(config.headers['Authorization']).substring(0, 20)}...` : '?�음',
      'User-Agent': config.headers['User-Agent'] || '�⺻��',
    })
    
    // ?�체 ?�청 URL 로그
    const fullRequestUrl = `${config.baseURL}${config.url}${config.params ? '?' + new URLSearchParams(config.params).toString() : ''}`
    console.log('?�� ?�전???�청 URL:', fullRequestUrl)
    
    // OPTIONS ?�청?��? ?�인
    if (config.method === 'OPTIONS') {
      console.log('?�️ OPTIONS Preflight ?�청 감�?! ?�는 CORS ?�책 ?�인???�한 브라?��????�동 ?�청?�니??')
    }
  }

  // Append ngrok bypass query param when hitting free tunnel via browser
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

// ?�답 ?�터?�터 추�?
apiClient.interceptors.response.use(
  (response) => {
    console.log('??API ?�답 ?�공:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      statusText: response.statusText,
      dataSize: JSON.stringify(response.data).length,
    })
    
    // ngrok 경고 ?�이지 감�?
    if (typeof response.data === 'string' && response.data.includes('ngrok')) {
      console.warn('?�️ ngrok 경고 ?�이지가 반환?�었?�니?? ngrok-skip-browser-warning ?�더�??�인?�세??')
    }
    
    // JSON ?�답?��? ?�인
    if (typeof response.data === 'string' && response.data.startsWith('<!DOCTYPE html>')) {
      console.error('??HTML ?�답??반환?�었?�니?? API가 ?�닌 ?�페?��?가 ?�답?�습?�다.')
    }
    
    return response
  },
  (error) => {
    console.error('??API ?�러 발생:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED',
    })
    
    // ?�별???�러 ?�?�별 처리
    if (error.code === 'ERR_NETWORK') {
      console.error('?�� ?�트?�크 ?�러: ?�버???�결?????�습?�다. ?�버가 ?�행 중인지 ?�인?�주?�요.')
    } else if (error.code === 'ECONNABORTED') {
      console.error('???�?�아???�러: ?�청??10�??�에 ?�료?��? ?�았?�니??')
    } else if (error.message.includes('CORS')) {
      console.error('?�� CORS ?�러: ?�버 CORS ?�정???�인?�주?�요.')
    } else if (error.response?.status === 401) {
      console.error('?�� ?�증 ?�러: Firebase ?�큰???�효?��? ?�습?�다.')
    } else if (error.response?.status === 403) {
      console.error('?�� 권한 ?�러: ?�근 권한???�습?�다.')
    } else if (error.response?.status >= 500) {
      console.error('?�� ?�버 ?�러: ?�버 ?��? ?�류가 발생?�습?�다.')
    }
    
    return Promise.reject(error)
  }
)

export { apiClient }


