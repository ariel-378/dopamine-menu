import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const PETALS = [0, 72, 144, 216, 288];

export default function AppleIcon() {
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
            width: 156,
            height: 156,
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
                marginLeft: -20,
                marginTop: -31,
                width: 40,
                height: 62,
                background: '#C26577',
                borderRadius: '50%',
                transform: `rotate(${angle}deg) translateY(-40px)`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -20,
              marginTop: -20,
              width: 40,
              height: 40,
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
