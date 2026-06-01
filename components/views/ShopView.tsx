'use client';

import { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import type { Prize, Redemption } from '@/lib/types';

interface Props {
  prizes: Prize[];
  redemptions: Redemption[];
  balance: number;
  redeemPrize: (prize: Prize) => void;
  addPrize: (data: Omit<Prize, 'id'>) => void;
  deletePrize: (id: string) => void;
}

const EMOJI = ['🎁', '🍿', '☕', '🍕', '🎬', '😴', '📚', '🛍️', '🍫', '🎮', '🛁', '🌸'];

export function ShopView({
  prizes,
  redemptions,
  balance,
  redeemPrize,
  addPrize,
  deletePrize,
}: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [emoji, setEmoji] = useState('🎁');

  const submit = () => {
    const c = parseInt(cost, 10);
    if (!name.trim() || !Number.isFinite(c) || c <= 0) return;
    addPrize({ name: name.trim(), cost: c, emoji, custom: true });
    setName('');
    setCost('');
    setEmoji('🎁');
    setShowAdd(false);
  };

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--display)',
          fontSize: '36px',
          color: 'var(--cream)',
          margin: '0 0 4px',
          fontWeight: 700,
        }}
      >
        Prize Shop
      </h1>
      <div
        style={{
          fontFamily: 'var(--type)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--brass)',
          marginBottom: '18px',
        }}
      >
        spend your hearts on a treat ♥
      </div>

      {/* Balance counter */}
      <div
        className="cozy-card"
        style={{
          padding: '18px',
          marginBottom: '24px',
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fff 0%, var(--ink-deep) 100%)',
        }}
      >
        <div style={{ fontFamily: 'var(--type)', fontSize: '11px', fontWeight: 700, color: 'var(--cream-soft)', letterSpacing: '0.04em' }}>
          YOUR HEARTS
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          <Heart className="heartbeat" size={28} fill="var(--brass)" color="var(--brass)" strokeWidth={2.4} />
          <span style={{ fontFamily: 'var(--display)', fontSize: '46px', fontWeight: 700, color: 'var(--cream)', lineHeight: 1 }}>
            {balance}
          </span>
        </div>
      </div>

      {/* Prize grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {prizes.map((p) => {
          const affordable = balance >= p.cost;
          return (
            <div
              key={p.id}
              className="cozy-card"
              style={{
                padding: '16px 14px',
                textAlign: 'center',
                position: 'relative',
                opacity: affordable ? 1 : 0.7,
              }}
            >
              {p.custom && (
                <button
                  onClick={() => deletePrize(p.id)}
                  aria-label="Delete prize"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--ink-deep)',
                    border: 'none',
                    borderRadius: '999px',
                    color: 'var(--brass-deep)',
                    cursor: 'pointer',
                    padding: '5px',
                    display: 'flex',
                  }}
                >
                  <Trash2 size={12} strokeWidth={2.6} />
                </button>
              )}
              <div className={affordable ? 'float' : undefined} style={{ fontSize: '40px', lineHeight: 1, marginBottom: '8px' }}>
                {p.emoji}
              </div>
              <div
                style={{
                  fontFamily: 'var(--body)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--cream)',
                  lineHeight: '1.3',
                  minHeight: '34px',
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  margin: '8px 0 12px',
                  fontFamily: 'var(--display)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--brass-deep)',
                }}
              >
                <Heart size={13} fill="var(--brass)" color="var(--brass)" strokeWidth={2.4} />
                {p.cost}
              </div>
              <button
                className="game-btn"
                onClick={() => redeemPrize(p)}
                disabled={!affordable}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: affordable ? 'var(--brass)' : 'var(--ink-deep)',
                  color: affordable ? '#fff' : 'var(--cream-soft)',
                  ['--btn-lip' as string]: affordable ? 'var(--brass-deep)' : 'var(--lip)',
                }}
              >
                {affordable ? 'redeem!' : `need ${p.cost - balance} more`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add custom prize */}
      {showAdd ? (
        <div className="cozy-card" style={{ padding: '18px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '13px', fontWeight: 700, color: 'var(--brass)', marginBottom: '12px' }}>
            ✦ new prize
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {EMOJI.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: '38px',
                  height: '38px',
                  fontSize: '20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: emoji === e ? 'var(--ink-deep)' : 'var(--ink)',
                  border: `2px solid ${emoji === e ? 'var(--brass)' : 'var(--rule-strong)'}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's the treat?"
            style={{
              width: '100%',
              background: 'var(--ink)',
              border: '2px solid var(--line)',
              borderRadius: '14px',
              padding: '11px 14px',
              color: 'var(--cream)',
              fontFamily: 'var(--body)',
              fontSize: '15px',
              fontWeight: 600,
              outline: 'none',
              marginBottom: '9px',
            }}
          />
          <input
            value={cost}
            onChange={(e) => setCost(e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            placeholder="Cost in hearts (e.g. 50)"
            style={{
              width: '100%',
              background: 'var(--ink)',
              border: '2px solid var(--line)',
              borderRadius: '14px',
              padding: '11px 14px',
              color: 'var(--cream)',
              fontFamily: 'var(--body)',
              fontSize: '15px',
              fontWeight: 600,
              outline: 'none',
              marginBottom: '14px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="game-btn"
              onClick={submit}
              disabled={!name.trim() || !cost}
              style={{
                flex: 1,
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                background: name.trim() && cost ? 'var(--brass)' : 'var(--ink-deep)',
                color: name.trim() && cost ? '#fff' : 'var(--cream-soft)',
                ['--btn-lip' as string]: name.trim() && cost ? 'var(--brass-deep)' : 'var(--lip)',
              }}
            >
              add prize ♥
            </button>
            <button
              className="pill"
              onClick={() => setShowAdd(false)}
              style={{ padding: '13px 18px', background: 'var(--panel)', color: 'var(--cream-soft)', borderColor: 'var(--rule-strong)', fontSize: '13px', fontWeight: 600 }}
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="game-btn"
          onClick={() => setShowAdd(true)}
          style={{
            width: '100%',
            padding: '13px',
            marginBottom: '24px',
            background: 'var(--panel)',
            color: 'var(--brass)',
            ['--btn-lip' as string]: 'var(--lip)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Plus size={15} strokeWidth={2.6} />
          add your own prize
        </button>
      )}

      {/* Redemption history */}
      {redemptions.length > 0 && (
        <div>
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--type)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brass-deep)',
              background: 'var(--ink-deep)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '12px',
            }}
          >
            🎉 treats claimed
          </div>
          {redemptions
            .slice()
            .reverse()
            .map((r, i) => {
              const when = new Date(r.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '11px',
                    padding: '11px 14px',
                    marginBottom: '8px',
                    background: 'var(--panel)',
                    border: '2px solid var(--line)',
                    borderRadius: '14px',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{r.emoji}</span>
                  <div style={{ flex: 1, fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 600, color: 'var(--cream)' }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: 'var(--type)', fontSize: '12px', fontWeight: 700, color: 'var(--brass-deep)', flexShrink: 0 }}>
                    −{r.cost} ♥
                  </div>
                  <div style={{ fontFamily: 'var(--type)', fontSize: '11px', fontWeight: 600, color: 'var(--cream-soft)', flexShrink: 0, minWidth: '42px', textAlign: 'right' }}>
                    {when}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
