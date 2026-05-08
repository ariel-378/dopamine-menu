export type Tier = 'snack' | 'small' | 'medium' | 'feast';

export type Mode = 'any' | 'morning' | 'fried' | 'bedtime';

export type CategoryKey =
  | 'movement'
  | 'creative'
  | 'social'
  | 'hands'
  | 'reading'
  | 'rest';

export interface Item {
  id: string;
  text: string;
  desc?: string;
  tier: Tier;
  cats: CategoryKey[];
  modes: Mode[];
  custom?: boolean;
}

export interface LogEntry {
  itemId: string;
  text: string;
  at: string;
}

export interface InspoBoard {
  id: string;
  url: string;
  label?: string;
  addedAt: string;
}
