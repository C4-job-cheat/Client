/**
 * 날짜 관련 유틸리티 함수들
 */

export function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return '마감';
  if (days === 0) return '오늘 마감';
  if (days === 1) return '내일 마감';
  return `${days}일 후 마감`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function isDeadlineSoon(deadline: string, warningDays: number = 3): boolean {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  return days >= 0 && days <= warningDays;
}

