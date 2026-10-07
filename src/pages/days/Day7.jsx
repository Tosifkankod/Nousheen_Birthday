import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DayNav from '../../components/DayNav';

// Gentle warm audio chime when opening
function playWarmChime() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.8);
  } catch {
    // Ignore audio failures
  }
}

export default function Day7() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('intro'); // 'intro' | 'letter'
  const [introStep, setIntroStep] = useState(0);

  // Timed progression of the intro sequence
  useEffect(() => {
    if (stage !== 'intro') return;

    if (introStep < 6) {
      const timer = setTimeout(() => {
        setIntroStep((prev) => prev + 1);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [stage, introStep]);

  const handleOpenLetter = () => {
    playWarmChime();
    setStage('letter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#050407',
        color: '#f6f1ea',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background warm ambiance & subtle floating particles */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(circle at 50% 12%, rgba(201, 169, 110, 0.06) 0%, rgba(232, 99, 122, 0.03) 40%, transparent 75%)',
        }}
      />

      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* INTRO SCREEN: BLACK SCREEN TO SLOW REVEAL                    */}
        {/* ============================================================ */}
        {stage === 'intro' && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } }}
            style={{
              minHeight: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: '#040306',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>
              {/* Small subtle text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(201, 169, 110, 0.65)',
                  textTransform: 'uppercase',
                  marginBottom: '2.5rem',
                }}
              >
                DAY 07
              </motion.div>

              {/* Sequential Fade-In Text */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.4rem',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.15rem, 4vw, 1.45rem)',
                  color: 'rgba(246, 241, 234, 0.92)',
                  lineHeight: 1.6,
                }}
              >
                {introStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{
                      fontSize: 'clamp(1.4rem, 5vw, 1.85rem)',
                      color: 'var(--gold, #c9a96e)',
                      fontStyle: 'italic',
                    }}
                  >
                    Nousheen...
                  </motion.p>
                )}

                {introStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{ color: 'rgba(246, 241, 234, 0.75)', fontSize: '1.05rem' }}
                  >
                    Tonight, I don't want to make you play a game.
                  </motion.p>
                )}

                {introStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{ color: 'rgba(246, 241, 234, 0.75)', fontSize: '1.05rem' }}
                  >
                    I don't want to ask you anything.
                  </motion.p>
                )}

                {introStep >= 4 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{ color: 'rgba(246, 241, 234, 0.9)' }}
                  >
                    I just want to write to you.
                  </motion.p>
                )}

                {introStep >= 5 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{
                      fontStyle: 'italic',
                      color: 'var(--gold, #c9a96e)',
                      fontSize: '1.2rem',
                    }}
                  >
                    One letter.
                  </motion.p>
                )}

                {introStep >= 6 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    style={{
                      fontSize: '1.1rem',
                      color: 'rgba(246, 241, 234, 0.95)',
                      marginTop: '0.5rem',
                    }}
                  >
                    For my bachaa. 🤍
                  </motion.p>
                )}
              </div>

              {/* Button */}
              {introStep >= 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.35 }}
                  style={{ marginTop: '3.5rem' }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, letterSpacing: '0.28em' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOpenLetter}
                    id="day7-open-heart-btn"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(201, 169, 110, 0.45)',
                      color: 'var(--gold, #c9a96e)',
                      padding: '0.95rem 2.4rem',
                      borderRadius: '2rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(201, 169, 110, 0.12)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    OPEN MY HEART
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* MAIN STAGE: TOSIF'S EXACT CONTINUOUS LOVE LETTER             */}
        {/* ============================================================ */}
        {stage === 'letter' && (
          <motion.div
            key="letter-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              paddingTop: 'max(5.5rem, calc(env(safe-area-inset-top) + 4.5rem))',
              paddingBottom: 'max(6.5rem, calc(env(safe-area-inset-bottom) + 4.5rem))',
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <DayNav dayNumber={7} />

            {/* Dark warm paper container */}
            <div
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                background: 'linear-gradient(180deg, #100d15 0%, #0c0911 60%, #07050a 100%)',
                border: '1px solid rgba(201, 169, 110, 0.16)',
                borderRadius: '1.5rem',
                padding: 'clamp(2rem, 6vw, 3.5rem) clamp(1.4rem, 5vw, 2.75rem)',
                boxShadow:
                  '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                position: 'relative',
              }}
            >
              {/* Soft Candle-like ambient glow at top */}
              <div
                style={{
                  position: 'absolute',
                  top: '-35px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201, 169, 110, 0.14) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Date & Note Indicator */}
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(201, 169, 110, 0.6)',
                  marginBottom: '2.5rem',
                }}
              >
                LATE NIGHT • TO NOUSHEEN
              </div>

              {/* Salutation */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 5vw, 2.3rem)',
                  color: 'var(--gold, #c9a96e)',
                  fontWeight: 500,
                  marginBottom: '2rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Nousheen,
              </motion.h1>

              {/* ====================================================== */}
              {/* CONTINUOUS LETTER BODY                                 */}
              {/* ====================================================== */}
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.05rem, 3.4vw, 1.2rem)',
                  lineHeight: 2.1,
                  color: 'rgba(246, 241, 234, 0.92)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.85rem',
                }}
              >
                {/* 1 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Nousheen, I have loved you so much that there aren't even that many stars in the whole universe.
                </motion.p>

                {/* 2 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Thinking about you makes me smile and motivates me that I have a long, long future with you.
                </motion.p>

                {/* 3 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I wanna give you every happiness, that's why Allah has brought us together.
                </motion.p>

                {/* 4 - Noor Highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    paddingLeft: '1rem',
                    borderLeft: '2px solid rgba(201, 169, 110, 0.35)',
                    margin: '0.4rem 0',
                  }}
                >
                  <p style={{ marginBottom: '0.65rem' }}>
                    You are so, so pretty my girl. By pretty, I mean <span style={{ color: 'var(--gold, #c9a96e)', fontStyle: 'italic' }}>nooor</span>... may Allah give you even more nooor.
                  </p>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.75rem',
                      color: 'rgba(201, 169, 110, 0.55)',
                      fontStyle: 'italic',
                      marginTop: '0.35rem',
                    }}
                  >
                    ~ mera noor 🤍 ~
                  </div>
                </motion.div>

                {/* 5 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I know you wanna marry me, so do I—more, more than you.
                </motion.p>

                {/* 6 - Hugging Pillow */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    color: 'rgba(246, 241, 234, 0.96)',
                    fontSize: 'clamp(1.08rem, 3.5vw, 1.24rem)',
                  }}
                >
                  Every day I hug tightly my pillow thinking it's you.
                </motion.p>

                {/* 7 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I do extra gym because you like it. 😂
                </motion.p>

                {/* 8 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I'll totally change myself for you.
                </motion.p>

                {/* 9 - Biwi paglu & Nousheen paglu */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  <p>I'll be your biwi-paglu, and you'll be my Nousheen-paglu.</p>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.75rem',
                      color: 'rgba(232, 99, 122, 0.65)',
                      display: 'inline-block',
                      marginTop: '0.25rem',
                    }}
                  >
                    ~ biwi paglu 😂 ~
                  </span>
                </motion.div>

                {/* 10 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I have shared with you the things that I literally cannot even think of saying to someone.
                </motion.p>

                {/* 11 - Free near you */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    fontSize: 'clamp(1.1rem, 3.6vw, 1.26rem)',
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  I'm free near you, my bachaaaa.
                </motion.p>

                {/* 12 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Jab se we are talking with each other, it's like 2 months now, and it feels like it's been 2 years.
                </motion.p>

                {/* 13 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I feel butterflies talking to you.
                </motion.p>

                {/* 14 - Sukoon & Queen */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    padding: '1.2rem 1.35rem',
                    background: 'rgba(201, 169, 110, 0.05)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(201, 169, 110, 0.16)',
                  }}
                >
                  <p style={{ marginBottom: '0.4rem', color: 'var(--gold, #c9a96e)', fontStyle: 'italic', fontSize: '1.12rem' }}>
                    I feel sukoon...
                  </p>
                  <p>
                    Like agar mere paas kuch bhi nahi, bas aap ho, I can take over the world and do everything for my queen.
                  </p>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.72rem',
                      color: 'rgba(201, 169, 110, 0.55)',
                      display: 'inline-block',
                      marginTop: '0.4rem',
                    }}
                  >
                    ~ my queen ~
                  </span>
                </motion.div>

                {/* 15 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Keep this in mind: the way I love you, no one in this entire world can.
                </motion.p>

                {/* 16 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I feel very happy to express my feelings to you, it's like there's no tension in my life.
                </motion.p>

                {/* 17 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{ color: 'var(--gold, #c9a96e)', fontStyle: 'italic' }}
                >
                  I imagine our future married life...
                </motion.p>

                {/* 18 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Hugs every day, long drives, dancing, singing, books, movies, sleeping together, creating memories.
                </motion.p>

                {/* 19 & 20 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I'll never make you sad, my girl. I'll never let a single drop of tears come out of your eyes. I'll protect you from everything, you will be smiling every, every day.
                </motion.p>

                {/* 21 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{ fontStyle: 'italic' }}
                >
                  By just imagining this, I got tears in my eyes.
                </motion.p>

                {/* 22 - So much love */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    fontSize: 'clamp(1.15rem, 3.8vw, 1.35rem)',
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  I love you so, so, so, so, so much.
                </motion.p>

                {/* 23 - Small hands */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{ color: 'rgba(246, 241, 234, 0.95)' }}
                >
                  Kissing your small hands... <span style={{ color: 'var(--gold, #c9a96e)', fontStyle: 'italic' }}>waaah</span>.
                </motion.p>

                {/* 24 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  After meeting you, I have got so, so much confidence that I'll fight for you with my family—I mean in a good way, I'll fight for you.
                </motion.p>

                {/* 25 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  And to do this I need some time, Nousheen. Yes, I'm trying to convince my mom.
                </motion.p>

                {/* 26, 27, 28 - Real Struggles */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    paddingLeft: '1rem',
                    borderLeft: '2px solid rgba(255, 255, 255, 0.15)',
                    margin: '0.4rem 0',
                  }}
                >
                  <p style={{ marginBottom: '0.75rem' }}>
                    I have responsibilities because of my sister's marriage, and my brother is gone.
                  </p>
                  <p style={{ marginBottom: '0.75rem' }}>
                    I'm working very hard and I'm not sleeping well.
                  </p>
                  <p>
                    I want to give you the life you deserve.
                  </p>
                </motion.div>

                {/* 29 & 30 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Yeah, I'm earning very good now, but I want to do more. That's why I'm focusing on my business. I don't want that I'll be in a job the whole time after getting married. I wanna spend time with you.
                </motion.p>

                {/* 31 - Dream & Support */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    fontSize: 'clamp(1.08rem, 3.5vw, 1.22rem)',
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  You are my dream now, and I'll achieve it. I just need your support.
                </motion.p>

                {/* 32 - Promise */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    fontSize: 'clamp(1.12rem, 3.6vw, 1.28rem)',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                >
                  I promise you I will marry you only.
                </motion.p>

                {/* 33 & 34 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I have truly loved you and wanna give you the best life. I also know that you will not be happy with another guy.
                </motion.p>

                {/* 35, 36, 37 */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  <p style={{ marginBottom: '0.65rem' }}>
                    I need your support. I want you to fight for me like I did.
                  </p>
                  <p style={{ color: 'var(--gold, #c9a96e)', fontStyle: 'italic' }}>
                    Life is only one, don't let it get ruined, wallahi.
                  </p>
                </motion.div>

                {/* 38 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I'll be your strength. Just think about me whenever you are sad, I'll be with you forever.
                </motion.p>

                {/* 39 - Sabr */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    fontSize: '1.25rem',
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  Sabr is everything.
                </motion.p>

                {/* 40 - The Meeting & Relief */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    padding: '1.3rem 1.4rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <p style={{ color: '#fff', fontSize: 'clamp(1.08rem, 3.5vw, 1.22rem)', lineHeight: 1.9 }}>
                    Itni saari pareshaniyon ke baad jab hum actually milenge, main aapko gale lagaunga sab ke saamne... think about the relief.
                  </p>
                </motion.div>

                {/* 41 & 42 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  This is a test from Allah. Woh pehle pareshaniyon se aazmata hai taaki hum toote na.
                </motion.p>

                {/* 43 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  You have to believe in me, you have to believe that we'll get married, you have to manifest like I'm doing.
                </motion.p>

                {/* 44 - Yusuf & Zulaikha */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{ color: 'rgba(246, 241, 234, 0.88)' }}
                >
                  Zulaikha ko 15 saal baad mile the Yusuf, woh unka yakeen tha Allah pe, unko bharosa tha.
                </motion.p>

                {/* 45 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  Nousheen, bahot saare imtehaan honge, you have to be strong.
                </motion.p>

                {/* 46 - Belief */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  I believe in you, I believe in my love, I believe in Allah, aur is cheez pe thoda bhi shak nahi hona chahiye.
                </motion.p>

                {/* 47 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I'm not giving you motivation or anything, it's reality. Be strong, don't fear anyone except Allah.
                </motion.p>


                {/* 49 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I'm not telling you to just sabr. It's never late, my bacha.
                </motion.p>

                {/* 50 & 51 */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                >
                  I'll never ever betray you. I'm always with you, always. You are my world, I wanna spend the rest of my life with you.
                </motion.p>

                {/* 52 & 53 - Challenges & Quran */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    paddingLeft: '1rem',
                    borderLeft: '2px solid rgba(201, 169, 110, 0.35)',
                    margin: '0.4rem 0',
                  }}
                >
                  <p style={{ marginBottom: '0.75rem' }}>
                    I need your support, and obviously this will be hard, but Allah is with us.
                  </p>
                  <p>
                    We will face challenges, and maybe there can be a case where you have to convey it to your parents. Don't be afraid, you are not doing anything wrong, neither am I. Quran says marry to whom you love.
                  </p>
                </motion.div>

                {/* 54 - Fragile Heart */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.75 }}
                  style={{
                    fontSize: 'clamp(1.1rem, 3.6vw, 1.28rem)',
                    color: 'var(--gold, #c9a96e)',
                    fontStyle: 'italic',
                  }}
                >
                  Nousheen, you have my heart and it is very fragile, keep it safe.
                </motion.p>

                {/* 55 - Final Line */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-25px' }}
                  transition={{ duration: 0.85 }}
                  style={{
                    marginTop: '1rem',
                    padding: '1.4rem',
                    background: 'rgba(201, 169, 110, 0.06)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(201, 169, 110, 0.22)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'clamp(1.12rem, 3.8vw, 1.32rem)',
                      color: 'var(--gold, #c9a96e)',
                      fontStyle: 'italic',
                      lineHeight: 1.85,
                      marginBottom: '0.5rem',
                    }}
                  >
                    Nousheen, I had loved you, I'm loving you, and I will love you till my last breath.
                  </p>
                  <p
                    style={{
                      fontSize: '1.15rem',
                      color: '#fff',
                      fontWeight: 500,
                    }}
                  >
                    We both together are strong.
                  </p>
                </motion.div>

                {/* Signature */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <p style={{ color: 'rgba(246, 241, 234, 0.7)', marginBottom: '0.35rem' }}>
                    Always yours,
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      color: 'var(--gold, #c9a96e)',
                      fontStyle: 'italic',
                      fontWeight: 600,
                    }}
                  >
                    Tosif.
                  </p>
                </motion.div>
              </div>

              {/* ====================================================== */}
              {/* QUIET, PEACEFUL STILL ENDING                           */}
              {/* ====================================================== */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 1.5, delay: 0.4 }}
                style={{
                  marginTop: '5.5rem',
                  paddingTop: '3.5rem',
                  borderTop: '1px solid rgba(201, 169, 110, 0.15)',
                  textAlign: 'center',
                }}
              >
                {/* Arabic Name */}
                <div
                  style={{
                    fontFamily: 'var(--font-arabic, serif)',
                    fontSize: '2.4rem',
                    color: 'var(--gold, #c9a96e)',
                    marginBottom: '0.35rem',
                    direction: 'rtl',
                    letterSpacing: '0.05em',
                  }}
                >
                  نوشين
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'rgba(246, 241, 234, 0.7)',
                    fontSize: '1rem',
                    marginBottom: '2rem',
                  }}
                >
                  my bachaa.
                </p>

                <div
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.25em',
                    color: 'rgba(201, 169, 110, 0.75)',
                    marginBottom: '0.85rem',
                    textTransform: 'uppercase',
                  }}
                >
                  DAY 07
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    color: 'rgba(246, 241, 234, 0.85)',
                    fontStyle: 'italic',
                    maxWidth: '400px',
                    margin: '0 auto 2.5rem',
                    lineHeight: 1.7,
                  }}
                >
                  "Some feelings are too big to fit inside a single letter."
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '2rem',
                    background: 'rgba(201, 169, 110, 0.08)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: 'var(--gold, #c9a96e)',
                    textTransform: 'uppercase',
                    marginBottom: '2.5rem',
                  }}
                >
                  DAY 07 COMPLETE 🤍
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="btn"
                    id="day7-scroll-top-btn"
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.8rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '2rem',
                      color: 'rgba(246, 241, 234, 0.7)',
                    }}
                  >
                    ↑ Re-read from top
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="btn"
                    id="day7-return-home-btn"
                    style={{
                      background: 'none',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      fontSize: '0.8rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '2rem',
                      color: 'var(--gold, #c9a96e)',
                    }}
                  >
                    Return to Calendar →
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
