import { ImageResponse } from 'next/og';

export const alt = 'Khaacho — independent insurance comparison for Nepal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px', color: '#eff6ff', background: 'linear-gradient(135deg, #071b33 0%, #0d3850 58%, #0c6b67 100%)', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}><span>Khaacho</span><span style={{ color: '#5eead4', marginLeft: 14 }}>Nepal</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 930 }}><div style={{ color: '#99f6e4', fontSize: 24, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>Independent insurance information</div><div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 750, letterSpacing: '-0.045em' }}>Compare cover with more clarity.</div></div>
      <div style={{ display: 'flex', fontSize: 25, color: '#bfdbfe' }}>Motor · Health · Life · Travel</div>
    </div>,
    size,
  );
}
