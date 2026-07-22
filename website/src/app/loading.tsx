export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid rgba(37, 99, 235, 0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <h2 style={{ marginTop: '1.5rem', color: 'var(--text-color)', fontWeight: 500 }}>Loading NepaCompare...</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Fetching the best insurance rates for you.</p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
