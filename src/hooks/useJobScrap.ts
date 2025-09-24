import { useState, useCallback } from 'react';

export function useJobScrap() {
  const [scrapedJobsByPersona, setScrapedJobsByPersona] = useState<Record<string, Set<string>>>({});

  const toggleScrap = useCallback((jobId: string, personaId: string) => {
    if (!personaId) return;

    setScrapedJobsByPersona(prev => {
      const newState = { ...prev };
      const currentSet = new Set(newState[personaId] || []);

      if (currentSet.has(jobId)) {
        currentSet.delete(jobId);
      } else {
        currentSet.add(jobId);
      }

      newState[personaId] = currentSet;
      return newState;
    });
  }, []);

  const getScrapedJobs = useCallback((personaId: string | undefined): Set<string> => {
    if (!personaId) return new Set<string>();
    return scrapedJobsByPersona[personaId] || new Set<string>();
  }, [scrapedJobsByPersona]);

  return {
    scrapedJobsByPersona,
    toggleScrap,
    getScrapedJobs,
    setScrapedJobsByPersona
  };
}

