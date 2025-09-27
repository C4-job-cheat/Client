import { useState, useCallback } from 'react';
import type { Persona } from '../types';

export function usePersona() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);

  const addPersona = useCallback((persona: Persona) => {
    setPersonas(prev => [...prev, persona]);
    setCurrentPersona(persona);
  }, []);

  const deletePersona = useCallback((personaId: string) => {
    setPersonas(prev => prev.filter(p => p.id !== personaId));
    if (currentPersona?.id === personaId) {
      setCurrentPersona(null);
    }
  }, [currentPersona]);

  const selectPersona = useCallback((persona: Persona | null) => {
    setCurrentPersona(persona);
  }, []);

  return {
    personas,
    currentPersona,
    addPersona,
    deletePersona,
    selectPersona
  };
}
