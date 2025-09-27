import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { User, GraduationCap, Award } from 'lucide-react';
import type { Persona } from '../types';

interface PersonaCardProps {
  persona: Persona;
  className?: string;
  compact?: boolean;
  expanded?: boolean;
}

export function PersonaCard({ persona, className = '', compact = false, expanded = false }: PersonaCardProps) {
  const specificJob = persona.categorySpecific?.specificJob || persona.jobCategory;
  const techStack = persona.categorySpecific?.skills?.techStack ?? [];
  const certifications = persona.certifications ?? [];

  const renderBadges = (
    items: string[],
    limit: number,
    emptyLabel: string,
    variant: 'outline' | 'secondary' = 'outline',
  ) => {
    if (!items.length) {
      return <span className="text-xs text-gray-400">{emptyLabel}</span>;
    }

    return (
      <>
        {items.slice(0, limit).map((item, index) => (
          <Badge
            key={`${item}-${index}`}
            variant={variant}
            className="text-xs"
          >
            {item}
          </Badge>
        ))}
        {items.length > limit && (
          <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">
            +{items.length - limit}
          </span>
        )}
      </>
    );
  };

  if (compact) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{specificJob}</h3>
            <p className="text-sm text-gray-600 truncate">{persona.education.level}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (expanded) {
    return (
      <Card className={`p-6 lg:p-8 ${className}`}>
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{persona.jobCategory}</h3>
              <p className="text-lg lg:text-xl text-gray-600">{specificJob}</p>
              <p className="text-sm lg:text-base text-gray-500 mt-1">{persona.description}</p>
            </div>
          </div>

          {/* 상세 정보 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 학력 정보 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <h4 className="font-semibold text-gray-900 lg:text-lg">학력 정보</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">학력 수준</span>
                  <span className="font-medium">{persona.education.level}</span>
                </div>
                {persona.education.major && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">전공</span>
                    <Badge variant="outline">{persona.education.major}</Badge>
                  </div>
                )}
                {persona.categorySpecific?.education?.school && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">학교</span>
                    <span className="font-medium">{persona.categorySpecific.education.school}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 기술 스택 */}
            {techStack.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gray-400" />
                  <h4 className="font-semibold text-gray-900 lg:text-lg">기술 스택</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {renderBadges(techStack, techStack.length, '선택 없음', 'secondary')}
                </div>
              </div>
            )}

            {/* 자격증 */}
            {certifications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gray-400" />
                  <h4 className="font-semibold text-gray-900 lg:text-lg">보유 자격증</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {renderBadges(certifications, certifications.length, '선택 없음')}
                </div>
              </div>
            )}

            {/* 커리어 목표 */}
            {persona.categorySpecific?.careerGoals?.goal && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 lg:text-lg">커리어 목표</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {persona.categorySpecific.careerGoals.goal}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 수상 이력 */}
          {persona.categorySpecific?.skills?.achievements && persona.categorySpecific.skills.achievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 lg:text-lg">수상 이력</h4>
              <div className="bg-green-50 rounded-lg p-4">
                <ul className="space-y-1">
                  {persona.categorySpecific.skills.achievements.map((achievement: string, index: number) => (
                    <li key={index} className="text-sm text-green-800">
                      • {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className={`bg-white border border-black rounded-xl shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">내 페르소나</h3>
        <span className="text-xs text-gray-400">현재 설정</span>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2.5">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">희망 분야 / 직무</p>
              <p className="font-medium text-gray-900">
                {persona.jobCategory}
                {specificJob ? ` · ${specificJob}` : ''}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-0.5">학력 수준</p>
              <p className="font-medium text-gray-900">{persona.education.level || '미설정'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-0.5">학교명</p>
              <p className="font-medium text-gray-900">{persona.categorySpecific?.education?.school || '학교 미설정'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-0.5">전공</p>
              <p className="font-medium text-gray-900">{persona.education.major || '전공 미설정'}</p>
            </div>
          </div>
          {/* 프로필 사진을 4개 필드와 동일한 높이로 우측에 배치 */}
          <div className="ml-6 mr-2 mt-2">
            <div className="w-32 h-40 bg-gradient-to-b from-blue-100 to-purple-100 rounded-3xl border border-black shadow-sm flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">보유 기술 스택</p>
          <div className="flex flex-wrap gap-1.5">
                {renderBadges(techStack, 8, '선택 없음')}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">보유 자격증</p>
          <div className="flex flex-wrap gap-1.5">
                {renderBadges(certifications, 6, '선택 없음')}
          </div>
        </div>
      </div>
    </div>
  );
}