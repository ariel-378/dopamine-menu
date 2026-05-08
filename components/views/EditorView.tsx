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
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        Edit the menu
      </h1>
      <div
        style={{
          fontFamily: 'var(--type)',
          fontSize: '10px',
          color: 'var(--brass)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        make it your own
      </div>

      <div
        style={{
          padding: '16px',
          border: '0.5px solid var(--rule)',
          borderRadius: '4px',
          marginBottom: '32px',
          background: 'var(--panel)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--type)',
            fontSize: '10px',
            color: 'var(--brass)',
            letterSpacing: '0.18em',
            marginBottom: '10px',
            textTransform: 'uppercase',
          }}
        >
          New item
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's the activity?"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '0.5px solid var(--rule)',
            padding: '8px 0',
            color: 'var(--cream)',
            fontFamily: 'var(--body)',
            fontSize: '15px',
            outline: 'none',
            marginBottom: '8px',
          }}
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="A short note (optional)"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '0.5px solid var(--rule)',
            padding: '8px 0',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--body)',
            fontStyle: 'italic',
            fontSize: '13px',
            outline: 'none',
            marginBottom: '12px',
          }}
        />

        <div style={{ marginBottom: '10px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '9px',
              color: 'var(--cream-soft)',
              letterSpacing: '0.15em',
              marginBottom: '6px',
              textTransform: 'uppercase',
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
                  onClick={() => setTier(key)}
                  style={{
                    padding: '4px 10px',
                    background: active ? 'var(--cream)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--cream-soft)',
                    border: active ? 'none' : '0.5px solid var(--rule)',
                    fontFamily: 'var(--type)',
                    fontSize: '10px',
                    letterSpacing: '0.05em',
                    borderRadius: '3px',
                    cursor: 'pointer',
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
              fontSize: '9px',
              color: 'var(--cream-soft)',
              letterSpacing: '0.15em',
              marginBottom: '6px',
              textTransform: 'uppercase',
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
                    onClick={() =>
                      setCats(active ? cats.filter((c) => c !== key) : [...cats, key])
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: active ? info.color : 'transparent',
                      color: active ? 'var(--ink)' : 'var(--cream-soft)',
                      border: active ? 'none' : '0.5px solid var(--rule)',
                      fontFamily: 'var(--type)',
                      fontSize: '10px',
                      letterSpacing: '0.05em',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={10} />
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
              fontSize: '9px',
              color: 'var(--cream-soft)',
              letterSpacing: '0.15em',
              marginBottom: '6px',
              textTransform: 'uppercase',
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
                  onClick={() => toggleMode(key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: active ? 'var(--cream)' : 'transparent',
                    color: active ? 'var(--ink)' : 'var(--cream-soft)',
                    border: active ? 'none' : '0.5px solid var(--rule)',
                    fontFamily: 'var(--type)',
                    fontSize: '10px',
                    letterSpacing: '0.05em',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={10} />
                  {info.label.toLowerCase()}
                </button>
              );
            })}
          </div>
          <div
            style={{
              fontFamily: 'var(--body)',
              fontStyle: 'italic',
              fontSize: '11px',
              color: 'var(--cream-soft)',
              marginTop: '6px',
              lineHeight: '1.4',
            }}
          >
            keep &quot;anytime&quot; on so it always shows in the main menu. add others to also show in those modes.
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!text.trim()}
          style={{
            width: '100%',
            padding: '10px',
            background: text.trim() ? 'var(--brass)' : 'transparent',
            color: text.trim() ? 'var(--ink)' : 'var(--cream-soft)',
            border: text.trim() ? 'none' : '0.5px solid var(--rule)',
            fontFamily: 'var(--type)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderRadius: '3px',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 500,
          }}
        >
          add to menu
        </button>
      </div>

      {(Object.entries(grouped) as [Tier, Item[]][]).map(([tierKey, tierItems]) => (
        <div key={tierKey} style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '10px',
              color: 'var(--brass)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '8px',
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
                padding: '10px 0',
                borderTop: '0.5px solid var(--rule)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--cream)', lineHeight: '1.3' }}>
                  {item.text}
                </div>
                {item.desc && (
                  <div
                    style={{
                      fontFamily: 'var(--body)',
                      fontStyle: 'italic',
                      fontSize: '12px',
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
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--cream-soft)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Delete item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ))}

      <div style={{ paddingTop: '16px', borderTop: '0.5px solid var(--rule)' }}>
        <button
          onClick={resetSeed}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--cream-soft)',
            fontFamily: 'var(--type)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          reset to default menu →
        </button>
      </div>
    </div>
  );
}
