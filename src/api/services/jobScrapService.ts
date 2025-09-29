import { apiClient } from '../apiClient'
import type { ScrapedJobsResponse, ScrapResponse } from '../../types'

interface ScrapIdentifiers {
  userId: string
  personaId: string
  jobPostingId: string
}

export async function fetchScrapedJobs(params: {
  userId: string
  personaId: string
}): Promise<ScrapedJobsResponse> {
  const { data } = await apiClient.get<ScrapedJobsResponse>(
    '/api/job-search/scrap/list/',
    {
      params: {
        user_id: params.userId,
        persona_id: params.personaId,
      },
    },
  )

  return data
}

export async function addJobScrap({
  userId,
  personaId,
  jobPostingId,
}: ScrapIdentifiers): Promise<ScrapResponse> {
  const { data } = await apiClient.post<ScrapResponse>(
    '/api/job-search/scrap/add/',
    {
      user_id: userId,
      persona_id: personaId,
      job_posting_id: jobPostingId,
    },
  )

  return data
}

export async function removeJobScrap({
  userId,
  personaId,
  jobPostingId,
}: ScrapIdentifiers): Promise<ScrapResponse> {
  const { data } = await apiClient.delete<ScrapResponse>(
    '/api/job-search/scrap/remove/',
    {
      data: {
        user_id: userId,
        persona_id: personaId,
        job_posting_id: jobPostingId,
      },
    },
  )

  return data
}
