import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';

const QUESTIONS = [
  {
    id: 1,
    question: "Where would we rather go?",
    options: [
      { id: 'night_drive', icon: '🌙', text: 'Late night drive' },
      { id: 'sunrise', icon: '🌅', text: 'Sunrise together' },
    ],
    tosifChoiceId: 'sunrise',
    matchComment: "Okay... we're starting well. ❤️",
    diffComment: "Looks like we have something to argue about. 😂 (Though watching sunrise with you is pure magic 🌅)",
  },
  {
    id: 2,
    question: "What's more us?",
    options: [
      { id: 'laughing', icon: '😂', text: 'Laughing at something stupid' },
      { id: 'quiet', icon: '❤️', text: 'Sitting quietly together' },
    ],
    tosifChoiceId: 'quiet',
    matchComment: "That comfortable, peaceful silence with you is my absolute favorite place. ❤️",
    diffComment: "Looks like we have something to argue about. 😂 (Though your laugh is literally music to my ears!)",
  },
  {
    id: 3,
    question: "What would I choose?",
    options: [
      { id: 'food', icon: '🍕', text: 'Good food' },
      { id: 'convo', icon: '☕', text: 'A long conversation' },
    ],
    tosifChoiceId: 'convo',
    matchComment: "You know me so well. Getting lost in hours of talking to you beats everything. ☕",
    diffComment: "Food is tempting, but a deep 2 AM talk with you wins every single time. ☕❤️",
  },
  {
    id: 4,
    question: "What's something I'd probably remember?",
    options: [
      { id: 'photo', icon: '📸', text: 'A photograph' },
      { id: 'words', icon: '💬', text: 'Something you said' },
    ],
    tosifChoiceId: 'words',
    matchComment: "Always. Every sentence, every tone, every whisper of yours lives in my heart. 💬",
    diffComment: "Photos capture moments, but things you say to me remain etched in my soul forever. 💬✨",
  },
  {
    id: 5,
    question: "If we had one completely free day?",
    options: [
      { id: 'random', icon: '✈️', text: 'Go somewhere random' },
      { id: 'stay', icon: '🏠', text: 'Stay together all day' },
    ],
    tosifChoiceId: 'stay',
    matchComment: "Just you, me, and the world locked outside. Nothing better. 🏠❤️",
    diffComment: "Exploring the world is great, but as long as I have you next to me, home is anywhere. 🏠",
  },
];

const ANALYZE_MESSAGES = [
  "Checking your answers...",
  "Comparing our choices...",
  "Looking for similarities...",
  "Almost there...",
  "Okay... I think I know something.",
];

