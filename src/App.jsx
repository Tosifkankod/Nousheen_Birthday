import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import DayRouter from './pages/DayRouter';
import AdminDay4 from './pages/AdminDay4';
import BackgroundMusic from './components/BackgroundMusic';
import { trackPageAccess } from './services/accessTracker';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    let pageName = 'Home (Safe Space Sanctuary)';
    if (location.pathname.startsWith('/day/')) {
      const dayNum = location.pathname.replace('/day/', '');
      pageName = `Day ${dayNum} Romantic Journey`;
    } else if (location.pathname.startsWith('/admin')) {
      pageName = 'Admin Dashboard';
    }
    trackPageAccess(pageName);
  }, [location.pathname]);

  return (
    <>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/:dayNumber" element={<DayRouter />} />
        <Route path="/day4-responses" element={<AdminDay4 />} />
        <Route path="/admin" element={<AdminDay4 />} />
        <Route path="/admin/day4" element={<AdminDay4 />} />
        <Route path="/admin/day5" element={<AdminDay4 />} />
      </Routes>
    </>
  );
}

