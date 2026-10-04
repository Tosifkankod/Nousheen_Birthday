import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DayNav from '../../components/DayNav';
import ReelCard from '../../components/ReelCard';

// ============================================================================
// CONFIGURATION: DIRECT VIDEOS FOR DAY 03 (SCENE 5)
// Download your videos and place them in `public/videos/` with the names below!
// ============================================================================
const EXPERIENCES = [
  {
    id: 'salah',
    title: 'Praying Salah with you 🤲✨',
    description: 'Standing together in prayer, asking Allah for each other in this Dunya and Akhirah.',
    fullText: [
      'Leading you in prayer...',
      '...hearing you say "Ameen" behind me...',
      '...and making dua for our forever together.',
      'My most sacred dream. ❤️',
    ],
    videoSrc: '/videos/salah.mp4',
    instagramUrl: '',
    icon: '🤲',
    tag: 'Sacred',
    accentColor: '#e8c37d',
  },
  {
    id: 'paris',
    title: 'French kiss under the Eiffel Tower 🇫🇷',
    description: 'One day. Paris. Just you and me. Under the Eiffel Tower.',
    fullText: [
      'One day...',
      'Paris.',
      'Just you and me.',
      'Under the Eiffel Tower.',
    ],
    videoSrc: '/videos/paris.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DRnH-kqDNFg/',
    icon: '🗼',
    tag: 'Dream',
    accentColor: '#e8b068',
  },
  {
    id: 'games',
    title: 'Playing & eating games 😂',
    description: 'And obviously I\'m going to let you win... maybe.',
    fullText: [
      'I want the kind of memories where we do absolutely stupid things...',
      '...eat...',
      '...play...',
      '...laugh...',
      '...and somehow remember that day forever.',
    ],
    videoSrc: '/videos/games.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DIOmd6JTinT/',
    icon: '🎲',
    tag: 'Laughter',
    accentColor: '#f28d79',
  },
  {
    id: 'chai',
    title: 'Tea with you ☕',
    description: 'Nothing fancy. Just sitting together with chai.',
    fullText: [
      "I don't need some fancy date every time.",
      'Sometimes I just want chai...',
      '...you sitting next to me...',
      '...and us talking about absolutely everything.',
    ],
    videoSrc: '/videos/chai.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DSb40TZkq2Z/',
    icon: '☕',
    tag: 'Peace',
    accentColor: '#c9a96e',
  },
  {
    id: 'cuddle',
    title: 'Warm cuddles with you 🫂❤️',
    description: 'Wrapped up in blankets, holding you close, and forgetting the world.',
    fullText: [
      'One of those quiet, cozy days...',
      '...where it\'s cold outside...',
      '...wrapped up in blankets...',
      '...my arms around you tight...',
      '...and nowhere else in this world I\'d rather be. ❤️',
    ],
    videoSrc: '/videos/cuddle.mp4',
    instagramUrl: '',
    icon: '🫂',
    tag: 'Cozy',
    accentColor: '#f7a8b8',
  },
  {
    id: 'gym',
    title: 'Building my body for you 🏋️',
    description: 'One day you\'ll have to say, \'okay, you\'re actually looking good.\' 😂',
    fullText: [
      'Okay fine...',
      'This one is partly your fault.',
      "I'm going to get stronger...",
      "...and one day you're going to look at me and say...",
      'Not bad. 😌',
    ],
    videoSrc: '/videos/gym.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DcBsIXcSQdT/',
    icon: '💪',
    tag: 'Promise',
    accentColor: '#e27b88',
  },
  {
    id: 'dance',
    title: 'Dancing with you 💃🏻',
    description: 'Even if neither of us knows what we\'re doing.',
    fullText: [
      "I don't care if we know how to dance.",
      'I just want one song...',
      "...where it's just you and me.",
    ],
    videoSrc: '/videos/dance.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DF3K5PNJlSc/',
    icon: '✨',
    tag: 'Forever',
    accentColor: '#d69e54',
  },
];

const NICKNAMES = [
  { text: 'meri jaan ❤️', delay: 0.4, rotate: -4, size: '1.7rem', color: '#f7d399' },
  { text: 'mera bacha 🥹', delay: 1.6, rotate: 3, size: '1.6rem', color: '#ffbfa3' },
  { text: 'mera dil ❤️', delay: 2.8, rotate: -2, size: '1.8rem', color: '#f09aa8' },
  { text: 'mera noor ✨', delay: 4.0, rotate: 5, size: '2.1rem', color: '#fbe2a8' },
];

