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
import { ChevronDown, Plus, User, Trash2 } from 'lucide-react';
import type { Page, Persona } from '../types';

interface PersonaToggleProps {
  currentPersona: Persona | null;
  personas: Persona[];
  onPersonaSelect: (persona: Persona) => void;
  onNavigate: (page: Page, source?: 'cover-letter' | 'interview' | 'scraped-jobs' | 'general') => void;
  onPersonaDelete?: (personaId: string) => void;
}

export function PersonaToggle({ 
  currentPersona, 
  personas, 
  onPersonaSelect, 
  onNavigate,
  onPersonaDelete 
}: PersonaToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePersonaDelete = (e: React.MouseEvent, personaId: string) => {
    e.stopPropagation();
    if (confirm('이 페르소나를 삭제하시겠습니까?')) {
      onPersonaDelete?.(personaId);
      // 삭제된 페르소나가 현재 선택된 페르소나라면 다른 페르소나로 변경
      if (currentPersona?.id === personaId) {
        const remainingPersonas = personas.filter(p => p.id !== personaId);
        if (remainingPersonas.length > 0) {
          onPersonaSelect(remainingPersonas[0]);
        }
      }
      setIsOpen(false);
    }
  };

  const handlePersonaSelect = (persona: Persona) => {
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
            {currentPersona ? currentPersona.jobCategory : '페르소나 생성'}
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
            key={persona.id}
            onClick={() => handlePersonaSelect(persona)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center space-x-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPersona?.id === persona.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{persona.jobCategory}</div>
                <div className="text-xs text-gray-500 truncate">
                  {persona.experience.hasExperience
                    ? `${persona.experience.years}년 경력`
                    : '신입'
                  } • {persona.education.level}
                </div>
              </div>
            </div>
            
            {currentPersona?.id === persona.id && (
              <Badge variant="secondary" className="text-xs ml-2">
                현재
              </Badge>
            )}

            {/* 삭제 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handlePersonaDelete(e, persona.id)}
              className="h-6 w-6 p-0 ml-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
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