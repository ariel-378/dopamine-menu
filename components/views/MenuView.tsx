'use client';

import { Plus, Sparkles } from 'lucide-react';
import { MenuItem } from '@/components/ui/MenuItem';
import { MODES, TIERS } from '@/lib/taxonomy';
import type { Item, Mode, Tier } from '@/lib/types';

interface Props {
  items: Item[];
  mode: Mode;
  setMode: (m: Mode) => void;
  tier: Tier;
  setTier: (t: Tier) => void;
  onPick: (item: Item) => void;
  onSurprise: (filtered: Item[]) => void;
  goToEdit: (presetTier: Tier | null, presetMode: Mode | null) => void;
}

export function MenuView({
  items,
  mode,
  setMode,
  tier,
  setTier,
  onPick,
  onSurprise,
  goToEdit,
}: Props) {
  const filtered = items.filter(
    (i) => i.tier === tier && (i.modes || ['any']).includes(mode)
  );
  const tierInfo = TIERS[tier];

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(Object.entries(MODES) as [Mode, (typeof MODES)[Mode]][]).map(([key, info]) => {
            const active = mode === key;
            const { Icon } = info;
            return (
              <button
                key={key}
                className="pill"
                onClick={() => setMode(key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 13px',
                  background: active ? 'var(--brass)' : 'var(--panel)',
                  color: active ? '#fff' : 'var(--cream-soft)',
                  borderColor: active ? 'var(--brass)' : 'var(--rule-strong)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textTransform: 'lowercase',
                  boxShadow: active ? '0 3px 0 var(--brass-deep)' : 'none',
                }}
              >
                <Icon size={13} strokeWidth={2.6} />
                {info.label.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        {(Object.entries(TIERS) as [Tier, (typeof TIERS)[Tier]][]).map(([key, info], i) => {
          const active = tier === key;
          const dots = '●'.repeat(i + 1);
          return (
            <button
              key={key}
              onClick={() => setTier(key)}
              style={{
                padding: '11px 4px 10px',
                background: active ? 'var(--brass)' : 'var(--panel)',
                border: `2.5px solid ${active ? 'var(--brass)' : 'var(--line)'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: active ? '0 4px 0 var(--brass-deep)' : '0 4px 0 var(--lip)',
                transform: active ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div
                style={{
                  fontSize: '7px',
                  color: active ? 'rgba(255,255,255,0.85)' : 'var(--brass-shadow)',
                  letterSpacing: '0.15em',
                  marginBottom: '3px',
                }}
              >
                {dots}
              </div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: active ? '#fff' : 'var(--cream)',
                  lineHeight: 1,
                }}
              >
                {info.shortLabel}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'center', position: 'relative' }}>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: '30px',
            fontWeight: 700,
            color: 'var(--cream)',
            lineHeight: '1.1',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {tierInfo.label}
        </h2>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            marginTop: '8px',
            padding: '4px 12px',
            background: 'var(--ink-deep)',
            borderRadius: '999px',
            fontFamily: 'var(--type)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--brass-deep)',
          }}
        >
          ⏱ {tierInfo.sub}
        </div>
      </div>

      {filtered.length > 0 && (
        <button
          className="game-btn"
          onClick={() => onSurprise(filtered)}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--brass)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.01em',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '9px',
          }}
        >
          <Sparkles size={17} strokeWidth={2.6} />
          surprise me!
        </button>
      )}

      <div>
        {filtered.length === 0 ? (
          <div
            className="cozy-card"
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              fontFamily: 'var(--body)',
              fontWeight: 600,
              color: 'var(--cream-soft)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            <div className="float" style={{ fontSize: '36px', marginBottom: '8px' }}>🧺</div>
            nothing here yet —<br />
            add your own below!
          </div>
        ) : (
          filtered.map((item) => (
            <MenuItem key={item.id} item={item} onClick={onPick} />
          ))
        )}
        <button
          className="game-btn"
          onClick={() => goToEdit(tier, mode)}
          style={{
            width: '100%',
            padding: '13px',
            marginTop: '6px',
            background: 'var(--panel)',
            color: 'var(--brass)',
            ['--btn-lip' as string]: 'var(--lip)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Plus size={15} strokeWidth={2.6} />
          add your own
        </button>
      </div>
    </>
  );
}
