import type { Prize } from './types';

export type SeedPrize = Omit<Prize, 'id'>;

/** Default treats you can spend your hearts on. Editable in the Shop. */
export const SEED_PRIZES: SeedPrize[] = [
  { emoji: '📱', name: '15 min guilt-free scroll',   cost: 20 },
  { emoji: '🍿', name: 'One episode of your show',    cost: 30 },
  { emoji: '☕', name: 'Fancy coffee or boba',        cost: 40 },
  { emoji: '🎬', name: 'Movie night, zero guilt',     cost: 50 },
  { emoji: '🍕', name: 'Order your favorite takeout',  cost: 75 },
  { emoji: '😴', name: 'Sleep in this weekend',        cost: 80 },
  { emoji: '📚', name: 'A brand-new book',             cost: 100 },
  { emoji: '🛍️', name: 'Buy that thing in your cart',  cost: 150 },
];
