import { pointsForTier } from '@/lib/taxonomy';
import type { Item, LogEntry } from '@/lib/types';

interface Props {
  log: LogEntry[];
  items: Item[];
}

export function LogView({ log, items }: Props) {
  if (log.length === 0) {
    return (
      <div className="cozy-card" style={{ padding: '48px 28px', textAlign: 'center' }}>
        <div className="float" style={{ fontSize: '44px', marginBottom: '10px' }}>🌱</div>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--cream)',
            marginBottom: '8px',
          }}
        >
          a fresh start!
        </div>
        <div
          style={{
            fontFamily: 'var(--body)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--cream-soft)',
          }}
        >
          things you do off your phone show up here
        </div>
      </div>
    );
  }

  const byDate: Record<string, LogEntry[]> = {};
  log.slice().reverse().forEach((entry) => {
    const d = new Date(entry.at);
    const key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(entry);
  });

  const total = log.length;
  // "Last 7 days" relative to current render — re-computing on each visit is correct.
  // eslint-disable-next-line react-hooks/purity
  const last7 = log.filter((e) => Date.now() - new Date(e.at).getTime() < 7 * 86400000).length;

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
        Your Wins
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
        every little thing counts ♥
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div className="cozy-card" style={{ padding: '16px 14px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '10px', fontWeight: 700, color: 'var(--brass)', letterSpacing: '0.06em', marginBottom: '4px' }}>
            ⭐ ALL TIME
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '34px', fontWeight: 700, color: 'var(--cream)', lineHeight: 1 }}>
            {total}
          </div>
        </div>
        <div className="cozy-card" style={{ padding: '16px 14px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '10px', fontWeight: 700, color: 'var(--mint)', letterSpacing: '0.06em', marginBottom: '4px' }}>
            🔥 LAST 7 DAYS
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '34px', fontWeight: 700, color: 'var(--cream)', lineHeight: 1 }}>
            {last7}
          </div>
        </div>
      </div>

      {Object.entries(byDate).map(([date, entries]) => (
        <div key={date} style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--type)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--brass-deep)',
              background: 'var(--ink-deep)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '10px',
            }}
          >
            {date}
          </div>
          {entries.map((e, i) => {
            const item = items.find((it) => it.id === e.itemId);
            const time = new Date(e.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const hearts = typeof e.points === 'number' ? e.points : item ? pointsForTier(item.tier) : 0;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '11px 14px',
                  marginBottom: '8px',
                  background: 'var(--panel)',
                  border: '2px solid var(--line)',
                  borderRadius: '14px',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--mint)', fontSize: '14px', flexShrink: 0 }}>✓</span>
                <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--body)', fontSize: '14px', fontWeight: 600, color: 'var(--cream)' }}>
                  {item?.text || e.text || '(deleted item)'}
                </div>
                {hearts > 0 && (
                  <span
                    style={{
                      flexShrink: 0,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'var(--ink-deep)',
                      fontFamily: 'var(--type)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--brass-deep)',
                    }}
                  >
                    +{hearts} ♥
                  </span>
                )}
                <div style={{ fontFamily: 'var(--type)', fontSize: '11px', fontWeight: 600, color: 'var(--cream-soft)', flexShrink: 0, minWidth: '46px', textAlign: 'right' }}>
                  {time}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
