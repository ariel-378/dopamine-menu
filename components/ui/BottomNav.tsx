'use client';

export type TabId = 'menu' | 'log' | 'edit';

interface Props {
  tab: TabId;
  setTab: (id: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'menu', label: 'Menu' },
  { id: 'log',  label: 'Ledger' },
  { id: 'edit', label: 'Edit' },
];

export function BottomNav({ tab, setTab }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        marginTop: '40px',
        background: 'var(--ink)',
        borderTop: '0.5px solid var(--rule)',
        display: 'flex',
        padding: '4px',
      }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--type)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: active ? 'var(--brass)' : 'var(--cream-soft)',
              cursor: 'pointer',
              fontWeight: active ? 500 : 400,
            }}
          >
            {t.label.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}
