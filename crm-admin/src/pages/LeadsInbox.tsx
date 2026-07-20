import { useState, useEffect } from 'react';

// For the MVP we will mock the type and data if the backend is not running
interface Lead {
  id: string;
  vertical: string;
  source: string;
  createdAt: string;
  status?: string;
  formData: { name: string; phone: string; age?: string; isUrgent?: boolean };
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

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    // Define headers
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Vertical', 'Status', 'Urgent'];
    
    // Map leads to CSV rows
    const rows = leads.map(lead => [
      lead.id,
      new Date(lead.createdAt).toISOString(),
      `"${lead.formData.name || ''}"`,
      `"${lead.formData.phone || ''}"`,
      lead.vertical,
      lead.status || 'NEW',
      lead.formData.isUrgent ? 'YES' : 'NO'
    ]);
    
    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Leads Inbox</h1>
        <button className="btn btn-primary" onClick={exportToCSV} disabled={leads.length === 0 || loading}>
          Export CSV
        </button>
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
                <tr key={lead.id} style={{ backgroundColor: lead.formData.isUrgent ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td>
                    {new Date(lead.createdAt).toLocaleDateString()}
                    {lead.formData.isUrgent && <div style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontWeight: 600, marginTop: '4px', animation: 'pulse 2s infinite' }}>🚨 URGENT DROP-OFF</div>}
                  </td>
                  <td style={{ fontWeight: 500 }}>{lead.formData.name || 'N/A'}</td>
                  <td>{lead.formData.phone || 'N/A'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.vertical}</td>
                  <td><span className={`badge ${lead.formData.isUrgent ? 'badge-lost' : 'badge-new'}`}>{lead.status || 'NEW'}</span></td>
                  <td>
                    <button 
                      className="btn" 
                      style={{ border: lead.formData.isUrgent ? '1px solid var(--accent-red)' : '1px solid var(--border-color)', background: 'transparent' }}
                      onClick={() => window.location.href = `/leads/${lead.id}`}
                    >
                      View / Route
                    </button>
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
