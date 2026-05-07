import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MenuManager from './pages/MenuManager';
import OrderHistory from './pages/OrderHistory';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <SocketProvider>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/menu" element={<MenuManager />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/history" element={<OrderHistory />} />
                </Routes>
              </AdminLayout>
            </SocketProvider>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
