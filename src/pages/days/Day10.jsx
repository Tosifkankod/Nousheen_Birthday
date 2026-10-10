import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import DayNav from '../../components/DayNav';
import UniverseCanvas from '../../components/day10/UniverseCanvas';
import FutureCoupleCanvas from '../../components/day10/FutureCoupleCanvas';
import { saveResponse, syncPendingResponses } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';
import './Day10.css';
import {
  DAY10_SCENE1_PHRASES,
  DAY10_SCENE1_ENDING,
  DAY10_SCENE2_PARAGRAPHS,
  DAY10_STARS,
  DAY10_TWO_LIGHTS_LINES,
  DAY10_FUTURE_LINES,
  DAY10_FINAL_SECTION,
} from '../../data/day10Data';

export default function Day10() {
  const navRef = useRef(null);

  // Session ID for response tracking to Excel/Google Sheets
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const id = getOrCreateSessionId(10);
    setSessionId(id);
  }, []);

  // Active Scene (1 to 6)
  const [scene, setScene] = useState(() => {
    try {
      const saved = localStorage.getItem('day10_scene_num');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Smooth scroll active nav pill into view on mobile
  useEffect(() => {
    const activeBtn = navRef.current?.querySelector('.day10-nav-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [scene]);

  // Scene 6: Nousheen's input state (synced to Excel)
  const [userNote, setUserNote] = useState(() => {
    try {
      return localStorage.getItem('day10_nousheen_note') || '';
    } catch {
      return '';
    }
  });
  const [noteSubmitted, setNoteSubmitted] = useState(() => {
    try {
      return localStorage.getItem('day10_nousheen_note_submitted') === 'true';
    } catch {
      return false;
    }
  });
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const changeScene = (num) => {
    setScene(num);
    try {
      localStorage.setItem('day10_scene_num', String(num));
    } catch {
      // ignore
    }
  };

  // =========================================================================
  // Web Audio Synthesizer (Gentle, elegant romantic tones)
  // =========================================================================
  const playTone = (freq = 440, type = 'sine', duration = 0.5, gainVal = 0.05) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported
    }
  };

  const playStarChime = () => {
    playTone(659.25, 'sine', 0.8, 0.04); // E5
    setTimeout(() => playTone(830.61, 'sine', 0.9, 0.035), 90); // G#5
    setTimeout(() => playTone(987.77, 'sine', 1.1, 0.03), 190); // B5
  };

  const playMergeBurstTone = () => {
    playTone(523.25, 'triangle', 0.8, 0.06); // C5
    setTimeout(() => playTone(659.25, 'sine', 1.0, 0.05), 80);
    setTimeout(() => playTone(783.99, 'sine', 1.2, 0.04), 160);
    setTimeout(() => playTone(1046.5, 'sine', 1.5, 0.03), 240);
  };

  // =========================================================================
  // SCENE 1: THE SCREEN FILLS WITH HER NAME
  // =========================================================================
  const [scene1Stage, setScene1Stage] = useState(0); // 0: dark/typing, 1: expanding cloud, 2: converged ending

  useEffect(() => {
    if (scene !== 1) return;

    const t1 = setTimeout(() => setScene1Stage(1), 1800);
    const t2 = setTimeout(() => setScene1Stage(2), 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [scene]);

  // =========================================================================
  // SCENE 2: MY MESSAGE TO NOUSHEEN
  // =========================================================================
  const [letterIndex, setLetterIndex] = useState(0);

  const handleNextLetterPart = () => {
    playTone(480, 'sine', 0.25, 0.03);
    if (letterIndex < DAY10_SCENE2_PARAGRAPHS.length - 1) {
      setLetterIndex((prev) => prev + 1);
    }
  };

  // =========================================================================
  // SCENE 3: THE 3D UNIVERSE OF MY LOVE (6 STARS)
  // =========================================================================
  const [discoveredStars, setDiscoveredStars] = useState(() => {
    try {
      const saved = localStorage.getItem('day10_discovered_stars');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeStarModal, setActiveStarModal] = useState(null);

  const handleSelectStar = (id) => {
    playStarChime();
    const starData = DAY10_STARS.find((s) => s.id === id);
    if (starData) {
      setActiveStarModal(starData);
    }

    if (!discoveredStars.includes(id)) {
      const updated = [...discoveredStars, id];
      setDiscoveredStars(updated);
      try {
        localStorage.setItem('day10_discovered_stars', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const allStarsDiscovered = discoveredStars.length >= 6;

  // =========================================================================
  // SCENE 4: TWO LIGHTS, ONE STORY (DRAG TO MERGE)
  // =========================================================================
  const [lightsDragProgress, setLightsDragProgress] = useState(0);
  const [lightsMerged, setLightsMerged] = useState(false);

  const handleLightsMerged = () => {
    if (lightsMerged) return;
    playMergeBurstTone();
    setLightsMerged(true);
    setLightsDragProgress(1);
  };

  const handleSliderDrag = (e) => {
    const val = parseFloat(e.target.value);
    setLightsDragProgress(val);
    if (val >= 0.95 && !lightsMerged) {
      handleLightsMerged();
    }
  };

  // Replay from Scene 3 without clearing progress
  const handleReplayUniverse = () => {
    changeScene(3);
    setActiveStarModal(null);
    setLightsMerged(false);
    setLightsDragProgress(0);
  };

  // Submit Nousheen's personal message to Excel / Google Sheets
  const handleSubmitNote = async (e) => {
    e?.preventDefault();
    if (!userNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      await saveResponse({
        sessionId: sessionId || getOrCreateSessionId(10),
        day: 10,
        questionId: 'day10_final_note_to_tosif',
        question: 'What is on your heart, Nousheen? (A message to Tosif)',
        optionId: 'typed_note',
        answer: userNote.trim(),
        customText: userNote.trim(),
        timestamp: new Date().toISOString(),
      });

      syncPendingResponses();

      try {
        localStorage.setItem('day10_nousheen_note', userNote.trim());
        localStorage.setItem('day10_nousheen_note_submitted', 'true');
      } catch {
        // ignore
      }
      setNoteSubmitted(true);
      playTone(659.25, 'sine', 0.8, 0.05);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#e8c37d', '#fbe2a8', '#ffffff', '#f48fb1'],
        });
      } catch (_) {}
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="day10-wrapper">
      {/* Top Header / Day Navigation */}
      <DayNav dayNumber={10} />

      {/* Background Starry Dust */}
      <div className="day10-stars-bg" />

      {/* Scene Navigation Pill Bar */}
      <div className="day10-nav-pills" ref={navRef}>
        <button
          onClick={() => changeScene(1)}
          className={`day10-nav-btn ${scene === 1 ? 'active' : ''}`}
        >
          1. Her Name
        </button>
        <span className="day10-nav-sep">·</span>
        <button
          onClick={() => changeScene(2)}
          className={`day10-nav-btn ${scene === 2 ? 'active' : ''}`}
        >
          2. Letter
        </button>
        <span className="day10-nav-sep">·</span>
        <button
          onClick={() => changeScene(3)}
          className={`day10-nav-btn ${scene === 3 ? 'active' : ''}`}
        >
          3. Universe ({discoveredStars.length}/6)
        </button>
        <span className="day10-nav-sep">·</span>
        <button
          onClick={() => changeScene(4)}
          className={`day10-nav-btn ${scene === 4 ? 'active' : ''}`}
        >
          4. Two Lights
        </button>
        <span className="day10-nav-sep">·</span>
        <button
          onClick={() => changeScene(5)}
          className={`day10-nav-btn ${scene === 5 ? 'active' : ''}`}
        >
          5. Our Future
        </button>
        <span className="day10-nav-sep">·</span>
        <button
          onClick={() => changeScene(6)}
          className={`day10-nav-btn ${scene === 6 ? 'active' : ''}`}
        >
          6. Final
        </button>
      </div>

      {/* =================================================================== */}
      {/* SCENE 1: THE SCREEN FILLS WITH HER NAME                            */}
      {/* =================================================================== */}
      {scene === 1 && (
        <section className="day10-section">
          <div className="day10-scene1-viewport">
            {/* Stage 0 & 1: Typography cloud floating across screen */}
            {scene1Stage < 2 && (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                {DAY10_SCENE1_PHRASES.map((p, idx) => (
                  <motion.div
                    key={idx}
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                      x: `${p.x * 1.1}vw`,
                      y: `${p.y * 0.9}vh`,
                      rotate: p.rot * 1.5,
                    }}
                    animate={{
                      opacity: [0, 0.95, 0.8],
                      scale: [0.7, 1.05, 1],
                      x: [`${p.x * 1.1}vw`, `${p.x * 0.95}vw`, `${p.x * 0.9}vw`],
                      y: [`${p.y * 0.9}vh`, `${p.y * 0.78}vh`, `${p.y * 0.75}vh`],
                      rotate: [p.rot * 1.5, p.rot, p.rot],
                    }}
                    transition={{
                      duration: 2.4,
                      delay: p.delay,
                      ease: 'easeOut',
                    }}
                    className="day10-floating-phrase"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: p.isArabic ? 'clamp(2.6rem, 9vw, 5.5rem)' : 'clamp(1.1rem, 3.6vw, 2.4rem)',
                      fontFamily: p.font,
                      color: p.color,
                    }}
                  >
                    {p.text}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Stage 2: Words drift away, leaving one handwritten sentence */}
            {scene1Stage === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="day10-scene1-center-box"
              >
                <div style={{ fontFamily: 'Amiri, serif', fontSize: '2.8rem', color: '#fbe2a8', marginBottom: '8px' }}>
                  نوشين
                </div>
                <p className="day10-scene1-quote">
                  "{DAY10_SCENE1_ENDING}"
                </p>

                <button
                  id="btn-read-my-message"
                  onClick={() => {
                    playTone(520, 'sine', 0.4, 0.05);
                    changeScene(2);
                  }}
                  className="day10-glow-btn"
                >
                  READ MY MESSAGE →
                </button>
              </motion.div>
            )}

            {/* Quick Skip or Replay */}
            <div style={{ position: 'absolute', bottom: '18px', zIndex: 25 }}>
              {scene1Stage < 2 ? (
                <button
                  onClick={() => setScene1Stage(2)}
                  className="day10-link-btn"
                >
                  Skip intro →
                </button>
              ) : (
                <button
                  onClick={() => setScene1Stage(0)}
                  className="day10-link-btn"
                >
                  ↺ Replay animation
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* SCENE 2: MY MESSAGE TO NOUSHEEN                                    */}
      {/* =================================================================== */}
      {scene === 2 && (
        <section className="day10-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="day10-letter-card"
          >
            {/* Header */}
            <div className="day10-letter-header">
              <span className="day10-letter-step">Personal Love Letter</span>
              <span className="day10-letter-tag">From Tosif to Nousheen</span>
            </div>

            {/* Paragraphs revealed up to current index */}
            <div style={{ minHeight: '260px' }}>
              {DAY10_SCENE2_PARAGRAPHS.slice(0, letterIndex + 1).map((p, pIdx) => {
                const isPromise = p.includes("I will marry you, inshaAllah");
                const isWorld = p.includes("You are my world, my wifey, my habiti");

                return (
                  <motion.p
                    key={pIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`day10-letter-p ${isPromise || isWorld ? 'special-bold' : ''}`}
                  >
                    {p}
                  </motion.p>
                );
              })}
            </div>

            {/* If all paragraphs revealed, show Arabic name & next button */}
            {letterIndex === DAY10_SCENE2_PARAGRAPHS.length - 1 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}
              >
                <div className="day10-letter-arabic-sig">
                  نوشين
                </div>
                <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.4rem', color: '#fbe2a8', margin: '6px 0 20px 0' }}>
                  Come, bachaa. I want to show you something. ✨
                </p>

                <button
                  id="btn-enter-our-universe"
                  onClick={() => {
                    playTone(550, 'sine', 0.4, 0.05);
                    changeScene(3);
                  }}
                  className="day10-glow-btn"
                >
                  ENTER OUR UNIVERSE ✨
                </button>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={handleNextLetterPart}
                  className="day10-glow-btn"
                  style={{ padding: '10px 24px', fontSize: '0.8rem' }}
                >
                  Read next line →
                </button>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* =================================================================== */}
      {/* SCENE 3: THE 3D UNIVERSE OF MY LOVE (6 INTERACTIVE STARS)           */}
      {/* =================================================================== */}
      {scene === 3 && (
        <section className="day10-section">
          <div className="day10-universe-wrapper">
            {/* Introductory Header */}
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                color: '#fbe2a8',
                fontWeight: 400,
                margin: 0,
              }}>
                A Little Universe Made For You ✨
              </h2>
              <p style={{
                fontSize: '0.86rem',
                color: 'rgba(247, 244, 237, 0.8)',
                maxWidth: '620px',
                margin: '8px auto 0 auto',
                lineHeight: 1.5,
              }}>
                “Nousheen… I have so many things in my heart that I don't always know how to explain. So today, I made you a little universe. Explore it, bachaa. Every glowing star has something I want you to know.”
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '20px',
                background: 'rgba(0, 0, 0, 0.55)',
                border: '1px solid rgba(232, 195, 125, 0.3)',
                fontSize: '0.78rem',
                color: '#e8c37d',
                marginTop: '10px',
              }}>
                <span>Touch a glowing star to discover what's inside</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span style={{ fontWeight: 600 }}>{discoveredStars.length} of 6 stars discovered</span>
              </div>
            </div>

            {/* 3D Universe Viewport */}
            <div className="day10-universe-canvas-container">
              <UniverseCanvas
                stars={DAY10_STARS}
                discoveredStars={discoveredStars}
                onSelectStar={handleSelectStar}
                isScene4={false}
              />
            </div>

            {/* Star Quick-Select HUD Chips below canvas - zero canvas overlap */}
            <div className="day10-stars-hud">
              {DAY10_STARS.map((s) => {
                const isOpened = discoveredStars.includes(s.id);
                return (
                  <button
                    key={s.id}
                    id={`star-btn-${s.id}`}
                    onClick={() => handleSelectStar(s.id)}
                    className={`day10-star-hud-btn ${isOpened ? 'discovered' : ''}`}
                    title={s.title}
                  >
                    <span>{s.icon}</span>
                    <span>{s.badge}</span>
                    {isOpened && <span style={{ color: '#e8c37d' }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Unlock Scene 4 Banner if all 6 stars discovered */}
            {allStarsDiscovered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '20px', textAlign: 'center' }}
              >
                <button
                  id="btn-goto-scene4"
                  onClick={() => {
                    playMergeBurstTone();
                    changeScene(4);
                  }}
                  className="day10-glow-btn"
                >
                  DISCOVER TWO LIGHTS, ONE STORY →
                </button>
              </motion.div>
            )}

            {/* Star Message Drawer / Modal with Backdrop */}
            <AnimatePresence>
              {activeStarModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setActiveStarModal(null)}
                    className="day10-star-drawer-backdrop"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                    className="day10-star-drawer"
                  >
                    <div className="day10-star-drawer-header">
                      <h4 className="day10-star-drawer-title">
                        <span>{activeStarModal.icon}</span>
                        <span>{activeStarModal.title}</span>
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.74rem', color: 'rgba(232, 195, 125, 0.7)', fontFamily: 'var(--font-mono, monospace)' }}>
                          {activeStarModal.badge}
                        </span>
                        <button
                          onClick={() => setActiveStarModal(null)}
                          className="day10-star-close-icon"
                          aria-label="Close star drawer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <p className="day10-star-drawer-msg">
                      "{activeStarModal.message}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setActiveStarModal(null)}
                        className="day10-glow-btn"
                        style={{ padding: '8px 20px', fontSize: '0.78rem' }}
                      >
                        Close Star ❤️
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* SCENE 4: TWO LIGHTS, ONE STORY                                     */}
      {/* =================================================================== */}
      {scene === 4 && (
        <section className="day10-section">
          <div className="day10-universe-wrapper">
            {/* Poetic Lines Intro */}
            <div style={{ marginBottom: '14px', maxWidth: '620px' }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.6rem, 5vw, 2.3rem)',
                color: '#ffffff',
                fontWeight: 400,
                margin: 0,
              }}>
                Two Lights, One Story
              </h2>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {DAY10_TWO_LIGHTS_LINES.map((line, idx) => (
                  <p key={idx} style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', margin: 0 }}>
                    {line}
                  </p>
                ))}
              </div>
              <p style={{
                fontFamily: 'Caveat, cursive',
                fontSize: '1.35rem',
                color: '#fbe2a8',
                marginTop: '12px',
              }}>
                Bachaa, can you bring our two little worlds closer?
              </p>
            </div>

            {/* 3D Canvas with Two Lights & Drag Target */}
            <div className="day10-universe-canvas-container">
              <UniverseCanvas
                stars={DAY10_STARS}
                discoveredStars={discoveredStars}
                onSelectStar={() => {}}
                isScene4={true}
                onLightsMerged={handleLightsMerged}
                lightsProgress={lightsDragProgress}
                onDragProgress={(p) => setLightsDragProgress(p)}
              />

              {/* Drag instruction indicator */}
              {!lightsMerged && (
                <div className="day10-drag-indicator">
                  <span style={{ fontSize: '0.76rem', color: '#fbe2a8' }}>
                    Drag Nousheen's pink light toward Tosif's blue light 💫
                  </span>
                </div>
              )}
            </div>

            {/* Drag Slider for Touchscreen Ease */}
            {!lightsMerged && (
              <div className="day10-drag-slider-wrap">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={lightsDragProgress}
                  onChange={handleSliderDrag}
                  className="day10-drag-slider"
                />
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Slide to bring our worlds closer ({Math.round(lightsDragProgress * 100)}%)
                </span>
              </div>
            )}

            {/* Constellation Overlay upon Merging */}
            <AnimatePresence>
              {lightsMerged && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="day10-constellation-overlay"
                >
                  <div className="day10-constellation-card">
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      ✨💍✨
                    </div>
                    <div className="day10-constellation-title">
                      TOSHEEN ♡
                    </div>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#fbe2a8', fontStyle: 'italic', margin: '0 0 10px 0' }}>
                      “Abhi screen ke iss paar ho, meri jaan. InshaAllah, ek din mere paas hogi.”
                    </p>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0 0 24px 0' }}>
                      “Until that day, let's keep building towards the life we dream about.”
                    </p>

                    <button
                      id="btn-goto-scene5"
                      onClick={() => {
                        playTone(580, 'sine', 0.4, 0.05);
                        changeScene(5);
                      }}
                      className="day10-glow-btn"
                    >
                      A GLIMPSE OF OUR FUTURE →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* SCENE 5: A LITTLE GLIMPSE OF OUR FUTURE                            */}
      {/* =================================================================== */}
      {scene === 5 && (
        <section className="day10-section">
          <div className="day10-universe-wrapper">
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.6rem, 5vw, 2.3rem)',
              color: '#ffffff',
              fontWeight: 400,
              margin: '0 0 12px 0',
            }}>
              A Little Glimpse of Our Future
            </h2>

            {/* 3D Moonlit Scene of Couple Holding Hands */}
            <div className="day10-universe-canvas-container">
              <FutureCoupleCanvas />
            </div>

            {/* Emotional Dialogue Card */}
            <div className="day10-future-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '20px' }}>
                {DAY10_FUTURE_LINES.map((line, idx) => (
                  <p key={idx} style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    color: idx === 3 ? '#fbe2a8' : 'rgba(247, 244, 237, 0.9)',
                    fontFamily: idx === 3 ? 'Playfair Display, serif' : 'inherit',
                    fontStyle: idx === 3 ? 'italic' : 'normal',
                    margin: 0,
                  }}>
                    {line}
                  </p>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  id="btn-goto-scene6"
                  onClick={() => {
                    playTone(600, 'sine', 0.4, 0.05);
                    changeScene(6);
                  }}
                  className="day10-glow-btn"
                >
                  THE FINAL MESSAGE →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* SCENE 6: THE FINAL MESSAGE                                         */}
      {/* =================================================================== */}
      {scene === 6 && (
        <section className="day10-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="day10-final-box"
          >
            {/* Arabic Name */}
            <div style={{
              fontFamily: 'Amiri, serif',
              fontSize: '4.2rem',
              color: '#fbe2a8',
              textShadow: '0 0 35px rgba(251, 226, 168, 0.6)',
              margin: '0 0 10px 0',
            }}>
              {DAY10_FINAL_SECTION.arabic}
            </div>

            <h3 style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '2.4rem',
              color: '#fbe2a8',
              margin: '0 0 20px 0',
            }}>
              {DAY10_FINAL_SECTION.greeting}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', textAlign: 'left' }}>
              {DAY10_FINAL_SECTION.lines.map((l, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: idx === 2 ? '1.25rem' : '1rem',
                    color: idx === 2 ? '#fbe2a8' : 'rgba(247, 244, 237, 0.92)',
                    fontFamily: idx === 2 ? 'Playfair Display, serif' : 'inherit',
                    fontWeight: idx === 2 ? 600 : 300,
                    lineHeight: 1.7,
                    margin: 0,
                    textAlign: idx === 2 ? 'center' : 'left',
                  }}
                >
                  {l}
                </p>
              ))}
            </div>

            {/* Input tag for Nousheen to type something (synced to Google Sheets / Excel) */}
            <div className="day10-note-box">
              <h4 className="day10-note-title">
                <span>💌</span>
                <span>Kuch kehna hai Tosif ko, meri jaan?</span>
              </h4>
              <p className="day10-note-subtitle">
                Whatever you're thinking, feeling, or want to share with me... write it here. It goes straight to my heart and saved directly for me.
              </p>

              {!noteSubmitted ? (
                <form onSubmit={handleSubmitNote}>
                  <textarea
                    id="day10-nousheen-input"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Type whatever is in your heart, bachaa... I'm listening. ❤️"
                    className="day10-note-textarea"
                    rows={4}
                    maxLength={1000}
                  />

                  <div className="day10-note-actions">
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono, monospace)' }}>
                      {userNote.length}/1000
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmittingNote || !userNote.trim()}
                      className="day10-glow-btn"
                      style={{
                        padding: '10px 24px',
                        fontSize: '0.78rem',
                        opacity: !userNote.trim() || isSubmittingNote ? 0.6 : 1,
                        cursor: !userNote.trim() || isSubmittingNote ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isSubmittingNote ? 'Saving...' : 'SEND TO MY HEART 💌'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="day10-note-success">
                    <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
                      Tumhari baat mere dil tak pahunch gayi, meri jaan. ❤️
                    </p>
                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(247, 244, 237, 0.85)' }}>
                      "{userNote}"
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setNoteSubmitted(false)}
                      className="day10-link-btn"
                      style={{ fontSize: '0.74rem' }}
                    >
                      ✎ Edit / add more
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'inline-block',
              padding: '6px 20px',
              borderRadius: '24px',
              background: 'rgba(232, 195, 125, 0.15)',
              border: '1px solid rgba(232, 195, 125, 0.4)',
              fontSize: '0.82rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#fbe2a8',
              marginBottom: '28px',
            }}>
              {DAY10_FINAL_SECTION.tag}
            </div>

            <div>
              <button
                id="btn-replay-universe"
                onClick={handleReplayUniverse}
                className="day10-glow-btn"
              >
                {DAY10_FINAL_SECTION.button}
              </button>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
