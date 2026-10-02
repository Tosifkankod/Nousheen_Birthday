import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import FloatingPetals from '../../components/FloatingPetals';
import { REASONS } from '../../data/days';

export default function Day6() {
  const [revealed, setRevealed] = useState([]);
  const [shuffled] = useState(() => [...REASONS].sort(() => Math.random() - 0.5));

  const revealNext = () => {
    if (revealed.length < shuffled.length) {
      setRevealed(prev => [...prev, prev.length]);
    }
  };

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <FloatingPetals count={15} />
      <DayNav dayNumber={6} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 06 — DAY SIX
          </p>
          <h1 className="heading mb-2">Reasons</h1>
          <p className="subheading">
            Every tap reveals one more.
          </p>
          {revealed.length > 0 && (
            <motion.p
              className="mono rose mt-2"
              style={{ fontSize: '0.8rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {revealed.length} of {shuffled.length} revealed
            </motion.p>
          )}
        </motion.div>

        {/* Responsive Masonry / Feed */}
        <div className="reasons-masonry">
          <AnimatePresence>
            {revealed.map(idx => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ breakInside: 'avoid', marginBottom: '0.85rem' }}
              >
                <div
                  className="card"
                  style={{
                    borderColor: 'rgba(232, 99, 122, 0.25)',
                    background: 'linear-gradient(135deg, rgba(232, 99, 122, 0.08), var(--card-bg))',
                    padding: '1.1rem 1.25rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-elegant)',
                      fontSize: '1.05rem',
                      fontStyle: 'italic',
                      color: 'var(--white)',
                      lineHeight: 1.55,
                    }}
                  >
                    "{shuffled[idx]}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reveal button */}
        <div className="text-center mt-2">
          {revealed.length < shuffled.length ? (
            <motion.button
              className="btn-primary btn"
              onClick={revealNext}
              whileTap={{ scale: 0.96 }}
              id="day6-reveal-btn"
              aria-label="Reveal next reason"
              style={{ padding: '0.9rem 2.2rem', minHeight: '50px' }}
            >
              Reveal another ❤️
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{ maxWidth: '400px', margin: '0 auto', borderColor: 'rgba(232, 99, 122, 0.3)' }}
            >
              <p className="heading mb-2" style={{ fontSize: '1.25rem' }}>
                All {shuffled.length} reasons. ❤️
              </p>
              <p className="body-text">
                And I'm still noticing more every single day.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
