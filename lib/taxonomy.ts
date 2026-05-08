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
  movement: { label: 'movement', Icon: Wind,     color: '#7BA88E' },
  creative: { label: 'creative', Icon: Pencil,   color: '#E07856' },
  social:   { label: 'social',   Icon: Users,    color: '#D4A24C' },
  hands:    { label: 'hands',    Icon: Hammer,   color: '#B89368' },
  reading:  { label: 'reading',  Icon: BookOpen, color: '#9B7B9E' },
  rest:     { label: 'rest',     Icon: Heart,    color: '#8FA9B8' },
};

export interface TierInfo {
  label: string;
  sub: string;
  shortLabel: string;
  numeral: string;
}

export const TIERS: Record<Tier, TierInfo> = {
  snack:  { label: 'Apéritifs',  sub: '2–5 minutes',    shortLabel: 'snack',  numeral: 'I' },
  small:  { label: 'Petits',     sub: '10–20 minutes',  shortLabel: 'small',  numeral: 'II' },
  medium: { label: 'Principaux', sub: '30–60 minutes',  shortLabel: 'medium', numeral: 'III' },
  feast:  { label: 'Festins',    sub: '1 hour or more', shortLabel: 'feast',  numeral: 'IV' },
};

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
