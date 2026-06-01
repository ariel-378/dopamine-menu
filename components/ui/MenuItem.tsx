'use client';

import { Heart } from 'lucide-react';
import { CATEGORIES, pointsForTier } from '@/lib/taxonomy';
import type { Item } from '@/lib/types';

interface Props {
  item: Item;
  onClick: (item: Item) => void;
}

export function MenuItem({ item, onClick }: Props) {
  return (
    <button
      className="menu-row"
      onClick={() => onClick(item)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
        marginBottom: '10px',
        border: '2.5px solid var(--line)',
        borderRadius: '18px',
        background: 'var(--panel)',
        boxShadow: '0 4px 0 var(--lip)',
        cursor: 'pointer',
        display: 'block',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 0 var(--lip)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 var(--lip)';
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Heart
          className="menu-heart"
          size={16}
          strokeWidth={2.6}
          fill="var(--brass-shadow)"
          color="var(--brass)"
          style={{ marginTop: '3px', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                fontFamily: 'var(--body)',
                fontSize: '16px',
                color: 'var(--cream)',
                lineHeight: '1.35',
                fontWeight: 700,
              }}
            >
              {item.text}
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                flexShrink: 0,
                padding: '3px 9px',
                marginTop: '1px',
                borderRadius: '999px',
                background: 'var(--ink-deep)',
                fontFamily: 'var(--type)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--brass-deep)',
              }}
            >
              <Heart size={11} fill="var(--brass)" color="var(--brass)" strokeWidth={2.4} />
              {pointsForTier(item.tier)}
            </span>
          </div>
          {item.desc && (
            <div
              style={{
                fontFamily: 'var(--body)',
                fontSize: '13px',
                color: 'var(--cream-soft)',
                marginTop: '3px',
                lineHeight: '1.4',
                fontWeight: 500,
              }}
            >
              {item.desc}
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            {(item.cats || []).map((c) => {
              const cat = CATEGORIES[c];
              if (!cat) return null;
              const { Icon } = cat;
              return (
                <span
                  key={c}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    fontFamily: 'var(--type)',
                    fontWeight: 600,
                    color: '#fff',
                    background: cat.color,
                    padding: '3px 9px',
                    borderRadius: '999px',
                    letterSpacing: '0.02em',
                  }}
                >
                  <Icon size={10} strokeWidth={2.6} />
                  {cat.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </button>
  );
}
