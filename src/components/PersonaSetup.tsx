import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
// Select 관련 컴포넌트는 현재 단계에서 사용하지 않음
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Check, FileText, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Page, PersonaEducationInfo, PersonaSkillsInfo, PersonaData, PersonaResponse } from '../types';
import { usePersona } from '../hooks/usePersona';
import { toast } from 'sonner';

interface PersonaSetupProps {
  onComplete: (persona: PersonaResponse) => void;
  onNavigate: (page: Page) => void;
}

// 5개 질문 기반 데이터 구조
interface UploadedFileInfo {
  file: File | null;
  fileName: string;
  fileContent: string;
}

interface NewPersonaFormData {
  jobCategory: string;
  specificJob: string;
  customJob?: string;
  education: PersonaEducationInfo;
  skills: PersonaSkillsInfo;
  uploadedFile: UploadedFileInfo;
}

// 직군별 직무 매핑 (요청된 카테고리 반영)
const jobCategoryMapping = {
  '기획': [
    '경영·사업기획',
    '마케팅기획',
    '상품기획·MD',
    '서비스기획',
    '웹기획',
    '앱기획',
    '게임기획',
    '기술기획',
    '교육·문화기획',
    '인사기획',
    'R&D기획',
    '직접입력'
  ],
  '전략': [
    '컨설턴트',
    '최고경영진 (CEO·COO·CTO)',
    'AI 기획·사업전략',
    '기업전략/사업전략',
    '신사업개발(사업개발, BD)',
    'M&A·투자전략',
    '경영혁신/PI·BPR',
    '산업·시장전략 애널리스트',
    '직접입력'
  ],
  'PM·PO': [
    '프로젝트 매니저 (PL·PM·PO)',
    '스크럼 마스터(SM)',
    '프로그램 매니저(PgM)',
    '프로덕트 오너(PO)',
    '서비스 오너(SO)',
    '직접입력'
  ],
  '마케팅': [
    '온라인·디지털 마케터',
    '퍼포먼스 마케터',
    '브랜드 마케터',
    '콘텐츠 마케터',
    'CRM 마케터',
    '바이럴 마케터',
    '글로벌 마케터',
    '시장조사·리서치',
    '그로스해커',
    '직접입력'
  ],
  '광고': [
    '광고기획 (AE)',
    '광고PD',
    '카피라이터',
    '크리에이티브 디렉터',
    '미디어플래너·채널관리',
    '광고 디자이너',
    '직접입력'
  ],
  'PR·커뮤니케이션': [
    '홍보·PR',
    '기업커뮤니케이션(Corporate Comm.)',
    '내부커뮤니케이션(Internal Comm.)',
    '이슈·위기관리(위기 커뮤니케이션)',
    '미디어 릴레이션즈(보도 대응)',
    '스피치라이터/임원 커뮤니케이션 어드바이저',
    '직접입력'
  ],
  '소프트웨어개발': [
    '서버·백엔드 개발',
    '프론트엔드 개발',
    '웹 개발·퍼블리싱',
    '앱 개발 (Android, iOS)',
    '소프트웨어(SW) 개발',
    '게임 개발',
    '블록체인',
    'QA (품질 보증)',
    '프롬프트 엔지니어',
    'DBA',
    '직접입력'
  ],
  '데이터': [
    '데이터 엔지니어',
    '데이터 사이언티스트',
    '데이터 분석가',
    'DBA (데이터베이스 관리자)',
    'AI·머신러닝 엔지니어',
    'AI·ML 연구원',
    'MLOps 엔지니어',
    '데이터 라벨러',
    '직접입력'
  ],
  '인프라·보안': [
    '시스템 엔지니어',
    '네트워크·클라우드 엔지니어',
    '정보보안·보안관제',
    'IT 기술지원·컨설팅',
    '직접입력'
  ],
  '디자인': [
    '그래픽·시각 디자이너',
    'UI·UX 디자이너',
    '웹·모바일 디자이너',
    '영상·모션 디자이너',
    '3D 디자이너',
    '제품·산업 디자이너',
    '캐릭터·완구 디자이너',
    '실내·공간 디자이너',
    '건축 디자이너',
    '환경·경관 디자이너',
    '패션 디자이너',
    'VMD (비주얼 머천다이저)',
    '편집 디자이너',
    '아트디렉터',
    '일러스트레이터·그림작가',
    '직접입력'
  ],
  '영업': [
    '기술영업',
    '법인영업',
    '해외영업',
    '서비스영업',
    '광고영업',
    '금융영업',
    '제품·솔루션영업',
    '영업 관리·지원',
    '직접입력'
  ],
  '판매': [
    '매장 관리·매니저',
    '판매·세일즈',
    '슈퍼바이저',
    '유통 관리',
    '직접입력'
  ],
  '무역': [
    '무역 사무',
    '국제 물류·포워딩',
    '관세사',
    '보세사',
    '직접입력'
  ],
  '물류·자재·구매': [
    '물류 관리',
    'SCM (공급망 관리)',
    '재고·창고 관리',
    '구매 관리',
    '자재 관리',
    '물류·구매 기획',
    'SRM (공급업체 관계 관리)',
    '직접입력'
  ],
  '사무': [
    '사무·경영지원',
    '비서 (임원, 수행)',
    '일반사무/행정사무',
    '문서작성/데이터입력·전산사무',
    '출납/사무지원(Back Office)',
    '직접입력'
  ],
  '총무': [
    '총무',
    '자산·비품·구매보조 관리',
    '문서·기록 관리(Records)',
    '복리후생·사내행사 운영',
    'OA/사무환경·공간 관리',
    '직접입력'
  ],
  '법무': [
    '법무·컴플라이언스',
    '사내변호사',
    '법률사무원',
    '변리사·특허명세사',
    '변호사',
    '법무사',
    '직접입력'
  ],
  '인사(HR)': [
    '인사관리 (HRM)',
    '인재개발 (HRD)',
    'HR 컨설팅',
    '헤드헌터·잡매니저',
    '직접입력'
  ],
  '노무(ER)': [
    '노무관리 (ER)',
    '노무사',
    '임금·퇴직정산/근태·시간외 관리',
    '노사협의체/노조 대응 실무',
    '인사규정·징계·분쟁 대응',
    '직접입력'
  ],
  '회계': [
    '회계·경리',
    '공인회계사 (CPA)',
    '직접입력'
  ],
  '세무': [
    '세무',
    '세무사',
    '직접입력'
  ],
  '재무·자금·IR': [
    '재무·자금',
    '감사',
    'IR·공시',
    'CFA (재무분석사)',
    'CFO (최고재무책임자)',
    '직접입력'
  ],
  '생산·제조': [
    '생산·공정 관리',
    '품질 관리',
    '생산·공정 엔지니어',
    '생산직 (조립·가공·검사)',
    '기계 조작',
    '공장 관리·설비보전',
    '용접·제관',
    '직접입력'
  ],
  '엔지니어링': [
    '기계·기구 설계',
    '금형·회로 설계',
    '기계·설비 엔지니어',
    '전기·전자 엔지니어',
    '반도체 엔지니어',
    '화학 엔지니어',
    '직접입력'
  ],
  '건설·토목': [
    '건축·토목 기사',
    '현장·공무 관리',
    '감리',
    '안전 관리',
    '환경·소방설비',
    '직접입력'
  ],
  '건축·인테리어': [
    '건축·구조 설계',
    '도시·조경 설계',
    '인테리어 시공·견적·원가',
    '인테리어 현장관리·감리 보조',
    '전시·상업공간 기획/시공',
    'BIM 코디네이터(건축 인테리어 영역)',
    '직접입력'
  ],
  '설비·시설': [
    '시설·건물 관리',
    '공조냉동',
    '빌딩 오퍼레이터(BO)',
    '에너지관리자',
    '설비 자동제어(BA/IBS)',
    '주택관리사(관리사무소장)',
    '직접입력'
  ],
  '의료': [
    '의사·한의사',
    '약사·한약사',
    '수의사',
    '간호사',
    '간호조무사',
    '물리치료사·도수치료사',
    '방사선사',
    '심리·언어·놀이치료사',
    '원무·병원행정',
    '병원코디네이터',
    '수의테크니션',
    '직접입력'
  ],
  '바이오·제약': [
    '바이오·제약 연구',
    '임상연구 (CRA, CRC)',
    '제제/제형 연구',
    'CMC/공정개발',
    '품질보증(QA)/품질관리(QC) 제약',
    '약물감시(PV)',
    'RA(인허가)',
    '직접입력'
  ],
  '교육': [
    '학원·과외 강사',
    '외국어 강사',
    '방문·학습지 교사',
    '유치원·보육교사',
    '초·중·고·특수교사',
    '교육콘텐츠·교재 개발',
    '교수설계',
    '교육 운영·상담',
    '직업상담사',
    '교직원·조교',
    '직접입력'
  ],
  '연구': [
    '연구원·R&D',
    '응용연구/선행연구',
    '실험·분석 연구원(랩 운영)',
    '산학협력·과제관리(R&D PMO)',
    '연구기술지원/장비운영',
    '직접입력'
  ],
  '고객서비스': [
    '인바운드·아웃바운드 상담',
    '텔레마케터·CS',
    '고객센터·CX 관리',
    '설치·수리·A/S',
    '안내데스크',
    '경비·경호',
    '직접입력'
  ],
  '식음료·외식': [
    '요리사·셰프·조리사',
    '주방보조',
    '제과·제빵사',
    '바리스타',
    '소믈리에·바텐더',
    '홀서빙',
    '레스토랑·카페 매니저',
    '식품 연구',
    '영양사',
    '푸드스타일리스트',
    '직접입력'
  ],
  '미디어': [
    'PD·감독',
    '영상편집·촬영',
    '방송·사운드 엔지니어',
    '기자',
    '에디터·작가',
    '통번역가',
    '연예인·매니저',
    '모델·가수·성우',
    '쇼호스트·리포터',
    '크리에이터 (BJ, 인플루언서)',
    '직접입력'
  ],
  '문화': [
    '큐레이터·도슨트',
    '전시기획(큐레이션 기획)',
    '공연/축제 기획·운영',
    '문화콘텐츠 PD',
    '아카이비스트(기록/컬렉션)',
    '직접입력'
  ],
  '스포츠': [
    '스포츠 강사·선수',
    '스포츠 매니지먼트(팀/선수 운영)',
    '트레이너/피지컬 코치',
    '심판·경기운영',
    '스포츠 데이터 분석가',
    '스포츠 마케터',
    '직접입력'
  ],
  '금융': [
    '금융사무·텔러',
    '금융상품 영업',
    '대출상담사',
    '심사역',
    '펀드매니저',
    '애널리스트',
    '계리사',
    '직접입력'
  ],
  '보험': [
    '보험설계사',
    '보험심사',
    '손해사정사',
    '언더라이터(인수심사)',
    '보험상품 기획·개발',
    '지급심사·보험금 심사 실무',
    '채널영업/GA 영업',
    '보험 운영·고객관리',
    '직접입력'
  ],
  '운전': [
    '수행기사',
    '버스·택시 기사',
    '셔틀·통근버스 기사',
    '특수차량(트럭·리프트 등) 운전',
    '리무진·의전 운전',
    '주차·발렛',
    '직접입력'
  ],
  '운송·배송': [
    '화물·중장비 기사',
    '납품·배송기사',
    '라이더·배달원',
    '상하차·적재',
    '배차관리',
    '조종사·기관사',
    '직접입력'
  ],
  '공공': [
    '군인·부사관',
    '환경미화원',
    '사서',
    '방역·방재',
    '직접입력'
  ],
  '복지': [
    '사회복지사',
    '생활지도원',
    '요양보호사',
    '장애인활동지원사',
    '정신건강사회복지사',
    '아동·청소년지도사',
    '노인복지상담사',
    '직접입력'
  ]
};

