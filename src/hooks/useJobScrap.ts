import { useState, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import { toast } from 'sonner';
import type { ScrapResponse } from '../types';

export function useJobScrap() {
  const [scrapedJobsByPersona, setScrapedJobsByPersona] = useState<Record<string, Set<string>>>({});

  const toggleScrap = useCallback(async (jobId: string, personaId: string, userId: string) => {
    if (!personaId || !userId) return;

    const currentSet = scrapedJobsByPersona[personaId] || new Set<string>();
    const isCurrentlyScraped = currentSet.has(jobId);

    try {
      if (!isCurrentlyScraped) {
        // 스크랩 추가
        const { data } = await apiClient.post<ScrapResponse>('/api/job-search/scrap/add/', {
          user_id: userId,
          persona_id: personaId,
          job_posting_id: jobId
        });

        if (data.success) {
          // 로컬 상태 업데이트
          setScrapedJobsByPersona(prev => {
            const newState = { ...prev };
            const newSet = new Set(newState[personaId] || []);
            newSet.add(jobId);
            newState[personaId] = newSet;
            return newState;
          });

          toast.success('공고가 스크랩되었습니다', {
            description: `총 ${data.scrap_count}개의 공고가 스크랩되었습니다.`,
            duration: 3000,
          });
        } else {
          toast.error('스크랩 실패', {
            description: data.message,
            duration: 3000,
          });
        }
      } else {
        // 스크랩 제거
        const { data } = await apiClient.delete<ScrapResponse>('/api/job-search/scrap/remove/', {
          data: {
            user_id: userId,
            persona_id: personaId,
            job_posting_id: jobId
          }
        });

        if (data.success) {
          // 로컬 상태 업데이트
          setScrapedJobsByPersona(prev => {
            const newState = { ...prev };
            const newSet = new Set(newState[personaId] || []);
            newSet.delete(jobId);
            newState[personaId] = newSet;
            return newState;
          });

          toast.success('스크랩이 해제되었습니다', {
            description: `총 ${data.scrap_count}개의 공고가 스크랩되었습니다.`,
            duration: 3000,
          });
        } else {
          toast.error('스크랩 해제 실패', {
            description: data.message,
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.error('스크랩 처리 실패:', err);
      toast.error('스크랩 처리 실패', {
        description: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        duration: 3000,
      });
    }
  }, [scrapedJobsByPersona]);

  const getScrapedJobs = useCallback((personaId: string | undefined): Set<string> => {
    if (!personaId) return new Set<string>();
    return scrapedJobsByPersona[personaId] || new Set<string>();
  }, [scrapedJobsByPersona]);

  return {
    scrapedJobsByPersona,
    toggleScrap,
    getScrapedJobs
  };
}

