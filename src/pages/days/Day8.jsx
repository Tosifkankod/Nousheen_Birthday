import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';

const TERMINAL_LINES = [
  { type: 'cmd', text: 'npm run birthday', delay: 400 },
  { type: 'output', text: '', delay: 700 },
  { type: 'output', text: 'Building something special for Nousheen...', delay: 1000 },
  { type: 'output', text: '', delay: 1300 },
  { type: 'success', text: '✓ memories      loaded', delay: 1600 },
  { type: 'success', text: '✓ love          loaded', delay: 1900 },
  { type: 'success', text: '✓ stupid jokes  compiled', delay: 2200 },
  { type: 'success', text: '✓ late nights   bundled', delay: 2500 },
  { type: 'success', text: '✓ coffee        consumed', delay: 2800 },
  { type: 'love', text: '✓ Nousheen      ❤️', delay: 3100 },
  { type: 'output', text: '', delay: 3400 },
  { type: 'success', text: 'Build successful. ❤️', delay: 3800 },
  { type: 'output', text: '', delay: 4100 },
  { type: 'output', text: 'yes, I actually coded all this for you.', delay: 4500 },
];

const BUILD_STAGES = [
  { label: 'Thinking about you', width: 15 },
  { label: 'Loading memories', width: 35 },
  { label: 'Writing code', width: 55 },
  { label: 'Adding love', width: 75 },
  { label: 'Still thinking about you', width: 92 },
  { label: 'Done', width: 100 },
];

export default function Day8() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [buildStage, setBuildStage] = useState(0);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      const timer = setTimeout(() => setVisibleLines(i + 1), line.delay);
      return () => clearTimeout(timer);
    });
  }, []);

  useEffect(() => {
    const stages = BUILD_STAGES;
    stages.forEach((stage, i) => {
      const delay = 500 + i * 500;
      setTimeout(() => {
        setProgress(stage.width);
        setBuildStage(i);
      }, delay);
    });
  }, []);

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={8} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 08 — DAY EIGHT
          </p>
          <h1 className="heading mb-2">Behind The Website</h1>
          <p className="subheading">The honest version.</p>
        </motion.div>

        {/* Build Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card mb-3"
          style={{ padding: '1.25rem' }}
        >
          <p className="mono dim mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>
            BUILDING SOMETHING FOR:
          </p>
          <p
            className="heading mb-3"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}
          >
            Nousheen ❤️
          </p>

          {/* Progress bar */}
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '2px',
              height: '4px',
              overflow: 'hidden',
              marginBottom: '0.6rem',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--rose), var(--gold))',
                borderRadius: '2px',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center" style={{ justifyContent: 'space-between' }}>
            <p className="mono dim" style={{ fontSize: '0.72rem' }}>
              {BUILD_STAGES[buildStage]?.label}...
            </p>
            <p className="mono rose" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
              {progress}%
            </p>
          </div>

          {progress === 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mono"
              style={{ fontSize: '0.72rem', color: '#28c840', marginTop: '0.4rem' }}
            >
              Status: Still thinking about you...
            </motion.p>
          )}
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="terminal"
        >
          <div className="terminal-header">
            <div className="terminal-dot t-red" />
            <div className="terminal-dot t-yellow" />
            <div className="terminal-dot t-green" />
            <span className="mono dim" style={{ fontSize: '0.68rem', marginLeft: '0.3rem' }}>
              bash — nousheen-birthday
            </span>
          </div>

          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="terminal-line"
              style={{ marginBottom: '0.2rem' }}
            >
              {line.type === 'cmd' && (
                <>
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-cmd">{line.text}</span>
                </>
              )}
              {line.type === 'output' && (
                <span className="terminal-output">{line.text}</span>
              )}
              {line.type === 'success' && (
                <span className="terminal-success" style={{ paddingLeft: '0.5rem' }}>
                  {line.text}
                </span>
              )}
              {line.type === 'love' && (
                <span className="terminal-love" style={{ paddingLeft: '0.5rem' }}>
                  {line.text}
                </span>
              )}
            </motion.div>
          ))}

          {/* Blinking cursor */}
          {visibleLines < TERMINAL_LINES.length && (
            <div className="terminal-line mt-1">
              <span className="terminal-prompt">$</span>
              <span
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '13px',
                  background: 'var(--white)',
                  marginLeft: '4px',
                  animation: 'blink 1s ease-in-out infinite',
                }}
              />
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {visibleLines >= TERMINAL_LINES.length && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card text-center mt-3"
              style={{ borderColor: 'rgba(232, 99, 122, 0.25)', padding: '1.25rem' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  color: 'var(--white)',
                  lineHeight: 1.6,
                }}
              >
                "Yes, I actually coded all this for you."
                <br />
                <span style={{ color: 'var(--white-dim)', fontSize: '0.85rem' }}>
                  Every single page. Every animation. Every word.
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
