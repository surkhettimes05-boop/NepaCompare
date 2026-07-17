import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        NepaCompare CRM
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/leads" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          Leads Inbox
        </NavLink>
        <NavLink 
          to="/partners" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          Partners & Insurers
        </NavLink>
        <NavLink 
          to="/rate-tables" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          Rate Tables
        </NavLink>
      </nav>
      <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: 'var(--text-sidebar-muted)', fontSize: '0.8rem' }}>Logged in as Admin</p>
      </div>
    </aside>
  );
}
