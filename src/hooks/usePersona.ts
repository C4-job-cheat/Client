import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { apiClient } from '../api/apiClient';
import type { PersonaData, PersonaResponse, ServerPersonaResponse } from '../types';

interface PersonaState {
  personas: PersonaResponse[];
  currentPersona: PersonaResponse | null;
  personaId: string | null;
  isLoading: boolean;
  error: string | null;
  createPersona: (payload: PersonaData) => Promise<PersonaResponse>;
  selectPersona: (persona: PersonaResponse | null) => void;
  setPersonaId: (id: string | null) => void;
  clearError: () => void;
}

const PersonaContext = createContext<PersonaState | null>(null);

const PERSONA_STORAGE_KEY = 'persona_id';

// 서버 응답을 클라이언트 타입으로 변환
function transformServerResponse(serverResponse: ServerPersonaResponse): PersonaResponse {
  return {
    persona_id: serverResponse.id,
    user_id: serverResponse.user_id,
    job_category: serverResponse.job_category,
    job_role: serverResponse.job_role,
    school_name: serverResponse.school_name,
    major: serverResponse.major,
    skills: serverResponse.skills,
    certifications: serverResponse.certifications,
    html_file_path: serverResponse.html_file_path,
    html_content_type: serverResponse.html_content_type,
    html_file_size: serverResponse.html_file_size,
    json_file_path: serverResponse.json_file_path,
    json_content_type: serverResponse.json_content_type,
    json_file_size: serverResponse.json_file_size,
    conversations_count: serverResponse.conversations_count,
    html_file_deleted: serverResponse.html_file_deleted,
    embedding_status: serverResponse.embedding_status,
    embedding_message: serverResponse.embedding_message,
    embeddings_count: serverResponse.embeddings_count,
    has_embeddings: serverResponse.has_embeddings,
    vectorized_competency_tags: serverResponse.vectorized_competency_tags,
    embedding_started_at: serverResponse.embedding_started_at,
    embedding_completed_at: serverResponse.embedding_completed_at,
    core_competencies: serverResponse.core_competencies,
    created_at: serverResponse.created_at,
    updated_at: serverResponse.updated_at,
  };
}

async function requestPersonaCreation(payload: PersonaData) {
  const formData = new FormData();
  
  // 기본 필드들 추가
  formData.append('job_category', payload.job_category);
  
  if (payload.job_role) {
    formData.append('job_role', payload.job_role);
  }
  if (payload.school_name) {
    formData.append('school_name', payload.school_name);
  }
  if (payload.major) {
    formData.append('major', payload.major);
  }
  if (payload.skills && payload.skills.length > 0) {
    formData.append('skills', JSON.stringify(payload.skills));
  }
  if (payload.certifications && payload.certifications.length > 0) {
    formData.append('certifications', JSON.stringify(payload.certifications));
  }
  if (payload.html_file) {
    formData.append('html_file', payload.html_file);
    console.log('HTML 파일 추가됨:', payload.html_file.name, payload.html_file.size, 'bytes');
  } else {
    // 서버에서 html_file이 필수인 경우 기본 HTML 템플릿 전송
    const defaultHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이력서</title>
</head>
<body>
    <h1>이력서</h1>
    <p>HTML 파일이 업로드되지 않았습니다.</p>
</body>
</html>`;
    const defaultFile = new File([defaultHtml], 'default.html', { type: 'text/html' });
    formData.append('html_file', defaultFile);
    console.log('기본 HTML 템플릿 전송됨');
  }

  // FormData 내용 확인
  console.log('FormData 내용:');
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  const { data } = await apiClient.post<ServerPersonaResponse>('/api/personas/inputs/', formData);
  
  console.log('🔍 API 응답 확인:');
  console.log('서버 응답 데이터:', data);
  console.log('서버 id:', data?.id);
  console.log('응답 타입:', typeof data);
  
  if (!data || !data.id) {
    console.error('❌ 서버 응답에 id가 없습니다:', data);
    throw new Error('서버에서 페르소나 ID를 반환하지 않았습니다.');
  }
  
  // 서버 응답을 클라이언트 타입으로 변환
  const transformedData = transformServerResponse(data);
  console.log('🔄 변환된 데이터:', transformedData);
  console.log('변환된 persona_id:', transformedData.persona_id);
  
  return transformedData;
}


function usePersonaProvider(): PersonaState {
  const [personas, setPersonas] = useState<PersonaResponse[]>([]);
  const [currentPersona, setCurrentPersona] = useState<PersonaResponse | null>(null);
  const [personaId, setPersonaIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const storedPersonaId = window.localStorage.getItem(PERSONA_STORAGE_KEY);
    if (storedPersonaId) {
      setPersonaIdState(storedPersonaId);
    }
  }, []);

  const setPersonaId = useCallback((id: string | null) => {
    setPersonaIdState(id);
    if (typeof window !== 'undefined') {
      if (id) {
        window.localStorage.setItem(PERSONA_STORAGE_KEY, id);
      } else {
        window.localStorage.removeItem(PERSONA_STORAGE_KEY);
      }
    }
  }, []);

  const selectPersona = useCallback((persona: PersonaResponse | null) => {
    setCurrentPersona(persona);
    setPersonaId(persona?.persona_id ?? null);
  }, [setPersonaId]);

  const createPersona = useCallback(async (payload: PersonaData) => {
    setIsLoading(true);
    setError(null);
    try {
      const persona = await requestPersonaCreation(payload);
      setPersonas(prev => [persona, ...prev]);
      selectPersona(persona);
      return persona;
    } catch (err) {
      setError(err instanceof Error ? err.message : '페르소나 생성에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectPersona]);

  const clearError = useCallback(() => setError(null), []);

  return useMemo(() => ({
    personas,
    currentPersona,
    personaId,
    isLoading,
    error,
    createPersona,
    selectPersona,
    setPersonaId,
    clearError,
  }), [personas, currentPersona, personaId, isLoading, error, createPersona, selectPersona, setPersonaId, clearError]);
}

interface PersonaProviderProps {
  children: ReactNode;
}

export function PersonaProvider({ children }: PropsWithChildren<PersonaProviderProps>) {
  const value = usePersonaProvider();
  return React.createElement(PersonaContext.Provider, { value }, children);
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona 훅은 PersonaProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
