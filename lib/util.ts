import type { Mode } from './types';

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function detectMode(): Mode {
  const hour = new Date().getHours();
  if (hour < 9) return 'morning';
  if (hour >= 21) return 'bedtime';
  if (hour >= 15 && hour < 19) return 'fried';
  return 'any';
}
