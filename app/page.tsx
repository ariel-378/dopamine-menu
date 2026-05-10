'use client';

import { useEffect, useState } from 'react';
import { BottomNav, type TabId } from '@/components/ui/BottomNav';
import { FocusedItem } from '@/components/ui/FocusedItem';
import { EditorView } from '@/components/views/EditorView';
import { LogView } from '@/components/views/LogView';
import { MenuView } from '@/components/views/MenuView';
import { SEED_ITEMS } from '@/lib/items';
import { get as storageGet, set as storageSet } from '@/lib/storage';
import type { Item, LogEntry, Mode, Tier } from '@/lib/types';
import { detectMode, makeId } from '@/lib/util';

const KEY_ITEMS = 'menu:items';
const KEY_LOG = 'menu:log';

function seedWithIds(): Item[] {
  return SEED_ITEMS.map((i) => ({ ...i, id: makeId() }));
}

export default function Page() {
  const [tab, setTab] = useState<TabId>('menu');
  const [items, setItems] = useState<Item[]>(seedWithIds);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [mode, setMode] = useState<Mode>('any');
  const [tier, setTier] = useState<Tier>('snack');
  const [focused, setFocused] = useState<Item | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editorPreset, setEditorPreset] = useState<{ tier: Tier | null; mode: Mode | null }>({
    tier: null,
    mode: null,
  });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = storageGet<Item[] | null>(KEY_ITEMS, null);
    if (stored && stored.length > 0) {
      setItems(stored);
    } else {
      const seeded = seedWithIds();
      setItems(seeded);
      storageSet(KEY_ITEMS, seeded);
    }
    setLog(storageGet<LogEntry[]>(KEY_LOG, []));
    setMode(detectMode());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persistItems = (next: Item[]) => {
    setItems(next);
    storageSet(KEY_ITEMS, next);
  };

  const addItem = (data: Omit<Item, 'id'>) => {
    persistItems([...items, { ...data, id: makeId() }]);
  };

  const deleteItem = (id: string) => {
    persistItems(items.filter((i) => i.id !== id));
  };

  const resetSeed = () => {
    if (window.confirm('Reset menu to defaults? Custom items will be removed.')) {
      persistItems(seedWithIds());
    }
  };

  const goToEdit = (presetTier: Tier | null, presetMode: Mode | null) => {
    setEditorPreset({ tier: presetTier, mode: presetMode });
    setTab('edit');
  };

  const onSurprise = (filtered: Item[]) => {
    if (filtered.length === 0) return;
    setFocused(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  const onPick = (item: Item) => setFocused(item);

  const markDone = (item: Item) => {
    const entry: LogEntry = { itemId: item.id, text: item.text, at: new Date().toISOString() };
    const nextLog = [...log, entry];
    setLog(nextLog);
    storageSet(KEY_LOG, nextLog);
    setFocused(null);
  };

  const skipFocused = () => {
    const filtered = items.filter(
      (i) => i.tier === tier && (i.modes || ['any']).includes(mode) && i.id !== focused?.id
    );
    if (filtered.length === 0) {
      setFocused(null);
      return;
    }
    setFocused(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--cream)', position: 'relative' }}>
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '28px 24px 0',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: '28px', textAlign: 'center', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--type)',
              fontSize: '9px',
              color: 'var(--brass)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            est. today
          </div>
          <h1
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(36px, 9vw, 48px)',
              color: 'var(--cream)',
              margin: 0,
              lineHeight: '1',
              letterSpacing: '0.02em',
              fontWeight: 400,
            }}
          >
            Dopamine Menu
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px',
              color: 'var(--rule-strong)',
            }}
          >
            <div style={{ width: '50px', height: '0.5px', background: 'var(--rule-strong)' }} />
            <div
              style={{
                fontFamily: 'var(--display)',
                fontSize: '11px',
                color: 'var(--brass)',
                fontStyle: 'italic',
              }}
            >
              put the phone down
            </div>
            <div style={{ width: '50px', height: '0.5px', background: 'var(--rule-strong)' }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {loaded ? (
            <div className="page-enter" key={tab}>
              {tab === 'menu' && (
                <MenuView
                  items={items}
                  mode={mode}
                  setMode={setMode}
                  tier={tier}
                  setTier={setTier}
                  onPick={onPick}
                  onSurprise={onSurprise}
                  goToEdit={goToEdit}
                />
              )}
              {tab === 'log' && <LogView log={log} items={items} />}
              {tab === 'edit' && (
                <EditorView
                  items={items}
                  addItem={addItem}
                  deleteItem={deleteItem}
                  resetSeed={resetSeed}
                  initialTier={editorPreset.tier}
                  initialMode={editorPreset.mode}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                padding: '40px 0',
                textAlign: 'center',
                color: 'var(--cream-soft)',
                fontFamily: 'var(--type)',
                fontSize: '11px',
                letterSpacing: '0.15em',
              }}
            >
              setting the table...
            </div>
          )}
        </div>

        <BottomNav tab={tab} setTab={setTab} />
      </div>

      {focused && (
        <FocusedItem
          item={focused}
          onDone={markDone}
          onSkip={skipFocused}
          onClose={() => setFocused(null)}
        />
      )}
    </div>
  );
}
