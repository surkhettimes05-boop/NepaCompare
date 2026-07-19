import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LeadsInbox from './pages/LeadsInbox';
import LeadDetail from './pages/LeadDetail';
import Partners from './pages/Partners';
import Renewals from './pages/Renewals';
import Login from './pages/Login';

// Simple Auth Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Admin Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <header className="topbar">
                <button className="btn btn-primary" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Log Out</button>
              </header>
              <main className="page-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/leads" element={<LeadsInbox />} />
                  <Route path="/leads/:id" element={<LeadDetail />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/renewals" element={<Renewals />} />
                  <Route path="*" element={<h2>404 - Not Found</h2>} />
                </Routes>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
