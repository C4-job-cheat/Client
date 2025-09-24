import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
// Select 관련 컴포넌트는 현재 단계에서 사용하지 않음
import { Label } from './ui/label';
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react';
import type { Page, Persona } from '../types';

interface PersonaSetupProps {
  onComplete: (persona: Persona) => void;
  onNavigate: (page: Page) => void;
}

// 5개 질문 기반 데이터 구조
interface NewPersonaFormData {
  id: string;
  // 기본 질문 (4개)
  jobCategory: string;
  specificJob: string;
  education: {
    level: string;
    school: string;
    major: string;
    graduated: boolean;
  };
  skills: {
    techStack: string[];
    certifications: string[];
    achievements: string[];
  };
  
  // 파일 업로드 (5번째 질문)
  uploadedFile: {
    file: File | null;
    fileName: string;
    fileContent: string;
  };
  
  // 카테고리별 특별 필드
  categorySpecific?: {
    customJob?: string;
    [key: string]: any;
  };
}

// 직군별 직무 매핑 (요청된 카테고리 반영)
const jobCategoryMapping = {
  '기획': ['직접입력'],
  '전략·사업': ['직접입력'],
  'PM·PO': ['직접입력'],
  '마케팅': ['직접입력'],
  '광고': ['직접입력'],
  'PR·커뮤니케이션': ['직접입력'],
  '소프트웨어개발': ['직접입력'],
  '데이터': ['직접입력'],
  '인프라·보안': ['직접입력'],
  '디자인': ['직접입력'],
  'B2B 영업': ['직접입력'],
  '리테일·유통': ['직접입력'],
  '무역': ['직접입력'],
  '물류·SCM': ['직접입력'],
  '구매·소싱': ['직접입력'],
  '사무·행정': ['직접입력'],
  '총무·시설': ['직접입력'],
  '법무·컴플라이언스': ['직접입력'],
  '인사(HR)': ['직접입력'],
  '노무(ER)': ['직접입력'],
  '회계': ['직접입력'],
  '세무': ['직접입력'],
  '재무·자금·IR': ['직접입력'],
  '생산·제조': ['직접입력'],
  '엔지니어링': ['직접입력'],
  '건설·토목': ['직접입력'],
  '건축·인테리어': ['직접입력'],
  '설비·시설관리': ['직접입력'],
  '의료': ['직접입력'],
  '바이오·제약': ['직접입력'],
  '교육': ['직접입력'],
  '연구': ['직접입력'],
  '고객서비스': ['직접입력'],
  '식음료·외식': ['직접입력'],
  '미디어': ['직접입력'],
  '문화·예술': ['직접입력'],
  '스포츠': ['직접입력'],
  '금융': ['직접입력'],
  '보험': ['직접입력'],
  '운전': ['직접입력'],
  '운송·배송': ['직접입력'],
  '공공·행정': ['직접입력'],
  '복지·NGO': ['직접입력']
};

const educationLevels = [
  '고등학교', '대학교', '대학원 석사', '대학원 박사'
];

// 참고용 전공 목록 (현재는 미사용) - 제거 예정

const techStacks = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue.js', 'Angular',
  'Node.js', 'Spring', 'Django', 'HTML/CSS', 'SQL', 'MySQL', 'PostgreSQL',
  'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Figma', 
  'Photoshop', 'Illustrator', 'Excel', '기타'
];

const certifications = [
  '정보처리기사', '정보보안기사', 'SQLD', 'ADsP', '컴활1급', '컴활2급',
  'AWS Certified', 'Google Analytics', 'TOEIC', 'OPIC', 'JLPT', 'HSK',
  '토익스피킹', '데이터분석전문가', '사회조사분석사', '기타'
];

