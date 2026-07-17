export default function DisclaimerBanner() {
  return (
    <div style={{ background: 'var(--bg-surface)', borderBottom: `1px solid var(--border)`, padding: '0.75rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
        NepaCompare is a comparison service, not an insurer or broker. Final premium is determined by the insurer.
      </p>
    </div>
  );
}
