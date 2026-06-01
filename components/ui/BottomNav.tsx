'use client';

import { Gift, Heart, Pencil, UtensilsCrossed, type LucideIcon } from 'lucide-react';

export type TabId = 'menu' | 'log' | 'shop' | 'edit';

interface Props {
  tab: TabId;
  setTab: (id: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'menu', label: 'menu',   Icon: UtensilsCrossed },
  { id: 'log',  label: 'wins',   Icon: Heart },
  { id: 'shop', label: 'shop',   Icon: Gift },
  { id: 'edit', label: 'edit',   Icon: Pencil },
];

export function BottomNav({ tab, setTab }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: '14px',
        marginTop: '36px',
        marginBottom: '14px',
        display: 'flex',
        gap: '6px',
        padding: '7px',
        background: 'var(--panel)',
        border: '2.5px solid var(--line)',
        borderRadius: '999px',
        boxShadow: '0 5px 0 var(--lip), 0 10px 20px rgba(74, 47, 62, 0.14)',
      }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        const { Icon } = t;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '11px 5px',
              background: active ? 'var(--brass)' : 'transparent',
              border: 'none',
              borderRadius: '999px',
              fontFamily: 'var(--type)',
              fontSize: '12px',
              fontWeight: active ? 600 : 500,
              letterSpacing: '0.01em',
              color: active ? '#fff' : 'var(--cream-soft)',
              cursor: 'pointer',
              transition: 'all 160ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: active ? 'scale(1.04)' : 'scale(1)',
              boxShadow: active ? '0 3px 0 var(--brass-deep)' : 'none',
            }}
          >
            <Icon size={15} strokeWidth={2.6} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
