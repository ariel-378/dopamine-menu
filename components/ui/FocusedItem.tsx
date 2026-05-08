'use client';

import { ArrowLeft } from 'lucide-react';
import type { Item } from '@/lib/types';

interface Props {
  item: Item;
  onDone: (item: Item) => void;
  onSkip: () => void;
  onClose: () => void;
}

export function FocusedItem({ item, onDone, onSkip, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(253, 246, 232, 0.98) 0%, rgba(248, 220, 230, 0.98) 100%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        animation: 'fadeIn 300ms ease',
      }}
    >
      <button
        onClick={onClose}
        style={{
          alignSelf: 'flex-start',
          background: 'transparent',
          border: 'none',
          color: 'var(--cream-soft)',
          cursor: 'pointer',
          fontFamily: 'var(--type)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          padding: '8px 12px 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <ArrowLeft size={14} /> back to menu
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '440px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '11px',
            color: 'var(--brass)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          tonight&apos;s recommendation
        </div>
        <h1
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(36px, 8vw, 56px)',
            fontWeight: 400,
            color: 'var(--cream)',
            lineHeight: '1.1',
            letterSpacing: '-0.01em',
            margin: '0 0 16px',
          }}
        >
          {item.text}
        </h1>
        {item.desc && (
          <p
            style={{
              fontFamily: 'var(--body)',
              fontStyle: 'italic',
              fontSize: '17px',
              color: 'var(--cream-soft)',
              lineHeight: '1.5',
              margin: '0 0 40px',
            }}
          >
            {item.desc}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <button
            onClick={() => onDone(item)}
            style={{
              padding: '14px 24px',
              fontFamily: 'var(--type)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: 'var(--brass)',
              color: 'var(--ink)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            i&apos;m doing it →
          </button>
          <button
            onClick={onSkip}
            style={{
              padding: '12px 24px',
              fontFamily: 'var(--type)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: 'var(--cream-soft)',
              border: '0.5px solid var(--cream-soft)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            give me another
          </button>
        </div>
      </div>
    </div>
  );
}
