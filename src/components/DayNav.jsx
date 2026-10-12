import { useNavigate } from 'react-router-dom';
import { getCurrentDay } from '../utils/dayUtils';

export default function DayNav({ dayNumber }) {
  const navigate = useNavigate();
  const currentDay = getCurrentDay();

  return (
    <nav className="day-nav" aria-label="Day navigation">
      <button
        className="btn"
        style={{
          padding: '0.35rem 0.85rem',
          fontSize: '0.78rem',
          minHeight: '36px',
          borderRadius: '20px',
        }}
        onClick={() => navigate('/')}
        aria-label="Back to home"
      >
        ← Home
      </button>

      {dayNumber && (
        <span className="day-badge" aria-label={`Day ${dayNumber} of 14`}>
          Day {dayNumber} of 14
        </span>
      )}

      {dayNumber && dayNumber < currentDay ? (
        <button
          className="btn"
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.78rem',
            minHeight: '36px',
            borderRadius: '20px',
          }}
          onClick={() => navigate(`/day/${dayNumber + 1}`)}
          aria-label={`Go to Day ${dayNumber + 1}`}
        >
          Next →
        </button>
      ) : (
        <div style={{ width: '40px' }} />
      )}
    </nav>
  );
}
