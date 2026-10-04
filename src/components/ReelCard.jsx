import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Direct Video Reel Card Component
 * - Plays downloaded .mp4 / .webm videos directly with high-performance hardware acceleration
 * - Provides custom sleek controls (play/pause, mute/unmute, fullscreen, time progress)
 * - Includes fallback poster & Instagram backup link if video is not yet downloaded
 */
export default function ReelCard({
  title,
  description,
  videoSrc = '',
  instagramUrl = '',
  icon = '🎬',
  tag = 'Memory',
  index = 0,
  accentColor = '#e8a858',
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        setVideoError(false);
      }).catch((err) => {
        console.warn('Video playback error:', err);
        setVideoError(true);
      });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  };

  // Extract filename for instructions
  const fileName = videoSrc ? videoSrc.split('/').pop() : 'video.mp4';

  return (
    <div
      className="reel-card-wrapper"
      style={{
        width: '100%',
        maxWidth: '380px',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, rgba(26, 18, 14, 0.9) 0%, rgba(12, 10, 10, 0.98) 100%)',
        border: '1px solid rgba(232, 168, 88, 0.25)',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px -10px rgba(232, 168, 88, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Visual Video Area (9:16 vertical reel proportion) */}
      <div
        onClick={togglePlay}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9 / 14',
          background: '#070505',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Background Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}28 0%, rgba(0,0,0,0) 70%)`,
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }}
        />

        {/* Direct HTML5 Video Player */}
        {videoSrc && !videoError ? (
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoError(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
            }}
          />
        ) : null}

        {/* Poster / Fallback Overlay (When video is paused or file not found) */}
        {(!hasStarted || videoError) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: videoError
                ? 'linear-gradient(180deg, rgba(20, 14, 12, 0.95) 0%, rgba(10, 8, 8, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(30, 20, 16, 0.6) 0%, rgba(10, 8, 8, 0.85) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            {/* Big Center Play Icon */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f7d399 0%, #d49a46 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(212, 154, 70, 0.5), 0 0 20px rgba(247, 211, 153, 0.4)',
                marginBottom: '1.2rem',
                paddingLeft: '4px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#140a04">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>

            {videoError ? (
              <div style={{ maxWidth: '280px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#f0c88b',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Direct Video Setup:
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'rgba(245, 240, 235, 0.7)',
                    lineHeight: 1.4,
                    background: 'rgba(0,0,0,0.4)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px dashed rgba(232, 168, 88, 0.3)',
                    wordBreak: 'break-all',
                  }}
                >
                  Save as: <strong>public/videos/{fileName}</strong>
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  color: '#f7d399',
                  textTransform: 'uppercase',
                }}
              >
                Tap to Play Video
              </p>
            )}
          </div>
        )}

        {/* Top Tag & Memory Number */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '100px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(232, 168, 88, 0.35)',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '0.8rem' }}>{icon}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              color: '#f0c88b',
              textTransform: 'uppercase',
            }}
          >
            {tag} • 0{index + 1}
          </span>
        </div>

        {/* Video Control Bar Overlay (when playing/active) */}
        {hasStarted && !videoError && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '12px 14px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 10,
            }}
          >
            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #c9a96e, #f7d399)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            {/* Controls Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>

                <button
                  onClick={handleFullscreen}
                  title="Fullscreen"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content & Description Body */}
      <div
        style={{
          padding: '1.4rem 1.4rem 1.6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          background: 'rgba(15, 12, 11, 0.98)',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            color: '#fdfbf7',
            fontWeight: 500,
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            color: 'rgba(245, 240, 235, 0.7)',
            lineHeight: 1.55,
            fontWeight: 300,
          }}
        >
          {description}
        </p>

        {/* Action Controls */}
        <div style={{ marginTop: '0.6rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={togglePlay}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.65rem 1rem',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, rgba(232, 168, 88, 0.28) 0%, rgba(201, 169, 110, 0.12) 100%)',
              border: '1px solid rgba(232, 168, 88, 0.45)',
              color: '#f7dfb0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <span>{isPlaying ? 'Pause Video ⏸' : 'Play Direct Video ▶'}</span>
          </button>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original Instagram link"
              style={{
                padding: '0.65rem 0.9rem',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(245, 240, 235, 0.8)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
