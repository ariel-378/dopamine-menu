import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

const PETALS = [0, 72, 144, 216, 288];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FDF6E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {PETALS.map((angle) => (
            <div
              key={angle}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: -7,
                marginTop: -11,
                width: 14,
                height: 22,
                background: '#C26577',
                borderRadius: '50%',
                transform: `rotate(${angle}deg) translateY(-14px)`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -7,
              marginTop: -7,
              width: 14,
              height: 14,
              background: '#E8B228',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
