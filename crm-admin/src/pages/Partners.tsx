import { useEffect, useState } from 'react';
import { apiUrl } from '../lib/api';

type Partner = { id: string; name: string; type: string; integrationType?: string; agreedCpl?: number | null; active: boolean };
type PartnerForm = { name: string; type: string; agreedCpl: string; integrationType: string };
const emptyForm: PartnerForm = { name: '', type: 'INSURER', agreedCpl: '', integrationType: 'MOCK_STANDARD' };

export default function Partners() {
  const [showForm, setShowForm] = useState(false);

    const [partners, setPartners] = useState<Partner[]>([]);
    const [form, setForm] = useState<PartnerForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const loadPartners = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/partners`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; return; }
      if (!response.ok) throw new Error('Unable to load partners');
      setPartners(await response.json());
    };

    useEffect(() => { loadPartners().catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load partners')).finally(() => setLoading(false)); }, []);

    const openForm = (partner?: Partner) => {
      setNotice(''); setError('');
      setEditingId(partner?.id || null);
      setShowForm(true);
      setForm(partner ? { name: partner.name, type: partner.type, agreedCpl: partner.agreedCpl?.toString() || '', integrationType: partner.integrationType || 'MOCK_STANDARD' } : emptyForm);
    };

    const savePartner = async (event: React.FormEvent) => {
      event.preventDefault(); setSaving(true); setError(''); setNotice('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/partners${editingId ? `/${editingId}` : ''}`, { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, agreedCpl: form.agreedCpl ? Number(form.agreedCpl) : undefined }) });
        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Unable to save partner');
        await loadPartners(); setNotice('Partner saved successfully.'); setEditingId(null); setForm(emptyForm); setShowForm(false);
      } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save partner'); } finally { setSaving(false); }
    };

    return <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}><h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Partner Management</h1><button className="btn btn-primary" onClick={() => openForm()}>+ Add Partner</button></div>
      {error && <p role="alert" style={{ color: '#b91c1c', marginBottom: '1rem' }}>{error}</p>}{notice && <p role="status" style={{ color: '#047857', marginBottom: '1rem' }}>{notice}</p>}
      {showForm ? <form onSubmit={savePartner} className="card" style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}><h2 style={{ fontSize: '1.2rem' }}>{editingId ? 'Edit partner' : 'Add partner'}</h2><label>Name<input className="input-field" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Type<select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="INSURER">Insurer</option><option value="AGENT">Agent</option><option value="BROKER">Broker</option></select></label><label>Agreed CPL<input className="input-field" type="number" min="0" value={form.agreedCpl} onChange={e => setForm({ ...form, agreedCpl: e.target.value })} /></label><label>Integration type<select className="input-field" value={form.integrationType} onChange={e => setForm({ ...form, integrationType: e.target.value })}><option value="MOCK_STANDARD">Mock standard</option><option value="MOCK_LEGACY_REST">Mock legacy REST</option></select></label><div><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save partner'}</button><button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(false); }}>Cancel</button></div></form> : null}
      <div className="card table-container">{loading ? <p>Loading partners...</p> : <table className="data-table"><thead><tr><th>Partner Name</th><th>Type</th><th>CPL Rate</th><th>Integration</th><th>Actions</th></tr></thead><tbody>{partners.map(partner => <tr key={partner.id}><td style={{ fontWeight: 500 }}>{partner.name}</td><td>{partner.type}</td><td>{partner.agreedCpl == null ? 'Not set' : `NPR ${partner.agreedCpl}`}</td><td>{partner.integrationType || 'Not set'}</td><td><button className="btn" onClick={() => openForm(partner)}>Edit</button></td></tr>)}{!partners.length && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No partners found.</td></tr>}</tbody></table>}</div>
    </div>;
}
