import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { QUIZ_QUESTIONS } from '../../data/days';

export default function Day5() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[current];

  const handleSelect = (optionIdx) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    const isCorrect = optionIdx === q.correct;
    if (isCorrect) setScore(s => s + 1);
  };

  const next = () => {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const retry = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={5} />
      <div className="orb orb-1" aria-hidden="true" />

      <div className="page-content z-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 05 — DAY FIVE
          </p>
          <h1 className="heading mb-2">How Well Do You Know Me?</h1>
          <p className="subheading">5 questions. Be honest. 😂</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={`q-${current}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              {/* Progress */}
              <div className="flex gap-1 mb-3">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '3px',
                      borderRadius: '2px',
                      background: i < current
                        ? 'var(--rose)'
                        : i === current
                        ? 'rgba(232, 99, 122, 0.5)'
                        : 'var(--border)',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>

              <p className="mono dim mb-2" style={{ fontSize: '0.75rem' }}>
                Question {current + 1} of {QUIZ_QUESTIONS.length}
              </p>

              <div className="card mb-3" style={{ padding: '1.25rem 1.35rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
                    color: 'var(--white)',
                    lineHeight: 1.45,
                  }}
                >
                  {q.question}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correct;
                  const isSelected = selected === i;
                  const showResult = selected !== null;

                  let className = 'quiz-option';
                  if (showResult && isCorrect) className += ' correct';
                  else if (showResult && isSelected && !isCorrect) className += ' wrong';

                  return (
                    <motion.button
                      key={i}
                      className={className}
                      onClick={() => handleSelect(i)}
                      whileTap={{ scale: 0.98 }}
                      id={`quiz-option-${current}-${i}`}
                      aria-label={`Option: ${opt}`}
                    >
                      <span className="mono" style={{ marginRight: '0.75rem', fontSize: '0.75rem', opacity: 0.5, flexShrink: 0 }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {showResult && isCorrect && <span style={{ marginLeft: '0.5rem', flexShrink: 0 }}>✓</span>}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card mt-3"
                    style={{ borderColor: 'rgba(232, 99, 122, 0.25)', padding: '1.15rem 1.25rem' }}
                  >
                    <p className="body-text" style={{ fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {q.funnyExplain}
                    </p>
                    <button
                      className="btn-primary btn mt-3"
                      onClick={next}
                      id={`quiz-next-${current}`}
                      style={{ width: '100%', minHeight: '48px' }}
                    >
                      {current < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results →'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card text-center"
              style={{ padding: '2.5rem 1.5rem' }}
            >
              <div className="animate-heartbeat" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {score === 5 ? '🥹' : score >= 3 ? '😊' : '😅'}
              </div>
              <p
                className="heading mb-2"
                style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.85rem)' }}
              >
                Score: {score}/{QUIZ_QUESTIONS.length}
              </p>

              {score === 5 && (
                <p className="body-text mb-4">
                  Okay fine...<br />
                  <span className="rose">You know me too well. ❤️</span>
                </p>
              )}
              {score >= 3 && score < 5 && (
                <p className="body-text mb-4">
                  Pretty good!<br />
                  <span className="rose">You're paying attention. I like that.</span>
                </p>
              )}
              {score < 3 && (
                <p className="body-text mb-4">
                  Hmm...<br />
                  <span className="rose">We need to talk more. 😭❤️</span>
                </p>
              )}

              <button
                className="btn"
                onClick={retry}
                id="quiz-retry-btn"
                style={{ minHeight: '48px', padding: '0.85rem 2rem' }}
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
