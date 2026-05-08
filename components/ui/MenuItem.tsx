'use client';

import { CATEGORIES } from '@/lib/taxonomy';
import type { Item } from '@/lib/types';

interface Props {
  item: Item;
  index: number;
  onClick: (item: Item) => void;
}

export function MenuItem({ item, index, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(item)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '14px 4px 14px 0',
        borderTop: '0.5px solid var(--rule)',
        background: 'transparent',
        cursor: 'pointer',
        display: 'block',
        transition: 'background 200ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(45, 36, 24, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '11px',
            color: 'var(--brass)',
            letterSpacing: '0.1em',
            minWidth: '24px',
            paddingTop: '2px',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--body)',
              fontSize: '16px',
              color: 'var(--cream)',
              lineHeight: '1.35',
              fontWeight: 400,
            }}
          >
            {item.text}
          </div>
          {item.desc && (
            <div
              style={{
                fontFamily: 'var(--body)',
                fontStyle: 'italic',
                fontSize: '13px',
                color: 'var(--cream-soft)',
                marginTop: '3px',
                lineHeight: '1.4',
              }}
            >
              {item.desc}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
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
                    color: cat.color,
                    letterSpacing: '0.06em',
                  }}
                >
                  <Icon size={10} />
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
