import { apiClient } from '../apiClient'
import type { JobDetailResponse, JobRecommendationResponse } from '../../types'

export async function fetchJobRecommendations(params: {
  userId: string
  personaId: string
}): Promise<JobRecommendationResponse> {
  const { data } = await apiClient.get<JobRecommendationResponse>(
    '/api/job-search/recommendations/',
    {
      params: {
        user_id: params.userId,
        persona_id: params.personaId,
      },
    },
  )

  return data
}

export async function fetchJobDetail(
  jobPostingId: string,
  params: { userId: string; personaId: string },
): Promise<JobDetailResponse> {
  const { data } = await apiClient.get<JobDetailResponse>(
    `/api/job-search/recommendations/${jobPostingId}/`,
    {
      params: {
        user_id: params.userId,
        persona_id: params.personaId,
      },
    },
  )

  return data
}
