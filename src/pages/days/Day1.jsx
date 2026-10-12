import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';

export default function Day1() {
  const [phase, setPhase] = useState(0); // 0: intro, 1: name reveal, 2: full
  const navigate = useNavigate();

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={1} />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <div className="page-content z-1 text-center">
        <AnimatePresence mode="wait">
          {/* Phase 0: The opening */}
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                className="mono dim mb-4"
                style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                OCTOBER 01 — DAY ONE
              </motion.p>

              <motion.h1
                className="display mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                This isn't your birthday gift.
              </motion.h1>

              <motion.p
                className="subheading mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                It's the beginning of it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <button
                  className="btn-primary btn"
                  onClick={() => setPhase(1)}
                  id="day1-start-btn"
                  style={{ minHeight: '48px', padding: '0.85rem 2.2rem' }}
                >
                  Start →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 1: Name reveal */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                style={{ marginBottom: '1.5rem' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="text-shimmer"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.8rem, 10vw, 6rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    display: 'block',
                  }}
                  aria-label="Nousheen"
                >
                  Nousheen
                </span>
              </motion.div>

              <motion.p
                className="subheading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                you have no idea what's coming.
              </motion.p>

              <motion.div
                className="mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <button
                  className="btn"
                  onClick={() => setPhase(2)}
                  id="day1-continue-btn"
                  style={{ minHeight: '48px', padding: '0.85rem 2rem' }}
                >
                  What is this? →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Explanation */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ maxWidth: '500px', margin: '0 auto' }}
            >
              <p className="mono dim mb-4" style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>
                THE CONCEPT
              </p>

              <div className="card text-center" style={{ borderColor: 'rgba(232, 99, 122, 0.25)' }}>
                <p className="body-text mb-3" style={{ color: 'var(--white)', fontSize: '0.98rem', lineHeight: 1.8 }}>
                  Every day for the next 14 days,<br />
                  you'll get a new link from me.
                </p>
                <div className="divider divider-center" />
                <p className="body-text mb-3">
                  Not a generic birthday gift.
                </p>
                <p className="body-text mb-4" style={{ color: 'var(--white)' }}>
                  Something made only for <span className="rose">you</span>.
                </p>
                <p className="subheading" style={{ fontSize: '0.95rem' }}>
                  Come back tomorrow. 🌙
                </p>
              </div>

              <div className="mt-4">
                <button
                  className="btn-primary btn"
                  onClick={() => navigate('/')}
                  id="day1-home-btn"
                  style={{ minHeight: '48px', padding: '0.85rem 2rem' }}
                >
                  See the full calendar →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
