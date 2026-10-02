import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { LETTER } from '../../data/days';

export default function Day10() {
  const [visible, setVisible] = useState(false);
  const paragraphs = LETTER.split('\n\n');

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4.5rem))',
        paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))',
        background: '#060606',
      }}
    >
      {/* Minimal background */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 80vw, 400px)',
          height: 'clamp(280px, 80vw, 400px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 99, 122, 0.05), transparent 70%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <DayNav dayNumber={10} />

      <div
        className="page-content z-1"
        style={{ maxWidth: '520px', padding: '0 0.5rem' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-5"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 10 — DAY TEN
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-elegant)',
              fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--white)',
            }}
          >
            A letter.
          </h1>
        </motion.div>

        <div
          style={{
            fontFamily: 'var(--font-elegant)',
            fontSize: 'clamp(1.02rem, 3.2vw, 1.15rem)',
            lineHeight: 1.85,
            color: 'var(--white-dim)',
            letterSpacing: '0.01em',
          }}
        >
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
              style={{
                marginBottom: '1.4rem',
                color: i === 0 ? 'var(--white)' : 'var(--white-dim)',
                fontWeight: i === 0 ? 400 : 300,
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: paragraphs.length * 0.2 + 0.4 }}
          className="text-center mt-5"
        >
          <div className="divider divider-center" style={{ width: '50px' }} />
          <p className="mono dimmer mt-3" style={{ fontSize: '0.7rem', letterSpacing: '0.12em' }}>
            WRITTEN BY TOSIF — OCTOBER 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
