import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ChevronDown, Plus, User } from 'lucide-react';
import type { Page, PersonaResponse } from '../types';

interface PersonaToggleProps {
  currentPersona: PersonaResponse | null;
  personas: PersonaResponse[];
  onPersonaSelect: (persona: PersonaResponse) => void;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
}

export function PersonaToggle({ 
  currentPersona, 
  personas, 
  onPersonaSelect, 
  onNavigate
}: PersonaToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePersonaSelect = (persona: PersonaResponse) => {
    onPersonaSelect(persona);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onNavigate('persona-setup');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 min-w-32 bg-white border-gray-300 hover:bg-gray-50"
        >
          <User className="h-4 w-4" />
          <span className="truncate">
            {currentPersona ? currentPersona.job_category : '페르소나 생성'}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
        {/* 새 페르소나 생성 */}
        <DropdownMenuItem
          onClick={handleCreateNew}
          className="flex items-center space-x-2 p-3"
        >
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="h-4 w-4 text-black" />
          </div>
          <div>
            <div className="font-medium">새 페르소나 생성</div>
            <div className="text-xs text-gray-500">새로운 역할 설정하기</div>
          </div>
        </DropdownMenuItem>

        {personas.length > 0 && <DropdownMenuSeparator />}

        {/* 기존 페르소나 목록 */}
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.persona_id}
            onClick={() => handlePersonaSelect(persona)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center space-x-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPersona?.persona_id === persona.persona_id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{persona.job_category}</div>
                <div className="text-xs text-gray-500 truncate">{persona.job_role ?? '직무 미지정'}</div>
              </div>
            </div>
            
            {currentPersona?.persona_id === persona.persona_id && (
              <Badge variant="secondary" className="text-xs ml-2">
                현재
              </Badge>
            )}

          </DropdownMenuItem>
        ))}

        {personas.length === 0 && (
          <div className="p-3 text-center text-sm text-gray-500">
            생성된 페르소나가 없습니다
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}