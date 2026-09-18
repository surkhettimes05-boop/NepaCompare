import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadSeed, leadStatusOptions, leadPriorityOptions, staffOptions } from '../lib/crmData';

const currentUserScope = ['KTM', 'BKT'];

const pageSize = 4;

export default function LeadsInbox() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assignedFilter, setAssignedFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'status'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const visibleLeads = useMemo(() => {
    const filtered = leadSeed.filter((lead) => {
      const matchesScope = lead.scope.some((area) => currentUserScope.includes(area));
      const matchesSearch = !search || [lead.customerName, lead.phone, lead.email, lead.id, lead.product].some((field) => field.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter;
      const matchesAssigned = assignedFilter === 'ALL' || lead.assignedTo === assignedFilter;

      return matchesScope && matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });

    const sorted = [...filtered].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'priority') {
        const score = { LOW: 1, NORMAL: 2, HIGH: 3, URGENT: 4 } as const;
        return (score[a.priority] - score[b.priority]) * direction;
      }

      if (sortField === 'status') {
        return String(a.status).localeCompare(String(b.status)) * direction;
      }

      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
    });

    return sorted;
  }, [search, statusFilter, priorityFilter, assignedFilter, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(visibleLeads.length / pageSize));
  const paginatedLeads = visibleLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'createdAt' | 'priority' | 'status') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortDirection(field === 'priority' ? 'desc' : 'desc');
  };

  const exportCsv = () => {
    const rows = [
      ['Lead ID', 'Customer', 'Phone', 'Product', 'Status', 'Priority', 'Assigned To', 'Created'],
      ...visibleLeads.map((lead) => [lead.id, lead.customerName, lead.phone, lead.product, lead.status, lead.priority, lead.assignedTo, new Date(lead.createdAt).toLocaleDateString()]),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'khaacho-leads.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Sales</p>
          <h1>Lead pipeline</h1>
        </div>
        <button className="btn btn-primary" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input
            className="input-field search-box"
            value={search}
            placeholder="Search by name, phone, email, lead id, product"
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />

          <select className="input-field" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}>
            <option value="ALL">All statuses</option>
            {leadStatusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select className="input-field" value={priorityFilter} onChange={(event) => { setPriorityFilter(event.target.value); setCurrentPage(1); }}>
            <option value="ALL">All priorities</option>
            {leadPriorityOptions.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <select className="input-field" value={assignedFilter} onChange={(event) => { setAssignedFilter(event.target.value); setCurrentPage(1); }}>
            <option value="ALL">All assignments</option>
            {staffOptions.map((staff) => (
              <option key={staff} value={staff}>{staff}</option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</th>
                <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>Priority</th>
                <th>Assigned</th>
                <th>Product</th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{lead.customerName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{lead.id} • {lead.phone}</div>
                  </td>
                  <td>
                    <span className="pipeline-status">
                      <span className="status-dot" style={{ background: lead.status === 'POLICY_ISSUED' ? '#10b981' : lead.status === 'LOST' || lead.status === 'CANCELLED' ? '#ef4444' : '#f59e0b' }} />
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${lead.priority === 'URGENT' ? 'badge-closed' : lead.priority === 'HIGH' ? 'badge-pending' : 'badge-new'}`}>{lead.priority}</span>
                  </td>
                  <td>{lead.assignedTo}<br /><small style={{ color: 'var(--text-muted)' }}>{lead.assignedTeam}</small></td>
                  <td>{lead.product}</td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/leads/${lead.id}`} className="btn btn-primary small-btn">Open</Link>
                  </td>
                </tr>
              ))}

              {paginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No leads match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Showing {paginatedLeads.length} of {visibleLeads.length} leads</span>
          <div className="pagination-controls">
            <button className="btn" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}>Previous</button>
            <button className="btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
