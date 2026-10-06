import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { saveResponse } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';

// Sound tone synthesizer
function playTone(freq = 440, type = 'sine', duration = 0.4, gainVal = 0.08) {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio failures
  }
}

function triggerHaptic(pattern = 50) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore
  }
}

export default function Day5() {
  const [sessionId, setSessionId] = useState('');
  const [hugCount, setHugCount] = useState(0);
  const [hugBurst, setHugBurst] = useState(false);
  const [activeHeartBeat, setActiveHeartBeat] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    const id = getOrCreateSessionId(5);
    setSessionId(id);

    try {
      const savedHugs = localStorage.getItem('day5_hugs_count');
      if (savedHugs) setHugCount(parseInt(savedHugs, 10));

      const savedNote = localStorage.getItem('day5_nousheen_note');
      if (savedNote) {
        setUserNote(savedNote);
        setIsNoteSaved(true);
      }
    } catch (e) {
      console.warn('Could not restore day 5 data', e);
    }
  }, []);

  const handleHug = () => {
    const nextHugs = hugCount + 1;
    setHugCount(nextHugs);
    setHugBurst(true);
    setActiveHeartBeat(true);
    playTone(520 + (nextHugs % 8) * 40, 'sine', 0.5, 0.12);
    triggerHaptic([40, 30, 80]);

    localStorage.setItem('day5_hugs_count', nextHugs.toString());
    setTimeout(() => setHugBurst(false), 900);
    setTimeout(() => setActiveHeartBeat(false), 600);

    saveResponse({
      sessionId,
      day: 5,
      questionId: 'day5_tight_hug',
      question: 'Tightly Hugged Tosif',
      optionId: `hug_${nextHugs}`,
      answer: `Hugged ${nextHugs} times`,
    });
  };

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    localStorage.setItem('day5_nousheen_note', userNote);
    setIsNoteSaved(true);
    playTone(660, 'sine', 1.0, 0.1);
    triggerHaptic([80, 50, 100]);

    saveResponse({
      sessionId,
      day: 5,
      questionId: 'day5_nousheen_note',
      question: "Nousheen's Reply to Tosif",
      optionId: 'direct_note',
      answer: userNote,
    });
  };

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))',
        paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 2rem))',
        background: 'radial-gradient(circle at 50% 10%, #170d1e 0%, #08060d 50%, #030205 100%)',
      }}
    >
      <StarField />
      <DayNav dayNumber={5} />

      {/* Floating Ambient Light */}
      <div
        style={{
          position: 'fixed',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 99, 122, 0.15) 0%, rgba(201, 169, 110, 0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="page-content z-1" style={{ maxWidth: '620px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* DAY TAG */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
            style={{
              background: 'rgba(232, 99, 122, 0.1)',
              border: '1px solid rgba(232, 99, 122, 0.3)',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              color: 'var(--gold, #c9a96e)',
              textTransform: 'uppercase',
            }}
          >
            <span>🌙</span>
            <span>DAY 05 • OCTOBER 05</span>
            <span>🌙</span>
          </div>
        </motion.div>

        {/* 1. GIGANTIC ANIMATED NOUHSHEEEEEEEEEEN WITH SCREEN RUMBLE */}
        <motion.div
          animate={{
            x: [-2, 2, -3, 3, -1, 1, 0],
            y: [-1, 1, -2, 2, 0],
          }}
          transition={{ repeat: Infinity, duration: 0.4 }}
          className="text-center mb-3"
        >
          <motion.h1
            animate={{
              scale: [1, 1.03, 1],
              color: ['#ff4d6d', '#ffd166', '#e8637a', '#ff4d6d'],
            }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontWeight: 900,
              fontSize: 'clamp(1.5rem, 6.2vw, 2.5rem)',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              wordBreak: 'break-all',
              textShadow: '0 0 25px rgba(232, 99, 122, 0.8), 0 0 45px rgba(255, 77, 109, 0.4)',
            }}
          >
            NOUHSHEEEEEEEEEEEEEEEEEEEEN!
          </motion.h1>

          {/* Animated Emotional Crying & Butterfly Emojis */}
          <div className="flex items-center justify-center gap-2 mt-2" style={{ fontSize: '2.2rem' }}>
            <motion.span
              animate={{ y: [0, -6, 0], rotate: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              😭
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ❤️
            </motion.span>
            <motion.span
              animate={{ y: [0, -6, 0], rotate: [8, -8, 8] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
            >
              🥺
            </motion.span>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ x: [-4, 4, -4], y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🦋
            </motion.span>
          </div>
        </motion.div>

        {/* 2. THE MAIN EMOTIONAL LETTER (ALL IN ONE BEAUTIFUL INTERACTIVE CARD) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card mb-4"
          style={{
            background: 'linear-gradient(180deg, rgba(28, 18, 38, 0.95) 0%, rgba(12, 9, 18, 0.95) 100%)',
            border: '1px solid rgba(232, 99, 122, 0.35)',
            borderRadius: '1.25rem',
            padding: '1.65rem 1.4rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            position: 'relative',
          }}
        >
          {/* Header Tag */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'var(--gold, #c9a96e)',
                fontSize: '1.05rem',
              }}
            >
              This is how much I love you...
            </span>
            <span style={{ fontSize: '1.4rem' }}>💌</span>
          </div>

          {/* Letter Body - Grammar Polished & Deeply Emotional */}
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'rgba(255, 255, 255, 0.92)',
              fontSize: 'clamp(0.98rem, 3.2vw, 1.08rem)',
              lineHeight: 1.85,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <p>
              <strong style={{ color: 'var(--rose-light)' }}>You are my first love, Nousheen.</strong> My first and my only. I really, truly want to pull you into the tightest hug, my bacha... I want to lift you up off your feet and go round and round until the entire world stops spinning and only your laughter remains.
            </p>

            <p>
              I know you have lots of hopes from me, and I carry so many hopes for us too. <strong style={{ color: 'var(--gold)' }}>You are my bacha... I see my entire world inside you.</strong> I want to give you back every single piece of happiness that you ever lost, and every ounce of joy and peace you truly deserve.
            </p>

            <p>
              In front of you, I am literally like a baby. I have never cried for anyone in this entire world... but with you, my heart melts. <em>You are the one who took a boy and made me into a man.</em>
            </p>

            <p>
              You are my girl, and I feel so deeply proud every single time I say that. I know this is a very tough time right now, and I know you’ve been thinking about lots of heavy stuff... I don't know the exact depth of how much you love me, <strong style={{ color: '#ff4d6d' }}>but you are my entire universe.</strong>
            </p>

            {/* Battle Vow & Butterfly Feelings */}
            <div
              style={{
                background: 'rgba(201, 169, 110, 0.12)',
                border: '1px solid rgba(201, 169, 110, 0.35)',
                borderRadius: '0.85rem',
                padding: '1rem',
                marginTop: '0.5rem',
                color: '#fff',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                fontFamily: 'var(--font-sans)',
              }}
            >
              <p style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--rose)' }}>😭❤️ I have never been this happy in my life:</strong> I still feel butterflies every single time I think of you!
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: 'var(--gold)' }}>⚔️ And listen to me:</strong> I will literally FIGHT THE ENTIRE WORLD FOR YOU! 😤🤺 Anyone or anything that tries to steal your smile has to deal with me first!
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3. THE TIGHT HUG ARTWORK & INTERACTIVE HUG BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-4"
          style={{
            padding: '1rem',
            background: 'rgba(15, 10, 22, 0.9)',
            border: '1px solid rgba(201, 169, 110, 0.4)',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', borderRadius: '0.85rem', overflow: 'hidden' }}>
            <motion.img
              animate={{
                scale: activeHeartBeat ? 1.04 : 1,
              }}
              transition={{ duration: 0.3 }}
              src="/images/tight_hug.jpg"
              alt="Tosif and Nousheen in a tight, emotional embrace under the starry sky"
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'cover',
                borderRadius: '0.85rem',
                display: 'block',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 65%, rgba(10, 7, 15, 0.9) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div className="mt-3 text-center">
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--gold, #c9a96e)',
                fontStyle: 'italic',
                marginBottom: '0.75rem',
              }}
            >
              "Held in my arms forever. My safest place, my Pari." 🤍
            </p>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleHug}
              id="day5-tight-hug-button"
              className="btn"
              style={{
                background: 'radial-gradient(circle, #e8637a 0%, #a82342 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '2rem',
                padding: '0.75rem 1.85rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: '0 8px 25px rgba(232, 99, 122, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                style={{ display: 'inline-block' }}
              >
                ❤️
              </motion.span>
              <span>Tap to Hug Me Tightly</span>
              {hugCount > 0 && (
                <span
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '1rem',
                    fontSize: '0.82rem',
                  }}
                >
                  {hugCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Bursting Hearts Effect on Hug */}
          <AnimatePresence>
            {hugBurst && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.5, y: -50 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '3rem',
                  pointerEvents: 'none',
                  zIndex: 20,
                  textShadow: '0 0 20px rgba(255, 77, 109, 0.9)',
                }}
              >
                ❤️
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 4. HER DIRECT REPLY / LOVE NOTE TO TOSIF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card mb-4"
          style={{
            background: 'rgba(18, 14, 24, 0.85)',
            border: '1px solid rgba(232, 99, 122, 0.25)',
            borderRadius: '1.25rem',
            padding: '1.25rem',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.2rem' }}>✍️</span>
            <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>
              Tell Tosif whatever is in your heart:
            </h3>
          </div>

          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Write to me bachaa... I will treasure every single word forever. 🤍"
            rows={4}
            id="day5-nousheen-reply-input"
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              padding: '0.85rem',
              color: '#fff',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              marginBottom: '0.75rem',
            }}
          />

          <button
            onClick={handleSaveNote}
            disabled={!userNote.trim()}
            id="day5-save-reply-btn"
            className="btn-primary btn"
            style={{
              width: '100%',
              minHeight: '46px',
              opacity: !userNote.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{isNoteSaved ? 'Saved in Tosif’s Heart ✓' : 'Send to Tosif’s Heart'}</span>
            <span>💌</span>
          </button>
        </motion.div>

        {/* 5. CLOSING DUA BADGE */}
        <div
          className="text-center py-4"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-arabic, serif)',
              fontSize: '1.25rem',
              color: 'var(--gold, #c9a96e)',
              marginBottom: '0.5rem',
              direction: 'rtl',
            }}
          >
            اللهم احفظها وبارك لي فيها واجمع بيننا في خير
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            "Goodnight, my universe. Sleep peacefully knowing you are loved beyond words." 🤍
          </p>
        </div>

      </div>
    </div>
  );
}
