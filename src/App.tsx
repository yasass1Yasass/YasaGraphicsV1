import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tours from './pages/Tours'
import About from './pages/About'
import Rentals from './pages/Rentals'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import Booking from './pages/Booking'

export default function App() {
  return (
  <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/about" element={<About />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