const TIMELINE_ITEMS = [
  { label: 'Praying Salah', icon: '🤲', detail: 'Standing together before Allah' },
  { label: 'Paris', icon: '🗼', detail: 'Under golden lights' },
  { label: 'Chai', icon: '☕', detail: 'Warm quiet evenings' },
  { label: 'Games', icon: '🎲', detail: 'Stupid laughs & bets' },
  { label: 'Cuddles', icon: '🫂', detail: 'Holding you warm & close' },
  { label: 'Dancing', icon: '💃🏻', detail: 'One slow song' },
  { label: 'Random trips', icon: '🚗', detail: 'No destination' },
  { label: 'Late night talks', icon: '🌙', detail: 'Until the sky turns blue' },
  { label: 'Growing together', icon: '🌱', detail: 'Every version of us' },
  { label: 'A lifetime in Dunya & Jannah...', icon: '💍', detail: 'Everything & forever' },
];

export default function Day3() {
  const navigate = useNavigate();

  // Scene index: 1 through 9
  // 1: Darkness & Sujood reveal
  // 2: Sujood closer & A small light begins
  // 3: Nousheen Arrives (Arabic Typography & Dawn Light)
  // 4: I See You Everywhere
  // 5: Things I Want To Do With You (Direct Video Carousel)
  // 6: Future Memories (Timeline)
  // 7: Names I Call You (Nicknames float)
  // 8: Final Message (A life full of moments)
  // 9: The Final Line & Completion
  const [scene, setScene] = useState(1);
  const [subStep, setSubStep] = useState(0);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sujoodRevealed, setSujoodRevealed] = useState(false);

  // Sound synthesis via Web Audio API
  const playCinematicChime = (type = 'warmth') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'warmth') {
        const freqs = [220, 277.18, 329.63, 440, 554.37];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), ctx.currentTime + 0.8 + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + 4.0);
        });
      } else if (type === 'dawn') {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.3 + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + 3.0);
        });
      }
    } catch (e) {}
  };

  // Initial Scene 1 timing: reveal sujood after 2.4s
  useEffect(() => {
    if (scene === 1) {
      const timer = setTimeout(() => {
        setSujoodRevealed(true);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  // Audio cue triggers when hitting key transition scenes
  useEffect(() => {
    if (scene === 2) {
      playCinematicChime('warmth');
    } else if (scene === 3) {
      playCinematicChime('dawn');
    }
    setSubStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scene]);

  // Keyboard navigation for cinematic control
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, subStep, activeReelIndex]);

  const handleNext = () => {
    if (scene === 1) {
      if (!sujoodRevealed) {
        setSujoodRevealed(true);
        return;
      }
      setScene(2);
    } else if (scene === 2) {
      setScene(3);
    } else if (scene === 3) {
      setScene(4);
    } else if (scene === 4) {
      setScene(5);
    } else if (scene === 5) {
      if (activeReelIndex < EXPERIENCES.length - 1) {
        setActiveReelIndex((prev) => prev + 1);
      } else {
        setScene(6);
      }
    } else if (scene === 6) {
      setScene(7);
    } else if (scene === 7) {
      setScene(8);
    } else if (scene === 8) {
      setScene(9);
    }
  };

  const handlePrev = () => {
    if (scene === 5 && activeReelIndex > 0) {
      setActiveReelIndex((prev) => prev - 1);
      return;
    }
    if (scene > 1) {
      setScene((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    playCinematicChime('dawn');
    try {
      localStorage.setItem('day3_completed', 'true');
    } catch (e) {}
  };

  const restartStory = () => {
    setIsCompleted(false);
    setScene(1);
    setSujoodRevealed(false);
    setActiveReelIndex(0);
    setSubStep(0);
  };

  return (
    <div
      className="page cinematic-day-3"
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: '#000000',
        color: '#f5f0eb',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: scene === 1 ? '1.5rem' : 'max(4.5rem, calc(env(safe-area-inset-top) + 3rem))',
        paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))',
        paddingLeft: 'max(1.2rem, calc(env(safe-area-inset-left) + 0.8rem))',
        paddingRight: 'max(1.2rem, calc(env(safe-area-inset-right) + 0.8rem))',
        transition: 'background 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top DayNav (hidden in Scene 1 for pure immersive darkness) */}
      {scene > 1 && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900 }}>
          <DayNav dayNumber={3} />
        </div>
      )}

      {/* Subtle Cinematic Vignette & Atmospheric Lighting Layers */}
      <div
        className="cinematic-lighting-layer"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: scene === 1 ? 0 : scene === 2 ? 0.25 : scene === 3 ? 0.9 : 0.45,
          transition: 'opacity 2.5s ease',
          background:
            scene >= 3
              ? 'radial-gradient(circle at 50% 25%, rgba(201, 169, 110, 0.18) 0%, rgba(74, 14, 23, 0.08) 50%, rgba(0, 0, 0, 0.95) 100%)'
              : 'radial-gradient(circle at 50% 45%, rgba(201, 169, 110, 0.08) 0%, rgba(0, 0, 0, 0.98) 100%)',
        }}
      />

      {/* Cinematic Film Grain & Dust Particles */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 20px 30px, rgba(232, 195, 125, 0.2), rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 180px, rgba(255, 255, 255, 0.15), rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 100px, rgba(201, 169, 110, 0.25), rgba(0,0,0,0))',
          backgroundSize: '350px 350px',
          opacity: scene >= 2 ? 0.6 : 0.2,
          transition: 'opacity 2s ease',
        }}
      />

      {/* Floating Scene Progress Bar / Film Strip */}
      {scene > 1 && (
        <div
          style={{
            position: 'fixed',
            top: 'max(1.2rem, calc(env(safe-area-inset-top) + 0.8rem))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 890,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '100px',
            background: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
            <button
              key={s}
              onClick={() => {
                setScene(s);
                if (s === 1) setSujoodRevealed(true);
              }}
              title={`Scene ${s}`}
              style={{
                width: scene === s ? '20px' : '6px',
                height: '5px',
                borderRadius: '4px',
                background:
                  scene === s
                    ? 'linear-gradient(90deg, #c9a96e, #f0c88b)'
                    : scene > s
                    ? 'rgba(201, 169, 110, 0.45)'
                    : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN CINEMATIC SCENE CONTAINER */}
      {/* ==================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {/* ================================================================ */}
          {/* SCENE 1 — COMPLETE DARKNESS & SUJOOD SILHOUETTE */}
          {/* ================================================================ */}
          {scene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              {/* Silhouette of boy in Sujood / Prayer */}
              <div
                style={{
                  position: 'relative',
                  width: 'min(300px, 80vw)',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '3rem',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: sujoodRevealed ? 0.95 : 0,
                    scale: sujoodRevealed ? 1 : 0.96,
                  }}
                  transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    width="260"
                    height="140"
                    viewBox="0 0 260 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      filter: 'drop-shadow(0 0 16px rgba(201, 169, 110, 0.08))',
                      transform: 'translateY(10px)',
                    }}
                  >
                    <path
                      d="M20 128 C70 126, 190 126, 240 128"
                      stroke="rgba(201, 169, 110, 0.2)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M70 126 C72 120, 80 114, 88 116 C96 118, 98 126, 92 127 C84 128, 74 128, 70 126 Z"
                      fill="#141416"
                      stroke="rgba(201, 169, 110, 0.35)"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M86 122 C96 120, 115 116, 126 123 C128 125, 115 127, 86 127 Z"
                      fill="#0d0e10"
                      stroke="rgba(201, 169, 110, 0.25)"
                      strokeWidth="0.6"
                    />
                    <path
                      d="M92 118 C104 104, 128 92, 146 92 C162 92, 178 98, 184 108 C190 116, 190 126, 172 127 C156 127, 140 124, 126 123"
                      fill="#0a0a0c"
                      stroke="rgba(201, 169, 110, 0.4)"
                      strokeWidth="0.9"
                    />
                    <path
                      d="M178 106 C192 110, 202 118, 204 126 C205 127, 185 128, 168 127"
                      fill="#070709"
                      stroke="rgba(201, 169, 110, 0.25)"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M95 114 C112 98, 134 91, 152 93 C168 94, 178 102, 182 108"
                      stroke="rgba(235, 195, 130, 0.45)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <motion.div
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    style={{
                      width: '180px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'radial-gradient(ellipse, rgba(201, 169, 110, 0.25) 0%, rgba(0,0,0,0) 70%)',
                      filter: 'blur(4px)',
                      marginTop: '-6px',
                    }}
                  />
                </motion.div>
              </div>

              {/* Text sequence */}
              <div style={{ maxWidth: '540px', margin: '0 auto', minHeight: '180px' }}>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: sujoodRevealed ? 1 : 0, y: sujoodRevealed ? 0 : 12 }}
                  transition={{ delay: 0.8, duration: 1.4 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)',
                    color: '#f7f4ed',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    marginBottom: '1.4rem',
                    fontStyle: 'italic',
                  }}
                >
                  "Before you..."
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: sujoodRevealed ? 0.75 : 0 }}
                  transition={{ delay: 2.2, duration: 1.4 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)',
                    color: 'rgba(245, 240, 235, 0.75)',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    marginBottom: '1.2rem',
                  }}
                >
                  I thought I knew what darkness was.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: sujoodRevealed ? 0.6 : 0 }}
                  transition={{ delay: 3.6, duration: 1.4 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                    color: 'rgba(245, 240, 235, 0.55)',
                    fontStyle: 'italic',
                  }}
                >
                  <p style={{ marginBottom: '0.4rem' }}>My days were moving...</p>
                  <p>...but something was missing.</p>
                </motion.div>
              </div>

              {/* Subtle Step Forward Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: sujoodRevealed ? 1 : 0 }}
                transition={{ delay: 4.8, duration: 1 }}
                style={{ marginTop: '3.5rem' }}
              >
                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.65rem 1.6rem',
                    borderRadius: '100px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    color: '#f0c88b',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span>Step into the light</span>
                  <span style={{ fontSize: '0.9rem' }}>→</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 2 — THE SUJOOD (ZOOM IN & WARM LIGHT APPEARS) */}
          {/* ================================================================ */}
          {scene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Warm light beginning in distance */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.4, 1.2],
                  opacity: [0.2, 0.85, 0.7],
                }}
                transition={{ duration: 4.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '25%',
                  width: 'min(220px, 60vw)',
                  height: 'min(220px, 60vw)',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(235, 178, 90, 0.35) 0%, rgba(201, 169, 110, 0.12) 45%, rgba(0,0,0,0) 75%)',
                  filter: 'blur(25px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Silhouette with camera moving closer */}
              <motion.div
                initial={{ scale: 1, y: 15 }}
                animate={{ scale: 1.25, y: 0 }}
                transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'relative',
                  marginBottom: '2.5rem',
                  filter: 'drop-shadow(0 0 25px rgba(235, 178, 90, 0.2))',
                }}
              >
                <svg
                  width="220"
                  height="120"
                  viewBox="0 0 260 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 128 C70 126, 190 126, 240 128"
                    stroke="rgba(235, 178, 90, 0.35)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M70 126 C72 120, 80 114, 88 116 C96 118, 98 126, 92 127 C84 128, 74 128, 70 126 Z"
                    fill="#151312"
                    stroke="rgba(235, 178, 90, 0.5)"
                    strokeWidth="1"
                  />
                  <path
                    d="M86 122 C96 120, 115 116, 126 123 C128 125, 115 127, 86 127 Z"
                    fill="#100e0d"
                    stroke="rgba(235, 178, 90, 0.4)"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M92 118 C104 104, 128 92, 146 92 C162 92, 178 98, 184 108 C190 116, 190 126, 172 127 C156 127, 140 124, 126 123"
                    fill="#0d0b0a"
                    stroke="rgba(235, 178, 90, 0.6)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M178 106 C192 110, 202 118, 204 126 C205 127, 185 128, 168 127"
                    fill="#0a0807"
                    stroke="rgba(235, 178, 90, 0.4)"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M95 114 C112 98, 134 91, 152 93 C168 94, 178 102, 182 108"
                    stroke="rgba(255, 218, 140, 0.8)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <div style={{ maxWidth: '580px', margin: '0 auto' }}>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.5rem, 5vw, 2.3rem)',
                    color: '#fbe9c4',
                    fontStyle: 'italic',
                    marginBottom: '1.8rem',
                  }}
                >
                  "Then..."
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 1.6 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.15rem, 4vw, 1.55rem)',
                    color: '#f7f4ed',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    letterSpacing: '0.01em',
                  }}
                >
                  Allah sent something beautiful into my life.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8, duration: 1 }}
                style={{ marginTop: '3.5rem' }}
              >
                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.7rem 1.8rem',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, rgba(235, 178, 90, 0.25) 0%, rgba(201, 169, 110, 0.1) 100%)',
                    border: '1px solid rgba(235, 178, 90, 0.5)',
                    color: '#fbe2a8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(235, 178, 90, 0.2)',
                  }}
                >
                  <span>Reveal Her Name</span>
                  <span>✨</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 3 — NOUSHEEN ARRIVES (ARABIC TYPOGRAPHY & DAWN LIGHT) */}
          {/* ================================================================ */}
          {scene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.0 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Grand Dawn Bloom */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.8, 1.3, 1.1], opacity: [0.3, 0.95, 0.85] }}
                transition={{ duration: 3.5, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 'min(480px, 90vw)',
                  height: 'min(480px, 90vw)',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(245, 200, 115, 0.38) 0%, rgba(212, 125, 60, 0.18) 45%, rgba(74, 14, 23, 0.05) 70%, rgba(0,0,0,0) 90%)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }}
              />

              {/* ARABIC TYPOGRAPHY: نوشين */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative', marginBottom: '0.5rem' }}
              >
                <h1
                  style={{
                    fontFamily: "'Amiri', 'Traditional Arabic', serif",
                    fontSize: 'clamp(4.2rem, 14vw, 7.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '0.04em',
                    background: 'linear-gradient(135deg, #fff2db 0%, #f7d399 35%, #e2ab55 70%, #fff7ea 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 35px rgba(245, 200, 115, 0.6))',
                    margin: 0,
                    padding: '0.2rem 1rem',
                  }}
                  dir="rtl"
                >
                  نوشين
                </h1>
              </motion.div>

              {/* Sub-label: Nousheen */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.2 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)',
                  letterSpacing: '0.25em',
                  color: '#fdfbf7',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  marginBottom: '2.5rem',
                  textShadow: '0 0 20px rgba(245, 200, 115, 0.4)',
                }}
              >
                Nousheen
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1.5 }}
                style={{
                  maxWidth: '560px',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.15rem, 3.8vw, 1.45rem)',
                    color: '#fbe8c3',
                    fontStyle: 'italic',
                  }}
                >
                  "And suddenly..."
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)',
                    color: 'rgba(253, 251, 247, 0.9)',
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  My world had a little more light.
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                    color: 'rgba(245, 240, 235, 0.7)',
                    fontStyle: 'italic',
                  }}
                >
                  I started seeing beauty in places I never noticed before.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8, duration: 1 }}
                style={{ marginTop: '3rem' }}
              >
                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 2rem',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                    color: '#120b06',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(232, 176, 104, 0.35)',
                  }}
                >
                  <span>Continue The Story</span>
                  <span>→</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 4 — "I SEE YOU EVERYWHERE" */}
          {/* ================================================================ */}
          {scene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.4 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Ethereal Moving Bokeh Light Circles */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                {[
                  { size: 140, x: '20%', y: '30%', delay: 0, dur: 7 },
                  { size: 220, x: '75%', y: '60%', delay: 1, dur: 9 },
                  { size: 180, x: '50%', y: '20%', delay: 2, dur: 8 },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: ['-20px', '20px', '-20px'],
                      x: ['-15px', '15px', '-15px'],
                      opacity: [0.15, 0.35, 0.15],
                    }}
                    transition={{ repeat: Infinity, duration: b.dur, delay: b.delay, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: b.y,
                      left: b.x,
                      width: b.size,
                      height: b.size,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(232, 168, 88, 0.25) 0%, rgba(100, 30, 45, 0.08) 60%, rgba(0,0,0,0) 80%)',
                      filter: 'blur(30px)',
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  maxWidth: '620px',
                  margin: '0 auto',
                  padding: '2.5rem 1.8rem',
                  borderRadius: '24px',
                  background: 'rgba(18, 14, 13, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(232, 168, 88, 0.18)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  position: 'relative',
                }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    color: '#e8c37d',
                    textTransform: 'uppercase',
                    marginBottom: '1.5rem',
                  }}
                >
                  Scene 04 • A Thought
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.35rem, 4.5vw, 1.95rem)',
                    color: '#fdfbf7',
                    fontWeight: 400,
                    marginBottom: '1.8rem',
                    lineHeight: 1.4,
                  }}
                >
                  "Now there's something funny...
                  <br />
                  <span style={{ color: '#f5c67d', fontStyle: 'italic' }}>I see you everywhere."</span>
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 1.4 }}
                  style={{
                    fontSize: 'clamp(1.02rem, 3.5vw, 1.2rem)',
                    lineHeight: 1.7,
                    color: 'rgba(245, 240, 235, 0.85)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 300,
                    marginBottom: '2rem',
                  }}
                >
                  <p style={{ marginBottom: '1rem' }}>
                    Sometimes I see you in every girl wearing a burqa...
                  </p>
                  <p style={{ color: '#fbe2a8', fontStyle: 'italic', marginBottom: '1.2rem' }}>
                    ...because for a second, my heart thinks it's you.
                  </p>
                  <p style={{ opacity: 0.7 }}>But then I realize...</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.8, duration: 1.2 }}
                  style={{
                    padding: '1rem 1.4rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(232, 168, 88, 0.15) 0%, rgba(74, 14, 23, 0.12) 100%)',
                    border: '1px solid rgba(232, 168, 88, 0.35)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.2rem, 4vw, 1.55rem)',
                      color: '#fdfbf7',
                      letterSpacing: '0.02em',
                      margin: 0,
                    }}
                  >
                    "...there's only one <span style={{ color: '#f5c67d' }}>Nousheen</span>."
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.8, duration: 1 }}
                style={{ marginTop: '2.5rem' }}
              >
                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.7rem 1.8rem',
                    borderRadius: '100px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(232, 168, 88, 0.35)',
                    color: '#fbe2a8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <span>Our Bucket List</span>
                  <span>→</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 5 — THINGS I WANT TO DO WITH YOU (DIRECT VIDEO REELS) */}
          {/* ================================================================ */}
          {scene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem 0',
              }}
            >
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.8rem', maxWidth: '600px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.22em',
                    color: '#e8c37d',
                    textTransform: 'uppercase',
                    marginBottom: '0.6rem',
                  }}
                >
                  Scene 05 • Direct Video Moments
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                    color: '#fdfbf7',
                    fontWeight: 400,
                    lineHeight: 1.25,
                    marginBottom: '0.8rem',
                  }}
                >
                  Things I want to do with you.
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(0.95rem, 3.2vw, 1.15rem)',
                    color: 'rgba(245, 240, 235, 0.65)',
                    fontStyle: 'italic',
                  }}
                >
                  "And honestly... I don't think this list is ever going to end."
                </p>
              </div>

              {/* Video Switcher Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '1.8rem',
                  maxWidth: '100%',
                }}
              >
                {EXPERIENCES.map((exp, idx) => (
                  <button
                    key={exp.id}
                    onClick={() => setActiveReelIndex(idx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      background:
                        activeReelIndex === idx
                          ? 'linear-gradient(135deg, rgba(232, 168, 88, 0.3) 0%, rgba(201, 169, 110, 0.15) 100%)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border:
                        activeReelIndex === idx
                          ? '1px solid rgba(232, 168, 88, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      color: activeReelIndex === idx ? '#fbe2a8' : 'rgba(245, 240, 235, 0.55)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <span>{exp.icon}</span>
                    <span>0{idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Active Reel Card */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  perspective: 1000,
                  minHeight: '480px',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeReelIndex}
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <ReelCard
                      title={EXPERIENCES[activeReelIndex].title}
                      description={EXPERIENCES[activeReelIndex].description}
                      videoSrc={EXPERIENCES[activeReelIndex].videoSrc}
                      instagramUrl={EXPERIENCES[activeReelIndex].instagramUrl}
                      icon={EXPERIENCES[activeReelIndex].icon}
                      tag={EXPERIENCES[activeReelIndex].tag}
                      index={activeReelIndex}
                      accentColor={EXPERIENCES[activeReelIndex].accentColor}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '380px',
                  marginTop: '1.8rem',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() => {
                    if (activeReelIndex > 0) setActiveReelIndex((p) => p - 1);
                    else handlePrev();
                  }}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    borderRadius: '100px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'rgba(245, 240, 235, 0.7)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  ← Previous
                </button>

                <button
                  onClick={handleNext}
                  style={{
                    flex: 1.2,
                    padding: '0.65rem 1.2rem',
                    borderRadius: '100px',
                    background:
                      activeReelIndex === EXPERIENCES.length - 1
                        ? 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)'
                        : 'rgba(232, 168, 88, 0.2)',
                    border: '1px solid rgba(232, 168, 88, 0.4)',
                    color: activeReelIndex === EXPERIENCES.length - 1 ? '#110b06' : '#fbe2a8',
                    fontWeight: activeReelIndex === EXPERIENCES.length - 1 ? 600 : 400,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {activeReelIndex === EXPERIENCES.length - 1 ? "There's More →" : 'Next Video →'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 6 — FUTURE MEMORIES (TIMELINE) */}
          {/* ================================================================ */}
          {scene === 6 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem 0',
              }}
            >
              <div style={{ maxWidth: '600px', marginBottom: '2.5rem' }}>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.35rem, 4.5vw, 1.85rem)',
                    color: '#fdfbf7',
                    fontWeight: 400,
                    lineHeight: 1.35,
                    marginBottom: '0.8rem',
                  }}
                >
                  "These aren't just things I want to do."
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.1rem, 3.8vw, 1.4rem)',
                    color: '#f5c67d',
                    fontStyle: 'italic',
                  }}
                >
                  These are memories I want to make with you.
                </motion.p>
              </div>

              {/* Glowing Interactive Connected Timeline */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  padding: '1rem 0 2rem',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    bottom: '20px',
                    left: '28px',
                    width: '2px',
                    background: 'linear-gradient(180deg, rgba(232, 168, 88, 0.6) 0%, rgba(201, 169, 110, 0.2) 100%)',
                    zIndex: 0,
                  }}
                />

                {TIMELINE_ITEMS.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.12, duration: 0.6 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                      marginBottom: '1rem',
                      position: 'relative',
                      zIndex: 1,
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1f1612 0%, #110c0a 100%)',
                        border: '1.5px solid rgba(232, 168, 88, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        boxShadow: '0 0 15px rgba(232, 168, 88, 0.18)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        padding: '0.85rem 1.2rem',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.1rem',
                          color: '#fdfbf7',
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {item.label}
                      </h4>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.78rem',
                          color: 'rgba(245, 240, 235, 0.55)',
                          margin: '2px 0 0',
                        }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ maxWidth: '540px', marginTop: '1rem' }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 1 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    color: 'rgba(245, 240, 235, 0.8)',
                    fontStyle: 'italic',
                    marginBottom: '1.8rem',
                  }}
                >
                  "And I have a feeling... this list is going to get very, very long."
                </motion.p>

                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 2rem',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                    color: '#120b06',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(232, 176, 104, 0.3)',
                  }}
                >
                  <span>There's more →</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 7 — NAMES I CALL YOU (FLOATING NICKNAMES) */}
          {/* ================================================================ */}
          {scene === 7 && (
            <motion.div
              key="scene-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    color: '#e8c37d',
                    textTransform: 'uppercase',
                    marginBottom: '0.8rem',
                  }}
                >
                  Scene 07 • Whispers
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.4rem, 4.5vw, 2rem)',
                    color: '#fdfbf7',
                    fontStyle: 'italic',
                  }}
                >
                  "Wait... I forgot something."
                </motion.h3>
              </div>

              {/* Floating Nicknames */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  minHeight: '280px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.2rem',
                }}
              >
                {NICKNAMES.map((nick, idx) => (
                  <motion.div
                    key={nick.text}
                    initial={{ opacity: 0, scale: 0.5, y: 25 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0],
                      rotate: [nick.rotate, nick.rotate + 2, nick.rotate],
                    }}
                    transition={{
                      delay: nick.delay,
                      duration: 0.9,
                      y: { repeat: Infinity, duration: 3.5 + idx, ease: 'easeInOut' },
                      rotate: { repeat: Infinity, duration: 4 + idx, ease: 'easeInOut' },
                    }}
                    whileHover={{ scale: 1.15, rotate: 0 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.7rem 1.6rem',
                      borderRadius: '100px',
                      background: 'linear-gradient(135deg, rgba(26, 18, 14, 0.9) 0%, rgba(15, 10, 10, 0.95) 100%)',
                      border: '1.5px solid rgba(232, 168, 88, 0.45)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(232, 168, 88, 0.15)',
                      cursor: 'default',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: nick.size,
                        color: nick.color,
                        letterSpacing: '0.02em',
                        textShadow: '0 0 15px rgba(232, 168, 88, 0.3)',
                      }}
                    >
                      {nick.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.2, duration: 1.2 }}
                style={{
                  marginTop: '2rem',
                  maxWidth: '520px',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  color: 'rgba(245, 240, 235, 0.75)',
                  fontStyle: 'italic',
                }}
              >
                <p>And there are a thousand other things...</p>
                <p style={{ color: '#fbe2a8', marginTop: '4px' }}>...I could call you.</p>

                <div style={{ marginTop: '2rem' }}>
                  <button
                    onClick={handleNext}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '0.7rem 1.8rem',
                      borderRadius: '100px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(232, 168, 88, 0.35)',
                      color: '#fbe2a8',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    <span>One Heartfelt Truth</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 8 — FINAL MESSAGE (A LIFE FULL OF THEM) */}
          {/* ================================================================ */}
          {scene === 8 && (
            <motion.div
              key="scene-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              <div style={{ maxWidth: '620px', margin: '0 auto' }}>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.15rem, 3.8vw, 1.4rem)',
                    color: 'rgba(245, 240, 235, 0.65)',
                    fontStyle: 'italic',
                    marginBottom: '0.6rem',
                  }}
                >
                  "Because honestly..."
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 1.2 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.5rem, 5vw, 2.3rem)',
                    color: '#fdfbf7',
                    fontWeight: 400,
                    lineHeight: 1.35,
                    marginBottom: '2rem',
                  }}
                >
                  I don't just want moments with you.
                  <br />
                  <span style={{ color: '#f5c67d' }}>I want a life full of them.</span>
                </motion.h2>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '10px 18px',
                    marginBottom: '2.5rem',
                    maxWidth: '520px',
                    margin: '0 auto 2.5rem',
                  }}
                >
                  {[
                    'Trips.',
                    'Random evenings.',
                    'Tea.',
                    'Arguments.',
                    'Laughter.',
                    'Growing together.',
                    'Getting old together.',
                  ].map((word, idx) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.2 + idx * 0.35, duration: 0.6 }}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1rem, 3.2vw, 1.25rem)',
                        color: idx === 6 ? '#f5c67d' : 'rgba(245, 240, 235, 0.85)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.0, duration: 1.4 }}
                  style={{
                    padding: '1.6rem 2rem',
                    borderRadius: '20px',
                    background: 'rgba(201, 169, 110, 0.06)',
                    border: '1px solid rgba(201, 169, 110, 0.25)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                      color: '#fdfbf7',
                      lineHeight: 1.5,
                      fontWeight: 300,
                      margin: 0,
                    }}
                  >
                    "Because you're not just someone I want to love...
                    <br />
                    <span style={{ color: '#f5c67d', fontWeight: 500 }}>
                      ...you're someone I want to build a life with."
                    </span>
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.2, duration: 1 }}
                style={{ marginTop: '2.5rem' }}
              >
                <button
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 2rem',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                    color: '#120b06',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(232, 176, 104, 0.35)',
                  }}
                >
                  <span>One Last Thing</span>
                  <span>😂</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 9 — THE FINAL LINE & DAY COMPLETION */}
          {/* ================================================================ */}
          {scene === 9 && (
            <motion.div
              key="scene-9"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                width: '100%',
                minHeight: '75vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              {!isCompleted ? (
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.65 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      color: '#e8c37d',
                      textTransform: 'uppercase',
                      marginBottom: '1rem',
                    }}
                  >
                    Scene 09 • A Forever Promise
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)',
                      color: 'rgba(245, 240, 235, 0.7)',
                      fontStyle: 'italic',
                      marginBottom: '1.2rem',
                    }}
                  >
                    "One last thing... There's something I promise you."
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.8rem, 6vw, 3rem)',
                      color: '#fdfbf7',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      marginBottom: '2rem',
                      textShadow: '0 0 30px rgba(232, 168, 88, 0.4)',
                    }}
                  >
                    Main tumhe bohot tang karunga. 😂❤️
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.0, duration: 1.4 }}
                    style={{
                      fontSize: 'clamp(1.05rem, 3.6vw, 1.3rem)',
                      lineHeight: 1.8,
                      color: 'rgba(245, 240, 235, 0.88)',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 300,
                      marginBottom: '2.5rem',
                    }}
                  >
                    <p>Main tumhe itna pyaar karunga...</p>
                    <p>...itna pareshaan karunga...</p>
                    <p>...itna hasaunga...</p>
                    <p>...aur itna apna bana lunga...</p>
                    <p style={{ marginTop: '1rem', color: '#f5c67d', fontStyle: 'italic' }}>
                      ki ek din tum khud kahogi...
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.3rem, 4.2vw, 1.7rem)',
                        color: '#fdfbf7',
                        fontWeight: 600,
                        marginTop: '0.6rem',
                      }}
                    >
                      "Bas karo, Tosif. 😂❤️"
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4.8, duration: 1 }}
                    style={{ marginBottom: '2.5rem' }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        color: '#f5c67d',
                        fontStyle: 'italic',
                      }}
                    >
                      "Too late."
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'rgba(245, 240, 235, 0.55)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginTop: '4px',
                      }}
                    >
                      You're stuck with me.
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 5.8, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComplete}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem 2.5rem',
                      borderRadius: '100px',
                      background: 'linear-gradient(135deg, #f0c88b 0%, #c9a96e 50%, #9a1b2f 100%)',
                      color: '#0e0804',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 12px 40px rgba(240, 200, 139, 0.4), 0 0 25px rgba(154, 27, 47, 0.3)',
                    }}
                  >
                    <span>DAY 03 COMPLETE ❤️</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    maxWidth: '560px',
                    margin: '0 auto',
                    padding: '3rem 2rem',
                    borderRadius: '28px',
                    background: 'linear-gradient(180deg, rgba(28, 20, 16, 0.95) 0%, rgba(14, 10, 10, 0.98) 100%)',
                    border: '1.5px solid rgba(240, 200, 139, 0.45)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 45px rgba(240, 200, 139, 0.25)',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    style={{ fontSize: '3rem', marginBottom: '1.2rem' }}
                  >
                    🌅
                  </motion.div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.6rem, 5vw, 2.3rem)',
                      color: '#fdfbf7',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      marginBottom: '1rem',
                    }}
                  >
                    Kal phir milna, Nousheen.
                  </h2>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: '#f0c88b',
                      fontStyle: 'italic',
                      marginBottom: '2rem',
                    }}
                  >
                    — Tosif
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 16px',
                      borderRadius: '100px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '2.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em',
                        color: 'rgba(245, 240, 235, 0.8)',
                      }}
                    >
                      03 / 14
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={restartStory}
                      style={{
                        padding: '0.65rem 1.4rem',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#fdfbf7',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      ↺ Replay Story
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      style={{
                        padding: '0.65rem 1.6rem',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #e8b068 0%, #c9a96e 100%)',
                        color: '#120b06',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Back to Calendar →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM CONTROLS & "03" BADGE */}
      {/* ==================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: scene === 1 ? 'rgba(245, 240, 235, 0.25)' : 'rgba(232, 168, 88, 0.5)',
            transition: 'color 1s ease',
          }}
        >
          03
        </span>

        {scene > 1 && scene < 9 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              title="Previous scene"
              aria-label="Previous scene"
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(245, 240, 235, 0.5)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              title="Next scene"
              aria-label="Next scene"
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                background: 'rgba(232, 168, 88, 0.1)',
                border: '1px solid rgba(232, 168, 88, 0.25)',
                color: '#e8c37d',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