export default function Day2() {
  const navigate = useNavigate();

  // Screen states: 'intro' | 'questions' | 'analyzing' | 'compare' | 'transition' | 'letter' | 'final'
  const [screen, setScreen] = useState('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzeMsgIndex, setAnalyzeMsgIndex] = useState(0);
  const [compareIndex, setCompareIndex] = useState(0);
  const [finalAnswered, setFinalAnswered] = useState(null);

  // Mark completion in localStorage
  useEffect(() => {
    if (finalAnswered) {
      try {
        localStorage.setItem('day2_completed', 'true');
        localStorage.setItem('day2_final_choice', finalAnswered);
      } catch (e) {
        // ignore
      }
    }
  }, [finalAnswered]);

  // Handle Question Option Click
  const handleSelectOption = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option.id);
    const updatedAnswers = { ...userAnswers, [currentQIndex]: option };
    setUserAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQIndex < QUESTIONS.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setSelectedOption(null);
        setScreen('analyzing');
      }
    }, 1100);
  };

  // Analyzing screen progress animation
  useEffect(() => {
    if (screen !== 'analyzing') return;

    setAnalyzingProgress(0);
    setAnalyzeMsgIndex(0);

    const progressInterval = setInterval(() => {
      setAnalyzingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 38);

    const msgInterval = setInterval(() => {
      setAnalyzeMsgIndex((prev) => (prev < ANALYZE_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(msgInterval);
    };
  }, [screen]);

  // Restart / Replay experience
  const handleReplay = () => {
    setScreen('intro');
    setCurrentQIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setAnalyzingProgress(0);
    setCompareIndex(0);
    setFinalAnswered(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQ = QUESTIONS[currentQIndex];
  const compareQ = QUESTIONS[compareIndex];
  const herCompareChoice = userAnswers[compareIndex];
  const tosifCompareChoice = compareQ?.options.find((o) => o.id === compareQ.tosifChoiceId);
  const isMatch = herCompareChoice?.id === compareQ?.tosifChoiceId;

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(circle at 50% 15%, #220810 0%, #100306 60%, #070102 100%)',
        paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))',
        paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))',
      }}
    >
      <StarField />
      <DayNav dayNumber={2} />

      {/* Ambient glowing orbs */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(500px, 90vw)',
          height: 'min(500px, 90vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 99, 122, 0.08) 0%, rgba(20, 5, 8, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="page-content z-1"
        style={{
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Subtle Progress Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span
            className="mono"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.25em',
              color: 'rgba(245, 240, 235, 0.45)',
              textTransform: 'uppercase',
            }}
          >
            02 / 14 • OCTOBER 02
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* SCREEN 1: INTRO */}
          {/* ============================================================ */}
          {screen === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 1rem',
                  borderRadius: '100px',
                  background: 'rgba(232, 99, 122, 0.1)',
                  border: '1px solid rgba(232, 99, 122, 0.25)',
                  marginBottom: '2rem',
                }}
              >
                <span style={{ fontSize: '0.8rem' }}>✨</span>
                <span className="mono rose" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                  DAY 02
                </span>
              </motion.div>

              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.35,
                  color: 'var(--white)',
                  marginBottom: '2.5rem',
                  letterSpacing: '-0.01em',
                }}
              >
                "I have a little game for you, Nousheen."
              </h1>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '3rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                    color: 'rgba(245, 240, 235, 0.65)',
                  }}
                >
                  But there's one rule...
                </p>
                <p
                  style={{
                    fontSize: '1.05rem',
                    color: 'rgba(245, 240, 235, 0.85)',
                    fontWeight: 400,
                  }}
                >
                  Don't think too much.
                </p>
                <p
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--rose-light)',
                    fontWeight: 500,
                  }}
                >
                  Choose what feels right. ❤️
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(232, 99, 122, 0.45)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setScreen('questions')}
                style={{
                  background: 'linear-gradient(135deg, #e8637a, #b33951)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '100px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(232, 99, 122, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                BEGIN
              </motion.button>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 2: INTERACTIVE QUESTIONS */}
          {/* ============================================================ */}
          {screen === 'questions' && (
            <motion.div
              key={`q-${currentQIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Question progress */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  marginBottom: '2rem',
                }}
              >
                {QUESTIONS.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: idx === currentQIndex ? '28px' : '8px',
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor:
                        idx === currentQIndex
                          ? 'var(--rose)'
                          : idx < currentQIndex
                          ? 'rgba(232, 99, 122, 0.4)'
                          : 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>

              <span
                className="mono rose mb-2"
                style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
              >
                QUESTION {currentQIndex + 1} OF 5
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                  fontWeight: 400,
                  textAlign: 'center',
                  color: 'var(--white)',
                  marginBottom: '2.5rem',
                  lineHeight: 1.35,
                }}
              >
                "{currentQ.question}"
              </h2>

              {/* Two Option Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  width: '100%',
                  marginBottom: '2rem',
                }}
              >
                {currentQ.options.map((opt) => {
                  const isChosen = selectedOption === opt.id;
                  const isOther = selectedOption !== null && !isChosen;

                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      whileHover={selectedOption === null ? { scale: 1.02, y: -4 } : {}}
                      whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                      animate={{
                        opacity: isOther ? 0.35 : 1,
                        scale: isChosen ? 1.03 : 1,
                        borderColor: isChosen
                          ? 'rgba(232, 99, 122, 0.9)'
                          : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: isChosen
                          ? '0 0 30px rgba(232, 99, 122, 0.35)'
                          : '0 4px 20px rgba(0, 0, 0, 0.25)',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: isChosen
                          ? 'linear-gradient(160deg, rgba(232, 99, 122, 0.22), rgba(30, 8, 14, 0.85))'
                          : 'rgba(22, 10, 15, 0.65)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '2.2rem 1.5rem',
                        textAlign: 'center',
                        cursor: selectedOption === null ? 'pointer' : 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{opt.icon}</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.15rem',
                          color: isChosen ? '#ffffff' : 'var(--white)',
                          fontWeight: 500,
                        }}
                      >
                        {opt.text}
                      </span>
                      {isChosen && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            fontSize: '0.9rem',
                          }}
                        >
                          ✨
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Dynamic feedback message after selection */}
              <div style={{ minHeight: '32px', textAlign: 'center' }}>
                <AnimatePresence>
                  {selectedOption && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mono"
                      style={{
                        color: 'var(--rose-light)',
                        fontSize: '0.88rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Interesting choice... 👀
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 3: ANALYZING */}
          {/* ============================================================ */}
          {screen === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
                  fontWeight: 400,
                  color: 'var(--white)',
                  marginBottom: '2.5rem',
                }}
              >
                Analyzing Nousheen's answers...
              </h2>

              {/* Progress Bar Container */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '100px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1.25rem',
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    width: `${analyzingProgress}%`,
                    background: 'linear-gradient(90deg, #e8637a, #f0899a)',
                    boxShadow: '0 0 15px rgba(232, 99, 122, 0.8)',
                    borderRadius: '100px',
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>

              {/* Percentage */}
              <span
                className="mono rose"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
              >
                {analyzingProgress}%
              </span>

              {/* Rotating Status Messages */}
              <div style={{ minHeight: '40px', marginBottom: '2.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={analyzeMsgIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1rem',
                      color: 'rgba(245, 240, 235, 0.7)',
                    }}
                  >
                    "{ANALYZE_MESSAGES[analyzeMsgIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Reveal Button when ready */}
              <AnimatePresence>
                {analyzingProgress >= 100 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(232, 99, 122, 0.45)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setCompareIndex(0);
                      setScreen('compare');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #e8637a, #b33951)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.95rem 2.8rem',
                      borderRadius: '100px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(232, 99, 122, 0.3)',
                    }}
                  >
                    REVEAL
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 4: OUR ANSWERS */}
          {/* ============================================================ */}
          {screen === 'compare' && (
            <motion.div
              key={`compare-${compareIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                className="mono rose mb-2"
                style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
              >
                COMPARISON {compareIndex + 1} OF 5
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.35rem, 4vw, 1.85rem)',
                  fontWeight: 400,
                  textAlign: 'center',
                  color: 'var(--white)',
                  marginBottom: '2rem',
                }}
              >
                "{compareQ.question}"
              </h2>

              {/* Side-by-side / Stacked answers comparison */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                  width: '100%',
                  marginBottom: '1.75rem',
                }}
              >
                {/* Her Choice */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(232, 99, 122, 0.25)',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.72rem',
                      letterSpacing: '0.15em',
                      color: 'var(--rose-light)',
                      display: 'block',
                      marginBottom: '0.75rem',
                    }}
                  >
                    YOU CHOSE
                  </span>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {herCompareChoice?.icon || '✨'}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.08rem',
                      color: 'var(--white)',
                      fontWeight: 500,
                    }}
                  >
                    {herCompareChoice?.text || '—'}
                  </p>
                </div>

                {/* Tosif's Choice */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: '0.72rem',
                      letterSpacing: '0.15em',
                      color: 'var(--gold)',
                      display: 'block',
                      marginBottom: '0.75rem',
                    }}
                  >
                    I WOULD HAVE CHOSEN
                  </span>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {tosifCompareChoice?.icon || '✨'}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.08rem',
                      color: 'var(--white)',
                      fontWeight: 500,
                    }}
                  >
                    {tosifCompareChoice?.text || '—'}
                  </p>
                </div>
              </div>

              {/* Reaction comment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(22, 9, 14, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '14px',
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  width: '100%',
                  marginBottom: '2rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.98rem',
                    color: isMatch ? 'var(--rose-light)' : 'rgba(245, 240, 235, 0.85)',
                    lineHeight: 1.5,
                  }}
                >
                  {isMatch ? compareQ.matchComment : compareQ.diffComment}
                </p>
              </motion.div>

              {/* Stepper button or completion */}
              {compareIndex < QUESTIONS.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCompareIndex((prev) => prev + 1)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: 'var(--white)',
                    padding: '0.75rem 2rem',
                    borderRadius: '100px',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Next Answer →
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      color: 'var(--white)',
                      lineHeight: 1.6,
                    }}
                  >
                    "Maybe we don't always choose the same thing..."
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: 'var(--rose-light)',
                      fontWeight: 500,
                      lineHeight: 1.6,
                    }}
                  >
                    "But somehow, I still want to choose you."
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(232, 99, 122, 0.45)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setScreen('transition');
                    }}
                    style={{
                      marginTop: '1rem',
                      background: 'linear-gradient(135deg, #e8637a, #b33951)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.95rem 2.8rem',
                      borderRadius: '100px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(232, 99, 122, 0.3)',
                    }}
                  >
                    One last thing...
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 5: EMOTIONAL TRANSITION */}
          {/* ============================================================ */}
          {screen === 'transition' && (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  color: 'rgba(245, 240, 235, 0.6)',
                  fontStyle: 'italic',
                }}
              >
                Okay...
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
                  color: 'var(--white)',
                  lineHeight: 1.4,
                }}
              >
                I have something I actually wanted to tell you.
              </motion.p>

              <div style={{ height: '1.5rem' }} />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                style={{
                  fontSize: '1.1rem',
                  color: 'rgba(245, 240, 235, 0.8)',
                }}
              >
                Forget the game for a second.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.1, duration: 0.8 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.2rem',
                  color: 'var(--rose-light)',
                }}
              >
                Just read this.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.0, duration: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setScreen('letter');
                }}
                style={{
                  marginTop: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(232, 99, 122, 0.4)',
                  color: 'var(--white)',
                  padding: '0.85rem 2.5rem',
                  borderRadius: '100px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Continue 🤍
              </motion.button>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 6: THE MESSAGE */}
          {/* ============================================================ */}
          {screen === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                padding: '1rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Top delicate header */}
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span
                  className="mono rose"
                  style={{ fontSize: '0.72rem', letterSpacing: '0.2em' }}
                >
                  FROM TOSIF, WITH ALL MY HEART
                </span>
                <div
                  style={{
                    width: '30px',
                    height: '1px',
                    background: 'var(--rose-dim)',
                    margin: '0.75rem auto 0',
                  }}
                />
              </div>

              {/* Letter Content Container */}
              <div
                style={{
                  background: 'rgba(18, 6, 11, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(232, 99, 122, 0.2)',
                  borderRadius: '24px',
                  padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)',
                  width: '100%',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* NIKKAH PROMISE SECTION */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{
                    margin: '0.5rem 0 2rem',
                    padding: '2.5rem 1.5rem',
                    borderRadius: '20px',
                    background: 'radial-gradient(circle at 50% 50%, rgba(232, 99, 122, 0.14) 0%, rgba(15, 3, 7, 0.6) 100%)',
                    border: '1px solid rgba(232, 99, 122, 0.35)',
                    boxShadow: '0 0 40px rgba(232, 99, 122, 0.12)',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.25rem, 4vw, 1.65rem)',
                      lineHeight: 1.6,
                      color: 'var(--white)',
                      marginBottom: '1.25rem',
                      fontWeight: 400,
                    }}
                  >
                    "Tum bas nikkah tak mera saath de do,
                    <br />
                    Nousheen...
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.3rem, 4.2vw, 1.75rem)',
                      lineHeight: 1.6,
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 0 20px rgba(232, 99, 122, 0.5)',
                    }}
                  >
                    Phir Qayamat tak tumhara saath nibhaane ki
                    <br />
                    zimmedari meri. 🤍 "
                  </p>
                </motion.div>

                <div
                  style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    margin: '2rem 0 1.75rem',
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)',
                    color: 'var(--rose-light)',
                    fontWeight: 500,
                    marginBottom: '0.85rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                  }}
                >
                  I love you so, so, so much, meri Nousheen.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  style={{
                    fontSize: '1.02rem',
                    lineHeight: 1.8,
                    color: 'rgba(245, 240, 235, 0.95)',
                    textAlign: 'center',
                  }}
                >
                  Tum meri aaj ki mohabbat hi nahi, meri aane wale kal ki sabse pyaari khwahish ho. 🫶🏻
                </motion.p>
              </div>

              {/* Transition to Final Question */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ textAlign: 'center', marginTop: '2.5rem' }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(232, 99, 122, 0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setScreen('final');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #e8637a, #b33951)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.95rem 2.8rem',
                    borderRadius: '100px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(232, 99, 122, 0.3)',
                  }}
                >
                  Ek aakhri sawal... 🥺✨
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 7: FINAL QUESTION */}
          {/* ============================================================ */}
          {screen === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {!finalAnswered ? (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.25rem',
                      color: 'var(--rose-light)',
                      marginBottom: '2rem',
                    }}
                  >
                    "Bas ek baat poochun, Nousheen? 🥺"
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.4rem, 4.2vw, 1.9rem)',
                      color: 'var(--white)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                    }}
                  >
                    "Kya tum mera haath aise hi thaame rakhogi..."
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.4rem, 4.2vw, 1.9rem)',
                      color: '#ffffff',
                      fontWeight: 600,
                      lineHeight: 1.5,
                      marginBottom: '3rem',
                      textShadow: '0 0 25px rgba(232, 99, 122, 0.4)',
                    }}
                  >
                    "jab tak Allah humein nikkah ke bandhan mein baandh de?"
                  </motion.p>

                  {/* Two Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.2, duration: 0.6 }}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      justifyContent: 'center',
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(232, 99, 122, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFinalAnswered('haan')}
                      style={{
                        background: 'linear-gradient(135deg, #e8637a, #c03853)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '1.1rem 2.8rem',
                        borderRadius: '100px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        boxShadow: '0 4px 25px rgba(232, 99, 122, 0.35)',
                      }}
                    >
                      HAAN ❤️
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFinalAnswered('bilkul')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        padding: '1.1rem 2.8rem',
                        borderRadius: '100px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                      }}
                    >
                      Bilkul. 🤍
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                /* Post-Answer Beautiful Outro */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1.5rem 0',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ fontSize: '3rem', marginBottom: '0.5rem' }}
                  >
                    💍🤍✨
                  </motion.div>

                  <div
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      border: '1px solid rgba(232, 99, 122, 0.3)',
                      borderRadius: '100px',
                      padding: '0.4rem 1.25rem',
                    }}
                  >
                    <span
                      className="mono rose"
                      style={{ fontSize: '0.78rem', letterSpacing: '0.2em' }}
                    >
                      DAY 02 COMPLETE
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)',
                      color: 'var(--white)',
                      fontWeight: 400,
                      marginTop: '0.5rem',
                    }}
                  >
                    "Kal phir milna, Nousheen. ❤️"
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.15rem',
                      color: 'var(--rose-light)',
                    }}
                  >
                    — Tosif
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginTop: '2rem',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      onClick={handleReplay}
                      className="btn"
                      style={{
                        padding: '0.65rem 1.5rem',
                        fontSize: '0.85rem',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--white-dim)',
                        cursor: 'pointer',
                      }}
                    >
                      ↺ Replay Experience
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      className="btn"
                      style={{
                        padding: '0.65rem 1.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '100px',
                        background: 'rgba(232, 99, 122, 0.2)',
                        border: '1px solid rgba(232, 99, 122, 0.4)',
                        color: 'var(--white)',
                        cursor: 'pointer',
                      }}
                    >
                      Back to Home →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
