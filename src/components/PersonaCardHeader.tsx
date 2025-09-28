import type { PersonaResponse } from '../types';

interface PersonaCardHeaderProps {
  persona: PersonaResponse;
  className?: string;
}

export function PersonaCardHeader({ persona, className = '' }: PersonaCardHeaderProps) {
  const specificJob = persona.job_role || persona.job_category;

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-3 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">내 페르소나</h3>
          <p className="text-xs text-black font-medium mt-0.5">
            {persona.job_category}
            {specificJob ? ` · ${specificJob}` : ''}
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {persona.school_name || '학교 미설정'} · {persona.major || '전공 미설정'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          {/* 보유 기술 스택 */}
          {persona.skills && persona.skills.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">보유 기술 스택</p>
              <div className="flex flex-wrap gap-1.5">
                {persona.skills.slice(0, 8).map((tech, index) => (
                  <span key={index} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-black border border-gray-300">{tech}</span>
                ))}
                {persona.skills.length > 8 && (
                  <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">+{persona.skills.length - 8}</span>
                )}
              </div>
            </div>
          )}

          {/* 보유 자격증 */}
          {persona.certifications && persona.certifications.length > 0 && (
            <div className={persona.skills && persona.skills.length > 0 ? "" : "col-start-1"}>
              <p className="text-xs text-gray-500 mb-1">보유 자격증</p>
              <div className="flex flex-wrap gap-1.5">
                {persona.certifications.slice(0, 6).map((cert, index) => (
                  <span key={index} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200">{cert}</span>
                ))}
                {persona.certifications.length > 6 && (
                  <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">+{persona.certifications.length - 6}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}