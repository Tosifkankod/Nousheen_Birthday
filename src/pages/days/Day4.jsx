import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { DAY4_SCENES } from '../../data/day4Questions';
import { getOrCreateSessionId, markSessionCompleted } from '../../utils/session';
import { saveResponse, getCurrentSessionAnswers, syncPendingResponses } from '../../services/responseService';

export default function Day4() {
  const navigate = useNavigate();

  // Active Session & Progression
  const [sessionId, setSessionId] = useState('');
  const [sceneIndex, setSceneIndex] = useState(0);

  // Selected Answers Map (keyed by questionId)
  const [answers, setAnswers] = useState({});

  // Active feedback for the current scene
  const [currentFeedback, setCurrentFeedback] = useState(null);

  // Custom text for office message (scene 6)
  const [customOfficeText, setCustomOfficeText] = useState('');
  const [showCustomOfficeInput, setShowCustomOfficeInput] = useState(false);

  // Afternoon Call Simulation State
  const [callState, setCallState] = useState('incoming'); // 'incoming' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState('00:01');
  const [isFastForwardingCall, setIsFastForwardingCall] = useState(false);

  // Final Memory Input
  const [memoryInput, setMemoryInput] = useState('');
  const [isMemorySaved, setIsMemorySaved] = useState(false);

  // Commute Chat Animation Step
  const [chatStep, setChatStep] = useState(0);

  // Initialize session and restore any previous answers
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);

    const savedAnswers = getCurrentSessionAnswers();
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      setAnswers(savedAnswers);
      if (savedAnswers.her_perfect_day_addition?.customText) {
        setMemoryInput(savedAnswers.her_perfect_day_addition.customText);
        setIsMemorySaved(true);
      }
    }
  }, []);

  // Scroll to top on scene change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentFeedback(null);
  }, [sceneIndex]);

  // Commute chat step sequence
  useEffect(() => {
    if (sceneIndex === 5) {
      setChatStep(0);
      const timers = [
        setTimeout(() => setChatStep(1), 600),
        setTimeout(() => setChatStep(2), 1600),
        setTimeout(() => setChatStep(3), 2700),
        setTimeout(() => setChatStep(4), 3800),
        setTimeout(() => setChatStep(5), 4900),
        setTimeout(() => setChatStep(6), 6100),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [sceneIndex]);

  // Call timer effect
  useEffect(() => {
    let interval;
    if (sceneIndex === 7 && callState === 'connected' && !isFastForwardingCall) {
      let seconds = 1;
      interval = setInterval(() => {
        seconds += 1;
        const str = seconds < 10 ? `00:0${seconds}` : `00:${seconds}`;
        setCallDuration(str);
        if (seconds >= 6) clearInterval(interval);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sceneIndex, callState, isFastForwardingCall]);

  // Generic Choice Selection Handler
  const handleSelectOption = async (scene, option, customText = '') => {
    const questionId = scene.questionId;
    const questionText = scene.question;

    // Update local answers state
    const answerObj = {
      sessionId,
      day: 4,
      questionId,
      question: questionText,
      optionId: option.id,
      answer: option.label,
      customText,
      timestamp: new Date().toISOString(),
    };

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerObj,
    }));

    setCurrentFeedback(option.response);

    // Save locally and sync to Google Sheets asynchronously
    saveResponse(answerObj);
  };

  // Fast-forward afternoon call
  const handleCallDurationChoice = (scene, option) => {
    handleSelectOption(scene, option);
    setIsFastForwardingCall(true);

    const times = ['00:06', '00:14', '00:22', '00:30'];
    times.forEach((t, idx) => {
      setTimeout(() => {
        setCallDuration(t);
        if (idx === times.length - 1) {
          setCallState('ended');
        }
      }, (idx + 1) * 300);
    });
  };

  // Save Final Custom Memory
  const handleSaveMemory = async (e) => {
    e?.preventDefault();
    if (!memoryInput.trim()) return;

    const memoryObj = {
      sessionId,
      day: 4,
      questionId: 'her_perfect_day_addition',
      question: 'If you could add one thing to our perfect day... What would my bachaa add?',
      optionId: 'custom_memory_text',
      answer: 'Custom Memory Submitted',
      customText: memoryInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setAnswers((prev) => ({
      ...prev,
      her_perfect_day_addition: memoryObj,
    }));

    setIsMemorySaved(true);
    markSessionCompleted();

    await saveResponse(memoryObj);
    syncPendingResponses();

    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#e8637a', '#c9a96e', '#ffffff'],
      });
    } catch (_) {}

    setTimeout(() => {
      setSceneIndex(15); // Advance to Final Ending
    }, 1200);
  };

  const currentScene = DAY4_SCENES[sceneIndex] || DAY4_SCENES[0];

  // Dynamic Ambient Lighting per scene
  const getAmbientStyle = () => {
    switch (sceneIndex) {
      case 0:
        return {
          background: '#060608',
          orb1: 'rgba(232, 99, 122, 0.05)',
          orb2: 'rgba(201, 169, 110, 0.04)',
        };
      case 1: // 08:00 AM Sunrise
        return {
          background: 'radial-gradient(ellipse at 50% 100%, #1e111a 0%, #0c0910 60%, #060508 100%)',
          orb1: 'rgba(245, 158, 11, 0.18)',
          orb2: 'rgba(232, 99, 122, 0.16)',
        };
      case 2: // 09:00 AM Morning Chai
        return {
          background: 'radial-gradient(ellipse at 50% 20%, #1c1314 0%, #0e0a0f 65%, #070608 100%)',
          orb1: 'rgba(245, 158, 11, 0.16)',
          orb2: 'rgba(201, 169, 110, 0.14)',
        };
      case 3: // 10:00 AM Getting Ready
        return {
          background: 'radial-gradient(circle at 50% 30%, #16151c 0%, #0c0c12 70%, #07070a 100%)',
          orb1: 'rgba(232, 99, 122, 0.12)',
          orb2: 'rgba(168, 85, 247, 0.08)',
        };
      case 4: // 11:00 AM Departure
        return {
          background: 'radial-gradient(circle at 50% 50%, #14161f 0%, #090b10 70%, #050608 100%)',
          orb1: 'rgba(232, 99, 122, 0.14)',
          orb2: 'rgba(56, 189, 248, 0.08)',
        };
      case 5: // 11:30 AM Commute
        return {
          background: 'radial-gradient(ellipse at 50% 40%, #101622 0%, #080b12 70%, #040608 100%)',
          orb1: 'rgba(56, 189, 248, 0.14)',
          orb2: 'rgba(232, 99, 122, 0.1)',
        };
      case 6: // 12:30 PM Office
        return {
          background: 'radial-gradient(circle at 50% 20%, #111822 0%, #0a0e14 70%, #05070a 100%)',
          orb1: 'rgba(56, 189, 248, 0.1)',
          orb2: 'rgba(232, 99, 122, 0.12)',
        };
      case 7: // 02:30 PM Afternoon Call
        return {
          background: 'radial-gradient(circle at 50% 40%, #181220 0%, #0c0912 70%, #060408 100%)',
          orb1: 'rgba(74, 222, 128, 0.12)',
          orb2: 'rgba(232, 99, 122, 0.15)',
        };
      case 8: // 06:30 PM Evening Golden Sunset
        return {
          background: 'radial-gradient(ellipse at 50% 60%, #281218 0%, #150912 60%, #070509 100%)',
          orb1: 'rgba(232, 99, 122, 0.22)',
          orb2: 'rgba(245, 158, 11, 0.18)',
        };
      case 9: // 07:30 PM Date
        return {
          background: 'radial-gradient(circle at 50% 40%, #201017 0%, #10080e 65%, #070407 100%)',
          orb1: 'rgba(232, 99, 122, 0.2)',
          orb2: 'rgba(201, 169, 110, 0.15)',
        };
      case 10: // 09:30 PM Quiet Moment
        return {
          background: 'radial-gradient(circle at 50% 30%, #0c101c 0%, #060810 70%, #030407 100%)',
          orb1: 'rgba(99, 102, 241, 0.14)',
          orb2: 'rgba(232, 99, 122, 0.08)',
        };
      case 11: // 11:30 PM Late Night
        return {
          background: 'radial-gradient(circle at 50% 50%, #180d14 0%, #0e070c 70%, #050305 100%)',
          orb1: 'rgba(232, 99, 122, 0.14)',
          orb2: 'rgba(201, 169, 110, 0.12)',
        };
      case 12: // 12:47 AM Goodnight
        return {
          background: 'radial-gradient(ellipse at 50% 50%, #120916 0%, #09050d 70%, #040307 100%)',
          orb1: 'rgba(232, 99, 122, 0.18)',
          orb2: 'rgba(168, 85, 247, 0.14)',
        };
      default:
        return {
          background: '#070709',
          orb1: 'rgba(232, 99, 122, 0.12)',
          orb2: 'rgba(201, 169, 110, 0.1)',
        };
    }
  };

  const ambient = getAmbientStyle();

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        background: ambient.background,
        transition: 'background 1s ease-in-out',
        paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))',
        paddingBottom: 'max(3.5rem, calc(env(safe-area-inset-bottom) + 2.5rem))',
      }}
    >
      <StarField />
      <DayNav dayNumber={4} />

      {/* Ambient background glow orbs */}
      <div
        className="orb orb-1"
        style={{ background: ambient.orb1, transition: 'background 1s ease-in-out' }}
        aria-hidden="true"
      />
      <div
        className="orb orb-2"
        style={{ background: ambient.orb2, transition: 'background 1s ease-in-out' }}
        aria-hidden="true"
      />

      {/* Subtle Time Capsule Pill */}
      <AnimatePresence mode="wait">
        {currentScene.time && (
          <motion.div
            key={currentScene.time}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center gap-2 mb-4 z-1"
            style={{ position: 'relative' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.95rem',
                background: 'rgba(20, 20, 26, 0.8)',
                border: '1px solid rgba(232, 99, 122, 0.25)',
                borderRadius: '30px',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>⏱️</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  color: 'var(--rose-light)',
                  fontWeight: 600,
                }}
              >
                {currentScene.time}
              </span>
              <span
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.4)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '0.82rem',
                  color: 'var(--white-dim)',
                }}
              >
                {currentScene.subtitle}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-content z-1" style={{ maxWidth: '580px' }}>
        <AnimatePresence mode="wait">
          {/* ================================================================ */}
          {/* SCENE 0: OPENING                                                */}
          {/* ================================================================ */}
          {sceneIndex === 0 && (
            <motion.div
              key="scene-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center"
              style={{ padding: '2rem 0' }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-3"
              >
                <p className="mono dim" style={{ letterSpacing: '0.28em', fontSize: '0.78rem', color: 'var(--rose-light)' }}>
                  DAY 04
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: 'var(--gold)',
                    marginTop: '0.25rem',
                  }}
                >
                  نوشين • One Perfect Day With You
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8 }}
                className="mb-4"
              >
                <p
                  className="heading mb-2"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)',
                    lineHeight: 1.4,
                    color: 'var(--white)',
                  }}
                >
                  "I know we're far away..."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.8 }}
                className="mb-5"
              >
                <p className="subheading mb-2" style={{ fontSize: '1.25rem', color: 'var(--white-dim)' }}>
                  But today...
                </p>
                <p
                  className="display-italic"
                  style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
                    color: 'var(--rose-light)',
                    textShadow: '0 0 25px rgba(232, 99, 122, 0.4)',
                  }}
                >
                  "I want to imagine something."
                </p>
              </motion.div>

              {/* Sunrise Glow Transition Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: 3.0 }}
                className="card text-center mb-5"
                style={{
                  background: 'linear-gradient(180deg, rgba(232, 99, 122, 0.12) 0%, rgba(201, 169, 110, 0.08) 100%)',
                  borderColor: 'rgba(232, 99, 122, 0.3)',
                  padding: '1.85rem 1.5rem',
                  boxShadow: '0 12px 40px rgba(232, 99, 122, 0.15)',
                }}
              >
                <p className="body-text mb-2" style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--white)' }}>
                  What if I could spend one ordinary day with you?
                </p>
                <p className="heading mb-4" style={{ fontSize: 'clamp(1.2rem, 3.8vw, 1.55rem)', color: 'var(--gold)' }}>
                  Will you spend it with me, meri jaan?
                </p>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSceneIndex(1)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.9rem 2.2rem',
                    fontSize: '1.02rem',
                    fontWeight: 600,
                    boxShadow: '0 6px 24px rgba(232, 99, 122, 0.4)',
                    letterSpacing: '0.04em',
                  }}
                  id="btn-start-our-day"
                >
                  START OUR DAY ❤️
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 1: 08:00 AM — WAKE UP                                     */}
          {/* ================================================================ */}
          {sceneIndex === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  🌅🛏️
                </span>
                <h2 className="heading mb-1" style={{ fontSize: '1.45rem', color: 'var(--white)' }}>
                  Good morning, bachaa.
                </h2>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                  "I imagine waking up and the first thing I hear is you complaining that you're still sleepy."
                </p>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(2)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-1-next"
                  >
                    Go make morning chai ☕ →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 2: 09:00 AM — MORNING CHAI                                */}
          {/* ================================================================ */}
          {sceneIndex === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div className="animate-steam-1" style={{ fontSize: '1rem', position: 'absolute', top: '-14px', left: '6px' }}>
                      ☁️
                    </div>
                    <span style={{ fontSize: '2.4rem' }}>☕</span>
                  </div>
                  <span style={{ color: 'var(--rose-light)', fontSize: '1.2rem' }}>&</span>
                  <div style={{ position: 'relative' }}>
                    <div className="animate-steam-2" style={{ fontSize: '1rem', position: 'absolute', top: '-14px', left: '6px' }}>
                      ☁️
                    </div>
                    <span style={{ fontSize: '2.4rem' }}>🫖</span>
                  </div>
                </div>

                <h2 className="heading mb-1" style={{ fontSize: '1.45rem' }}>
                  Chai time with my pari.
                </h2>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                  Two steaming cups of chai, sitting across from each other.
                </p>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(201, 169, 110, 0.1)',
                      borderColor: 'rgba(201, 169, 110, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--gold)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(3)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-2-next"
                  >
                    Time to get ready 👗 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 3: 10:00 AM — GETTING READY (MODEST OUTFIT)                */}
          {/* ================================================================ */}
          {sceneIndex === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-3">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.5rem 0 1rem 0',
                  }}
                >
                  <div
                    className="card text-center"
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.03)',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>👦</span>
                    <p className="mono mt-1" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                      TOSIF
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--white-dimmer)' }}>Getting ready for work</p>
                  </div>
                  <span style={{ color: 'var(--rose-light)', fontSize: '1.2rem' }}>↔</span>
                  <div
                    className="card text-center"
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderColor: 'rgba(232, 99, 122, 0.3)',
                      background: 'rgba(232, 99, 122, 0.08)',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🧕</span>
                    <p className="mono mt-1" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--rose-light)' }}>
                      NOUSHEEN
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--rose-light)' }}>Modest & Beautiful</p>
                  </div>
                </div>

                <h2 className="heading mb-1" style={{ fontSize: '1.4rem', color: 'var(--white)' }}>
                  Getting ready for the day.
                </h2>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600 }}>{opt.label}</p>
                        {opt.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--white-dim)' }}>
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(4)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-3-next"
                  >
                    Say goodbye before office 🚪 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 4: 11:00 AM — BEFORE LEAVING FOR OFFICE                    */}
          {/* ================================================================ */}
          {sceneIndex === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  🚪🔑
                </span>
                <p className="heading mb-1" style={{ fontSize: '1.4rem', color: 'var(--white)' }}>
                  "I have to go to office now..."
                </p>
                <p className="subheading mb-3" style={{ fontSize: '1.15rem', color: 'var(--rose-light)' }}>
                  Standing at the door looking at you.
                </p>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(5)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-4-next"
                  >
                    Commute to office 🚗 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 5: 11:30 AM — COMMUTE CHAT                                */}
          {/* ================================================================ */}
          {sceneIndex === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-3">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>🚗</span>
                  <span className="mono" style={{ fontSize: '0.78rem', color: '#7dd3fc' }}>
                    On the way to office...
                  </span>
                </div>
              </div>

              {/* Chat Simulation Box */}
              <div
                className="card mb-4"
                style={{
                  background: 'rgba(12, 16, 24, 0.85)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  minHeight: '230px',
                }}
              >
                {chatStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{ alignSelf: 'flex-end', maxWidth: '80%' }}
                  >
                    <div
                      style={{
                        background: 'rgba(232, 99, 122, 0.25)',
                        border: '1px solid rgba(232, 99, 122, 0.4)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '14px 14px 4px 14px',
                        color: 'var(--white)',
                        fontSize: '0.92rem',
                      }}
                    >
                      Reached?
                    </div>
                  </motion.div>
                )}

                {chatStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{ alignSelf: 'flex-start', maxWidth: '80%' }}
                  >
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '14px 14px 14px 4px',
                        color: 'var(--white)',
                        fontSize: '0.92rem',
                      }}
                    >
                      Not yet.
                    </div>
                  </motion.div>
                )}

                {chatStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{ alignSelf: 'flex-end', maxWidth: '80%' }}
                  >
                    <div
                      style={{
                        background: 'rgba(232, 99, 122, 0.25)',
                        border: '1px solid rgba(232, 99, 122, 0.4)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '14px 14px 4px 14px',
                        color: 'var(--white)',
                        fontSize: '0.92rem',
                      }}
                    >
                      Did you eat?
                    </div>
                  </motion.div>
                )}

                {chatStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{ alignSelf: 'flex-start', maxWidth: '80%' }}
                  >
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '14px 14px 14px 4px',
                        color: 'var(--white)',
                        fontSize: '0.92rem',
                      }}
                    >
                      Are you my mother? 😂
                    </div>
                  </motion.div>
                )}

                {chatStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 15, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{ alignSelf: 'flex-end', maxWidth: '80%' }}
                  >
                    <div
                      style={{
                        background: 'rgba(232, 99, 122, 0.25)',
                        border: '1px solid rgba(232, 99, 122, 0.4)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '14px 14px 4px 14px',
                        color: 'var(--white)',
                        fontSize: '0.92rem',
                      }}
                    >
                      No. I'm your annoying person. ❤️
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Question */}
              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(6)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-5-next"
                  >
                    Enter office 🏢 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 6: 12:30 PM — OFFICE                                       */}
          {/* ================================================================ */}
          {sceneIndex === 6 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-3">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  💼💻
                </span>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                  "I have work... but somehow my brain keeps coming back to you."
                </p>
              </div>

              {/* Notification Banner */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="card mb-4"
                style={{
                  background: 'rgba(232, 99, 122, 0.12)',
                  borderColor: 'rgba(232, 99, 122, 0.4)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--rose)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  📱
                </div>
                <div style={{ flex: 1 }}>
                  <p className="heading" style={{ fontSize: '0.92rem', color: 'var(--white)' }}>
                    Nousheen ❤️
                  </p>
                  <p className="body-text" style={{ fontSize: '0.82rem', color: 'var(--white-dim)' }}>
                    "Thinking of Tosif..."
                  </p>
                </div>
                <span className="mono dim" style={{ fontSize: '0.7rem' }}>
                  now
                </span>
              </motion.div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (opt.id === 'custom_message') {
                          setShowCustomOfficeInput(true);
                        } else {
                          setShowCustomOfficeInput(false);
                          handleSelectOption(currentScene, opt);
                        }
                      }}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Office Message Textarea */}
              {showCustomOfficeInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card mb-4"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderColor: 'rgba(232, 99, 122, 0.4)',
                    padding: '1rem',
                  }}
                >
                  <p className="mono dim mb-2" style={{ fontSize: '0.78rem', color: 'var(--rose-light)' }}>
                    Write the message you'd actually send Tosif:
                  </p>
                  <textarea
                    value={customOfficeText}
                    onChange={(e) => setCustomOfficeText(e.target.value)}
                    placeholder="Type your message here, bachaa..."
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: 'var(--white)',
                      padding: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      resize: 'none',
                      outline: 'none',
                      marginBottom: '0.75rem',
                    }}
                  />
                  <button
                    disabled={!customOfficeText.trim()}
                    onClick={() => {
                      const customOpt = currentScene.options.find((o) => o.id === 'custom_message');
                      handleSelectOption(currentScene, customOpt, customOfficeText.trim());
                    }}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.88rem' }}
                  >
                    Send Message to Tosif ❤️
                  </button>
                </motion.div>
              )}

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(7)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-6-next"
                  >
                    Fast-forward to 2:30 PM call 📞 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 7: 02:30 PM — AFTERNOON CALL                              */}
          {/* ================================================================ */}
          {sceneIndex === 7 && (
            <motion.div
              key="scene-7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4 text-center"
              style={{ padding: '2rem 1.4rem' }}
            >
              {callState === 'incoming' && (
                <div>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--rose), #f43f5e)',
                      margin: '0 auto 1.25rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      boxShadow: '0 0 35px rgba(232, 99, 122, 0.45)',
                    }}
                  >
                    🧕
                  </div>
                  <h3 className="heading mb-1" style={{ fontSize: '1.4rem', color: 'var(--white)' }}>
                    Nousheen ❤️
                  </h3>
                  <p className="mono dim mb-5" style={{ fontSize: '0.85rem', color: 'var(--rose-light)' }}>
                    Incoming voice call...
                  </p>

                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => setCallState('connected')}
                      className="btn animate-call-pulse"
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        borderRadius: '50px',
                        padding: '0.95rem 2.2rem',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                      }}
                      id="btn-call-answer"
                    >
                      <span>📞</span>
                      <span>ANSWER</span>
                    </button>
                  </div>
                </div>
              )}

              {(callState === 'connected' || callState === 'ended') && (
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.35rem 0.85rem',
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      borderRadius: '20px',
                      marginBottom: '1rem',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                    <span className="mono" style={{ fontSize: '0.82rem', color: '#4ade80' }}>
                      Call Connected • {callDuration}
                    </span>
                  </div>

                  <h3 className="heading mb-3" style={{ fontSize: '1.3rem', color: 'var(--white)' }}>
                    Nousheen ❤️
                  </h3>

                  {/* Simulated Call Transcript */}
                  <div
                    className="card mb-4 text-left"
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    <p className="body-text" style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: 'var(--gold)' }}>Tosif:</strong> "Hi..."
                    </p>
                    <p className="body-text" style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: 'var(--rose-light)' }}>Nousheen:</strong> "Hi..."
                    </p>
                    <p className="body-text" style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: 'var(--gold)' }}>Tosif:</strong> "Why are you smiling?"
                    </p>
                    <p className="body-text" style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: 'var(--rose-light)' }}>Nousheen:</strong> "I don't know."
                    </p>
                    <p className="body-text" style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: 'var(--gold)' }}>Tosif:</strong> "You're lying. 😂❤️"
                    </p>
                  </div>

                  <p className="body-text mb-3" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.95rem' }}>
                    {currentScene.question}
                  </p>

                  <div className="flex flex-col gap-2 mb-4">
                    {currentScene.options.map((opt) => {
                      const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleCallDurationChoice(currentScene, opt)}
                          id={`opt-${opt.id}`}
                        >
                          <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {(currentFeedback || answers[currentScene.questionId]) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card mb-4"
                        style={{
                          background: 'rgba(232, 99, 122, 0.1)',
                          borderColor: 'rgba(232, 99, 122, 0.35)',
                          padding: '1.1rem 1.25rem',
                        }}
                      >
                        <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                          {currentFeedback ||
                            currentScene.options.find((o) => o.id === answers[currentScene.questionId]?.optionId)?.response ||
                            "Thirty minutes with my bachaa would've turned into three hours. I know us. 😂❤️"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {answers[currentScene.questionId] && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-3">
                      <button
                        onClick={() => setSceneIndex(8)}
                        className="btn btn-primary w-full"
                        style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                        id="btn-scene-7-next"
                      >
                        Wrap up work & meet you 🌅 →
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 8: 06:30 PM — EVENING PICKUP                              */}
          {/* ================================================================ */}
          {sceneIndex === 8 && (
            <motion.div
              key="scene-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  🌇
                </span>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                  "Work is done."
                </p>
                <h2 className="heading mt-1 mb-2" style={{ fontSize: '1.45rem', color: 'var(--white)' }}>
                  I pick you up.
                </h2>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <div>
                        <p style={{ fontWeight: 600 }}>{opt.label}</p>
                        {opt.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--white-dim)' }}>
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.15rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(9)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-8-next"
                  >
                    Start our evening date 🕯️ →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 9: 07:30 PM — OUR DATE                                    */}
          {/* ================================================================ */}
          {sceneIndex === 9 && (
            <motion.div
              key="scene-9"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  🕯️🍽️
                </span>
                <h2 className="heading mb-1" style={{ fontSize: '1.45rem', color: 'var(--white)' }}>
                  Our Date
                </h2>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                  Golden candlelight, warmth and laughter.
                </p>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(10)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-9-next"
                  >
                    Find a quiet spot 🌙 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 10: 09:30 PM — THE QUIET MOMENT                            */}
          {/* ================================================================ */}
          {sceneIndex === 10 && (
            <motion.div
              key="scene-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="day4-glass-card p-4 text-center"
              style={{
                padding: '2.2rem 1.5rem',
                background: 'rgba(12, 14, 24, 0.85)',
                borderColor: 'rgba(99, 102, 241, 0.25)',
              }}
            >
              <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '1rem' }}>
                🌌✨
              </span>

              <p className="subheading mb-3" style={{ fontSize: '1.2rem', color: 'var(--white-dim)' }}>
                "No games. No phones. No distractions."
              </p>
              <p className="heading mb-4" style={{ fontSize: '1.35rem', color: 'var(--white)' }}>
                "Just you and me."
              </p>

              <div className="card mb-4" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem' }}>
                <p className="body-text" style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--gold)', lineHeight: 1.6 }}>
                  "After all this distance... You're finally sitting right here."
                </p>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4 text-left">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(11)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-10-next"
                  >
                    Head back home together 🏠 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 11: 11:30 PM — LATE NIGHT                                 */}
          {/* ================================================================ */}
          {sceneIndex === 11 && (
            <motion.div
              key="scene-11"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  🕯️🛋️
                </span>
                <h2 className="heading mb-1" style={{ fontSize: '1.45rem', color: 'var(--white)' }}>
                  Late Night
                </h2>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                  The world is quiet outside.
                </p>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.1)',
                      borderColor: 'rgba(232, 99, 122, 0.35)',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(12)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-11-next"
                  >
                    Time to sleep 🛌 →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 12: 12:47 AM — GOODNIGHT                                  */}
          {/* ================================================================ */}
          {sceneIndex === 12 && (
            <motion.div
              key="scene-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '1.75rem 1.4rem' }}
            >
              <div className="text-center mb-3">
                {/* Glowing Connection Line */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    margin: '1rem 0 1.5rem 0',
                  }}
                >
                  <div
                    className="card text-center"
                    style={{ padding: '0.6rem 0.9rem', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>👦</span>
                    <p className="mono mt-1" style={{ fontSize: '0.72rem', color: 'var(--white)' }}>
                      TOSIF
                    </p>
                  </div>

                  <div style={{ flex: 1, position: 'relative', height: '12px' }}>
                    <svg width="100%" height="12" style={{ overflow: 'visible' }}>
                      <line x1="0" y1="6" x2="100%" y2="6" stroke="rgba(232, 99, 122, 0.4)" strokeWidth="2" />
                      <line
                        x1="0"
                        y1="6"
                        x2="100%"
                        y2="6"
                        stroke="var(--rose-light)"
                        strokeWidth="2"
                        className="glowing-dash-line"
                      />
                    </svg>
                  </div>

                  <div
                    className="card text-center"
                    style={{
                      padding: '0.6rem 0.9rem',
                      borderColor: 'rgba(232, 99, 122, 0.4)',
                      background: 'rgba(232, 99, 122, 0.1)',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>🧕</span>
                    <p className="mono mt-1" style={{ fontSize: '0.72rem', color: 'var(--rose-light)' }}>
                      NOUSHEEN
                    </p>
                  </div>
                </div>

                <h2 className="heading mb-2" style={{ fontSize: '1.5rem', color: 'var(--rose-light)' }}>
                  Goodnight, meri jaan.
                </h2>
              </div>

              <div className="divider divider-center mb-4" />

              <p className="body-text mb-3 text-center" style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.98rem' }}>
                {currentScene.question}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                {currentScene.options.map((opt) => {
                  const isSelected = answers[currentScene.questionId]?.optionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={`day4-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentScene, opt)}
                      id={`opt-${opt.id}`}
                    >
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card mb-4 text-center"
                    style={{
                      background: 'rgba(232, 99, 122, 0.12)',
                      borderColor: 'rgba(232, 99, 122, 0.4)',
                      padding: '1.15rem 1.25rem',
                    }}
                  >
                    <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                      {currentFeedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {answers[currentScene.questionId] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setSceneIndex(13)}
                    className="btn btn-primary w-full"
                    style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                    id="btn-scene-12-next"
                  >
                    Look up at the night sky ✨ →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 13: THE EMOTIONAL REVEAL                                  */}
          {/* ================================================================ */}
          {sceneIndex === 13 && (
            <motion.div
              key="scene-13"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="text-center"
              style={{ padding: '2rem 0' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.6rem',
                  maxWidth: '520px',
                  margin: '0 auto',
                }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="subheading"
                  style={{ fontSize: '1.25rem', color: 'var(--white-dim)' }}
                >
                  "Today was imaginary."
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 1.5 }}
                  className="subheading"
                  style={{ fontSize: '1.25rem', color: 'var(--rose-light)' }}
                >
                  "The distance is real."
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 2.8 }}
                  className="card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(232, 99, 122, 0.25)',
                    padding: '2rem 1.5rem',
                    lineHeight: 1.9,
                    textAlign: 'left',
                  }}
                >
                  <p className="heading mb-3" style={{ fontSize: '1.15rem', color: 'var(--gold)' }}>
                    "But one day..."
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white)' }}>
                    I don't want to imagine any of this anymore.
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white-dim)' }}>
                    I want to wake up beside you.
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white-dim)' }}>
                    I want to have chai with you.
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white-dim)' }}>
                    I want to annoy you before work.
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white-dim)' }}>
                    I want to come back home to you.
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white-dim)' }}>
                    I want to hear about your day.
                  </p>
                  <p className="body-text mb-2" style={{ color: 'var(--white-dim)' }}>
                    I want to sit next to you without a screen between us.
                  </p>
                  <p className="heading mt-3" style={{ fontSize: '1.15rem', color: 'var(--rose-light)' }}>
                    I want ordinary days with you.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 4.2 }}
                >
                  <p className="body-text mb-2" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                    Because I think...
                  </p>
                  <p className="display-italic mb-1" style={{ fontSize: '1.35rem', color: 'var(--white)' }}>
                    ordinary days become extraordinary...
                  </p>
                  <p className="heading" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>
                    ...when they're spent with the right person.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 5.5 }}
                >
                  <p className="subheading" style={{ fontSize: '1.15rem', color: 'var(--rose-light)' }}>
                    "And until that day... I'll keep finding ways to be close to you." ❤️
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 6.5 }}
                  className="mt-3"
                >
                  <button
                    onClick={() => setSceneIndex(14)}
                    className="btn btn-primary"
                    style={{
                      padding: '0.9rem 2rem',
                      fontSize: '0.98rem',
                      boxShadow: '0 6px 25px rgba(232, 99, 122, 0.4)',
                    }}
                    id="btn-emotional-continue"
                  >
                    One question for you, bachaa ✍️ →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 14: HER OWN MEMORY                                         */}
          {/* ================================================================ */}
          {sceneIndex === 14 && (
            <motion.div
              key="scene-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="day4-glass-card p-4"
              style={{ padding: '2rem 1.4rem' }}
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                  💌✨
                </span>
                <p className="subheading mb-1" style={{ fontSize: '1.1rem', color: 'var(--white-dim)' }}>
                  Now tell me something...
                </p>
                <h2 className="heading mb-2" style={{ fontSize: '1.35rem', color: 'var(--white)', lineHeight: 1.4 }}>
                  "If you could add one thing to our perfect day..."
                </h2>
                <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--rose-light)' }}>
                  What would my bachaa add?
                </p>
              </div>

              <form onSubmit={handleSaveMemory}>
                <div className="mb-4">
                  <textarea
                    value={memoryInput}
                    onChange={(e) => setMemoryInput(e.target.value)}
                    placeholder="Tell Tosif what you would add to our day..."
                    rows={4}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(232, 99, 122, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--white)',
                      padding: '1rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      resize: 'none',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
                    }}
                    id="input-nousheen-memory"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="mono dim" style={{ fontSize: '0.72rem' }}>
                      Saved securely for you & Tosif
                    </span>
                    <span className="mono dim" style={{ fontSize: '0.72rem' }}>
                      {memoryInput.length} chars
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!memoryInput.trim()}
                  className="btn btn-primary w-full"
                  style={{
                    padding: '0.9rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    opacity: memoryInput.trim() ? 1 : 0.5,
                  }}
                  id="btn-save-memory"
                >
                  {isMemorySaved ? 'SAVED 🤍' : 'SAVE OUR DAY ❤️'}
                </button>
              </form>

              {isMemorySaved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card mt-4 text-center"
                  style={{
                    background: 'rgba(232, 99, 122, 0.12)',
                    borderColor: 'rgba(232, 99, 122, 0.4)',
                    padding: '1rem',
                  }}
                >
                  <p className="heading" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                    Saved. 🤍
                  </p>
                  <p className="body-text mt-1" style={{ fontSize: '0.9rem', color: 'var(--white)' }}>
                    "I'll remember this one, pari."
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 15: FINAL MESSAGE                                          */}
          {/* ================================================================ */}
          {sceneIndex === 15 && (
            <motion.div
              key="scene-15"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
              style={{ padding: '2rem 0' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.9rem',
                  background: 'rgba(232, 99, 122, 0.15)',
                  border: '1px solid rgba(232, 99, 122, 0.4)',
                  borderRadius: '20px',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>✨</span>
                <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--rose-light)', letterSpacing: '0.1em' }}>
                  DAY 04 COMPLETE
                </span>
              </div>

              <h2
                className="heading mb-3"
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                Thank you for spending this imaginary day with me, Nousheen.
              </h2>

              <div
                className="card mb-5"
                style={{
                  background: 'linear-gradient(180deg, rgba(232, 99, 122, 0.08) 0%, rgba(201, 169, 110, 0.05) 100%)',
                  borderColor: 'rgba(232, 99, 122, 0.25)',
                  padding: '1.75rem 1.4rem',
                  lineHeight: 1.8,
                }}
              >
                <p className="body-text mb-3" style={{ fontSize: '1rem', color: 'var(--white)' }}>
                  "Even if it was only for a few minutes..."
                </p>
                <p className="display-italic mb-4" style={{ fontSize: '1.25rem', color: 'var(--rose-light)' }}>
                  "...I hope it felt a little like I was there."
                </p>

                <p className="body-text mb-1" style={{ color: 'var(--white-dim)' }}>
                  One day, bachaa...
                </p>
                <p className="heading mb-2" style={{ fontSize: '1.15rem', color: 'var(--gold)' }}>
                  this won't be imaginary.
                </p>
                <p className="subheading mb-3" style={{ fontSize: '1.05rem', color: 'var(--rose-light)' }}>
                  "Until then... I love you so, so, so much."
                </p>

                <p className="mono mt-2" style={{ fontSize: '0.9rem', color: 'var(--white)' }}>
                  — Tosif ❤️
                </p>

                <div className="divider divider-center my-3" />

                <p className="mono dim" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                  TOMORROW?
                </p>
                <p className="heading mt-1" style={{ fontSize: '1.05rem', color: 'var(--gold)' }}>
                  Something different. ✨
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 1.8rem', fontSize: '0.98rem' }}
                  id="btn-return-home"
                >
                  ← Back to Calendar
                </button>
                <button
                  onClick={() => {
                    setSceneIndex(0);
                    setCallState('incoming');
                    setCallDuration('00:01');
                    setIsFastForwardingCall(false);
                    setShowCustomOfficeInput(false);
                  }}
                  className="btn"
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.88rem',
                    color: 'var(--white-dim)',
                  }}
                  id="btn-replay-day"
                >
                  🔄 Spend another day together
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
