import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../components/StarField';
import { saveResponse, syncPendingResponses } from '../services/responseService';
import { trackPageAccess } from '../services/accessTracker';
import { getOrCreateSessionId } from '../utils/session';
import { DAYS } from '../data/days';
import './Home.css';

const QUESTIONS = [
  { id: 'home_q1_important', question: 'Am I important to you?', num: 1 },
  { id: 'home_q2_comfortable', question: 'Are you comfortable with me ?', num: 2 },
  { id: 'home_q3_love', question: 'Do you love me as I do ?', num: 3 },
  { id: 'home_q4_talking', question: 'do you like talking to me?', num: 4 },
];

const STORAGE_KEYS = {
  SENDER: 'nousheen_safespace_sender',
  MESSAGE: 'nousheen_safespace_message',
  QUESTIONS: 'nousheen_safespace_questions',
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
    trackPageAccess('Home (Safe Space Sanctuary)');
  }, []);

  // Sender name state
  const [senderName, setSenderName] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SENDER) || 'Nousheen 🤍';
    } catch {
      return 'Nousheen 🤍';
    }
  });

  // Message input state
  const [message, setMessage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MESSAGE) || '';
    } catch {
      return '';
    }
  });

  // Yes / No Questions answers state
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [answeringId, setAnsweringId] = useState(null);
  const [syncStatus, setSyncStatus] = useState('saved'); // 'typing', 'syncing', 'saved'
  const lastSyncedRef = useRef(message);
  const debounceTimerRef = useRef(null);

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

  // Auto-save sender name
  const handleSenderChange = (e) => {
    const val = e.target.value;
    setSenderName(val);
    try {
      localStorage.setItem(STORAGE_KEYS.SENDER, val);
    } catch (_) {}
  };

  // Immediate sync for Yes / No questions
  const handleSelectAnswer = async (questionId, questionText, choice) => {
    const updated = { ...answers, [questionId]: choice };
    setAnswers(updated);
    setAnsweringId(questionId);

    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
    } catch (_) {}

    try {
      const currentSessionId = sessionId || getOrCreateSessionId('safespace');
      await saveResponse({
        sessionId: currentSessionId,
        day: 'Always',
        questionId: questionId,
        question: questionText,
        optionId: choice,
        answer: choice,
        customText: `Question: ${questionText} | Answer: ${choice} | By: ${senderName.trim() || 'Nousheen'}`,
        timestamp: new Date().toISOString(),
      });
      syncPendingResponses();
      setTimeout(() => setAnsweringId(null), 1200);
    } catch (err) {
      console.warn('Error saving question answer:', err);
      setAnsweringId(null);
    }
  };

  // Auto-sync function for typed message
  const triggerSyncMessage = async (textToSync) => {
    const trimmed = (textToSync || '').trim();
    if (!trimmed || trimmed === lastSyncedRef.current) {
      setSyncStatus('saved');
      return;
    }

    setSyncStatus('syncing');
    try {
      const currentSessionId = sessionId || getOrCreateSessionId('safespace');
      await saveResponse({
        sessionId: currentSessionId,
        day: 'Always',
        questionId: 'nousheen_safe_space_confession',
        question: "Nousheen, I love you. ❤️ (Tosif's Letter to Nousheen)",
        optionId: senderName.trim() || 'Nousheen',
        answer: trimmed,
        customText: `From: ${senderName.trim() || 'Nousheen'} | Message: ${trimmed}`,
        timestamp: new Date().toISOString(),
      });
      syncPendingResponses();
      lastSyncedRef.current = trimmed;
      setSyncStatus('saved');
    } catch (err) {
      console.warn('Error auto-syncing message:', err);
      setSyncStatus('saved');
    }
  };

  // Auto-sync as she types (debounced 1400ms)
  const handleTextChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    setSyncStatus('typing');

    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGE, val);
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerSyncMessage(val);
    }, 1400);
  };

  // Immediate sync on blur
  const handleTextBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    triggerSyncMessage(message);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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

          {/* Tosif's Exact Words - Heartfelt Letter */}
          <div className="home-safe-message-box">
            <p className="home-letter-salutation">
              Nousheen, I love you. ❤️
            </p>

            <p className="home-letter-p">
              I don't know why I love writing letters to you like this. I think I can explain myself better here.
            </p>

            <p className="home-letter-p">
              Nousheen, bachaa, I know you're overthinking, and I do too, but my love for you is stronger. I know you love me. I know your heart is full of doubts, and I know there's still a small corner in your heart that you've kept for me. That's why we're still together, and we talk late at night without hesitation about everything, because somewhere in our minds, we believe that we're meant for each other.
            </p>

            <p className="home-letter-p">
              Nousheen, please trust me. I've seen the proofs, and I know what we have is real. My love, please don't leave me, yaar. Please, I'm begging you. I don't want to lose you. I want us to trust each other and get through this difficult phase together. I know you have doubts and fears, but bachaa, I want you to believe in me and in the love we share.
            </p>

            <p className="home-letter-p">
              I know I'm not in front of you right now. Otherwise, I would have gently run my fingers through your hair and calmed you down like my baby. But I'm far away from you, and every time you overthink, it hurts my heart. But don't worry, my love, I'll not leave you.
            </p>

            <p className="home-letter-p">
              I've left my ego and self-respect far behind for you, and I don't regret that. Yeah, I know it's difficult when you cannot share anything with anyone, and you start overthinking. Nousheen, we have hope now, so be happy, my bachaa.
            </p>

            <p className="home-letter-p">
              I'm the only one who can control you, my love. I don't care how angry you get with me or how upset you become; I'll always be there for you. Yeah, sometimes I get hurt too, but it doesn't matter as long as you're with me.
            </p>

            <p className="home-letter-highlight">
              I'm your man, my bachaa, and you're my girl. I'll take care of you like no one else.
            </p>

            <p className="home-letter-p">
              Enjoy your vacation, my bachaa. Please don't overthink. Whenever you feel like you're overthinking, pray to Allah. Think about me, our goals, and our plans. I hope that brings a smile to your face.
            </p>

            <p className="home-letter-p">
              You are my world, my life, my everything. It's a difficult phase, bachaa, but it'll pass. And I'll be in your life, pareshan karne ke liye, even more, later on. ❤️
            </p>

            <p className="home-letter-p home-letter-closing">
              Take care, Nousheen. And just ping me if you need anything.
            </p>

            <p className="home-letter-signoff">
              I love you, meri jaan. ❤️
            </p>
          </div>

          {/* 4 Yes or No Questions for Nousheen */}
          <div className="home-questions-card">
            <div className="home-questions-header">
              <span className="home-questions-icon">🤍</span>
              <div className="home-questions-header-text">
                <h2 className="home-questions-title">4 Questions for you, bachaa 🤍</h2>
                <p className="home-questions-sub">
                  Answer honestly from your heart. Whatever you choose reaches me directly.
                </p>
              </div>
            </div>

            <div className="home-questions-list">
              {QUESTIONS.map((q) => {
                const currentAns = answers[q.id];
                const isUpdating = answeringId === q.id;
                return (
                  <div key={q.id} className="home-q-item">
                    <div className="home-q-top-row">
                      <p className="home-q-text">
                        <span className="home-q-num">{q.num})</span> {q.question}
                      </p>
                      {isUpdating && <span className="home-q-saving-tag">Saving… 🤍</span>}
                    </div>

                    <div className="home-q-options">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, q.question, 'Yes')}
                        className={`home-q-btn ${currentAns === 'Yes' ? 'selected-yes' : ''}`}
                        aria-pressed={currentAns === 'Yes'}
                      >
                        <span className="home-q-btn-icon">✓</span>
                        <span>Yes</span>
                        {currentAns === 'Yes' && <span className="home-q-heart">🤍</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, q.question, 'No')}
                        className={`home-q-btn ${currentAns === 'No' ? 'selected-no' : ''}`}
                        aria-pressed={currentAns === 'No'}
                      >
                        <span className="home-q-btn-icon">✕</span>
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auto-syncing Message Box for Nousheen */}
          <div className="home-reply-wrapper">
            <div className="home-reply-header">
              <span className="home-reply-icon">💌</span>
              <div className="home-reply-titles">
                <h2 className="home-reply-title">Write to me, Nousheen 🤍</h2>
                <p className="home-reply-subtitle">
                  Whatever you type here comes to me directly as you write — no need to click any button.
                </p>
              </div>
            </div>

            <div className="home-safe-input-container">
              <div className="home-reply-field">
                <label htmlFor="nousheen-sender-input" className="home-reply-label">
                  <span>From:</span>
                  <span className="home-reply-label-hint">(Your name or nickname)</span>
                </label>
                <input
                  type="text"
                  id="nousheen-sender-input"
                  className="home-reply-name-input"
                  value={senderName}
                  onChange={handleSenderChange}
                  onBlur={() => triggerSyncMessage(message)}
                  placeholder="e.g. Nousheen / Meri jaan 🤍"
                  maxLength={50}
                />
              </div>

              <div className="home-reply-field">
                <label htmlFor="nousheen-safe-space-input" className="home-reply-label">
                  <span>Your message to Tosif:</span>
                  <span className="home-reply-label-hint">
                    {syncStatus === 'typing'
                      ? '✍️ Typing…'
                      : syncStatus === 'syncing'
                      ? '⏳ Saving to Tosif…'
                      : '✓ Auto-synced directly to Tosif 🤍'}
                  </span>
                </label>
                <textarea
                  className="home-safe-textarea"
                  value={message}
                  onChange={handleTextChange}
                  onBlur={handleTextBlur}
                  placeholder="Type whatever is in your heart, Nousheen… It comes to me directly as you write. 🤍"
                  rows={6}
                  id="nousheen-safe-space-input"
                  aria-label="Write to Tosif"
                />
              </div>

              {/* Live sync status pill */}
              <div className="home-sync-status-bar" role="status">
                <span className="home-sync-dot" data-status={syncStatus} />
                <span className="home-sync-text">
                  {syncStatus === 'typing'
                    ? 'Saving your words as you type…'
                    : syncStatus === 'syncing'
                    ? 'Sending directly to Tosif… 🤍'
                    : message.trim()
                    ? '✓ Everything you wrote is saved directly with Tosif 🤍'
                    : 'Whatever you type here comes directly to Tosif 🤍'}
                </span>
              </div>

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
            </div>
          </div>
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
