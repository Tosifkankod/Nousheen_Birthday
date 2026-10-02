import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { TEN_THINGS } from '../../data/days';

export default function Day2() {
  const [revealed, setRevealed] = useState({});

  const toggle = (i) => setRevealed(prev => ({ ...prev, [i]: !prev[i] }));
  const revealedCount = Object.values(revealed).filter(Boolean).length;

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={2} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-5"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 02 — DAY TWO
          </p>
          <h1 className="heading mb-2">10 Things I Like About You</h1>
          <p className="subheading">
            Tap each card to open it.
          </p>
          {revealedCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mono rose mt-2"
              style={{ fontSize: '0.8rem' }}
            >
              {revealedCount} / 10 opened
            </motion.p>
          )}
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {TEN_THINGS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <button
                className={`reason-card ${revealed[i] ? 'revealed' : ''}`}
                onClick={() => toggle(i)}
                id={`day2-card-${i + 1}`}
                aria-expanded={!!revealed[i]}
                aria-label={`Thing ${i + 1}: ${revealed[i] ? item.title : 'Locked'}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: revealed[i] ? 'var(--rose)' : 'var(--border)',
                }}
              >
                <AnimatePresence mode="wait">
                  {!revealed[i] ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 w-full"
                    >
                      <span className="mono rose" style={{ fontSize: '0.82rem', minWidth: '2.2rem', fontWeight: 600 }}>
                        {item.number}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            height: '2px',
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '1px',
                            width: '55%',
                          }}
                        />
                      </div>
                      <span className="lock-icon">🔒</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="mono rose" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {item.number}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.98rem',
                            fontWeight: 500,
                            color: 'var(--white)',
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                      <p className="body-text" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                        {item.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {revealedCount === 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="card text-center mt-5"
            style={{ borderColor: 'rgba(232, 99, 122, 0.3)' }}
          >
            <p className="heading mb-2" style={{ fontSize: '1.25rem' }}>
              All 10. ❤️
            </p>
            <p className="body-text">
              And honestly? This list could've been so much longer.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
