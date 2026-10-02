import { DAYS } from '../data/days';

// Set which day is currently active/unlocked.
// Set to 1 so ONLY Day 1 is unlocked for now.
// (You can change this number to 2, 3, etc. or set to null to use real date)
export const ACTIVE_DAY_OVERRIDE = 1;

export function getCurrentDay() {
  if (ACTIVE_DAY_OVERRIDE !== null && ACTIVE_DAY_OVERRIDE !== undefined) {
    return ACTIVE_DAY_OVERRIDE;
  }

  const START_DATE = new Date('2026-10-01T00:00:00');
  const now = new Date();
  const diffMs = now - START_DATE;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 1), 14);
}

export function isDayUnlocked(dayNumber) {
  return dayNumber <= getCurrentDay();
}

export function getDayData(dayNumber) {
  return DAYS.find(d => d.day === dayNumber);
}

export function getUnlockedDays() {
  const current = getCurrentDay();
  return DAYS.filter(d => d.day <= current);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}
