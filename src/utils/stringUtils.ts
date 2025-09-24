/**
 * 문자열 관련 유틸리티 함수들
 */

export function generateId(): string {
  return Date.now().toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatJobTitle(company: string, title: string): string {
  return `${company} - ${title}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

