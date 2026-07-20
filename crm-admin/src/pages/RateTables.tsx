import { useState, useEffect } from 'react';

export default function RateTables() {
  const [rateTables, setRateTables] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    partnerId: '', vertical: '', planName: '', premiumMin: '', premiumMax: '',
    ageMin: '', ageMax: '', sumAssuredMin: '', sumAssuredMax: '',
    ccMin: '', ccMax: '', vehicleType: '', tripDurationMin: '', tripDurationMax: '',
    dependentsMin: '', dependentsMax: ''
  });
  
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importReport, setImportReport] = useState<any>(null);

  const fetchRateTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const [rtRes, pRes] = await Promise.all([
        fetch(`${apiUrl}/rate-tables`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/partners`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (rtRes.ok) setRateTables(await rtRes.json());
      if (pRes.ok) setPartners(await pRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRateTables();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rate table?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await fetch(`${apiUrl}/rate-tables/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchRateTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const criteriaKeys = [
        'ageMin', 'ageMax', 'sumAssuredMin', 'sumAssuredMax', 'ccMin', 'ccMax', 
        'vehicleType', 'tripDurationMin', 'tripDurationMax', 'dependentsMin', 'dependentsMax'
      ];
      
      const parsedCriteria: any = {};
      criteriaKeys.forEach(key => {
        const val = (manualFormData as any)[key];
        if (val !== '') {
          const asNum = Number(val);
          parsedCriteria[key] = isNaN(asNum) ? val : asNum;
        }
      });

      const res = await fetch(`${apiUrl}/rate-tables`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...manualFormData,
          premiumMin: parseFloat(manualFormData.premiumMin),
          premiumMax: parseFloat(manualFormData.premiumMax),
          criteria: parsedCriteria
        })
      });

      if (res.ok) {
        setShowManualForm(false);
        fetchRateTables();
      } else {
        alert('Failed to create rate table');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'partnerId', 'vertical', 'planName', 'premiumMin', 'premiumMax', 
      'ageMin', 'ageMax', 'sumAssuredMin', 'sumAssuredMax', 'ccMin', 
      'ccMax', 'vehicleType', 'tripDurationMin', 'tripDurationMax', 
      'dependentsMin', 'dependentsMax'
    ];
    // Example row
    const example = [
      'put-partner-uuid-or-name-here', 'health', 'Basic Health', '5000', '15000',
      '18', '60', '500000', '1000000', '', '', '', '', '', '0', '3'
    ];
    
    const csvContent = headers.join(',') + '\n' + example.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rate_tables_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) {
        alert('CSV is empty or missing data rows');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        // basic split, ignoring commas in quotes for this MVP
        const values = lines[i].split(',').map(v => v.trim());
        const rowData: any = {};
        headers.forEach((h, idx) => {
          rowData[h] = values[idx] || '';
        });
        rows.push(rowData);
      }

      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/rate-tables/bulk-import`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(rows)
        });

        if (res.ok) {
          const report = await res.json();
          setImportReport(report);
          fetchRateTables();
        } else {
          alert('Bulk import failed due to server error');
        }
      } catch (err) {
        console.error(err);
        alert('Error parsing or uploading CSV');
      }
    };
    reader.readAsText(file);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Rate Tables</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowManualForm(true)}>Add Manually</button>
          <button className="btn btn-primary" onClick={() => setShowBulkImport(true)}>Bulk Import CSV</button>
        </div>
      </div>

      {showManualForm && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add Rate Table (Manual)</h2>
          <form onSubmit={handleManualSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="input-field" style={{ display: 'block' }}>Partner</label>
              <select className="input-field" required value={manualFormData.partnerId} onChange={e => setManualFormData({...manualFormData, partnerId: e.target.value})}>
                <option value="">Select Partner</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="input-field" style={{ display: 'block' }}>Vertical</label>
              <select className="input-field" required value={manualFormData.vertical} onChange={e => setManualFormData({...manualFormData, vertical: e.target.value})}>
                <option value="">Select Vertical</option>
                <option value="motor">Motor</option>
                <option value="health">Health</option>
                <option value="life">Life</option>
              </select>
            </div>
            <div>
              <label className="input-field" style={{ display: 'block' }}>Plan Name</label>
              <input type="text" className="input-field" required value={manualFormData.planName} onChange={e => setManualFormData({...manualFormData, planName: e.target.value})} />
            </div>
            <div>
              <label className="input-field" style={{ display: 'block' }}>Premium Min</label>
              <input type="number" className="input-field" required value={manualFormData.premiumMin} onChange={e => setManualFormData({...manualFormData, premiumMin: e.target.value})} />
            </div>
            <div>
              <label className="input-field" style={{ display: 'block' }}>Premium Max</label>
              <input type="number" className="input-field" required value={manualFormData.premiumMax} onChange={e => setManualFormData({...manualFormData, premiumMax: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Criteria Fields (Optional)</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {(manualFormData.vertical === 'health' || manualFormData.vertical === 'life' || manualFormData.vertical === '') && (
                  <>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Age Min</label>
                      <input type="number" className="input-field" value={manualFormData.ageMin} onChange={e => setManualFormData({...manualFormData, ageMin: e.target.value})} />
                    </div>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Age Max</label>
                      <input type="number" className="input-field" value={manualFormData.ageMax} onChange={e => setManualFormData({...manualFormData, ageMax: e.target.value})} />
                    </div>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Sum Assured Min</label>
                      <input type="number" className="input-field" value={manualFormData.sumAssuredMin} onChange={e => setManualFormData({...manualFormData, sumAssuredMin: e.target.value})} />
                    </div>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Sum Assured Max</label>
                      <input type="number" className="input-field" value={manualFormData.sumAssuredMax} onChange={e => setManualFormData({...manualFormData, sumAssuredMax: e.target.value})} />
                    </div>
                    {manualFormData.vertical === 'health' && (
                      <>
                        <div>
                          <label className="input-field" style={{ display: 'block' }}>Dependents Min</label>
                          <input type="number" className="input-field" value={manualFormData.dependentsMin} onChange={e => setManualFormData({...manualFormData, dependentsMin: e.target.value})} />
                        </div>
                        <div>
                          <label className="input-field" style={{ display: 'block' }}>Dependents Max</label>
                          <input type="number" className="input-field" value={manualFormData.dependentsMax} onChange={e => setManualFormData({...manualFormData, dependentsMax: e.target.value})} />
                        </div>
                      </>
                    )}
                  </>
                )}

                {(manualFormData.vertical === 'motor' || manualFormData.vertical === '') && (
                  <>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>CC Min</label>
                      <input type="number" className="input-field" value={manualFormData.ccMin} onChange={e => setManualFormData({...manualFormData, ccMin: e.target.value})} />
                    </div>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>CC Max</label>
                      <input type="number" className="input-field" value={manualFormData.ccMax} onChange={e => setManualFormData({...manualFormData, ccMax: e.target.value})} />
                    </div>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Vehicle Type</label>
                      <input type="text" className="input-field" value={manualFormData.vehicleType} onChange={e => setManualFormData({...manualFormData, vehicleType: e.target.value})} placeholder="e.g. 2W, 4W" />
                    </div>
                  </>
                )}

                {(manualFormData.vertical === 'travel' || manualFormData.vertical === '') && (
                  <>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Trip Duration Min (Days)</label>
                      <input type="number" className="input-field" value={manualFormData.tripDurationMin} onChange={e => setManualFormData({...manualFormData, tripDurationMin: e.target.value})} />
                    </div>
                    <div>
                      <label className="input-field" style={{ display: 'block' }}>Trip Duration Max (Days)</label>
                      <input type="number" className="input-field" value={manualFormData.tripDurationMax} onChange={e => setManualFormData({...manualFormData, tripDurationMax: e.target.value})} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowManualForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showBulkImport && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Bulk Import via CSV</h2>
            <button className="btn btn-secondary" onClick={() => setShowBulkImport(false)}>Close</button>
          </div>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Upload a CSV containing flat criteria columns. Values will be merged into JSON automatically. Matches on Partner + Vertical + PlanName will update existing rates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={downloadTemplate}>Download Template</button>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
          </div>

          {importReport && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <h3 style={{ fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                Import Complete: {importReport.successful} rows processed successfully.
              </h3>
              {importReport.errors.length > 0 && (
                <div>
                  <h4 style={{ color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>Errors ({importReport.errors.length}):</h4>
                  <ul style={{ maxHeight: '200px', overflowY: 'auto', background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '4px' }}>
                    {importReport.errors.map((err: any, i: number) => (
                      <li key={i} style={{ color: '#b91c1c', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Row {err.rowIndex}: {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Vertical</th>
              <th>Plan Name</th>
              <th>Premium Min</th>
              <th>Premium Max</th>
              <th>Criteria Configured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rateTables.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No rate tables found.</td>
              </tr>
            ) : (
              rateTables.map(rt => (
                <tr key={rt.id}>
                  <td><strong>{rt.partner?.name || rt.partnerId}</strong></td>
                  <td style={{ textTransform: 'capitalize' }}>{rt.vertical}</td>
                  <td>{rt.planName}</td>
                  <td>Rs. {rt.premiumMin}</td>
                  <td>Rs. {rt.premiumMax}</td>
                  <td>{Object.keys(rt.criteria || {}).length} rules</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => handleDelete(rt.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
