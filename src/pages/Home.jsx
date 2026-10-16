import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import StarField from '../components/StarField';
import { saveResponse, syncPendingResponses } from '../services/responseService';
import { getOrCreateSessionId } from '../utils/session';
import { DAYS } from '../data/days';
import './Home.css';

const STORAGE_KEYS = {
  MESSAGE: 'nousheen_safespace_message',
  COMPLETED: 'nousheen_safespace_sent',
  SAVED_AT: 'nousheen_safespace_saved_at',
};

export default function Home() {
  const navigate = useNavigate();

  // Session ID for Google Sheets tracking
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const id = getOrCreateSessionId('safespace');
    setSessionId(id);
  }, []);

  // Message input state
  const [message, setMessage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MESSAGE) || '';
    } catch {
      return '';
    }
  });

  const [isSent, setIsSent] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Floating background particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      left: `${Math.random() * 96}%`,
      duration: `${Math.random() * 12 + 10}s`,
      delay: `${Math.random() * 6}s`,
    }));
  }, []);

  // Auto-save input to localStorage
  const handleTextChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGE, val);
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  // Submit to Tosif's Google Sheet
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Save locally
      localStorage.setItem(STORAGE_KEYS.MESSAGE, message.trim());
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.SAVED_AT, new Date().toISOString());

      // 2. Sync to Google Sheets
      const currentSessionId = sessionId || getOrCreateSessionId('safespace');
      await saveResponse({
        sessionId: currentSessionId,
        day: 'Always',
        questionId: 'nousheen_safe_space_confession',
        question: "What happened, Nousheen? Please tell me everything that's on your mind. I'm here with you, my love. ❤️ I know you're more comfortable sharing your thoughts here, and I want you to feel safe telling me anything. My love, please let it all out. I'm here, I'm listening, and I'm not going anywhere. You don't have to keep anything to yourself, bachaa. ❤️",
        optionId: 'heartfelt_confession',
        answer: message.trim(),
        customText: message.trim(),
        timestamp: new Date().toISOString(),
      });

      syncPendingResponses();

      setIsSent(true);

      // Celebration Confetti
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.75 },
          colors: ['#e8c37d', '#fcefd6', '#ffffff', '#e8637a'],
        });
      } catch (_) {}
    } catch (err) {
      console.error('Error saving message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy message
  const handleCopy = async () => {
    const textToCopy = `🤍 Message for Tosif:\n\n${message.trim()}\n\n— Sent with love from Nousheen 🤍`;
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
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (_) {}
  };

  return (
    <div className="home-safe-wrapper">
      <StarField />

      {/* Ambient background glows */}
      <div className="home-bg-glow home-bg-glow-1" aria-hidden="true" />
      <div className="home-bg-glow home-bg-glow-2" aria-hidden="true" />

      {/* Delicate floating gold particles */}
      <div className="home-particles-container" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="home-particle"
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

      <main className="home-safe-stage">
        {/* Header Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="home-safe-badge"
        >
          <span>🤍</span>
          <span>YOUR SAFE SPACE · ALWAYS WITH YOU</span>
        </motion.div>

        {/* Central Love Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="home-safe-card"
        >
          {/* Title: Love you Nousheen */}
          <h1 className="home-safe-title">
            Love you Nousheen 🤍
          </h1>

          {/* Arabic Calligraphy: نوشين */}
          <div className="home-safe-name-ar" aria-label="Nousheen in Arabic">
            نوشين
          </div>

          {/* Tosif's Exact Words */}
          <div className="home-safe-message-box">
            <p className="home-safe-message-p">
              “What happened, Nousheen? Please tell me everything that's on your mind. I'm here with you, my love. ❤️ I know you're more comfortable sharing your thoughts here, and I want you to feel safe telling me anything.”
            </p>

            <p className="home-safe-message-highlight">
              “My love, please let it all out. I'm here, I'm listening, and I'm not going anywhere. You don't have to keep anything to yourself, bachaa. ❤️”
            </p>
          </div>

          {/* Input Box for Nousheen */}
          <form className="home-safe-input-container" onSubmit={handleSendMessage}>
            <textarea
              className="home-safe-textarea"
              value={message}
              onChange={handleTextChange}
              placeholder="Tell me whatever is on your mind or in your heart, Nousheen… I'm listening. 🤍"
              rows={5}
              id="nousheen-safe-space-input"
              aria-label="Write to Tosif"
            />

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="home-safe-send-btn"
              id="send-to-tosif-btn"
            >
              {isSubmitting ? 'SENDING TO TOSIF… 🤍' : 'SEND TO TOSIF 🤍'}
            </button>

            {isSent && (
              <div className="home-safe-confirm" role="status">
                <span>✓</span>
                <span>Your words have reached Tosif, bachaa. I'm right here with you. 🤍</span>
              </div>
            )}

            {message.trim() && (
              <button
                type="button"
                onClick={handleCopy}
                className="home-safe-copy-btn"
                id="copy-safe-space-btn"
              >
                {copied ? '✓ COPIED TO CLIPBOARD! 🤍' : 'COPY MESSAGE 📋'}
              </button>
            )}
          </form>
        </motion.div>

        {/* Discreet Past Days Archive (Hidden by default, collapsed at bottom) */}
        <div className="home-archive-section">
          <button
            type="button"
            onClick={() => setShowArchive(!showArchive)}
            className="home-archive-toggle-btn"
            aria-expanded={showArchive}
          >
            {showArchive ? '▴ Hide 14 Days Memories' : '▾ Revisit 14 Days Journey (Optional)'}
          </button>

          <AnimatePresence>
            {showArchive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="home-archive-grid"
              >
                {DAYS.map((d) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => navigate(`/day/${d.day}`)}
                    className="home-archive-day-btn"
                  >
                    <span>{d.emoji}</span>
                    <span>Day {d.day}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
