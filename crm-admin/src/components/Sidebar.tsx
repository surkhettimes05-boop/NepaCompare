import { NavLink } from 'react-router-dom';

const menuGroups = [
  {
    title: 'Dashboard',
    items: [{ to: '/', label: 'Dashboard' }],
  },
  {
    title: 'Sales',
    items: [
      { to: '/leads', label: 'Leads' },
      { to: '/quotes', label: 'Quotes' },
      { to: '/applications', label: 'Applications' },
      { to: '/policies', label: 'Policies' },
    ],
  },
  {
    title: 'Customers',
    items: [
      { to: '/customers', label: 'Customers' },
      { to: '/vehicles', label: 'Vehicles' },
      { to: '/documents', label: 'Documents' },
    ],
  },
  {
    title: 'Insurance',
    items: [
      { to: '/insurers', label: 'Insurers' },
      { to: '/products', label: 'Products' },
      { to: '/coverages', label: 'Coverages' },
      { to: '/providers', label: 'Quote Providers' },
    ],
  },
  {
    title: 'Renewals',
    items: [
      { to: '/renewals', label: 'Upcoming' },
      { to: '/renewals/due', label: 'Due' },
      { to: '/renewals/overdue', label: 'Overdue' },
    ],
  },
  {
    title: 'Claims',
    items: [
      { to: '/claims/active', label: 'Active' },
      { to: '/claims/resolved', label: 'Resolved' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { to: '/finance/premium', label: 'Premium' },
      { to: '/finance/commission', label: 'Commission' },
      { to: '/finance/reconciliation', label: 'Reconciliation' },
    ],
  },
  {
    title: 'Partners',
    items: [
      { to: '/partners', label: 'Partners' },
      { to: '/partner-leads', label: 'Partner Leads' },
      { to: '/partner-commission', label: 'Partner Commission' },
    ],
  },
  {
    title: 'Reports',
    items: [{ to: '/reports', label: 'Reports' }],
  },
  {
    title: 'Audit',
    items: [{ to: '/audit-logs', label: 'Audit Logs' }],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">Khaacho CRM</div>
      <nav className="sidebar-nav">
        {menuGroups.map((group) => (
          <div key={group.title} className="sidebar-group">
            <div className="sidebar-group-title">{group.title}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Logged in as Admin</p>
      </div>
    </aside>
  );
}
