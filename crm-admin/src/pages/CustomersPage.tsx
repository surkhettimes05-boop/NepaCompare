import { Link } from 'react-router-dom';
import { customersSeed } from '../lib/crmData';

const currentUser = {
  name: 'Aarati Shah',
  scope: ['KTM', 'BKT'],
};

export default function CustomersPage() {
  const visibleCustomers = customersSeed.filter((customer) =>
    customer.scope.some((area) => currentUser.scope.includes(area)),
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Customers</p>
          <h1>Customer database</h1>
        </div>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Scope</th>
              <th>Tier</th>
              <th>Vehicles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.scope.join(', ')}</td>
                <td>{customer.customerTier}</td>
                <td>{customer.vehicles.length}</td>
                <td>
                  <Link to={`/customers/${customer.id}`} className="btn btn-primary small-btn">View profile</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