export function PersonaSetup({ onComplete, onNavigate }: PersonaSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<NewPersonaFormData>({
    id: Date.now().toString(),
    jobCategory: '',
    specificJob: '',
    education: {
      level: '',
      school: '',
      major: '',
      graduated: true
    },
    skills: {
      techStack: [],
      certifications: [],
      achievements: []
    },
    uploadedFile: {
      file: null,
      fileName: '',
      fileContent: ''
    },
    categorySpecific: {}
  });

  const totalSteps = 5;

  const updateFormData = (updates: Partial<NewPersonaFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // NewPersonaFormData를 기존 Persona 형태로 변환
    const persona: Persona = {
      id: formData.id,
      jobCategory: formData.jobCategory || '기타',
      experience: { hasExperience: false },
      education: { 
        level: formData.education.level,
        major: formData.education.major 
      },
      preferredRegions: [],
      minSalary: 0,
      languages: [],
      workStyle: { location: '', type: '' },
      certifications: formData.skills.certifications,
      achievements: formData.skills.achievements.join(', '),
      categorySpecific: {
        specificJob: formData.specificJob,
        education: formData.education,
        skills: formData.skills,
        uploadedFile: formData.uploadedFile
      },
      description: `${formData.jobCategory} 분야의 ${formData.specificJob} 희망`
    };
    onComplete(persona);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/html') {
        alert('HTML 파일만 업로드 가능합니다.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        updateFormData({
          uploadedFile: {
            file: file,
            fileName: file.name,
            fileContent: content
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0: // 희망 직군 선택
        return (
          <div className="space-y-4 lg:space-y-5">
            <div className="text-center lg:text-left">
              <h2 className="text-xl lg:text-2xl font-bold">어떤 분야에서 커리어를 쌓고 싶으신가요?</h2>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {Object.keys(jobCategoryMapping).map((category) => (
                <button
                  key={category}
                  onClick={() => updateFormData({ jobCategory: category, specificJob: '' })}
                  className={`
                    inline-flex items-center px-3.5 py-2 rounded-md text-xs font-medium
                    transition-all duration-150 ease-out cursor-pointer select-none
                    hover:scale-105 hover:shadow-sm focus:outline-none
                    ${formData.jobCategory === category
                      ? 'bg-black text-white border border-black shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-800'
                    }
                  `}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // 희망 직무 선택
        return (
          <div className="space-y-4 lg:space-y-5">
            <div className="text-center lg:text-left">
              <h2 className="text-xl lg:text-2xl font-bold">어떤 직무를 희망하시나요?</h2>
            </div>
            {formData.jobCategory ? (
              <div className="space-y-3 lg:space-y-4">
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {jobCategoryMapping[formData.jobCategory as keyof typeof jobCategoryMapping]?.map((job) => (
                    <button
                      key={job}
                      onClick={() => updateFormData({ specificJob: job })}
                      className={`
                        inline-flex items-center px-3.5 py-2 rounded-md text-xs font-medium
                        transition-all duration-150 ease-out cursor-pointer select-none
                        hover:scale-105 hover:shadow-sm focus:outline-none
                        ${formData.specificJob === job
                          ? 'bg-black text-white border border-black shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-800'
                        }
                      `}
                      type="button"
                    >
                      {job}
                    </button>
                  ))}
                </div>
                {formData.specificJob === '직접입력' && (
                  <Input
                    placeholder="희망 직무를 직접 입력해주세요"
                    value={formData.categorySpecific?.customJob || ''}
                    onChange={(e) => updateFormData({
                      categorySpecific: {
                        ...formData.categorySpecific,
                        customJob: e.target.value
                      }
                    })}
                    className="mt-3 lg:mt-4 lg:text-lg lg:h-12"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8 lg:py-12 text-gray-500">
                <p className="lg:text-lg">먼저 직군을 선택해주세요</p>
              </div>
            )}
          </div>
        );

      case 2: // 최종 학력
        return (
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center lg:text-left space-y-2 lg:space-y-3">
              <h2 className="text-xl lg:text-2xl font-bold">최종 학력을 알려주세요</h2>
              
            </div>
            <div className="space-y-4 lg:space-y-6">
              <div>
                <Label className="text-sm lg:text-base font-medium mb-2 lg:mb-3 block">학력 수준</Label>
                <div className="grid grid-cols-2 gap-2 lg:gap-3 w-full">
                  {educationLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => updateFormData({ education: { ...formData.education, level } })}
                      className={`
                        flex items-center justify-center py-2.5 rounded-md text-sm font-medium
                        transition-all duration-150 ease-out cursor-pointer select-none
                        hover:scale-105 hover:shadow-sm focus:outline-none
                        ${formData.education.level === level
                          ? 'bg-black text-white border border-black shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-800'
                        }
                      `}
                      type="button"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 학교/전공 입력 필드 */}
              <div>
                <Label className="text-sm lg:text-base font-medium mb-2 lg:mb-3 block">학교명</Label>
                <Input
                  placeholder="예: 서울대학교"
                  value={formData.education.school}
                  onChange={(e) => updateFormData({
                    education: { ...formData.education, school: e.target.value }
                  })}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <Label className="text-sm lg:text-base font-medium mb-2 lg:mb-3 block">전공</Label>
                <Input
                  placeholder="예: 컴퓨터공학"
                  value={formData.education.major}
                  onChange={(e) => updateFormData({
                    education: { ...formData.education, major: e.target.value }
                  })}
                  className="h-10 text-sm"
                />
              </div>

            </div>
          </div>
        );

      case 3: // 핵심 역량 및 자격증
        return (
          <div className="space-y-4 lg:space-y-5 max-w-7xl mx-auto">
            {/* Header (고정 스타일) */}
            <div className="text-center lg:text-left">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">핵심 역량 및 자격증</h2>
            </div>

            {/* 1view 가로 2열 배치 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 보유 기술 스택 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">보유 기술 스택 (복수 선택 가능)</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[20.5rem] max-h-[20.5rem] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-blue-500">
                  <div className="flex flex-wrap gap-2">
                    {techStacks.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => {
                          const isSelected = formData.skills.techStack.includes(tech);
                          const updated = isSelected
                            ? formData.skills.techStack.filter(t => t !== tech)
                            : [...formData.skills.techStack, tech];
                          updateFormData({
                            skills: { ...formData.skills, techStack: updated }
                          });
                        }}
                        className={`
                          inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium
                          transition-all duration-150 ease-out cursor-pointer select-none
                          hover:scale-105 hover:shadow-sm focus:outline-none
                          ${formData.skills.techStack.includes(tech)
                            ? 'bg-blue-500 text-white border border-blue-500 shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-800'
                          }
                        `}
                        type="button"
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 보유 자격증 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">보유 자격증 (복수 선택 가능)</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[20.5rem] max-h-[20.5rem] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-blue-500">
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <button
                        key={cert}
                        onClick={() => {
                          const isSelected = formData.skills.certifications.includes(cert);
                          const updated = isSelected
                            ? formData.skills.certifications.filter(c => c !== cert)
                            : [...formData.skills.certifications, cert];
                          updateFormData({
                            skills: { ...formData.skills, certifications: updated }
                          });
                        }}
                        className={`
                          inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium
                          transition-all duration-150 ease-out cursor-pointer select-none
                          hover:scale-105 hover:shadow-sm focus:outline-none
                          ${formData.skills.certifications.includes(cert)
                            ? 'bg-blue-500 text-white border border-blue-500 shadow-sm'
                            : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-800'
                          }
                        `}
                        type="button"
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // HTML 파일 업로드
        return (
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* 상단: 설명 섹션 */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">파일을 업로드해주세요</h2>
              </div>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                이력서나 포트폴리오 HTML 파일을 업로드하면 더 정확한 분석이 가능합니다
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="text-xs text-gray-600">1) HTML 파일을 드래그하거나 클릭해서 선택하세요</div>
                <div className="text-xs text-gray-600">2) 업로드 후 파일명을 확인하세요</div>
                <div className="text-xs text-gray-600">3) 미리보기로 내용 일부를 확인할 수 있어요</div>
              </div>
            </div>

            {/* 하단: 업로드 영역 + 결과 */}
            <div className="space-y-6">
              {/* 파일 업로드 영역 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-blue-400 transition-all duration-200 bg-white min-h-[18rem] flex items-center justify-center">
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="html-file-upload"
                />
                <label htmlFor="html-file-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <FileText className="h-14 w-14 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        HTML 파일을 선택하거나 드래그해주세요
                      </p>
                      <p className="text-sm text-gray-500">
                        .html, .htm 파일만 업로드 가능합니다
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* 업로드된 파일 정보 */}
              {formData.uploadedFile.fileName && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{formData.uploadedFile.fileName}</p>
                      <p className="text-sm text-green-700">파일이 성공적으로 업로드되었습니다</p>
                    </div>
                    <button
                      onClick={() => updateFormData({
                        uploadedFile: { file: null, fileName: '', fileContent: '' }
                      })}
                      className="px-3 py-1 text-sm text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                  
                  {/* 파일 내용 미리보기 */}
                  <div className="p-3 bg-white rounded border">
                    
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded max-h-24 overflow-y-auto font-mono">
                      {formData.uploadedFile.fileContent.substring(0, 300)}
                      {formData.uploadedFile.fileContent.length > 300 && '...'}
                    </div>
                  </div>
                </div>
              )}

              
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-50 shadow-xl">
        <div className="max-w-md lg:max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="font-heading flex items-center space-x-2 text-neutral-600 hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>홈으로</span>
            </Button>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-sm lg:text-base font-semibold text-neutral-900">
                {currentStep === 0 ? '희망 직군' :
                 currentStep === 1 ? '희망 직무' :
                 currentStep === 2 ? '최종 학력' :
                 currentStep === 3 ? '역량 및 자격증' :
                 '파일 업로드'}
              </h1>
            </div>
            <div className="flex-1 text-right">
              <span className="font-body text-xs lg:text-sm text-neutral-500 font-medium">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-3 lg:py-6">
        <div className="max-w-md lg:max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Desktop: Left side - Step info */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
              <div className="sticky top-28">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">페르소나 설정</h1>
                    
                  </div>

                  {/* Step indicators */}
                  <div className="space-y-2.5">
                    {Array.from({ length: totalSteps }, (_, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index < currentStep ? 'bg-green-100 text-green-600' :
                          index === currentStep ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span className={`text-sm ${
                          index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}>
                          {index === 0 ? '희망 직군' :
                           index === 1 ? '희망 직무' :
                           index === 2 ? '학력 정보' :
                           index === 3 ? '역량 & 자격증' :
                           '파일 업로드'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="lg:col-span-6 xl:col-span-6">
              <div className="min-h-[420px] lg:min-h-[360px] flex flex-col">
                <div className="flex-1">
                  {getStepContent()}
                </div>
                
                {/* Footer navigation moved to fixed global bar */}
              </div>
              {/* Fixed bottom navigation - All viewports */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-2.5">
                <div className="max-w-md lg:max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    {/* 이전 버튼 - 왼쪽 */}
                    <div className="flex-1">
                      {currentStep > 0 ? (
                        <button
                          onClick={prevStep}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
                        >
                          <ArrowLeft className="h-5 w-5" />
                          <span>이전</span>
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    {/* 중앙 단계 표시 */}
                    <div className="flex-1 text-center">
                      <span className="text-sm text-gray-400">
                        {currentStep + 1} / {totalSteps}
                      </span>
                    </div>
                    {/* 다음/완료 버튼 - 오른쪽 */}
                    <div className="flex-1 flex justify-end">
                      {currentStep === totalSteps - 1 ? (
                        <button
                          onClick={handleComplete}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors py-2"
                        >
                          <span>완료</span>
                          <Check className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={nextStep}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors py-2"
                        >
                          <span>다음</span>
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Persona preview card */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
              <div className="sticky top-28">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">내 페르소나 미리보기</h3>
                    <span className="text-xs text-gray-400">{currentStep + 1} / {totalSteps}</span>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">희망 분야 / 직무</p>
                      <p className="font-medium text-gray-900">
                        {formData.jobCategory || '미선택'}
                        {formData.specificJob ? ` · ${formData.specificJob}` : ''}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">학력 수준</p>
                      <p className="font-medium text-gray-900">{formData.education.level || '미선택'}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">학교명</p>
                      <p className="font-medium text-gray-900">{formData.education.school || '학교 미입력'}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">전공</p>
                      <p className="font-medium text-gray-900">{formData.education.major || '전공 미입력'}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">보유 기술 스택</p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.skills.techStack.length > 0 ? (
                          formData.skills.techStack.slice(0, 8).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200">{t}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">선택 없음</span>
                        )}
                        {formData.skills.techStack.length > 8 && (
                          <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">+{formData.skills.techStack.length - 8}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">보유 자격증</p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.skills.certifications.length > 0 ? (
                          formData.skills.certifications.slice(0, 6).map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200">{c}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">선택 없음</span>
                        )}
                        {formData.skills.certifications.length > 6 && (
                          <span className="px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-700 border border-gray-200">+{formData.skills.certifications.length - 6}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom spacer for fixed footer */}
      <div className="h-16" />
    </div>
  );
}