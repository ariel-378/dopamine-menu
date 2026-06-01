'use client';

import { ArrowLeft, Heart } from 'lucide-react';
import { pointsForTier } from '@/lib/taxonomy';
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
        background: 'linear-gradient(160deg, rgba(255, 227, 241, 0.98) 0%, rgba(214, 240, 226, 0.98) 100%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        animation: 'fadeIn 250ms ease',
      }}
    >
      <button
        className="pill"
        onClick={onClose}
        style={{
          alignSelf: 'flex-start',
          background: 'var(--panel)',
          color: 'var(--cream-soft)',
          fontSize: '12px',
          fontWeight: 600,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <ArrowLeft size={14} strokeWidth={2.6} /> back to menu
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
          width: '100%',
        }}
      >
        <div
          className="pop-in cozy-card"
          style={{
            width: '100%',
            padding: '32px 24px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              background: 'var(--ink-deep)',
              borderRadius: '999px',
              fontFamily: 'var(--type)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--brass-deep)',
              marginBottom: '18px',
            }}
          >
            <span className="heartbeat">♥</span> your quest
          </div>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(32px, 7vw, 48px)',
              fontWeight: 700,
              color: 'var(--cream)',
              lineHeight: '1.12',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {item.text}
          </h1>
          {item.desc && (
            <p
              style={{
                fontFamily: 'var(--body)',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--cream-soft)',
                lineHeight: '1.5',
                margin: '14px 0 0',
              }}
            >
              {item.desc}
            </p>
          )}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '18px',
              padding: '7px 16px',
              background: 'var(--brass)',
              borderRadius: '999px',
              fontFamily: 'var(--type)',
              fontSize: '14px',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            <Heart size={14} fill="#fff" color="#fff" strokeWidth={2.4} />
            earn {pointsForTier(item.tier)} hearts
          </div>
        </div>

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
            className="game-btn"
            onClick={() => onDone(item)}
            style={{
              padding: '16px 24px',
              fontSize: '15px',
              fontWeight: 700,
              background: 'var(--mint)',
              color: '#fff',
              ['--btn-lip' as string]: '#4FA77B',
            }}
          >
            let&apos;s do it! →
          </button>
          <button
            className="game-btn"
            onClick={onSkip}
            style={{
              padding: '13px 24px',
              fontSize: '13px',
              fontWeight: 600,
              background: 'var(--panel)',
              color: 'var(--cream-soft)',
              ['--btn-lip' as string]: 'var(--lip)',
            }}
          >
            give me another ♺
          </button>
        </div>
      </div>
    </div>
  );
}
