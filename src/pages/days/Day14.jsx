import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';
import DayNav from '../../components/DayNav';
import { BIRTHDAY_SURPRISE } from '../../data/days';

const CLOSING_LETTER = `I could've bought you something.

But I wanted to give you something that took time.

Something that only exists because you exist in my life.

This entire thing — every page, every word, every line of code — was made by hand, for you.

Not for a version of you.

For the real one. The actual Nousheen.

Happy Birthday. ❤️`;

export default function Day14() {
  const [phase, setPhase] = useState('boot');
  const [count, setCount] = useState(3);
  const [showSurprise, setShowSurprise] = useState(false);
  const { width, height } = useWindowSize();

  // Boot → countdown
  useEffect(() => {
    if (phase !== 'boot') return;
    const t = setTimeout(() => setPhase('countdown'), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  // Countdown 3-2-1
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 850);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase('reveal'), 750);
      return () => clearTimeout(t);
    }
  }, [phase, count]);

  // Reveal → content
  useEffect(() => {
    if (phase !== 'reveal') return;
    const t = setTimeout(() => setPhase('content'), 2400);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'max(1.5rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(3rem, env(safe-area-inset-bottom) + 1.5rem) max(1rem, env(safe-area-inset-left))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Confetti */}
      {(phase === 'content' || phase === 'surprise') && (
        <ReactConfetti
          width={width}
          height={height}
          colors={['#e8637a', '#c9a96e', '#f0899a', '#ffffff', '#f5f0eb']}
          numberOfPieces={160}
          recycle={false}
          gravity={0.08}
        />
      )}

      {phase !== 'boot' && phase !== 'countdown' && phase !== 'reveal' && (
        <DayNav dayNumber={14} />
      )}

      {/* Rose glow orb */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(300px, 80vw, 550px)',
          height: 'clamp(300px, 80vw, 550px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 99, 122, 0.14), transparent 70%)',
          pointerEvents: 'none',
          transition: 'opacity 1.5s',
          opacity: phase === 'content' || phase === 'surprise' ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">

        {/* BOOT */}
        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p
              className="mono"
              style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.2em',
              }}
            >
              14 OCTOBER
            </p>
            <p
              className="mono animate-pulse"
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.2)',
                marginTop: '0.5rem',
                letterSpacing: '0.15em',
              }}
            >
              Initializing...
            </p>
          </motion.div>
        )}

        {/* COUNTDOWN */}
        {phase === 'countdown' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{ textAlign: 'center' }}
            >
              <span
                className="final-countdown"
                aria-label={count === 0 ? 'Starting' : String(count)}
              >
                {count === 0 ? '✦' : count}
              </span>
            </motion.div>
          </AnimatePresence>
        )}

        {/* REVEAL */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
            style={{ padding: '0 1rem' }}
          >
            <motion.h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.4rem, 8vw, 4.5rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                background: 'linear-gradient(135deg, #e8637a, #c9a96e, #f0899a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Happy Birthday,
              <br />
              Nousheen
            </motion.h1>
            <motion.span
              style={{ fontSize: '2.2rem', display: 'block', marginTop: '0.85rem' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
              className="animate-heartbeat"
            >
              ❤️
            </motion.span>
          </motion.div>
        )}

        {/* MAIN CONTENT */}
        {phase === 'content' && !showSurprise && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', maxWidth: '580px', margin: '0 auto', paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))' }}
          >
            {/* Big birthday heading */}
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
                OCTOBER 14 — DAY FOURTEEN
              </p>
              <h1
                className="text-shimmer"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.85rem, 6.5vw, 3rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  marginBottom: '0.5rem',
                }}
              >
                Happy Birthday, Nousheen ❤️
              </h1>
              <p className="subheading">
                Today is all yours.
              </p>
            </motion.div>

            {/* The closing letter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card mb-4"
              style={{ borderColor: 'rgba(232, 99, 122, 0.25)', padding: '1.5rem 1.35rem' }}
            >
              {CLOSING_LETTER.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  style={{
                    fontFamily: 'var(--font-elegant)',
                    fontSize: 'clamp(0.98rem, 2.8vw, 1.1rem)',
                    fontStyle: 'italic',
                    color: i === CLOSING_LETTER.split('\n\n').length - 1
                      ? 'var(--rose-light)'
                      : 'var(--white-dim)',
                    lineHeight: 1.75,
                    marginBottom: '0.9rem',
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <motion.button
                className="btn-primary btn"
                onClick={() => setShowSurprise(true)}
                whileTap={{ scale: 0.96 }}
                id="day14-surprise-btn"
                style={{ fontSize: '0.98rem', padding: '0.95rem 2.2rem', width: '100%', maxWidth: '300px' }}
              >
                One last thing →
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* SURPRISE REVEAL */}
        {showSurprise && (
          <motion.div
            key="surprise"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: '460px', margin: '0 auto', paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))' }}
          >
            <div
              className="card text-center"
              style={{ borderColor: 'rgba(232, 99, 122, 0.4)', padding: '2.5rem 1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                style={{ fontSize: '3rem', marginBottom: '1.25rem' }}
                className="animate-float"
              >
                🎁
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 500,
                  color: 'var(--white)',
                  marginBottom: '1.25rem',
                }}
              >
                Your actual birthday gift is waiting for you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}
              >
                <p className="body-text">
                  📍 {BIRTHDAY_SURPRISE.location}
                </p>
                <p className="body-text">
                  🕐 {BIRTHDAY_SURPRISE.time}
                </p>
                <p className="body-text">
                  {BIRTHDAY_SURPRISE.hint}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="divider divider-center mb-3" />
                <p
                  style={{
                    fontFamily: 'var(--font-elegant)',
                    fontSize: '1.05rem',
                    fontStyle: 'italic',
                    color: 'var(--rose-light)',
                  }}
                >
                  {BIRTHDAY_SURPRISE.note}
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center mono dimmer mt-4"
              style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              with love, from Tosif — October 14, 2026
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
