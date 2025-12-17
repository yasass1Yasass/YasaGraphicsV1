
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Galary from './pages/Galary';
import Design from './pages/Design';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin-login') || location.pathname.startsWith('/admin-dashboard');
  
  return (
  <div className="min-h-screen flex flex-col bg-[#0b0708]">
    {!isAdminPage && <Navbar />}
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galary" element={<Galary />} />
        <Route path="/design" element={<Design />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    {!isAdminPage && location.pathname !== '/admin' && <WhatsAppFloating />}
    {!isAdminPage && <Footer />}
  </div>
  )
}
