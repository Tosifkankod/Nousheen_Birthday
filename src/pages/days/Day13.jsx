import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { DAYS } from '../../data/days';

export default function Day13() {
  const navigate = useNavigate();
  const unlockedDays = DAYS.filter(d => d.day < 13);

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={13} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 13 — DAY THIRTEEN
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 6vw, 3.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}
          >
            Almost there.
          </h1>
          <p className="subheading">Tomorrow isn't just another day.</p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card text-center mb-4"
          style={{ borderColor: 'rgba(232, 99, 122, 0.3)', padding: '1.5rem 1rem' }}
        >
          <p className="mono dim mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.15em' }}>
            DAYS UNTIL HER BIRTHDAY
          </p>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(4.5rem, 18vw, 7.5rem)',
              fontWeight: 400,
              color: 'var(--rose)',
              lineHeight: 1,
              textShadow: '0 0 40px rgba(232, 99, 122, 0.4)',
            }}
          >
            1
          </div>
          <p className="subheading mt-1">
            day.
          </p>
        </motion.div>

        {/* Recap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="mono dim mb-3" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textAlign: 'center' }}>
            WHAT YOU'VE OPENED SO FAR
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.65rem',
            }}
          >
            {unlockedDays.map((day, i) => (
              <motion.button
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.04 }}
                onClick={() => navigate(`/day/${day.day}`)}
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: '0.9rem 0.75rem',
                  textAlign: 'center',
                  borderColor: 'rgba(232, 99, 122, 0.18)',
                  background: 'rgba(22, 22, 22, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                whileTap={{ scale: 0.96 }}
                id={`day13-recap-${day.day}`}
                aria-label={`Revisit Day ${day.day}: ${day.title}`}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{day.emoji}</div>
                <p className="mono dim" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  Day {day.day}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--white-dim)', marginTop: '0.2rem', lineHeight: 1.3 }}>
                  {day.title}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Closing message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-5"
        >
          <div className="divider divider-center mb-3" />
          <p
            style={{
              fontFamily: 'var(--font-elegant)',
              fontSize: 'clamp(1.1rem, 3.2vw, 1.35rem)',
              fontStyle: 'italic',
              color: 'var(--white-dim)',
            }}
          >
            See you tomorrow, Nousheen.
          </p>
          <span style={{ fontSize: '1.4rem', display: 'block', marginTop: '0.5rem' }}>🌙</span>
        </motion.div>
      </div>
    </div>
  );
}
