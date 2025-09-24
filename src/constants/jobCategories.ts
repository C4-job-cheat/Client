// 직군별 직무 매핑
export const JOB_CATEGORY_MAPPING = {
  'IT/개발': [
    '프론트엔드 개발자', '백엔드 개발자', '풀스택 개발자', '모바일 앱 개발자',
    'DevOps 엔지니어', '데이터 엔지니어', 'AI/ML 엔지니어', '게임 개발자',
    '보안 엔지니어', 'QA 엔지니어', 'DBA', '기타'
  ],
  '디자인': [
    'UI/UX 디자이너', '웹 디자이너', '그래픽 디자이너', '제품 디자이너',
    '브랜드 디자이너', '일러스트레이터', '영상 디자이너', '3D 디자이너', '기타'
  ],
  '마케팅': [
    '디지털 마케터', '콘텐츠 마케터', '퍼포먼스 마케터', '브랜드 마케터',
    'CRM 마케터', '소셜미디어 마케터', '이벤트 기획자', '마케팅 분석가', '기타'
  ],
  '영업': [
    '기업영업', '개인영업', '온라인영업', '해외영업', '기술영업', 
    '부동산 중개사', '보험설계사', '영업관리자', '기타'
  ],
  '기획': [
    '사업기획', '상품기획', '전략기획', '운영기획', '프로젝트 매니저',
    '서비스기획', '콘텐츠기획', '기타'
  ],
  '인사/HR': [
    'HR 전문가', '채용담당자', '교육담당자', '노무담당자',
    'HR 기획', '조직문화 담당자', '기타'
  ],
  '회계/재무': [
    '회계담당자', '재무담당자', '세무담당자', '경리',
    '투자분석가', '재무분석가', '내부감사', '기타'
  ],
  '기타': ['직접입력']
} as const;

export const EDUCATION_LEVELS = [
  '고등학교', '대학교', '대학원 석사', '대학원 박사'
] as const;

export const MAJORS = [
  '컴퓨터공학/소프트웨어', '전자/전기공학', '기계공학', '화학공학', '산업공학',
  '경영학', '경제학', '회계학', '마케팅', '디자인', '예술',
  '문학/어학', '심리학', '사회학', '정치외교학', '교육학', '기타'
] as const;

export const TECH_STACKS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue.js', 'Angular',
  'Node.js', 'Spring', 'Django', 'HTML/CSS', 'SQL', 'MySQL', 'PostgreSQL',
  'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Figma', 
  'Photoshop', 'Illustrator', 'Excel', '기타'
] as const;

export const CERTIFICATIONS = [
  '정보처리기사', '정보보안기사', 'SQLD', 'ADsP', '컴활1급', '컴활2급',
  'AWS Certified', 'Google Analytics', 'TOEIC', 'OPIC', 'JLPT', 'HSK',
  '토익스피킹', '데이터분석전문가', '사회조사분석사', '기타'
] as const;

