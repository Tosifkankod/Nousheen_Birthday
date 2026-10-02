import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarField from '../components/StarField';

export default function LockedPage({ dayNumber }) {
  const navigate = useNavigate();
  const unlockDate = new Date(`2026-10-${String(dayNumber).padStart(2, '0')}T00:00:00`);
  const options = { month: 'long', day: 'numeric' };

  return (
    <div className="locked-overlay">
      <StarField />
      <div className="orb orb-1" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-1"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <motion.div
          className="animate-float"
          style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
          aria-hidden="true"
        >
          🔒
        </motion.div>

        <h1 className="heading mb-2">Not yet.</h1>

        <p className="body-text mb-4">
          Day {dayNumber} unlocks on{' '}
          <span className="rose" style={{ fontWeight: 600 }}>
            {unlockDate.toLocaleDateString('en-US', options)}
          </span>
          .
          <br />
          Some things are worth waiting for.
        </p>

        <div className="divider divider-center mb-4" />

        <p className="subheading mb-4">
          Come back then, Nousheen. 🌙
        </p>

        <button
          className="btn"
          onClick={() => navigate('/')}
          id="locked-back-btn"
          style={{ width: '100%', maxWidth: '240px', minHeight: '46px' }}
        >
          ← Go back home
        </button>
      </motion.div>
    </div>
  );
}
