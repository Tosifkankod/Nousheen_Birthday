import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import DayNav from '../../components/DayNav';
import { saveResponse, syncPendingResponses } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';
import { DAY14_VIDEO_URL, DAY14_CONTENT, parseVideoSource } from '../../data/day14Data';
import './Day14.css';

const STORAGE_KEYS = {
  USER_RESPONSE: 'nousheen_day14_user_response',
  COMPLETED: 'nousheen_day14_completed',
  SAVED_AT: 'nousheen_day14_saved_at',
};

export default function Day14() {
  const navigate = useNavigate();

  // Session ID for Google Sheets tracking
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const id = getOrCreateSessionId(14);
    setSessionId(id);
  }, []);

  // Experience Phases: 'intro' -> 'playing' -> 'ended'
  const [phase, setPhase] = useState('intro');

  // Video State (tailored for portrait / 9:16)
  const videoRef = useRef(null);
  const [videoSource, setVideoSource] = useState(() => parseVideoSource(DAY14_VIDEO_URL));
  const [aspectRatio, setAspectRatio] = useState('9 / 16');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Message Input State (saved locally and synced to Google Sheets)
  const [userMessage, setUserMessage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_RESPONSE) || '';
    } catch {
      return '';
    }
  });

  const [isMessageSent, setIsMessageSent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Floating background particles
  const particles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      left: `${Math.random() * 96}%`,
      duration: `${Math.random() * 12 + 10}s`,
      delay: `${Math.random() * 6}s`,
    }));
  }, []);

  // Check URL changes if updated dynamically
  useEffect(() => {
    setVideoSource(parseVideoSource(DAY14_VIDEO_URL));
  }, []);

  // When transitioning to 'playing', attempt to start playback
  useEffect(() => {
    if (phase !== 'playing') return;

    setIsLoading(true);
    setHasError(false);
    setNeedsManualPlay(false);

    // If native video, attempt to play
    if (videoSource.type === 'native' && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
            setNeedsManualPlay(false);
          })
          .catch((err) => {
            console.warn('[Day14] Autoplay following user click blocked or waiting:', err);
            setIsLoading(false);
            setNeedsManualPlay(true);
          });
      }
    } else {
      // For YouTube embeds, loading completes quickly
      const timer = setTimeout(() => setIsLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, retryCount, videoSource.type]);

  // Handle manual start click
  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setNeedsManualPlay(false);
        })
        .catch((err) => {
          console.warn('[Day14] Manual play attempt:', err);
        });
    }
  };

  // Metadata loaded handler to detect natural video aspect ratio
  const handleLoadedMetadata = (e) => {
    setIsLoading(false);
    const v = e.target;
    if (v && v.videoWidth && v.videoHeight) {
      setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
    }
  };

  // Video error handler
  const handleVideoError = () => {
    console.warn('[Day14] Video failed to load source:', videoSource.url);
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setRetryCount((c) => c + 1);
  };

  // Video finished handler
  const handleVideoEnded = () => {
    setPhase('ended');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Celebration Confetti
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#e8c37d', '#fcefd6', '#ffffff', '#e8637a', '#f0899a'],
      });
    } catch (_) {}
  };

  // Send message to Tosif & Google Sheets
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!userMessage.trim()) return;

    setIsSubmittingMessage(true);
    try {
      // 1. Save locally
      localStorage.setItem(STORAGE_KEYS.USER_RESPONSE, userMessage.trim());
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.SAVED_AT, new Date().toISOString());

      // 2. Sync to Google Sheets via responseService
      const currentSessionId = sessionId || getOrCreateSessionId(14);
      await saveResponse({
        sessionId: currentSessionId,
        day: 14,
        questionId: 'day14_nousheen_message',
        question: DAY14_CONTENT.inputSection.heading,
        optionId: 'written_response',
        answer: userMessage.trim(),
        customText: userMessage.trim(),
        timestamp: new Date().toISOString(),
      });

      syncPendingResponses();

      setIsMessageSent(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#e8c37d', '#fcefd6', '#ffffff', '#e8637a'],
        });
      } catch (_) {}
    } catch (err) {
      console.error('Error saving Day 14 message:', err);
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  // Copy message to clipboard
  const handleCopyMessage = async () => {
    const textToCopy = `🤍 Day 14 Message for Tosif:\n\n${userMessage.trim()}\n\n— Sent with love from Nousheen 🤍`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 3000);
    } catch (_) {}
  };

  // Reusable message input card
  const renderMessageInputCard = () => (
    <div className="day14-message-input-card">
      <div className="day14-message-input-header">
        <span className="day14-message-icon">💌</span>
        <h3 className="day14-message-heading">
          {DAY14_CONTENT.inputSection.heading}
        </h3>
      </div>
      <p className="day14-message-subtext">
        {DAY14_CONTENT.inputSection.subtext}
      </p>

      <textarea
        className="day14-message-textarea"
        value={userMessage}
        onChange={(e) => {
          setUserMessage(e.target.value);
          try {
            localStorage.setItem(STORAGE_KEYS.USER_RESPONSE, e.target.value);
          } catch (_) {}
        }}
        placeholder={DAY14_CONTENT.inputSection.placeholder}
        rows={4}
        id="day14-user-message-input"
        aria-label="Your message to Tosif"
      />

      <div className="day14-message-actions">
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isSubmittingMessage || !userMessage.trim()}
          className="day14-send-msg-btn"
          id="day14-send-msg-btn"
        >
          {isSubmittingMessage ? 'SENDING TO TOSIF… 🤍' : DAY14_CONTENT.inputSection.buttonText}
        </button>

        {isMessageSent && (
          <div className="day14-msg-sent-confirm" role="status">
            <span>✓</span>
            <span>{DAY14_CONTENT.inputSection.confirmation}</span>
          </div>
        )}

        {userMessage.trim() && (
          <button
            type="button"
            onClick={handleCopyMessage}
            className="day14-copy-msg-btn"
            id="day14-copy-msg-btn"
          >
            {copiedMessage ? '✓ COPIED TO CLIPBOARD! 🤍' : 'COPY MESSAGE 📋'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="day14-wrapper">
      <DayNav dayNumber={14} />

      {/* Ambient background glows */}
      <div className="day14-bg-glow day14-bg-glow-1" aria-hidden="true" />
      <div className="day14-bg-glow day14-bg-glow-2" aria-hidden="true" />

      {/* Delicate floating gold particles */}
      <div className="day14-particles-container" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="day14-particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <main className="day14-stage">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="day14-pill-badge"
        >
          <span>🤍</span>
          <span>{DAY14_CONTENT.subBadge}</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* =============================================================== */}
          {/* 1. CINEMATIC INTRO SCREEN                                       */}
          {/* =============================================================== */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="day14-intro-card"
            >
              <div className="day14-intro-lines-list">
                {DAY14_CONTENT.introLines.map((line, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.35,
                      duration: 0.7,
                      ease: 'easeOut',
                    }}
                    className={`day14-intro-line ${
                      line.highlight ? 'day14-intro-line-highlight' : ''
                    } ${line.italic ? 'day14-intro-line-italic' : ''}`}
                  >
                    {line.text}
                  </motion.p>
                ))}
              </div>

              {/* Single Prominent Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + DAY14_CONTENT.introLines.length * 0.35 + 0.4,
                  duration: 0.6,
                }}
                type="button"
                onClick={() => setPhase('playing')}
                className="day14-play-trigger-btn"
                id="day14-play-surprise-btn"
              >
                <span>{DAY14_CONTENT.playButtonText}</span>
              </motion.button>
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* 2. DISTRACTION-FREE VIDEO PLAYER                                */}
          {/* =============================================================== */}
          {phase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="day14-video-section"
            >
              <div className="day14-video-card" style={{ aspectRatio }}>
                {/* 1. NATIVE MP4 / DIRECT VIDEO SOURCE */}
                {videoSource.type === 'native' && (
                  <video
                    ref={videoRef}
                    key={retryCount}
                    src={videoSource.url}
                    controls
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    onCanPlay={() => setIsLoading(false)}
                    onPlaying={() => {
                      setIsLoading(false);
                      setNeedsManualPlay(false);
                    }}
                    onWaiting={() => setIsLoading(true)}
                    onError={handleVideoError}
                    onEnded={handleVideoEnded}
                    className="day14-video-element"
                  />
                )}

                {/* 2. YOUTUBE EMBED SOURCE */}
                {videoSource.type === 'youtube' && (
                  <iframe
                    src={videoSource.embedUrl}
                    title="Nousheen Birthday Surprise"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="day14-iframe-embed"
                    onLoad={() => setIsLoading(false)}
                  />
                )}

                {/* Loading State Spinner */}
                {isLoading && !hasError && (
                  <div className="day14-video-loading">
                    <div className="day14-spinner" />
                    <p className="day14-video-loading-text">
                      Loading your surprise, meri jaan…
                    </p>
                  </div>
                )}

                {/* Manual Play Overlay if browser blocked initial start */}
                {needsManualPlay && !isLoading && !hasError && (
                  <div
                    className="day14-manual-play-overlay"
                    onClick={handleManualPlay}
                  >
                    <button type="button" className="day14-manual-play-btn">
                      <span>▶ Tap to Start Video</span>
                    </button>
                  </div>
                )}

                {/* Error Fallback with Retry */}
                {hasError && (
                  <div className="day14-error-card">
                    <div className="day14-error-icon">🎬</div>
                    <h3 className="day14-error-title">Video Loading</h3>
                    <p className="day14-error-msg">
                      Your video is being prepared or is currently uploading. You can retry anytime.
                    </p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="day14-retry-btn"
                    >
                      Retry Playback ↺
                    </button>
                  </div>
                )}
              </div>

              {/* Discreet progress option for YouTube or manual completion */}
              <button
                type="button"
                onClick={handleVideoEnded}
                className="day14-finished-subtle-btn"
                title="Proceed once you've finished watching"
              >
                I've finished watching the surprise →
              </button>

              {/* Input tag below the video so she can send a message right here */}
              {renderMessageInputCard()}
            </motion.div>
          )}

          {/* =============================================================== */}
          {/* 3. AFTER THE VIDEO FINISHES                                     */}
          {/* =============================================================== */}
          {phase === 'ended' && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="day14-after-card"
            >
              <h2 className="day14-after-heading">
                {DAY14_CONTENT.afterVideo.heading}
              </h2>

              <div className="day14-after-lines-list">
                {DAY14_CONTENT.afterVideo.lines.map((line, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.25, duration: 0.6 }}
                    className="day14-after-p"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Arabic Name: نوشين */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.7 }}
                className="day14-after-name-ar"
                aria-label="Nousheen in Arabic"
              >
                {DAY14_CONTENT.afterVideo.nameAr}
              </motion.div>

              {/* Day 14 Complete Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="day14-completion-badge"
              >
                <span>🤍</span>
                <span>{DAY14_CONTENT.afterVideo.completionBadge}</span>
              </motion.div>

              {/* Input tag below the finale message so she can send her thoughts */}
              {renderMessageInputCard()}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.5 }}
                className="day14-after-actions"
              >
                <button
                  type="button"
                  onClick={() => {
                    setPhase('playing');
                    setIsLoading(true);
                  }}
                  className="day14-replay-btn"
                >
                  Watch Video Again ↺
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="day14-journey-btn"
                >
                  Back to Journey 🤍
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
