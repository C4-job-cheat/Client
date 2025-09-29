import { apiClient } from '../apiClient'
import type {
  CoverLetterCreateRequest,
  CoverLetterCreateResponse,
  CoverLetterDetailResponse,
  CoverLetterListResponse,
  CoverLetterPersonaResponse,
} from '../../types'

export async function fetchCoverLetterPersona(personaId: string): Promise<CoverLetterPersonaResponse> {
  const { data } = await apiClient.get<CoverLetterPersonaResponse>('/api/cover-letters/', {
    params: {
      persona_id: personaId,
    },
  })

  return data
}

export async function createCoverLetter(
  request: CoverLetterCreateRequest,
): Promise<CoverLetterCreateResponse> {
  const { data } = await apiClient.post<CoverLetterCreateResponse>(
    '/api/cover-letters/create/',
    request,
  )

  return data
}

export async function fetchCoverLetterList(personaId: string): Promise<CoverLetterListResponse> {
  const { data } = await apiClient.get<CoverLetterListResponse>('/api/cover-letters/list/', {
    params: {
      persona_id: personaId,
    },
  })

  return data
}

export async function fetchCoverLetterDetail(
  personaId: string,
  coverLetterId: string,
): Promise<CoverLetterDetailResponse> {
  const { data } = await apiClient.get<CoverLetterDetailResponse>(
    `/api/cover-letters/list/${coverLetterId}/`,
    {
      params: {
        persona_id: personaId,
      },
    },
  )

  return data
}
