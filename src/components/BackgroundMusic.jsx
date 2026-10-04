import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundMusic() {
  const location = useLocation();
  const audioRef = useRef(null);
  // Default is ON
  const [isPlaying, setIsPlaying] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Day 3 is a dedicated cinematic film & video experience (requires no home bg music)
  const isDay3 = location.pathname === '/day/3';

  // Handle route changes: pause immediately on Day 3
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isDay3) {
      if (!audio.paused) {
        audio.pause();
      }
    } else if (isPlaying && audio.paused) {
      audio.play().catch(() => {});
    }
  }, [isDay3, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;
    audio.loop = true;

    // Do not autoplay on Day 3
    if (isDay3) {
      return;
    }

    // 1. Try immediate autoplay
    const tryPlay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay delayed by browser until user touches screen
            setIsPlaying(true); // Keep state as "On" so UI shows Music On
          });
      }
    };

    tryPlay();

    // 2. Fallback for mobile: unlock audio on her very first touch/scroll
    const unlockOnFirstTouch = () => {
      if (audio && audio.paused && !isDay3) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      events.forEach(evt => window.removeEventListener(evt, unlockOnFirstTouch));
    };

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
    events.forEach(evt => window.addEventListener(evt, unlockOnFirstTouch, { once: true, passive: true }));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, unlockOnFirstTouch));
    };
  }, [isDay3]);

  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Audio play error', err));
      setIsPlaying(true);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        loop
        preload="auto"
      />

      {/* Floating Music Toggle Pill (hidden on Day 3 for cinematic story & direct video audio) */}
      {!isDay3 && (
        <div
          style={{
            position: 'fixed',
            bottom: 'max(1.2rem, calc(env(safe-area-inset-bottom) + 0.8rem))',
            right: 'max(1.2rem, calc(env(safe-area-inset-right) + 0.8rem))',
            zIndex: 9990,
          }}
        >
        <motion.button
          onClick={toggleMusic}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: isPlaying
              ? 'rgba(232, 99, 122, 0.22)'
              : 'rgba(20, 20, 20, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${isPlaying ? 'rgba(232, 99, 122, 0.5)' : 'rgba(255, 255, 255, 0.12)'}`,
            borderRadius: '30px',
            padding: '0.5rem 0.9rem',
            color: isPlaying ? 'var(--rose-light)' : 'var(--white-dim)',
            cursor: 'pointer',
            boxShadow: isPlaying
              ? '0 6px 20px rgba(232, 99, 122, 0.35)'
              : '0 4px 16px rgba(0,0,0,0.5)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            transition: 'all 0.3s ease',
          }}
        >
          {isPlaying ? (
            <>
              {/* Equalizer wave bars */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                <span className="eq-bar eq-bar-1" />
                <span className="eq-bar eq-bar-2" />
                <span className="eq-bar eq-bar-3" />
              </span>
              <span>Music On</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.85rem' }}>🔇</span>
              <span>Music Off</span>
            </>
          )}
        </motion.button>

        {/* Minimal Toast Popup */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              style={{
                position: 'absolute',
                bottom: '115%',
                right: 0,
                background: 'rgba(10, 10, 10, 0.92)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.7rem',
                color: 'var(--white)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {isPlaying ? '🎵 Playing' : '🔇 Paused'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )}
  </>
);
}
