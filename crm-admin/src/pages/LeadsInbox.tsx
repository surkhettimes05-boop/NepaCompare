import { useState, useEffect } from 'react';

// For the MVP we will mock the type and data if the backend is not running
interface Lead {
  id: string;
  vertical: string;
  source: string;
  createdAt: string;
  formData: { name: string; phone: string; age?: string };
}

export default function LeadsInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/leads`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setLeads(data);
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Leads Inbox</h1>
        <button className="btn btn-primary">Export CSV</button>
      </div>
      
      <div className="card table-container">
        {loading ? (
          <p>Loading leads...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Vertical</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 500 }}>{lead.formData.name}</td>
                  <td>{lead.formData.phone}</td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.vertical}</td>
                  <td><span className="badge badge-new">New</span></td>
                  <td>
                    <button className="btn" style={{ border: '1px solid var(--border-color)', background: 'transparent' }}>View / Route</button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
