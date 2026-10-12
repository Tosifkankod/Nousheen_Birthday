import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DayNav from '../../components/DayNav';
import Day8TurntableCanvas from '../../components/day8/Day8TurntableCanvas';
import Day8OrbSelector from '../../components/day8/Day8OrbSelector';
import Day8DistanceCanvas from '../../components/day8/Day8DistanceCanvas';
import { day8Sound } from '../../components/day8/Day8Soundscape';
import { DAY8_SONGS } from '../../data/day8Songs';

export default function Day8() {
  const navigate = useNavigate();

  // Current view stage: 'earphones' | 'main' | 'distance' | 'meeting' | 'final-dedication'
  const [stage, setStage] = useState('earphones');
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [answeredSongs, setAnsweredSongs] = useState({});

  // Distance Experience stage
  const [distanceStep, setDistanceStep] = useState(0);
  const [meetingStep, setMeetingStep] = useState(0);

  const audioRef = useRef(null);
  const playerCardRef = useRef(null);

  const currentSong = DAY8_SONGS[activeSongIndex] || DAY8_SONGS[0];

  // Reset playback when song changes
  useEffect(() => {
    setIsPlaying(false);
    setShowEmbed(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeSongIndex]);

  const handleSelectSong = (index) => {
    day8Sound.playChime(index);
    setActiveSongIndex(index);
  };

  const handlePlayToggle = () => {
    if (currentSong.type === 'audio' && currentSong.url) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setShowEmbed(!showEmbed);
      setIsPlaying(!isPlaying);
    }
  };

  const handleScrollToPlayer = () => {
    day8Sound.playChime(0);
    if (playerCardRef.current) {
      playerCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSongInteraction = (songId, answer) => {
    day8Sound.playChime(answer === 'yes' ? 5 : 2);
    setAnsweredSongs((prev) => ({ ...prev, [songId]: answer }));

    if (activeSongIndex === DAY8_SONGS.length - 1 && answer === 'yes') {
      setTimeout(() => {
        day8Sound.playCosmicPulse();
        setStage('distance');
      }, 1200);
    }
  };

  const distanceLabels = [
    { symbol: '∞', note: 'Two worlds apart.' },
    { symbol: 'still far.', note: 'Miles between our hands.' },
    { symbol: 'closer.', note: 'Every day brings us nearer.' },
    { symbol: 'almost.', note: 'The waiting is ending.' },
    { symbol: 'one day...', note: 'No more screens between us.' },
    { symbol: 'together.', note: 'Finally in the same place.' },
  ];

  const handleAdvanceDistance = () => {
    day8Sound.playCosmicPulse();
    if (distanceStep < distanceLabels.length - 1) {
      setDistanceStep((prev) => prev + 1);
    } else {
      setStage('meeting');
      setMeetingStep(0);
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#07050a',
        color: '#f6f1ea',
        position: 'relative',
        overflowX: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <DayNav dayNumber={8} />

      {/* Hidden audio player for local MP3 files */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* ============================================================ */}
      {/* 0. FULL PAGE EARPHONES INTRO SCREEN                           */}
      {/* ============================================================ */}
      <AnimatePresence mode="wait">
        {stage === 'earphones' && (
          <motion.div
            key="stage-earphones"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.8 } }}
            style={{
              minHeight: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 35%, #171120 0%, #06040a 100%)',
              position: 'relative',
              zIndex: 30,
            }}
          >
            {/* Ambient Background Aura */}
            <div
              style={{
                position: 'absolute',
                width: '360px',
                height: '360px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(229, 193, 123, 0.12) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ maxWidth: '480px', width: '100%', position: 'relative', zIndex: 2 }}>
              {/* Top Tag */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.28em',
                  color: '#e5c17b',
                  textTransform: 'uppercase',
                  marginBottom: '2rem',
                }}
              >
                DAY 08 • AUDIO EXPERIENCE
              </motion.div>

              {/* Glowing Headphone Visual */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.2 }}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(229, 193, 123, 0.2) 0%, rgba(20, 14, 25, 0.8) 100%)',
                  border: '1.5px solid rgba(229, 193, 123, 0.4)',
                  boxShadow: '0 0 35px rgba(229, 193, 123, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.8rem',
                  fontSize: '2.5rem',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                >
                  🎧
                </motion.span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                style={{
                  fontFamily: '"Alex Brush", "Playfair Display", cursive',
                  fontSize: 'clamp(2.6rem, 7vw, 3.8rem)',
                  color: '#f8e7b9',
                  margin: '0 0 0.8rem',
                  fontWeight: 400,
                  textShadow: '0 0 20px rgba(255, 225, 150, 0.4)',
                }}
              >
                Put on your earphones...
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.75,
                  margin: '0 0 2.2rem',
                }}
              >
                Nousheen, today is a world built from music and memories.
                <br />
                <span style={{ color: '#ffd57e', fontStyle: 'italic' }}>
                  Please put on your earphones or headphones for the best emotional experience.
                </span>
              </motion.p>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(255, 200, 100, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    day8Sound.playChime(0);
                    setStage('main');
                  }}
                  style={{
                    padding: '0.95rem 2.8rem',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 220, 140, 0.6)',
                    background: 'linear-gradient(135deg, #f5d085 0%, #d89e42 100%)',
                    color: '#1a1005',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(220, 150, 40, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <span>🎧</span>
                  <span>I'M READY — ENTER</span>
                  <span>➔</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 1. MAIN UI SCREEN — EXACT REPLICA OF THE REFERENCE IMAGE       */}
      {/* ============================================================ */}
      {stage === 'main' && (
        <div
          style={{
            position: 'relative',
            minHeight: '100dvh',
            backgroundImage: `radial-gradient(circle at 50% 15%, rgba(20, 14, 25, 0.4) 0%, rgba(5, 3, 8, 0.95) 100%), url('/images/day8/room_background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundAttachment: 'fixed',
            paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))',
            paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))',
          }}
        >
          {/* Subtle warm bokeh & ambient overlay */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'radial-gradient(circle at 50% 35%, rgba(255, 175, 75, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Top Left Header Label: DAY 08 ── */}
          <div
            style={{
              position: 'absolute',
              top: 'max(2rem, calc(env(safe-area-inset-top) + 1.2rem))',
              left: 'clamp(1.5rem, 4vw, 3.5rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.78rem',
                letterSpacing: '0.28em',
                color: '#e5c17b',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              DAY 08
            </span>
            <div style={{ width: '38px', height: '1px', background: 'rgba(229, 193, 123, 0.5)' }} />
          </div>

          {/* Top Right Handwritten Tag: my queen ♡ */}
          <div
            style={{
              position: 'absolute',
              top: 'max(2.2rem, calc(env(safe-area-inset-top) + 1.4rem))',
              right: 'clamp(1.5rem, 5vw, 4rem)',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: '"Alex Brush", "Caveat", cursive',
                fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                color: '#ffd988',
                lineHeight: 1.1,
                margin: 0,
                textShadow: '0 0 12px rgba(255, 217, 136, 0.5)',
              }}
            >
              my<br />queen<br />♡
            </p>
          </div>

          {/* Left Clamped Polaroids & Note: Same Sky Different Places */}
          <div
            style={{
              position: 'absolute',
              top: '14%',
              left: 'clamp(1rem, 3vw, 3rem)',
              zIndex: 5,
              display: 'none', // Shown gracefully on tablet / desktop screens
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className="hidden md:flex"
          >
            <div
              style={{
                background: 'rgba(245, 235, 220, 0.88)',
                padding: '0.8rem 1rem',
                borderRadius: '3px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
                transform: 'rotate(-4deg)',
                maxWidth: '120px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: '1rem',
                  color: '#2a1a10',
                  lineHeight: 1.25,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Same<br />Sky<br />Different<br />Places<br />...<br />Same<br />Hearts<br />♡
              </p>
            </div>
          </div>

          {/* Center Main Header Section */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              maxWidth: '620px',
              margin: '0 auto',
              padding: '0 1.5rem',
            }}
          >
            {/* Earphones Recommendation Badge */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 215, 120, 0.12)',
                border: '1px solid rgba(255, 215, 120, 0.3)',
                borderRadius: '20px',
                padding: '0.35rem 0.95rem',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                marginBottom: '0.75rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span style={{ fontSize: '0.88rem' }}>🎧</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: '#ffd988',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Please use earphones for this experience ♡
              </span>
            </motion.div>

            {/* Cursive Heading: Nousheen... */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              style={{
                fontFamily: '"Alex Brush", "Playfair Display", cursive',
                fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
                color: '#f8e7b9',
                margin: '0 0 0.5rem',
                fontWeight: 400,
                textShadow: '0 0 25px rgba(255, 225, 150, 0.4)',
              }}
            >
              Nousheen...
            </motion.h1>

            {/* Paced Emotional Lines */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.7,
                marginBottom: '1rem',
              }}
            >
              <p style={{ margin: '0 0 0.4rem' }}>
                I have a few songs I want you to listen to.
              </p>
              <p style={{ margin: '0 0 0.4rem' }}>
                But don't just listen to them.
              </p>
              <p style={{ margin: '0 0 0.9rem', color: '#ffd57e', fontStyle: 'italic' }}>
                Listen to why I chose them.
              </p>

              <p style={{ margin: '0 0 0.3rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                Every song reminds me of something.
              </p>
              <p style={{ margin: '0 0 0.3rem' }}>
                Maybe you. Maybe us.
              </p>
              <p style={{ margin: '0 0 0.5rem' }}>
                Maybe the life I imagine with you.
              </p>
              <div style={{ color: '#ffd57e', fontSize: '1rem' }}>♡</div>
            </motion.div>

            {/* LET'S LISTEN Button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 200, 100, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToPlayer}
              style={{
                padding: '0.75rem 2.4rem',
                borderRadius: '50px',
                border: '1px solid rgba(255, 220, 140, 0.6)',
                background: 'linear-gradient(135deg, #f5d085 0%, #d89e42 100%)',
                color: '#1a1005',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(220, 150, 40, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginTop: '0.5rem',
              }}
            >
              <span>▶</span>
              <span>LET'S LISTEN</span>
            </motion.button>
          </div>

          {/* Centerpiece: 3D Turntable & Floating Memory Relics */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '850px',
              height: 'clamp(280px, 45vw, 420px)',
              margin: '0.5rem auto 0',
            }}
          >
            <Day8TurntableCanvas isPlaying={isPlaying} />
          </div>

          {/* 6 Glass Droplet Bubbles Selector */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Day8OrbSelector
              songs={DAY8_SONGS}
              activeIndex={activeSongIndex}
              onSelectSong={handleSelectSong}
            />
          </div>

          {/* ============================================================ */}
          {/* MAIN DETAILED PLAYER GLASS CARD                              */}
          {/* ============================================================ */}
          <div
            ref={playerCardRef}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '960px',
              margin: '0 auto',
              padding: '0 1.25rem',
            }}
          >
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              style={{
                background: 'rgba(14, 10, 20, 0.78)',
                border: '1.5px solid rgba(229, 193, 123, 0.28)',
                borderRadius: '28px',
                padding: 'clamp(1.25rem, 3.5vw, 2.4rem)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.85), inset 0 0 30px rgba(255, 200, 100, 0.05)',
              }}
            >
              {/* Main Card 3-Column Layout */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                  alignItems: 'center',
                }}
              >
                {/* 1. Left Column: Large Vinyl Record with Center Label & Floral Accent */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                    style={{
                      width: 'clamp(200px, 28vw, 260px)',
                      height: 'clamp(200px, 28vw, 260px)',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #0e0c12 28%, #1f1b27 32%, #0c0a10 50%, #221d2a 54%, #0a080e 100%)',
                      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), inset 0 0 25px rgba(255, 220, 130, 0.15)',
                      border: '2px solid rgba(255, 215, 120, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Vinyl Grooves Texture */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '8px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: '24px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Center Artwork Label */}
                    <div
                      style={{
                        width: '46%',
                        height: '46%',
                        borderRadius: '50%',
                        backgroundImage: `url('/images/day8/vinyl_center.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        boxShadow: '0 0 15px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '8px',
                      }}
                    >
                      {/* Dark overlay with cursive title */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)',
                        }}
                      />
                      <span
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          fontFamily: '"Caveat", cursive',
                          fontSize: '0.88rem',
                          color: '#ffe5a3',
                          fontWeight: 700,
                          textAlign: 'center',
                        }}
                      >
                        {currentSong.vinylLabel || 'The Beginning ♡'}
                      </span>
                    </div>

                    {/* Spindle hole */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#0a080e',
                        border: '1.5px solid #d4af37',
                        zIndex: 3,
                      }}
                    />
                  </motion.div>

                  {/* Delicate Baby's Breath Flowers Accent */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '8px',
                      fontSize: '1.6rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
                    }}
                  >
                    🌾
                  </div>
                </div>

                {/* 2. Center Column: Song Info, Story Message & Audio Controls */}
                <div style={{ minWidth: 0 }}>
                  {/* Song Counter */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.2em',
                      color: '#e5c17b',
                      marginBottom: '0.35rem',
                      fontWeight: 600,
                    }}
                  >
                    {currentSong.number} / 06
                  </div>

                  {/* Song Title */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
                      color: '#ffffff',
                      margin: '0 0 0.2rem',
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {currentSong.title}
                  </h2>

                  {/* Artist */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.65)',
                      margin: '0 0 1.2rem',
                    }}
                  >
                    {currentSong.artist}
                  </p>

                  {/* Subhead: "Why I chose this for you..." */}
                  <p
                    style={{
                      fontFamily: 'var(--font-serif, serif)',
                      fontStyle: 'italic',
                      color: '#e5c17b',
                      fontSize: '1rem',
                      margin: '0 0 0.6rem',
                    }}
                  >
                    “Why I chose this for you...”
                  </p>

                  {/* Message body */}
                  <p
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.88)',
                      margin: '0 0 1.5rem',
                    }}
                  >
                    {currentSong.message}
                  </p>

                  {/* Play Action Row (Matching the screenshot) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
                    {/* Main Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePlayToggle}
                      style={{
                        padding: '0.85rem 2.2rem',
                        borderRadius: '50px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #e5b968 0%, #c9963e 100%)',
                        color: '#1a1005',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        boxShadow: '0 6px 20px rgba(229, 185, 104, 0.35)',
                      }}
                    >
                      <span>{isPlaying ? '⏸' : '▶'}</span>
                      <span>{isPlaying ? 'PAUSE' : 'PLAY THIS ONE'}</span>
                    </motion.button>

                    {/* Heart Like Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: isLiked ? '#e8637a' : 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                      }}
                    >
                      {isLiked ? '❤️' : '♡'}
                    </motion.button>

                    {/* Spotify / Link Button */}
                    {currentSong.url && (
                      <motion.a
                        href={currentSong.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#1db954',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          fontSize: '1.3rem',
                        }}
                        title="Open on Spotify"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.79-0.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.72 1.114.293.18.386.562.206.856zm1.224-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.52-.973 3.632-1.102 8.147-.568 11.233 1.328.366.226.48.707.257 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.128-1.165-.62-.15-.492.13-1.015.62-1.165 3.532-1.072 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.28.324z" />
                        </svg>
                      </motion.a>
                    )}
                  </div>

                  {/* Embed Iframe if activated */}
                  <AnimatePresence>
                    {showEmbed && currentSong.url && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '152px' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          marginTop: '1.2rem',
                          overflow: 'hidden',
                          borderRadius: '12px',
                        }}
                      >
                        <iframe
                          src={currentSong.url.replace('open.spotify.com/track/', 'open.spotify.com/embed/track/')}
                          title={currentSong.title}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          style={{ borderRadius: '12px', border: 'none' }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Right Column: Polaroid Photo with "my bachaa ♡" */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Handwritten tag */}
                  <div
                    style={{
                      fontFamily: '"Alex Brush", "Caveat", cursive',
                      fontSize: '1.6rem',
                      color: '#ffd988',
                      marginBottom: '0.4rem',
                      transform: 'rotate(-4deg)',
                    }}
                  >
                    {currentSong.polaroidTag || 'my bachaa ♡'}
                  </div>

                  {/* Polaroid Frame */}
                  <motion.div
                    whileHover={{ rotate: 0, scale: 1.03 }}
                    style={{
                      background: '#faf4eb',
                      padding: '8px 8px 14px 8px',
                      borderRadius: '4px',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
                      transform: 'rotate(3deg)',
                      maxWidth: '190px',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src="/images/day8/nousheen_polaroid.jpg"
                      alt="Nousheen at sunset"
                      style={{
                        width: '100%',
                        height: '190px',
                        objectFit: 'cover',
                        borderRadius: '2px',
                        display: 'block',
                      }}
                    />

                    <p
                      style={{
                        fontFamily: '"Caveat", cursive',
                        fontSize: '0.88rem',
                        color: '#4a3224',
                        margin: '0.6rem 0 0',
                        lineHeight: 1.2,
                        whiteSpace: 'pre-line',
                        fontWeight: 600,
                      }}
                    >
                      {currentSong.polaroidCaption || 'Same sky...\nDifferent places...\nSame hearts. ♡'}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Card Footer: "Did you understand why I picked this?" */}
              <div
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.4rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif, serif)',
                    fontSize: '0.92rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontStyle: 'italic',
                    marginBottom: '0.9rem',
                  }}
                >
                  {currentSong.interaction?.question || 'Did you understand why I picked this?'}
                </p>

                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSongInteraction(currentSong.id, 'yes')}
                    style={{
                      padding: '0.6rem 1.6rem',
                      borderRadius: '30px',
                      border: '1px solid #e5c17b',
                      background:
                        answeredSongs[currentSong.id] === 'yes'
                          ? '#e5c17b'
                          : 'rgba(229, 193, 123, 0.25)',
                      color: answeredSongs[currentSong.id] === 'yes' ? '#140c02' : '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    YES ❤️
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSongInteraction(currentSong.id, 'not-yet')}
                    style={{
                      padding: '0.6rem 1.6rem',
                      borderRadius: '30px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.75)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    NOT YET
                  </motion.button>
                </div>

                {/* Toast feedback */}
                <AnimatePresence>
                  {answeredSongs[currentSong.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        marginTop: '0.8rem',
                        fontSize: '0.85rem',
                        color: '#ffd57e',
                        fontStyle: 'italic',
                      }}
                    >
                      {answeredSongs[currentSong.id] === 'yes'
                        ? currentSong.interaction?.yesResponse || 'Good. Then keep going.'
                        : currentSong.interaction?.noResponse || "That's okay... Maybe the next one will explain it."}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Bottom Left Tilted Sticky Note: "You make everything better. ♡" */}
          <div
            style={{
              position: 'fixed',
              bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))',
              left: 'clamp(1rem, 3vw, 2.5rem)',
              zIndex: 15,
              display: 'none', // Shown on desktop / tablet
            }}
            className="hidden md:block"
          >
            <div
              style={{
                background: 'rgba(245, 235, 220, 0.92)',
                padding: '0.75rem 1rem',
                borderRadius: '3px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
                transform: 'rotate(-7deg)',
                maxWidth: '130px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: '1rem',
                  color: '#2a1a10',
                  lineHeight: 1.25,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                You<br />make<br />everything<br />better.<br />♡
              </p>
            </div>
          </div>

          {/* Bottom Navigation Row: ← Back  and  1 / 6 */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '960px',
              margin: '2rem auto 0',
              padding: '0 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              ← Back
            </button>

            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {activeSongIndex + 1} / {DAY8_SONGS.length}
            </span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. THE 3D DISTANCE EXPERIENCE                                */}
      {/* ============================================================ */}
      {stage === 'distance' && (
        <motion.div
          key="stage-distance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0 } }}
          style={{
            position: 'relative',
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))',
            paddingBottom: 'max(2.5rem, calc(env(safe-area-inset-bottom) + 2rem))',
            background: '#040207',
          }}
        >
          <Day8DistanceCanvas distanceStage={distanceStep} isMeeting={false} />

          {/* Top Concept Banner */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              padding: '0 1.5rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.78rem',
                letterSpacing: '0.25em',
                color: 'rgba(229, 193, 123, 0.85)',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              Two People • Two Places • One Story
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
              }}
            >
              "Too much distance."
            </p>
          </div>

          {/* Floating Names Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-around',
              padding: '0 10%',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                background: 'rgba(15, 12, 22, 0.6)',
                padding: '0.3rem 0.8rem',
                borderRadius: '12px',
                border: '1px solid rgba(229, 193, 123, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#e5c17b', fontWeight: 600 }}>✦ Tosif</span>
            </div>

            <div
              style={{
                textAlign: 'center',
                background: 'rgba(15, 12, 22, 0.6)',
                padding: '0.3rem 0.8rem',
                borderRadius: '12px',
                border: '1px solid rgba(232, 141, 157, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#e88d9d', fontWeight: 600 }}>✦ Nousheen</span>
            </div>
          </div>

          {/* Distance Progress Status Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '460px',
              margin: '0 auto',
              padding: '0 1.25rem',
            }}
          >
            <motion.div
              key={distanceStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(12, 10, 18, 0.85)',
                border: '1px solid rgba(229, 193, 123, 0.25)',
                borderRadius: '20px',
                padding: '1.4rem',
                backdropFilter: 'blur(20px)',
                textAlign: 'center',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-serif, serif)',
                  color: '#e5c17b',
                  marginBottom: '0.2rem',
                }}
              >
                {distanceLabels[distanceStep]?.symbol}
              </div>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontStyle: 'italic',
                  marginBottom: '1.25rem',
                }}
              >
                {distanceLabels[distanceStep]?.note}
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAdvanceDistance}
                style={{
                  padding: '0.85rem 2.2rem',
                  borderRadius: '30px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #e5c17b 0%, #c9a456 100%)',
                  color: '#0a0712',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(229, 193, 123, 0.3)',
                }}
              >
                {distanceStep < distanceLabels.length - 1 ? 'STEP CLOSER ➔' : 'TOUCH 🤍'}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 3. THE FINAL MEETING & WHOLESOME HUG                         */}
      {/* ============================================================ */}
      {stage === 'meeting' && (
        <motion.div
          key="stage-meeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
          style={{
            position: 'relative',
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.5rem))',
            paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1.5rem))',
            background: '#040207',
          }}
        >
          <Day8DistanceCanvas isMeeting={true} />

          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              padding: '0 1.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                letterSpacing: '0.25em',
                color: 'rgba(229, 193, 123, 0.85)',
                textTransform: 'uppercase',
              }}
            >
              ✦ The Meeting ✦
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: '520px',
              margin: '0 auto',
              padding: '0 1.25rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: 'rgba(10, 8, 16, 0.85)',
                border: '1px solid rgba(229, 193, 123, 0.25)',
                borderRadius: '24px',
                padding: '1.6rem',
                backdropFilter: 'blur(25px)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                textAlign: 'center',
              }}
            >
              <div style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {meetingStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                        fontSize: '1.25rem',
                        fontStyle: 'italic',
                        color: '#fff',
                        lineHeight: 1.6,
                        margin: '0 0 0.8rem',
                      }}
                    >
                      "One day..."
                    </p>
                    <p
                      style={{
                        fontSize: '0.92rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      I won't have to send you songs through a screen.
                      <br />
                      <span style={{ color: '#e5c17b', fontStyle: 'italic' }}>
                        I'll be sitting beside you... and playing them for you.
                      </span>
                    </p>
                  </motion.div>
                )}

                {meetingStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.85)',
                        lineHeight: 1.8,
                        margin: '0 0 0.8rem',
                      }}
                    >
                      Maybe we'll argue about which song is better.
                      <br />
                      Maybe you'll steal my headphones.
                      <br />
                      Maybe I'll annoy you.
                      <br />
                      Maybe you'll tell me to shut up.
                    </p>
                  </motion.div>
                )}

                {meetingStep >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif, serif)',
                        fontSize: '1.25rem',
                        fontStyle: 'italic',
                        color: '#e5c17b',
                        lineHeight: 1.6,
                        margin: '0 0 0.5rem',
                      }}
                    >
                      "I'd still choose that life."
                    </p>
                    <p
                      style={{
                        fontSize: '1.05rem',
                        color: '#fff',
                        fontWeight: 500,
                        margin: 0,
                      }}
                    >
                      Every single time.
                    </p>
                  </motion.div>
                )}
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                {meetingStep < 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      day8Sound.playChime(meetingStep + 2);
                      setMeetingStep((prev) => prev + 1);
                    }}
                    style={{
                      padding: '0.75rem 2.2rem',
                      borderRadius: '30px',
                      border: '1px solid rgba(229, 193, 123, 0.4)',
                      background: 'linear-gradient(135deg, rgba(229, 193, 123, 0.2), rgba(229, 193, 123, 0.05))',
                      color: '#fff',
                      fontSize: '0.82rem',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                    }}
                  >
                    CONTINUE ➔
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      day8Sound.playChime(6);
                      setStage('final-dedication');
                    }}
                    style={{
                      padding: '0.85rem 2.5rem',
                      borderRadius: '30px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #e5c17b 0%, #c9a456 100%)',
                      color: '#0a0712',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(229, 193, 123, 0.35)',
                    }}
                  >
                    ALWAYS 🤍
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 4. FINAL MESSAGE & URDU DEDICATION                           */}
      {/* ============================================================ */}
      {stage === 'final-dedication' && (
        <motion.div
          key="stage-final-dedication"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 30%, #0a0814 0%, #020104 100%)',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <div style={{ maxWidth: '480px', width: '100%', position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              style={{
                fontFamily: '"Amiri", serif',
                fontSize: 'clamp(3rem, 10vw, 4.2rem)',
                color: '#e5c17b',
                lineHeight: 1.2,
                marginBottom: '0.3rem',
                textShadow: '0 0 25px rgba(229, 193, 123, 0.4)',
              }}
            >
              نوشين
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.0 }}
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: '1.15rem',
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
              }}
            >
              my bachaa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.0 }}
              style={{
                background: 'rgba(15, 12, 22, 0.7)',
                border: '1px solid rgba(229, 193, 123, 0.2)',
                borderRadius: '24px',
                padding: '1.8rem',
                backdropFilter: 'blur(20px)',
                marginBottom: '2.5rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.8,
                  margin: '0 0 1rem',
                }}
              >
                I hope someday...
                <br />
                these won't just be songs we listen to from far away.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif, serif)',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: '#e5c17b',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                "I hope they're songs playing somewhere in our home.
                <br />
                With you sitting next to me."
              </p>
            </motion.div>

            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '2rem',
              }}
            >
              DAY 08 COMPLETE 🤍
            </div>

            <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  day8Sound.playChime(0);
                  setStage('main');
                  setActiveSongIndex(0);
                }}
                style={{
                  padding: '0.85rem 1.8rem',
                  borderRadius: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                ↺ VIEW MUSIC ROOM
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/')}
                style={{
                  padding: '0.85rem 2.2rem',
                  borderRadius: '30px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #e5c17b 0%, #c9a456 100%)',
                  color: '#0a0712',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(229, 193, 123, 0.3)',
                }}
              >
                HOME ✦
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
