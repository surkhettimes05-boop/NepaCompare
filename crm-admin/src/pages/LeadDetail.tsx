import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  vertical: string;
  source: string;
  status: string;
  createdAt: string;
  formData: any;
  user?: {
    name: string;
    phone: string;
  }
}

const STATUS_OPTIONS = [
  'NEW',
  'QUALIFIED',
  'DISQUALIFIED',
  'SENT_TO_PARTNER',
  'CONVERTED',
  'LOST',
  'NO_RESPONSE',
  'INVOICED',
  'PAID'
];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/leads/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch lead');
        const data = await response.json();
        setLead(data);
        setCurrentStatus(data.status);
        if (data.partnerId) {
          setSelectedPartner(data.partnerId);
        }

        // Fetch partners
        const partnersRes = await fetch(`${apiUrl}/partners`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (partnersRes.ok) {
          const partnersData = await partnersRes.json();
          setPartners(partnersData);
        }
      } catch (err) {
        console.error('Failed to fetch lead details', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchLead();
    }
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      // Successfully updated
    } catch (err) {
      console.error('Failed to save status', err);
      // Revert status on failure
      if (lead) setCurrentStatus(lead.status);
    } finally {
      setSaving(false);
    }
  };

  const handleRoute = async () => {
    if (!selectedPartner) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/leads/${id}/route`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ partnerId: selectedPartner })
      });
      
      if (!response.ok) throw new Error('Failed to route lead');
      const updatedLead = await response.json();
      
      // Re-fetch the full lead to get the updated statusHistory
      const fullLeadRes = await fetch(`${apiUrl}/leads/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (fullLeadRes.ok) {
        const fullLeadData = await fullLeadRes.json();
        setLead(fullLeadData);
        setCurrentStatus(fullLeadData.status);
      }
    } catch (err) {
      console.error('Failed to route lead', err);
      alert('Failed to assign partner.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading lead details...</div>;
  }

  if (!lead) {
    return <div style={{ padding: '2rem' }}>Lead not found.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate('/leads')} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            fontSize: '1.25rem', 
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          &larr; Back
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Lead Details</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {lead.formData.isUrgent && (
            <div className="card" style={{ border: '2px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <h2 style={{ color: 'var(--accent-red)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                🚨 Financial Doctor Action Required
              </h2>
              <p style={{ fontWeight: 500 }}>This user abandoned the comparison page without finalizing a quote.</p>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>Please call them immediately to assist and save the sale.</p>
            </div>
          )}

          {/* Customer Info Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Customer Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Name:</span>
            <span style={{ fontWeight: 500 }}>{lead.formData.name || lead.user?.name || 'N/A'}</span>
            
            <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
            <span>{lead.formData.phone || lead.user?.phone || 'N/A'}</span>
            
            {lead.formData.age && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>Age:</span>
                <span>{lead.formData.age}</span>
              </>
            )}
            
            <span style={{ color: 'var(--text-muted)' }}>Source:</span>
            <span style={{ textTransform: 'capitalize' }}>{lead.source}</span>
          </div>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Raw Form Data</h3>
          <pre style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            overflowX: 'auto'
          }}>
            {JSON.stringify(lead.formData, null, 2)}
          </pre>
        </div>

        {/* Processing Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Processing & Routing</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Vertical</label>
              <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px', textTransform: 'capitalize', fontWeight: 500 }}>
                {lead.vertical} Insurance
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Current Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select 
                  className="input-field" 
                  value={currentStatus} 
                  onChange={handleStatusChange}
                  disabled={saving}
                  style={{ width: '100%', maxWidth: '300px' }}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                {saving && <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Saving...</span>}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Assign Partner</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select 
                  className="input-field" 
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  disabled={saving} 
                  style={{ width: '100%', maxWidth: '300px' }}
                >
                  <option value="">-- Select Partner --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleRoute} 
                  disabled={saving || !selectedPartner || selectedPartner === lead.partnerId}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Route
                </button>
              </div>
              {lead.partnerId && (
                <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: 500 }}>
                  Currently routed to: {lead.partner?.name || 'Unknown Partner'}
                </p>
              )}
            </div>

            {lead.statusHistory && lead.statusHistory.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Routing History</h3>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                  {lead.statusHistory.map((history: any) => (
                    <div key={history.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{new Date(history.changedAt).toLocaleString()}</span>
                      <br/>
                      <strong>{history.changedBy?.name || 'System'}</strong> changed status from <em>{history.oldStatus}</em> to <em>{history.newStatus}</em>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Created: {new Date(lead.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
