import {
  BatteryLow,
  BookOpen,
  Clock,
  Hammer,
  Heart,
  Moon,
  Pencil,
  Sun,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryKey, Mode, Tier } from './types';

export interface CategoryInfo {
  label: string;
  Icon: LucideIcon;
  color: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  movement: { label: 'movement', Icon: Wind,     color: '#5CA86F' },  // leaf
  creative: { label: 'creative', Icon: Pencil,   color: '#F47E5C' },  // spring coral
  social:   { label: 'social',   Icon: Users,    color: '#E8B228' },  // marigold
  hands:    { label: 'hands',    Icon: Hammer,   color: '#C97B5A' },  // terracotta
  reading:  { label: 'reading',  Icon: BookOpen, color: '#A77FCF' },  // lilac
  rest:     { label: 'rest',     Icon: Heart,    color: '#6BB8E8' },  // sky
};

export interface TierInfo {
  label: string;
  sub: string;
  shortLabel: string;
  numeral: string;
  points: number;
}

export const TIERS: Record<Tier, TierInfo> = {
  snack:  { label: 'Apéritifs',  sub: '2–5 minutes',    shortLabel: 'snack',  numeral: 'I',   points: 5 },
  small:  { label: 'Petits',     sub: '10–20 minutes',  shortLabel: 'small',  numeral: 'II',  points: 10 },
  medium: { label: 'Principaux', sub: '30–60 minutes',  shortLabel: 'medium', numeral: 'III', points: 25 },
  feast:  { label: 'Festins',    sub: '1 hour or more', shortLabel: 'feast',  numeral: 'IV',  points: 50 },
};

/** Hearts earned for completing an item of the given tier. */
export function pointsForTier(tier: Tier): number {
  return TIERS[tier]?.points ?? 0;
}

export interface ModeInfo {
  label: string;
  Icon: LucideIcon;
  hint: string;
}

export const MODES: Record<Mode, ModeInfo> = {
  any:     { label: 'Anytime', Icon: Clock,      hint: 'show me everything' },
  morning: { label: 'Morning', Icon: Sun,        hint: 'just woke up, low decisions' },
  fried:   { label: 'Fried',   Icon: BatteryLow, hint: 'after school, no energy' },
  bedtime: { label: 'Bedtime', Icon: Moon,       hint: 'wind down, screen-free' },
};
