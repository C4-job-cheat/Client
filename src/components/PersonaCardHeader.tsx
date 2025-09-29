import type { PersonaResponse } from '../types';

interface PersonaCardHeaderProps {
  persona: PersonaResponse;
  className?: string;
}

export function PersonaCardHeader({ persona, className = '' }: PersonaCardHeaderProps) {
  const specificJob = persona.job_role || persona.job_category;

  // 배열 내 문자열 파싱
  const parseData = (data: string[] | string | undefined): string[] => {
    if (!data) return [];
    if (Array.isArray(data) && data.length === 1 && typeof data[0] === 'string') {
      try {
        return JSON.parse(data[0]);
      } catch {
        return data[0].split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
    }
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data.split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
    }
    return [];
  };

  const skillsArray = parseData(persona.skills);
  const certificationsArray = parseData(persona.certifications);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">내 페르소나</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            {persona.job_category}
            {specificJob ? ` · ${specificJob}` : ''}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {persona.school_name || '학교 미설정'} · {persona.major || '전공 미설정'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* 보유 기술 스택 */}
          {skillsArray && skillsArray.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">보유 기술 스택</p>
              <div className="flex flex-wrap gap-1">
                {skillsArray.slice(0, 8).map((tech, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
                {skillsArray.length > 8 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
                    +{skillsArray.length - 8}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 보유 자격증 */}
          {certificationsArray && certificationsArray.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">보유 자격증</p>
              <div className="flex flex-wrap gap-1">
                {certificationsArray.slice(0, 6).map((cert, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {cert}
                  </span>
                ))}
                {certificationsArray.length > 6 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
                    +{certificationsArray.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}