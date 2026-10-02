import { useParams, Navigate } from 'react-router-dom';
import { isDayUnlocked } from '../utils/dayUtils';
import LockedPage from './LockedPage';

// Import all day pages
import Day1 from './days/Day1';
import Day2 from './days/Day2';
import Day3 from './days/Day3';
import Day4 from './days/Day4';
import Day5 from './days/Day5';
import Day6 from './days/Day6';
import Day7 from './days/Day7';
import Day8 from './days/Day8';
import Day9 from './days/Day9';
import Day10 from './days/Day10';
import Day11 from './days/Day11';
import Day12 from './days/Day12';
import Day13 from './days/Day13';
import Day14 from './days/Day14';

const DAY_COMPONENTS = {
  1: Day1, 2: Day2, 3: Day3, 4: Day4, 5: Day5,
  6: Day6, 7: Day7, 8: Day8, 9: Day9, 10: Day10,
  11: Day11, 12: Day12, 13: Day13, 14: Day14,
};

export default function DayRouter() {
  const { dayNumber } = useParams();
  const day = parseInt(dayNumber, 10);

  if (!day || day < 1 || day > 14) return <Navigate to="/" replace />;
  if (!isDayUnlocked(day)) return <LockedPage dayNumber={day} />;

  const DayComponent = DAY_COMPONENTS[day];
  return DayComponent ? <DayComponent /> : <Navigate to="/" replace />;
}