const educationLevels = [
  '고등학교', '대학교', '대학원 석사', '대학원 박사'
];


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

// 가이드 스텝 데이터
const guideSteps = [
  {
    step: 1,
    title: "프로필 아이콘 클릭",
    description: "우측 하단 프로필 아이콘(본인 이름/이니셜)을 클릭하세요",
    image: "/내보내기1.png"
  },
  {
    step: 2,
    title: "설정 선택",
    description: "메뉴에서 '설정'을 선택하세요",
    image: "/내보내기2.png"
  },
  {
    step: 3,
    title: "데이터 제어로 이동",
    description: "설정 창에서 '데이터 제어' 메뉴로 이동하세요",
    image: "/내보내기3.png"
  },
  {
    step: 4,
    title: "데이터 내보내기 클릭",
    description: "'데이터 내보내기' 버튼을 클릭하세요",
    image: "/내보내기4.png"
  },
  {
    step: 5,
    title: "내보내기 요청",
    description: "안내 팝업에서 '내보내기 요청' 버튼을 누르세요",
    image: "/내보내기5.png"
  },
  {
    step: 6,
    title: "이메일 대기",
    description: "가입된 이메일로 다운로드 링크가 전송될 때까지 기다리세요 (몇 분~몇 시간 소요)",
    image: "/내보내기6.png"
  },
  {
    step: 7,
    title: "이메일 확인",
    description: "받은 편지함에서 OpenAI/ChatGPT로부터 온 메일을 확인하세요",
    image: "/내보내기7.png"
  },
  {
    step: 8,
    title: "다운로드 버튼 클릭",
    description: "메일 안의 '데이터 내보내기 다운로드' 버튼을 클릭하세요",
    image: "/내보내기8.png"
  },
  {
    step: 9,
    title: "ZIP 파일 다운로드",
    description: "ZIP 파일이 다운로드됩니다",
    image: "/내보내기9.png"
  },
  {
    step: 10,
    title: "ZIP 파일 압축 해제",
    description: "다운로드 받은 ZIP 파일의 압축을 해제하세요",
    image: "/내보내기10.png"
  },
  {
    step: 11,
    title: "chat.html 파일 선택",
    description: "압축 해제된 폴더에서 'chat.html' 파일을 찾아 업로드하세요",
    image: "/내보내기11.png"
  }
];

