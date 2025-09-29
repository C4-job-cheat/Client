import { apiClient } from '../apiClient'
import type { ServerPersonaResponse } from '../../types'

export async function createPersona(formData: FormData): Promise<ServerPersonaResponse> {
  const { data } = await apiClient.post<ServerPersonaResponse>('/api/personas/inputs/', formData)
  return data
}
