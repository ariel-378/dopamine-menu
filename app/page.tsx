'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { BottomNav, type TabId } from '@/components/ui/BottomNav';
import { FocusedItem } from '@/components/ui/FocusedItem';
import { EditorView } from '@/components/views/EditorView';
import { LogView } from '@/components/views/LogView';
import { MenuView } from '@/components/views/MenuView';
import { ShopView } from '@/components/views/ShopView';
import { SEED_ITEMS } from '@/lib/items';
import { SEED_PRIZES } from '@/lib/prizes';
import { get as storageGet, set as storageSet } from '@/lib/storage';
import { pointsForTier } from '@/lib/taxonomy';
import type { Item, LogEntry, Prize, Redemption, Mode, Tier } from '@/lib/types';
import { detectMode, makeId } from '@/lib/util';

const KEY_ITEMS = 'menu:items';
const KEY_LOG = 'menu:log';
const KEY_PRIZES = 'menu:prizes';
const KEY_REDEMPTIONS = 'menu:redemptions';

function seedWithIds(): Item[] {
  return SEED_ITEMS.map((i) => ({ ...i, id: makeId() }));
}

function seedPrizesWithIds(): Prize[] {
  return SEED_PRIZES.map((p) => ({ ...p, id: makeId() }));
}

export default function Page() {
  const [tab, setTab] = useState<TabId>('menu');
  const [items, setItems] = useState<Item[]>(seedWithIds);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [mode, setMode] = useState<Mode>('any');
  const [tier, setTier] = useState<Tier>('snack');
  const [focused, setFocused] = useState<Item | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>(seedPrizesWithIds);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [reward, setReward] = useState<number | null>(null);
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
    const storedPrizes = storageGet<Prize[] | null>(KEY_PRIZES, null);
    if (storedPrizes && storedPrizes.length > 0) {
      setPrizes(storedPrizes);
    } else {
      const seededPrizes = seedPrizesWithIds();
      setPrizes(seededPrizes);
      storageSet(KEY_PRIZES, seededPrizes);
    }
    setLog(storageGet<LogEntry[]>(KEY_LOG, []));
    setRedemptions(storageGet<Redemption[]>(KEY_REDEMPTIONS, []));
    setMode(detectMode());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const pointsEarned = log.reduce((sum, e) => {
    if (typeof e.points === 'number') return sum + e.points;
    const it = items.find((i) => i.id === e.itemId);
    return sum + (it ? pointsForTier(it.tier) : 0);
  }, 0);
  const pointsSpent = redemptions.reduce((sum, r) => sum + r.cost, 0);
  const balance = pointsEarned - pointsSpent;

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
    const earned = pointsForTier(item.tier);
    const entry: LogEntry = {
      itemId: item.id,
      text: item.text,
      at: new Date().toISOString(),
      points: earned,
    };
    const nextLog = [...log, entry];
    setLog(nextLog);
    storageSet(KEY_LOG, nextLog);
    setFocused(null);
    setReward(earned);
    window.setTimeout(() => setReward(null), 1800);
  };

  const persistPrizes = (next: Prize[]) => {
    setPrizes(next);
    storageSet(KEY_PRIZES, next);
  };

  const addPrize = (data: Omit<Prize, 'id'>) => {
    persistPrizes([...prizes, { ...data, id: makeId() }]);
  };

  const deletePrize = (id: string) => {
    persistPrizes(prizes.filter((p) => p.id !== id));
  };

  const redeemPrize = (prize: Prize) => {
    if (balance < prize.cost) return;
    const redemption: Redemption = {
      prizeId: prize.id,
      name: prize.name,
      emoji: prize.emoji,
      cost: prize.cost,
      at: new Date().toISOString(),
    };
    const next = [...redemptions, redemption];
    setRedemptions(next);
    storageSet(KEY_REDEMPTIONS, next);
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
          <button
            onClick={() => setTab('shop')}
            aria-label="Open prize shop"
            style={{
              position: 'absolute',
              top: '2px',
              right: '0',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 12px',
              background: 'var(--panel)',
              border: '2.5px solid var(--line)',
              borderRadius: '999px',
              boxShadow: '0 3px 0 var(--lip)',
              cursor: 'pointer',
              fontFamily: 'var(--display)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--cream)',
            }}
          >
            <Heart
              className={reward !== null ? 'heartbeat' : undefined}
              size={16}
              fill="var(--brass)"
              color="var(--brass)"
              strokeWidth={2.4}
            />
            {balance}
          </button>
          <div
            className="float"
            style={{
              display: 'inline-block',
              position: 'relative',
              background: 'var(--panel)',
              border: '2.5px solid var(--line)',
              borderRadius: '22px',
              boxShadow: '0 5px 0 var(--lip)',
              padding: '14px 24px 16px',
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(30px, 8vw, 42px)',
                color: 'var(--brass)',
                margin: 0,
                lineHeight: '1',
                letterSpacing: '-0.01em',
                fontWeight: 700,
              }}
            >
              Dopamine Menu
            </h1>
            <div
              style={{
                marginTop: '7px',
                fontFamily: 'var(--type)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--cream-soft)',
              }}
            >
              <span className="heartbeat" style={{ color: 'var(--brass)' }}>♥</span>{' '}
              put the phone down{' '}
              <span className="heartbeat" style={{ color: 'var(--brass)' }}>♥</span>
            </div>
            {/* speech-bubble tail, echoing the favicon */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-13px',
                width: '20px',
                height: '20px',
                background: 'var(--panel)',
                borderRight: '2.5px solid var(--line)',
                borderBottom: '2.5px solid var(--line)',
                transform: 'translateX(-50%) rotate(45deg)',
              }}
            />
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
              {tab === 'shop' && (
                <ShopView
                  prizes={prizes}
                  redemptions={redemptions}
                  balance={balance}
                  redeemPrize={redeemPrize}
                  addPrize={addPrize}
                  deletePrize={deletePrize}
                />
              )}
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
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <span className="float" style={{ display: 'inline-block', fontSize: '32px' }}>🍓</span>
              <div style={{ marginTop: '8px' }}>setting the table…</div>
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

      {reward !== null && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '92px',
            transform: 'translateX(-50%)',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          <div
            className="pop-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'var(--brass)',
              color: '#fff',
              border: '2.5px solid var(--line)',
              borderRadius: '999px',
              boxShadow: '0 4px 0 var(--brass-deep)',
              fontFamily: 'var(--display)',
              fontSize: '18px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <Heart className="heartbeat" size={18} fill="#fff" color="#fff" strokeWidth={2.4} />
            +{reward} hearts!
          </div>
        </div>
      )}
    </div>
  );
}
