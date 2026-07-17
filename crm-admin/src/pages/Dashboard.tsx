export default function Dashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 600 }}>Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Leads</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>142</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Pending Routing</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--status-pending)' }}>12</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Revenue (YTD)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--status-new)' }}>NPR 45,000</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
        <p style={{ color: 'var(--text-muted)' }}>No recent activity to show.</p>
      </div>
    </div>
  );
}
