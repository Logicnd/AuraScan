import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'radial-gradient(circle at 20% 10%, rgba(89, 240, 211, 0.25), transparent 55%), radial-gradient(circle at 90% 0%, rgba(125, 211, 252, 0.2), transparent 45%), linear-gradient(180deg, #0b0f17 0%, #05060a 100%)',
          color: '#e2e8f0',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#59f0d3',
          }}
        >
          AuraScan
        </div>
        <div style={{ fontSize: 32, marginTop: 24, maxWidth: 800 }}>
          Trace the quiet anomalies. Decode the silent signal layers.
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            opacity: 0.7,
          }}
        >
          aurascan.lol // signal interface
        </div>
      </div>
    ),
    size
  );
}