export function PersonaSetup({ onComplete, onNavigate }: PersonaSetupProps) {
  const { createPersona, isLoading } = usePersona();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(1);
  const [formData, setFormData] = useState<NewPersonaFormData>({
    jobCategory: '',
    specificJob: '',
    customJob: '',
    education: {
      level: '',
      school: '',
      major: ''
    },
    skills: {
      techStack: [],
      certifications: []
    },
    uploadedFile: {
      file: null,
      fileName: '',
      fileContent: ''
    }
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

  const personaPayload: PersonaData = useMemo(() => ({
    job_category: formData.jobCategory,
    job_role: formData.specificJob === '직접입력'
      ? formData.customJob
      : formData.specificJob,
    school_name: formData.education.school,
    major: formData.education.major,
    skills: formData.skills.techStack,
    certifications: formData.skills.certifications,
    html_file: formData.uploadedFile.file || undefined,
  }), [formData]);

  const handleComplete = async () => {
    if (!formData.jobCategory) {
      alert('희망 직군을 선택해주세요.');
      return;
    }

    if (!formData.uploadedFile.file) {
      alert('HTML 파일을 업로드해주세요.');
      return;
    }

    try {
      const persona = await createPersona(personaPayload);
      
      // 페르소나 ID 확인
      if (!persona || !persona.persona_id) {
        toast.error('페르소나 생성 실패', {
          description: '서버에서 페르소나 ID를 반환하지 않았습니다.',
          duration: 5000,
        });
        return;
      }
      
      // 테스트용 토스트 - 페르소나 ID 확인
      toast.success(`페르소나 생성 성공!`, {
        description: `ID: ${persona.persona_id}`,
        duration: 5000,
      });
      
      onComplete(persona);
    } catch (err) {
      console.error('❌ 페르소나 생성 실패:', err);
      toast.error('페르소나 생성 실패', {
        description: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
        duration: 5000,
      });
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/html') {
      alert('HTML 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onload = (e) => {
      // 업로드 완료 후 약간의 지연으로 자연스러운 느낌 제공
      setTimeout(() => {
        const content = e.target?.result as string;
        updateFormData({
          uploadedFile: {
            file: file,
            fileName: file.name,
            fileContent: content
          }
        });
        setIsUploading(false);
        setUploadProgress(100);
      }, 300);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      alert('파일 읽기 중 오류가 발생했습니다.');
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
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
                    value={formData.customJob || ''}
                    onChange={(e) => updateFormData({
                      customJob: e.target.value
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
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[28rem] max-h-[28rem] overflow-y-auto">
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
                          inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium
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
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[28rem] max-h-[28rem] overflow-y-auto">
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
                          inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium
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
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">ChatGPT의 내보내기를 통한 HTML 파일 업로드</h2>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  ChatGPT 대화 내용을 HTML 파일로 내보내서 업로드하면 더 정확한 분석이 가능합니다
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGuideModal(true)}
                  className="ml-4 whitespace-nowrap"
                >
                  보내는 방법 자세히 알기
                </Button>
              </div>
            </div>

            {/* 업로드 영역 */}
            <div>
              {/* 파일 업로드 영역 */}
              <div
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 bg-white min-h-[18rem] flex items-center justify-center ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {formData.uploadedFile.fileName ? (
                  // 업로드 완료 후 결과 표시
                  <div className="space-y-4 w-full max-w-lg">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-green-900">{formData.uploadedFile.fileName}</p>
                        <p className="text-sm text-green-700">파일이 성공적으로 업로드되었습니다</p>
                      </div>
                    </div>

                    {/* 파일 내용 미리보기 */}
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm font-medium text-gray-700 mb-2">파일 내용 미리보기</p>
                      <div className="text-xs text-gray-600 bg-white p-3 rounded max-h-32 overflow-y-auto font-mono border">
                        {formData.uploadedFile.fileContent.substring(0, 400)}
                        {formData.uploadedFile.fileContent.length > 400 && '...'}
                      </div>
                    </div>

                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={() => {
                          updateFormData({
                            uploadedFile: { file: null, fileName: '', fileContent: '' }
                          });
                          setUploadProgress(0);
                          setIsUploading(false);
                        }}
                        className="px-4 py-2 text-sm text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        다른 파일 선택
                      </button>
                    </div>
                  </div>
                ) : isUploading ? (
                  // 업로드 진행 중 UI
                  <div className="space-y-6 w-full max-w-md">
                    <div className="flex flex-col items-center space-y-4">
                      <Upload className="h-14 w-14 text-blue-500 animate-pulse" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          파일 업로드 중...
                        </p>
                        <p className="text-sm text-gray-500">
                          잠시만 기다려주세요
                        </p>
                      </div>
                    </div>

                    {/* 진행률 바 */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">업로드 진행률</span>
                        <span className="font-medium text-blue-600">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-3" />
                    </div>
                  </div>
                ) : (
                  // 기본 업로드 UI
                  <>
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
                  </>
                )}
              </div>
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
              disabled={isLoading}
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
              <div className="sticky top-24">
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
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors py-2 disabled:text-gray-400"
                          disabled={isLoading}
                        >
                          <span>{isLoading ? '생성 중...' : '완료'}</span>
                          {!isLoading && <Check className="h-5 w-5" />}
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
              <div className="sticky top-24">
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

      {/* ChatGPT 가이드 모달 */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">ChatGPT 대화 내보내기 가이드</h2>
                <p className="text-sm text-gray-600 mt-1">
                  단계 {currentGuideStep} / {guideSteps.length}
                </p>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* 특정 스텝들(1, 2, 3, 5, 6, 8, 9)은 2열 레이아웃, 나머지는 기존 레이아웃 */}
              {[1, 2, 3, 5, 6, 8, 9].includes(currentGuideStep) ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  {/* 이미지 (왼쪽) */}
                  <div className="order-1 lg:order-1">
                    <img
                      src={guideSteps[currentGuideStep - 1].image}
                      alt={`가이드 ${currentGuideStep}`}
                      className="max-w-full h-auto mx-auto rounded-lg border shadow-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  
                  {/* 설명 (오른쪽) */}
                  <div className="order-2 lg:order-2 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-lg font-bold mb-4">
                      {currentGuideStep}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {guideSteps[currentGuideStep - 1].title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {guideSteps[currentGuideStep - 1].description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {/* 현재 스텝 이미지 */}
                  <div className="mb-6">
                    <img
                      src={guideSteps[currentGuideStep - 1].image}
                      alt={`가이드 ${currentGuideStep}`}
                      className="max-w-full h-auto mx-auto rounded-lg border shadow-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>

                  {/* 스텝 정보 */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-lg font-bold mb-4">
                      {currentGuideStep}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {guideSteps[currentGuideStep - 1].title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {guideSteps[currentGuideStep - 1].description}
                    </p>
                  </div>
                </div>
              )}

              {/* 진행률 표시 */}
              <div className="mt-6">
                <div className="flex justify-center space-x-2">
                  {guideSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index + 1 <= currentGuideStep
                          ? 'bg-blue-600'
                          : index + 1 === currentGuideStep + 1
                          ? 'bg-blue-300'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentGuideStep > 1) {
                    setCurrentGuideStep(currentGuideStep - 1);
                  }
                }}
                disabled={currentGuideStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>이전</span>
              </Button>

              <span className="text-sm text-gray-500">
                {currentGuideStep} / {guideSteps.length}
              </span>

              {currentGuideStep === guideSteps.length ? (
                <Button
                  onClick={() => {
                    setShowGuideModal(false);
                    setCurrentGuideStep(1);
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  <span>완료</span>
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentGuideStep(currentGuideStep + 1)}
                  className="flex items-center space-x-2"
                >
                  <span>다음</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}