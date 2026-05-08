import type { Item, LogEntry } from '@/lib/types';

interface Props {
  log: LogEntry[];
  items: Item[];
}

export function LogView({ log, items }: Props) {
  if (log.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontSize: '24px',
            color: 'var(--cream)',
            fontStyle: 'italic',
            marginBottom: '8px',
          }}
        >
          a fresh ledger
        </div>
        <div
          style={{
            fontFamily: 'var(--body)',
            fontSize: '14px',
            color: 'var(--cream-soft)',
            fontStyle: 'italic',
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
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        The Ledger
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
        what you did instead
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '14px', border: '0.5px solid var(--rule)', borderRadius: '4px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.18em', marginBottom: '4px' }}>
            ALL TIME
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--cream)' }}>
            {total}
          </div>
        </div>
        <div style={{ padding: '14px', border: '0.5px solid var(--rule)', borderRadius: '4px' }}>
          <div style={{ fontFamily: 'var(--type)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.18em', marginBottom: '4px' }}>
            LAST 7 DAYS
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--cream)' }}>
            {last7}
          </div>
        </div>
      </div>

      {Object.entries(byDate).map(([date, entries]) => (
        <div key={date} style={{ marginBottom: '24px' }}>
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
            {date}
          </div>
          {entries.map((e, i) => {
            const item = items.find((it) => it.id === e.itemId);
            const time = new Date(e.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '10px 0',
                  borderTop: '0.5px solid var(--rule)',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ fontFamily: 'var(--type)', fontSize: '10px', color: 'var(--cream-soft)', minWidth: '50px' }}>
                  {time}
                </div>
                <div style={{ fontFamily: 'var(--body)', fontSize: '14px', color: 'var(--cream)' }}>
                  {item?.text || e.text || '(deleted item)'}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
