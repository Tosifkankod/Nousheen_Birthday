import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { TIMELINE_MOMENTS } from '../../data/days';

export default function Day4() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={4} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-5"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 04 — DAY FOUR
          </p>
          <h1 className="heading mb-2">The Story of Us</h1>
          <p className="subheading">Tap each moment.</p>
        </motion.div>

        <div className="timeline">
          {TIMELINE_MOMENTS.map((moment, i) => (
            <motion.div
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                }}
                onClick={() => setExpanded(expanded === i ? null : i)}
                id={`timeline-item-${i + 1}`}
                aria-expanded={expanded === i}
                aria-label={`Story moment: ${moment.label}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: '1.25rem' }}>{moment.emoji}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      color: expanded === i ? 'var(--rose-light)' : 'var(--white)',
                      transition: 'color 0.25s',
                    }}
                  >
                    {moment.label}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden', paddingLeft: '0.5rem', marginTop: '0.35rem' }}
                  >
                    <div
                      className="card"
                      style={{
                        marginBottom: '0.5rem',
                        borderColor: 'rgba(232, 99, 122, 0.25)',
                        padding: '1rem 1.25rem',
                        background: 'linear-gradient(135deg, rgba(232, 99, 122, 0.05), var(--card-bg))',
                      }}
                    >
                      <p className="body-text" style={{ fontStyle: 'italic', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        "{moment.description}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-5"
        >
          <p className="subheading">
            And we're still writing it. ❤️
          </p>
        </motion.div>
      </div>
    </div>
  );
}
