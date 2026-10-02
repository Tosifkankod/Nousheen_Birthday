import { motion } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { IF_WE_WERE } from '../../data/days';

export default function Day9() {
  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={9} />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 09 — DAY NINE
          </p>
          <h1 className="heading mb-2">If We Were...</h1>
          <p className="subheading">My actual answers.</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {IF_WE_WERE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card"
              style={{ borderColor: 'rgba(232, 99, 122, 0.15)', padding: '1.15rem 1.25rem' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '1.35rem' }}>{item.emoji}</span>
                <p className="mono dim" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                  IF WE WERE {item.category.toUpperCase()}...
                </p>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-elegant)',
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  color: 'var(--white)',
                  lineHeight: 1.55,
                  paddingLeft: '0.25rem',
                }}
              >
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-5"
        >
          <p className="subheading" style={{ fontSize: '0.95rem' }}>
            Whatever we are, I like it. ❤️
          </p>
        </motion.div>
      </div>
    </div>
  );
}
