import type { Job } from '../types';

// Mock data for jobs - centralized
export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    company: '네이버',
    title: '프론트엔드 개발자',
    field: 'IT/개발',
    matchScore: 95,
    requirements: {
      expertise: 88,
      potential: 92,
      problemSolving: 85,
      collaboration: 90,
      adaptability: 87
    },
    details: {
      location: '경기도 성남시',
      employmentType: '정규직',
      registeredDate: '2024-09-20',
      deadline: '2024-10-20',
      description: 'React.js를 활용한 웹 서비스 개발',
      techStack: ['JavaScript', 'TypeScript', 'React', 'Next.js'],
      education: '대학교 졸업',
      certifications: ['정보처리기사']
    },
    aiReason: 'React와 TypeScript 경험이 풍부하고, 프론트엔드 개발에 대한 열정이 보입니다.',
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    company: '카카오',
    title: 'UI/UX 디자이너',
    field: '디자인',
    matchScore: 88,
    requirements: {
      expertise: 85,
      potential: 88,
      problemSolving: 82,
      collaboration: 92,
      adaptability: 85
    },
    details: {
      location: '서울시 강남구',
      employmentType: '정규직',
      registeredDate: '2024-09-18',
      deadline: '2024-10-18',
      description: '모바일 앱 UI/UX 디자인 및 사용자 경험 개선',
      techStack: ['Figma', 'Sketch', 'Adobe XD'],
      education: '대학교 졸업',
      certifications: ['디자인 관련 자격증']
    },
    aiReason: '사용자 중심의 디자인 사고와 모바일 UX에 대한 이해도가 높습니다.',
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    company: '쿠팡',
    title: '백엔드 개발자',
    field: 'IT/개발',
    matchScore: 92,
    requirements: {
      expertise: 90,
      potential: 89,
      problemSolving: 94,
      collaboration: 88,
      adaptability: 91
    },
    details: {
      location: '서울시 송파구',
      employmentType: '정규직',
      registeredDate: '2024-09-15',
      deadline: '2024-10-15',
      description: '대규모 이커머스 시스템 백엔드 개발',
      techStack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
      education: '대학교 졸업',
      certifications: ['정보처리기사', 'AWS Certified']
    },
    aiReason: '백엔드 개발 경험과 대규모 시스템에 대한 이해가 있으십니다.',
    logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face'
  }
];

// Default persona capabilities for radar chart
export const DEFAULT_PERSONA_CAPABILITIES = [
  { subject: '직무 전문성', A: 88, fullMark: 100 },
  { subject: '성장 잠재력', A: 90, fullMark: 100 },
  { subject: '문제 해결력', A: 85, fullMark: 100 },
  { subject: '협업 능력', A: 78, fullMark: 100 },
  { subject: '적응력', A: 92, fullMark: 100 }
];
