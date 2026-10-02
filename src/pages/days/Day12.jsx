import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { MYSTERY_BOXES } from '../../data/days';

export default function Day12() {
  const [opened, setOpened] = useState(null);
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const open = (i) => {
    if (opened === i) return;
    setOpened(i);
    setAttempts(a => a + 1);
    if (MYSTERY_BOXES[i].isReal) setFound(true);
  };

  const reset = () => {
    setOpened(null);
    setFound(false);
  };

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={12} />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <div className="page-content z-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 12 — DAY TWELVE
          </p>
          <h1 className="heading mb-2">Mystery Box</h1>
          <p className="subheading">
            One of these has today's gift.
          </p>
          {attempts > 0 && !found && (
            <p className="mono dim mt-2" style={{ fontSize: '0.75rem' }}>
              Attempt {attempts} 😭
            </p>
          )}
        </motion.div>

        {/* 3 boxes nicely aligned in a single row on any mobile width */}
        <div
          className="flex items-center justify-center"
          style={{ gap: 'clamp(0.65rem, 3.5vw, 1.25rem)', marginBottom: '2rem' }}
        >
          {MYSTERY_BOXES.map((box, i) => (
            <motion.button
              key={i}
              className={`mystery-box ${opened === i ? 'opened' : ''}`}
              onClick={() => open(i)}
              whileTap={{ scale: 0.92 }}
              id={`mystery-box-${i + 1}`}
              aria-label={`Mystery box ${i + 1}`}
            >
              <AnimatePresence mode="wait">
                {opened !== i ? (
                  <motion.span
                    key="closed"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{ display: 'block', lineHeight: 1 }}
                  >
                    🎁
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ display: 'block', lineHeight: 1 }}
                  >
                    {box.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {opened !== null && (
            <motion.div
              key={opened}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="card"
              style={{
                maxWidth: '440px',
                margin: '0 auto',
                borderColor: MYSTERY_BOXES[opened].isReal
                  ? 'rgba(232, 99, 122, 0.45)'
                  : 'var(--border)',
                textAlign: 'left',
              }}
            >
              {MYSTERY_BOXES[opened].content.split('\n').map((line, i) => (
                <p
                  key={i}
                  style={{
                    marginBottom: '0.45rem',
                    fontFamily: line.includes('❤️') || line.startsWith('You found')
                      ? 'var(--font-serif)'
                      : 'var(--font-sans)',
                    fontSize: line.startsWith('You found') ? '1.15rem' : '0.92rem',
                    color: line.includes('gift') ? 'var(--rose-light)' : 'var(--white-dim)',
                    fontStyle: line.startsWith('You get') ? 'italic' : 'normal',
                    lineHeight: 1.6,
                  }}
                >
                  {line}
                </p>
              ))}

              {!MYSTERY_BOXES[opened].isReal && (
                <button
                  className="btn mt-3"
                  onClick={reset}
                  id="mystery-retry-btn"
                  style={{ width: '100%' }}
                >
                  Try again →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
