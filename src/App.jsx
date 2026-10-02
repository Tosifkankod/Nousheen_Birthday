import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DayRouter from './pages/DayRouter';
import BackgroundMusic from './components/BackgroundMusic';

export default function App() {
  return (
    <>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/:dayNumber" element={<DayRouter />} />
      </Routes>
    </>
  );
}
