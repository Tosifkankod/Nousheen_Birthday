import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DayRouter from './pages/DayRouter';
import AdminDay4 from './pages/AdminDay4';
import BackgroundMusic from './components/BackgroundMusic';

export default function App() {
  return (
    <>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/:dayNumber" element={<DayRouter />} />
        <Route path="/day4-responses" element={<AdminDay4 />} />
        <Route path="/admin/day4" element={<AdminDay4 />} />
      </Routes>
    </>
  );
}
