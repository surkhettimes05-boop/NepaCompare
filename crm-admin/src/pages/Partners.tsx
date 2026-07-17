export default function Partners() {
  const mockPartners = [
    { id: 1, name: 'Nepal Life Insurance', type: 'Insurer', apiStatus: 'Active', cpl: 'NPR 500' },
    { id: 2, name: 'Shikhar Insurance', type: 'Insurer', apiStatus: 'Inactive', cpl: 'NPR 450' },
    { id: 3, name: 'Global Brokers Nepal', type: 'Broker', apiStatus: 'Active', cpl: 'NPR 600' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Partner Management</h1>
        <button className="btn btn-primary">+ Add Partner</button>
      </div>
      
      <div className="card table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Type</th>
              <th>CPL Rate</th>
              <th>API Integration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPartners.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.cpl}</td>
                <td>
                  <span className={`badge ${p.apiStatus === 'Active' ? 'badge-new' : 'badge-closed'}`}>
                    {p.apiStatus}
                  </span>
                </td>
                <td>
                  <button className="btn" style={{ border: '1px solid var(--border-color)', background: 'transparent', marginRight: '0.5rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
