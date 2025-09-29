import { apiClient } from '../apiClient'
import type { UserProfile } from '../../types'

export async function verifyAuth(): Promise<UserProfile> {
  const { data } = await apiClient.post<UserProfile>('/api/auth/verify/')
  return data
}
