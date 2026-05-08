/* Placeholder grid shown while Pinterest's pinit.js is loading
   the embed iframe. Six tiles in two columns, with shimmer. */

const TILE_HEIGHTS = [120, 88, 96, 130, 110, 76];

export function InspoSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        padding: '8px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
      }}
      aria-label="Loading Pinterest embed"
    >
      {TILE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="inspo-shimmer"
          style={{
            height: `${h}px`,
            borderRadius: '6px',
            border: '0.5px solid var(--rule)',
          }}
        />
      ))}
    </div>
  );
}
