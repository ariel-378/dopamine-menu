'use client';

import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { CATEGORIES, MODES, TIERS } from '@/lib/taxonomy';
import type { CategoryKey, Item, Mode, Tier } from '@/lib/types';

interface Props {
  items: Item[];
  addItem: (data: Omit<Item, 'id'>) => void;
  deleteItem: (id: string) => void;
  resetSeed: () => void;
  initialTier?: Tier | null;
  initialMode?: Mode | null;
}

export function EditorView({
  items,
  addItem,
  deleteItem,
  resetSeed,
  initialTier,
  initialMode,
}: Props) {
  const [text, setText] = useState('');
  const [desc, setDesc] = useState('');
  const [tier, setTier] = useState<Tier>(initialTier || 'snack');
  const [cats, setCats] = useState<CategoryKey[]>([]);
  const [modes, setModes] = useState<Mode[]>(
    initialMode && initialMode !== 'any' ? ['any', initialMode] : ['any']
  );

  const submit = () => {
    if (!text.trim()) return;
    addItem({
      text: text.trim(),
      desc: desc.trim(),
      tier,
      cats,
      modes: modes.length > 0 ? modes : ['any'],
      custom: true,
    });
    setText('');
    setDesc('');
    setCats([]);
    setModes(['any']);
  };

  const toggleMode = (m: Mode) => {
    setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const grouped = useMemo(() => {
    const g: Record<Tier, Item[]> = { snack: [], small: [], medium: [], feast: [] };
    items.forEach((i) => {
      if (g[i.tier]) g[i.tier].push(i);
    });
    return g;
  }, [items]);

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
        Edit the menu
      </h1>
      <div
        style={{
          fontFamily: 'var(--type)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--brass)',
          marginBottom: '22px',
        }}
      >
        make it your own ♥
      </div>

      <div className="cozy-card" style={{ padding: '18px', marginBottom: '32px' }}>
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--brass)',
            marginBottom: '12px',
          }}
        >
          ✦ new item
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's the activity?"
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
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="A short note (optional)"
          style={{
            width: '100%',
            background: 'var(--ink)',
            border: '2px solid var(--line)',
            borderRadius: '14px',
            padding: '10px 14px',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--body)',
            fontWeight: 500,
            fontSize: '13px',
            outline: 'none',
            marginBottom: '14px',
          }}
        />

        <div style={{ marginBottom: '10px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--cream)',
              marginBottom: '7px',
            }}
          >
            Section
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(Object.entries(TIERS) as [Tier, (typeof TIERS)[Tier]][]).map(([key, info]) => {
              const active = tier === key;
              return (
                <button
                  key={key}
                  className="pill"
                  onClick={() => setTier(key)}
                  style={{
                    padding: '6px 13px',
                    background: active ? 'var(--brass)' : 'var(--ink)',
                    color: active ? '#fff' : 'var(--cream-soft)',
                    borderColor: active ? 'var(--brass)' : 'var(--rule-strong)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {info.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--cream)',
              marginBottom: '7px',
            }}
          >
            Tags
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(Object.entries(CATEGORIES) as [CategoryKey, (typeof CATEGORIES)[CategoryKey]][]).map(
              ([key, info]) => {
                const active = cats.includes(key);
                const { Icon } = info;
                return (
                  <button
                    key={key}
                    className="pill"
                    onClick={() =>
                      setCats(active ? cats.filter((c) => c !== key) : [...cats, key])
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 11px',
                      background: active ? info.color : 'var(--ink)',
                      color: active ? '#fff' : 'var(--cream-soft)',
                      borderColor: active ? info.color : 'var(--rule-strong)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    <Icon size={12} strokeWidth={2.6} />
                    {info.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--cream)',
              marginBottom: '7px',
            }}
          >
            When to suggest
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(Object.entries(MODES) as [Mode, (typeof MODES)[Mode]][]).map(([key, info]) => {
              const active = modes.includes(key);
              const { Icon } = info;
              return (
                <button
                  key={key}
                  className="pill"
                  onClick={() => toggleMode(key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 11px',
                    background: active ? 'var(--lavender)' : 'var(--ink)',
                    color: active ? '#fff' : 'var(--cream-soft)',
                    borderColor: active ? 'var(--lavender)' : 'var(--rule-strong)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={12} strokeWidth={2.6} />
                  {info.label.toLowerCase()}
                </button>
              );
            })}
          </div>
          <div
            style={{
              fontFamily: 'var(--body)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--cream-soft)',
              marginTop: '8px',
              lineHeight: '1.45',
            }}
          >
            keep &quot;anytime&quot; on so it always shows in the main menu. add others to also show in those modes.
          </div>
        </div>

        <button
          className="game-btn"
          onClick={submit}
          disabled={!text.trim()}
          style={{
            width: '100%',
            padding: '14px',
            background: text.trim() ? 'var(--brass)' : 'var(--ink-deep)',
            color: text.trim() ? '#fff' : 'var(--cream-soft)',
            ['--btn-lip' as string]: text.trim() ? 'var(--brass-deep)' : 'var(--lip)',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          add to menu ♥
        </button>
      </div>

      {(Object.entries(grouped) as [Tier, Item[]][]).map(([tierKey, tierItems]) => (
        <div key={tierKey} style={{ marginBottom: '24px' }}>
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
              marginBottom: '10px',
            }}
          >
            {TIERS[tierKey].label} · {tierItems.length}
          </div>
          {tierItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '11px 14px',
                marginBottom: '8px',
                background: 'var(--panel)',
                border: '2px solid var(--line)',
                borderRadius: '14px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 600, color: 'var(--cream)', lineHeight: '1.3' }}>
                  {item.text}
                </div>
                {item.desc && (
                  <div
                    style={{
                      fontFamily: 'var(--body)',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--cream-soft)',
                      marginTop: '2px',
                    }}
                  >
                    {item.desc}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: 'var(--ink-deep)',
                  border: 'none',
                  borderRadius: '999px',
                  color: 'var(--brass-deep)',
                  cursor: 'pointer',
                  padding: '7px',
                  display: 'flex',
                  flexShrink: 0,
                }}
                aria-label="Delete item"
              >
                <Trash2 size={14} strokeWidth={2.6} />
              </button>
            </div>
          ))}
        </div>
      ))}

      <div style={{ paddingTop: '8px', textAlign: 'center' }}>
        <button
          className="pill"
          onClick={resetSeed}
          style={{
            background: 'var(--panel)',
            color: 'var(--cream-soft)',
            borderColor: 'var(--rule-strong)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 16px',
          }}
        >
          ↺ reset to default menu
        </button>
      </div>
    </div>
  );
}
