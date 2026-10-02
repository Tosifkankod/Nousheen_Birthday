import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { BUCKET_LIST } from '../../data/days';

const STORAGE_KEY = 'nousheen_bucket_list';

export default function Day11() {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (i) => {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={11} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 11 — DAY ELEVEN
          </p>
          <h1 className="heading mb-2">Things I Want To Do With You</h1>
          <p className="subheading">
            Tap to check things off. They'll stay saved. 🫶
          </p>
          {checkedCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mono rose mt-2"
              style={{ fontSize: '0.8rem' }}
            >
              {checkedCount} done ❤️ — {BUCKET_LIST.length - checkedCount} to go
            </motion.p>
          )}
        </motion.div>

        <div className="card" style={{ padding: '1.25rem 1.35rem' }}>
          {BUCKET_LIST.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="bucket-item"
                onClick={() => toggle(i)}
                role="checkbox"
                aria-checked={!!checked[i]}
                aria-label={item}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggle(i)}
                id={`bucket-item-${i + 1}`}
              >
                <motion.div
                  className={`bucket-checkbox ${checked[i] ? 'checked' : ''}`}
                  animate={checked[i] ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {checked[i] && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
                <p className={`bucket-item-text ${checked[i] ? 'checked' : ''}`}>
                  {item}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {checkedCount === BUCKET_LIST.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center mt-4"
            style={{ borderColor: 'rgba(232, 99, 122, 0.3)' }}
          >
            <p className="heading" style={{ fontSize: '1.2rem' }}>
              All of them. ❤️
            </p>
            <p className="body-text mt-2">
              Now we just need to actually do them all.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
