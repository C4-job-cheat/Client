import { apiClient } from '../apiClient'
import type {
  InterviewAnswerSubmitRequest,
  InterviewCompletedResponse,
  InterviewHistoryResponse,
  InterviewPreparationResponse,
  InterviewQuestionDetailResponse,
  InterviewQuestionGenerateRequest,
  InterviewQuestionGenerateResponse,
  NextQuestionResponse,
} from '../../types'

export async function fetchInterviewPreparation(
  personaId: string,
): Promise<InterviewPreparationResponse> {
  const { data } = await apiClient.get<InterviewPreparationResponse>(
    '/api/interviews/preparation/',
    {
      params: {
        persona_id: personaId,
      },
    },
  )

  return data
}

export async function generateInterviewQuestions(
  request: InterviewQuestionGenerateRequest,
): Promise<InterviewQuestionGenerateResponse> {
  const { data } = await apiClient.post<InterviewQuestionGenerateResponse>(
    '/api/interviews/questions/generate/',
    request,
  )

  return data
}

export async function submitInterviewAnswer(
  request: InterviewAnswerSubmitRequest,
): Promise<NextQuestionResponse | InterviewCompletedResponse> {
  console.log('🔍 submitInterviewAnswer API 호출:', request);
  
  const { data } = await apiClient.post<NextQuestionResponse | InterviewCompletedResponse>(
    '/api/interviews/answers/submit-and-next/',
    request,
  )

  console.log('🔍 submitInterviewAnswer API 응답:', data);
  return data
}

// 면접 완료 전용 함수 (10번째 질문일 때)
// 다음 질문 전용 함수 (1-9번째 질문일 때)
export async function submitInterviewVoiceAnswer(
  request: {
    persona_id: string;
    interview_session_id: string;
    question_id: string;
    question_number: number;
    audio_file: File;
    time_taken: number;
  },
): Promise<NextQuestionResponse | InterviewCompletedResponse> {
  console.log('🔍 submitInterviewVoiceAnswer API 호출:', {
    ...request,
    audio_file: `File(${request.audio_file.size} bytes)`
  });
  
  const formData = new FormData();
  formData.append('persona_id', request.persona_id);
  formData.append('interview_session_id', request.interview_session_id);
  formData.append('question_id', request.question_id);
  formData.append('question_number', request.question_number.toString());
  formData.append('audio_file', request.audio_file);
  formData.append('time_taken', request.time_taken.toString());

  const { data } = await apiClient.post<NextQuestionResponse | InterviewCompletedResponse>(
    '/api/interviews/answers/submit-and-next/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  console.log('🔍 submitInterviewVoiceAnswer API 응답:', data);
  return data
}

export async function fetchInterviewHistory(
  personaId: string,
): Promise<InterviewHistoryResponse> {
  const { data } = await apiClient.get<InterviewHistoryResponse>(
    '/api/interviews/history/',
    {
      params: {
        persona_id: personaId,
      },
    },
  )

  return data
}

export async function fetchInterviewQuestionDetail(
  interviewSessionId: string,
  questionId: string,
  personaId: string,
): Promise<InterviewQuestionDetailResponse> {
  const { data } = await apiClient.get<InterviewQuestionDetailResponse>(
    `/api/interviews/sessions/${interviewSessionId}/questions/${questionId}/`,
    {
      params: {
        persona_id: personaId,
      },
    },
  )

  return data
}
