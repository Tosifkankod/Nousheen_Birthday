import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import DayNav from '../../components/DayNav';
import { saveResponse, syncPendingResponses } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';
import { DAY13_DATA } from '../../data/day13Data';
import './Day13.css';

const STORAGE_KEYS = {
  ANSWERS: 'nousheen_day13_answers',
  SAVED_AT: 'nousheen_day13_saved_at',
  COMPLETED: 'nousheen_day13_completed',
};

// Target date: October 14, 2026, at 12:00 AM, Asia/Kolkata (IST = UTC+05:30)
const BIRTHDAY_TARGET_TIME = new Date(DAY13_DATA.countdown.targetIso).getTime();

export default function Day13() {
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const id = getOrCreateSessionId(13);
    setSessionId(id);
  }, []);

  // --------------------------------------------------------------------------
  // 1. Audio State (Soft, Optional Music — Never autoplays without user tap)
  // --------------------------------------------------------------------------
  const audioRef = useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingMusic) {
      audio.pause();
      setIsPlayingMusic(false);
    } else {
      audio.volume = 0.45;
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  };

  // --------------------------------------------------------------------------
  // 2. Answers State (Preserved via localStorage across refreshes)
  // --------------------------------------------------------------------------
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read saved answers:', e);
    }
    return {
      q1_fears: '',
      q2_doubts: '',
      q3_worries: '',
      q4_heart: '',
      q5_anything: '',
    };
  });

  const [isSaved, setIsSaved] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [copied, setCopied] = useState(false);

  // Update a single question answer
  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => {
      const updated = { ...prev, [qId]: value };
      try {
        localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });
    // If she edits after saving, reset saved badge until she saves again
    if (showSavedFeedback) {
      setShowSavedFeedback(false);
    }
  };

  // Explicit Save My Answers action
  const handleSaveAnswers = async (e) => {
    e?.preventDefault();
    setIsSaving(true);

    try {
      // 1. Save locally in localStorage
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.SAVED_AT, new Date().toISOString());

      // 2. Send each answered question to Google Sheets via responseService
      const currentSessionId = sessionId || getOrCreateSessionId(13);

      for (const q of DAY13_DATA.questions) {
        const textVal = (answers[q.id] || '').trim();
        if (textVal) {
          await saveResponse({
            sessionId: currentSessionId,
            day: 13,
            questionId: `day13_${q.id}`,
            question: `${q.category}: ${q.title}`,
            optionId: q.id,
            answer: textVal,
            customText: textVal,
            timestamp: new Date().toISOString(),
          });
        }
      }

      syncPendingResponses();

      setIsSaved(true);
      setShowSavedFeedback(true);

      // Trigger delicate warm gold confetti
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#e8c37d', '#fcefd6', '#ffffff', '#c9a96e'],
        });
      } catch (_) {}
    } catch (err) {
      console.error('Error saving Day 13 answers:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy My Answers action
  const handleCopyAnswers = async () => {
    const lines = [
      '🤍 Day 13 — Nousheen’s Answers for Tosif 🤍',
      '==========================================\n',
    ];

    let hasAnyAnswer = false;
    for (const q of DAY13_DATA.questions) {
      const textVal = (answers[q.id] || '').trim();
      if (textVal) {
        hasAnyAnswer = true;
        lines.push(`• ${q.category}: ${q.title}`);
        lines.push(`"${textVal}"\n`);
      }
    }

    if (!hasAnyAnswer) {
      lines.push('(No answers entered yet)\n');
    }

    lines.push('— Sent with love from Nousheen 🤍');

    const fullText = lines.join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.warn('Copy to clipboard failed:', e);
    }
  };

  // Scroll to Questions section
  const scrollToQuestions = () => {
    const el = document.getElementById('day13-questions-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --------------------------------------------------------------------------
  // 3. Live Birthday Countdown to October 14, 2026, 12:00 AM IST
  // --------------------------------------------------------------------------
  const [countdown, setCountdown] = useState(() => {
    const diff = BIRTHDAY_TARGET_TIME - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isDone: true };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isDone: false,
    };
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = BIRTHDAY_TARGET_TIME - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isDone: true });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isDone: false,
      });
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // --------------------------------------------------------------------------
  // 4. Staggered letter animations for "I LOVE YOU, NOUSHEEN"
  // --------------------------------------------------------------------------
  const lovePhraseLetters = useMemo(() => {
    return DAY13_DATA.hero.lovePhrase.split('');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.4,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Particles generator
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      left: `${Math.random() * 96}%`,
      duration: `${Math.random() * 12 + 10}s`,
      delay: `${Math.random() * 8}s`,
    }));
  }, []);

  return (
    <div className="day13-wrapper">
      <DayNav dayNumber={13} />

      {/* Ambient background glows */}
      <div className="day13-bg-orb day13-bg-orb-1" aria-hidden="true" />
      <div className="day13-bg-orb day13-bg-orb-2" aria-hidden="true" />

      {/* Floating lights & delicate particles */}
      <div className="day13-particles-container" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="day13-particle"
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

      {/* Optional Soft Background Music Element */}
      <audio
        ref={audioRef}
        src={DAY13_DATA.music.url}
        loop
        preload="none"
      />

      <main className="day13-container">
        {/* Soft Music Controller Pill (Muted/Paused by default) */}
        <button
          type="button"
          onClick={toggleMusic}
          className="day13-audio-control"
          aria-label={isPlayingMusic ? 'Mute background music' : 'Play soft background music'}
          id="day13-music-toggle-btn"
        >
          {isPlayingMusic && <span className="day13-audio-pulse" />}
          <span>{isPlayingMusic ? '🔊 MUSIC PLAYING · TAP TO MUTE' : '🎵 PLAY SOFT MUSIC'}</span>
        </button>

        {/* ================================================================= */}
        {/* 1. OPENING SCREEN — HER NAME                                      */}
        {/* ================================================================= */}
        <section className="day13-hero">
          {/* Day 13 Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="day13-pill-badge"
          >
            <span>🤍</span>
            <span>{DAY13_DATA.hero.subBadge}</span>
          </motion.div>

          {/* Her Name: Nousheen (Handwritten animation) */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="day13-name-handwritten"
          >
            {DAY13_DATA.hero.nameEn}
          </motion.h1>

          {/* Arabic Spelling: نوشين */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="day13-name-arabic"
            aria-label="Nousheen in Arabic"
          >
            {DAY13_DATA.hero.nameAr}
          </motion.div>

          {/* Staggered Letter-by-Letter: I LOVE YOU, NOUSHEEN */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="day13-love-phrase"
          >
            {lovePhraseLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="day13-letter-char"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Opening Message Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="day13-opening-card"
          >
            {DAY13_DATA.hero.openingMessage.map((p, idx) => (
              <p key={idx} className="day13-opening-p">
                {p}
              </p>
            ))}
          </motion.div>

          {/* Smooth Scroll Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            type="button"
            onClick={scrollToQuestions}
            className="day13-cta-btn"
            id="day13-talk-to-me-btn"
          >
            <span>{DAY13_DATA.hero.ctaText}</span>
            <span>↓</span>
          </motion.button>
        </section>

        {/* ================================================================= */}
        {/* 2. INTIMATE SPACE JUST FOR HER & 5 QUESTIONS                      */}
        {/* ================================================================= */}
        <section id="day13-questions-section" className="day13-questions-section">
          {/* Section Header */}
          <div className="day13-section-header">
            <h2 className="day13-section-title">
              {DAY13_DATA.intimateSpace.heading}
            </h2>

            <div className="day13-supporting-box">
              {DAY13_DATA.intimateSpace.supportingParagraphs.map((p, idx) => (
                <p key={idx} className="day13-supporting-p">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* The 5 Question Cards */}
          <div className="day13-questions-list">
            {DAY13_DATA.questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="day13-q-card"
              >
                <div className="day13-q-meta">
                  <span className="day13-q-category">
                    <span className="day13-q-icon">{q.icon}</span>
                    <span>Question {q.number} · {q.category}</span>
                  </span>
                </div>

                <h3 className="day13-q-title">
                  {q.title}
                </h3>

                <textarea
                  className="day13-q-textarea"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  id={`day13-textarea-${q.id}`}
                  rows={4}
                  aria-label={q.title}
                />
              </motion.div>
            ))}
          </div>

          {/* Under Questions Disclaimer */}
          <div className="day13-disclaimer-box">
            <p className="day13-disclaimer-text">
              “There's no right or wrong answer, bachaa. You can answer whichever questions you want. You can also leave them blank and come back later.
              <br /><br />
              I want to understand you, not pressure you. 🤍”
            </p>
          </div>

          {/* =============================================================== */}
          {/* 3. SAVE HER ANSWERS & COPY ACTIONS                              */}
          {/* =============================================================== */}
          <div className="day13-actions-area">
            <button
              type="button"
              onClick={handleSaveAnswers}
              disabled={isSaving}
              className="day13-save-btn"
              id="day13-save-answers-btn"
            >
              {isSaving ? 'SAVING YOUR ANSWERS… 🤍' : DAY13_DATA.saveSection.saveButtonText}
            </button>

            {showSavedFeedback && (
              <div className="day13-save-confirm" role="status">
                <span>✓</span>
                <span>{DAY13_DATA.saveSection.savedConfirmation}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyAnswers}
              className="day13-copy-btn"
              id="day13-copy-answers-btn"
            >
              {copied ? '✓ COPIED TO CLIPBOARD! 🤍' : DAY13_DATA.saveSection.copyButtonText}
            </button>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. BIRTHDAY COUNTDOWN — OCTOBER 14, 2026 🎂                       */}
        {/* ================================================================= */}
        <section className="day13-countdown-section">
          {countdown.isDone ? (
            <div className="day13-birthday-achieved">
              <h2 className="day13-birthday-achieved-title">
                {DAY13_DATA.countdown.completedHeading}
              </h2>
              <p className="day13-birthday-achieved-p">
                {DAY13_DATA.countdown.completedMessage}
              </p>
            </div>
          ) : (
            <>
              <p className="day13-countdown-above">
                {DAY13_DATA.countdown.labelAbove}
              </p>

              <div className="day13-timer-grid">
                <div className="day13-timer-block">
                  <span className="day13-timer-num">{countdown.days}</span>
                  <span className="day13-timer-label">Days</span>
                </div>
                <div className="day13-timer-block">
                  <span className="day13-timer-num">
                    {countdown.hours < 10 ? `0${countdown.hours}` : countdown.hours}
                  </span>
                  <span className="day13-timer-label">Hours</span>
                </div>
                <div className="day13-timer-block">
                  <span className="day13-timer-num">
                    {countdown.minutes < 10 ? `0${countdown.minutes}` : countdown.minutes}
                  </span>
                  <span className="day13-timer-label">Minutes</span>
                </div>
                <div className="day13-timer-block">
                  <span className="day13-timer-num">
                    {countdown.seconds < 10 ? `0${countdown.seconds}` : countdown.seconds}
                  </span>
                  <span className="day13-timer-label">Seconds</span>
                </div>
              </div>

              <p className="day13-countdown-below">
                “{DAY13_DATA.countdown.labelBelow}”
              </p>
            </>
          )}
        </section>

        {/* ================================================================= */}
        {/* 5. FINAL SCREEN                                                   */}
        {/* ================================================================= */}
        <section className="day13-final-section">
          <div className="day13-final-name-ar" aria-label="Nousheen in Arabic">
            {DAY13_DATA.finalScreen.nameAr}
          </div>

          <h2 className="day13-final-heading">
            {DAY13_DATA.finalScreen.heading}
          </h2>

          {DAY13_DATA.finalScreen.paragraphs.map((p, idx) => (
            <p key={idx} className="day13-final-p">
              {p}
            </p>
          ))}

          <div className="day13-complete-pill">
            <span>🤍</span>
            <span>{DAY13_DATA.finalScreen.completeBadge}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
