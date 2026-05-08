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
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(Object.entries(MODES) as [Mode, (typeof MODES)[Mode]][]).map(([key, info]) => {
            const active = mode === key;
            const { Icon } = info;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '999px',
                  background: active ? 'var(--cream)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--cream-soft)',
                  border: active ? 'none' : '0.5px solid var(--cream-soft)',
                  fontFamily: 'var(--type)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'lowercase',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <Icon size={11} />
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
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        {(Object.entries(TIERS) as [Tier, (typeof TIERS)[Tier]][]).map(([key, info]) => {
          const active = tier === key;
          return (
            <button
              key={key}
              onClick={() => setTier(key)}
              style={{
                padding: '10px 4px',
                background: active ? 'var(--panel)' : 'transparent',
                border: `0.5px solid ${active ? 'var(--brass)' : 'var(--rule)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 200ms',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--type)',
                  fontSize: '10px',
                  color: active ? 'var(--brass)' : 'var(--cream-soft)',
                  letterSpacing: '0.15em',
                  marginBottom: '2px',
                }}
              >
                {info.numeral}
              </div>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: '14px',
                  color: active ? 'var(--cream)' : 'var(--cream-soft)',
                  fontStyle: 'italic',
                  lineHeight: 1,
                }}
              >
                {info.shortLabel}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: '12px', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '10px',
            color: 'var(--brass)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          {tierInfo.sub}
        </div>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: '32px',
            fontWeight: 400,
            color: 'var(--cream)',
            lineHeight: '1.1',
            letterSpacing: '0.02em',
            margin: 0,
          }}
        >
          {tierInfo.label}
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '10px',
            color: 'var(--rule-strong)',
          }}
        >
          <div style={{ width: '40px', height: '0.5px', background: 'var(--rule-strong)' }} />
          <div style={{ fontSize: '8px', color: 'var(--brass)', letterSpacing: '0.3em' }}>✦</div>
          <div style={{ width: '40px', height: '0.5px', background: 'var(--rule-strong)' }} />
        </div>
      </div>

      {filtered.length > 0 && (
        <button
          onClick={() => onSurprise(filtered)}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            border: '0.5px dashed var(--brass)',
            borderRadius: '4px',
            color: 'var(--brass)',
            fontFamily: 'var(--type)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 200ms',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(194, 101, 119, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Sparkles size={12} />
          surprise me
        </button>
      )}

      <div>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              fontFamily: 'var(--body)',
              fontStyle: 'italic',
              color: 'var(--cream-soft)',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            nothing on this section yet —<br />
            add your own from the editor
          </div>
        ) : (
          filtered.map((item, i) => (
            <MenuItem key={item.id} item={item} index={i} onClick={onPick} />
          ))
        )}
        {filtered.length > 0 && (
          <div style={{ borderTop: '0.5px solid var(--rule)' }} />
        )}

        <button
          onClick={() => goToEdit(tier, mode)}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '16px',
            background: 'transparent',
            border: '0.5px solid var(--rule)',
            borderRadius: '4px',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--type)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 200ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brass)';
            e.currentTarget.style.color = 'var(--brass)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--rule)';
            e.currentTarget.style.color = 'var(--cream-soft)';
          }}
        >
          <Plus size={12} />
          add your own
        </button>
      </div>
    </>
  );
}
