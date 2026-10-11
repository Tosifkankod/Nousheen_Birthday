import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import DayNav from '../../components/DayNav';
import { saveResponse, syncPendingResponses } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';
import { DAY11_LETTER_PAGES, DAY11_QUESTIONS } from '../../data/day11Data';
import './Day11.css';

const STORAGE_KEYS = {
  PROMISES: 'nousheen_day11_promises',
  THOUGHTS: 'nousheen_day11_thoughts',
  COMPLETED: 'nousheen_day11_completed',
  SAVED_AT: 'nousheen_day11_saved_at',
};

export default function Day11() {
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const id = getOrCreateSessionId(11);
    setSessionId(id);
  }, []);

  // Saved answers from localStorage
  const [promises, setPromises] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PROMISES) || '';
    } catch {
      return '';
    }
  });

  const [thoughts, setThoughts] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THOUGHTS) || '';
    } catch {
      return '';
    }
  });

  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  // Navigation / Phase:
  // 'cover' -> 'reading' (4-page letter) -> 'finalQuestions' -> 'completed'
  const [bookState, setBookState] = useState(() => {
    try {
      const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
      return completed ? 'completed' : 'cover';
    } catch {
      return 'cover';
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Soft Web Audio tone synthesizer
  const playTone = (freq = 440, type = 'sine', duration = 0.4, gainVal = 0.04) => {
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
      gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported
    }
  };

  const playPageTurnTone = () => {
    playTone(392, 'sine', 0.25, 0.03); // G4
    setTimeout(() => playTone(523.25, 'sine', 0.35, 0.025), 60); // C5
  };

  const playBookCloseTone = () => {
    playTone(440, 'triangle', 0.5, 0.035); // A4
    setTimeout(() => playTone(349.23, 'sine', 0.6, 0.03), 100); // F4
  };

  const playSuccessTone = () => {
    playTone(523.25, 'sine', 0.4, 0.04);
    setTimeout(() => playTone(659.25, 'sine', 0.5, 0.04), 100);
    setTimeout(() => playTone(783.99, 'sine', 0.7, 0.04), 200);
    setTimeout(() => playTone(1046.5, 'sine', 1.0, 0.03), 320);
  };

  // Open the book
  const handleOpenBook = () => {
    playPageTurnTone();
    setCurrentPage(1);
    setBookState('reading');
  };

  // Turn page forward
  const handleNextPage = () => {
    playPageTurnTone();
    if (currentPage < DAY11_LETTER_PAGES.length) {
      setCurrentPage((prev) => prev + 1);
    } else {
      // Finished reading letter: Close book and transition into the two questions
      handleFinishLetter();
    }
  };

  // Turn page back
  const handlePrevPage = () => {
    playPageTurnTone();
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Finish letter -> Close 3D book and transition into final screen
  const handleFinishLetter = () => {
    playBookCloseTone();
    setBookState('finalQuestions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit the two questions
  const handleSaveAnswers = async (e) => {
    e?.preventDefault();

    // 1. Mandatory validation for Part 2 (What's on your mind)
    if (!thoughts.trim()) {
      setValidationError(DAY11_QUESTIONS.part2.validationError);
      playTone(330, 'sine', 0.3, 0.04);
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      // 2. Save locally in localStorage
      localStorage.setItem(STORAGE_KEYS.PROMISES, promises.trim());
      localStorage.setItem(STORAGE_KEYS.THOUGHTS, thoughts.trim());
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.SAVED_AT, new Date().toISOString());

      // 3. Save to background responseService (Excel / Google Sheets sync)
      const currentSessionId = sessionId || getOrCreateSessionId(11);

      if (promises.trim()) {
        await saveResponse({
          sessionId: currentSessionId,
          day: 11,
          questionId: 'day11_promises_from_tosif',
          question: DAY11_QUESTIONS.part1.heading,
          optionId: 'written_promises',
          answer: promises.trim(),
          customText: promises.trim(),
          timestamp: new Date().toISOString(),
        });
      }

      await saveResponse({
        sessionId: currentSessionId,
        day: 11,
        questionId: 'day11_whats_on_nousheen_mind',
        question: DAY11_QUESTIONS.part2.heading,
        optionId: 'written_thoughts',
        answer: thoughts.trim(),
        customText: thoughts.trim(),
        timestamp: new Date().toISOString(),
      });

      syncPendingResponses();

      setIsCompleted(true);
      setBookState('completed');
      playSuccessTone();

      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#e8c37d', '#fbe2a8', '#ffffff', '#f48fb1'],
        });
      } catch (_) {}

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving Day 11 answers:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy both answers formatted for Tosif
  const handleCopyAnswers = async () => {
    const textToCopy = `📖 Our Little Book — Day 11 🤍\n\n[PROMISES I WANT FROM TOSIF]:\n${promises.trim() || '(No promises requested right now)'}\n\n[SEND SOMETHING COMPULSORY]:\n${thoughts.trim()}\n\n— Written by Nousheen for Tosif 🤍`;

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
      playTone(660, 'sine', 0.25, 0.03);
      setTimeout(() => setCopied(false), 3500);
    } catch (err) {
      console.error('Failed to copy answers:', err);
    }
  };

  const activePageData = DAY11_LETTER_PAGES[currentPage - 1];

  return (
    <div className="day11-wrapper">
      <DayNav dayNumber={11} />
      <div className="day11-bg-glow" />

      <main className="day11-section">
        {/* ================================================================= */}
        {/* STATE 1: CLOSED 3D BOOK COVER                                     */}
        {/* ================================================================= */}
        {bookState === 'cover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="day11-book-stage"
          >
            <div className="day11-badge-pill">
              <span>📖</span>
              <span>OCTOBER 11 · DAY ELEVEN</span>
            </div>

            <div
              id="day11-book-cover"
              onClick={handleOpenBook}
              className="day11-book-cover"
              role="button"
              tabIndex={0}
              aria-label="Open our little book"
            >
              <div className="day11-cover-spine-crease" />
              <div className="day11-cover-border">
                <div className="day11-cover-corner tl" />
                <div className="day11-cover-corner tr" />
                <div className="day11-cover-corner bl" />
                <div className="day11-cover-corner br" />
              </div>

              {/* Cover Top Motif */}
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '2.4rem', color: '#fbe2a8' }}>✨ 📖 ✨</span>
              </div>

              {/* Cover Titles */}
              <div>
                <h1 className="day11-cover-title">Our Little Book</h1>
                <p className="day11-cover-subtitle">For Nousheen ♡</p>
                <div style={{
                  width: '60px',
                  height: '1px',
                  background: 'rgba(232, 195, 125, 0.5)',
                  margin: '18px auto',
                }} />
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: 'rgba(251, 226, 168, 0.8)',
                  margin: 0,
                }}>
                  "Five handwritten pages from my heart, and two things I want to ask you."
                </p>
              </div>

              {/* Cover Bottom Prompt */}
              <div style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  className="day11-glow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenBook();
                  }}
                >
                  OPEN OUR BOOK 📖
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* STATE 2: READING THE FIVE-PAGE HANDWRITTEN LETTER                 */}
        {/* ================================================================= */}
        {bookState === 'reading' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="day11-book-stage"
          >
            <div className="day11-badge-pill">
              <span>📖</span>
              <span>PAGE {currentPage} OF {DAY11_LETTER_PAGES.length}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPage}`}
                initial={{ opacity: 0, rotateY: -15, x: 20 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 15, x: -20 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="day11-open-book"
              >
                {/* Page Header */}
                <div className="day11-page-header">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="day11-page-num">{activePageData.title}</span>
                    <span className="day11-page-tag">{activePageData.header}</span>
                  </div>
                  <span className="day11-page-num" style={{ fontSize: '0.8rem' }}>
                    {currentPage} / {DAY11_LETTER_PAGES.length}
                  </span>
                </div>

                {/* Handwritten Letter Image Only */}
                <div
                  className="day11-letter-img-frame"
                  onClick={() => setLightboxImg(activePageData.image)}
                  title="Click to view full screen"
                >
                  <img
                    src={activePageData.image}
                    alt={`Handwritten letter page ${currentPage}`}
                    className="day11-letter-img"
                    onError={(e) => {
                      if (activePageData.fallbackImage && e.currentTarget.src !== activePageData.fallbackImage) {
                        e.currentTarget.src = activePageData.fallbackImage;
                      }
                    }}
                  />
                  <span className="day11-img-tap-hint">🔍 Tap to zoom</span>
                </div>

                {/* Page Footer & Turn Controls */}
                <div className="day11-page-footer">
                  <span className="day11-page-accent">
                    {activePageData.accentNote}
                  </span>

                  <div className="day11-page-controls">
                    {currentPage > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevPage}
                        className="day11-book-btn sec"
                        id="btn-prev-page"
                      >
                        ← Prev Page
                      </button>
                    )}

                    {currentPage < DAY11_LETTER_PAGES.length ? (
                      <button
                        type="button"
                        onClick={handleNextPage}
                        className="day11-book-btn"
                        id="btn-next-page"
                      >
                        Turn Page →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinishLetter}
                        className="day11-finish-letter-btn"
                        id="btn-finish-letter"
                      >
                        Close Book & Continue 📖 →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* STATE 3: THE FINAL SCREEN (TWO IMPORTANT QUESTIONS FOR NOUSHEEN)  */}
        {/* ================================================================= */}
        {bookState === 'finalQuestions' && (
          <div className="day11-final-screen">
            {/* Main Heading as requested */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="day11-badge-pill">
                <span>🤍</span>
                <span>THE LAST PAGE OF OUR LITTLE BOOK</span>
              </div>
              <h2 className="day11-final-main-heading">
                “{DAY11_QUESTIONS.mainHeading}”
              </h2>
              <p className="day11-final-intro-note">
                Take your time, bachaa. Every word you share with me is sacred.
              </p>
            </div>

            <form onSubmit={handleSaveAnswers} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* ------------------------------------------------------------- */}
              {/* PART 1 — PROMISES YOU WANT FROM ME                            */}
              {/* ------------------------------------------------------------- */}
              <div className="day11-card" id="part1-promises-card">
                <div className="day11-card-badge">{DAY11_QUESTIONS.part1.badge}</div>
                <h3 className="day11-card-heading">
                  “{DAY11_QUESTIONS.part1.heading}”
                </h3>

                <div className="day11-card-msg">
                  {DAY11_QUESTIONS.part1.message.map((msg, idx) => (
                    <p key={idx} className="day11-card-p">
                      {msg}
                    </p>
                  ))}
                </div>

                <div className="day11-textarea-wrap">
                  <textarea
                    id="day11-promises-input"
                    value={promises}
                    onChange={(e) => setPromises(e.target.value)}
                    placeholder={DAY11_QUESTIONS.part1.placeholder}
                    className="day11-textarea"
                    rows={5}
                  />
                </div>

                <p className="day11-subnote">
                  {DAY11_QUESTIONS.part1.subNote}
                </p>

                <p className="day11-promise-highlight">
                  {DAY11_QUESTIONS.part1.promiseHighlight}
                </p>

                <p className="day11-signature">
                  {DAY11_QUESTIONS.part1.signature}
                </p>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* PART 2 — SEND SOMETHING (COMPULSORY)                           */}
              {/* ------------------------------------------------------------- */}
              <div className="day11-card" id="part2-thoughts-card">
                <div className="day11-card-badge">{DAY11_QUESTIONS.part2.badge}</div>
                <h3 className="day11-card-heading">
                  {DAY11_QUESTIONS.part2.heading}
                </h3>

                {DAY11_QUESTIONS.part2.message && DAY11_QUESTIONS.part2.message.length > 0 && (
                  <div className="day11-card-msg">
                    {DAY11_QUESTIONS.part2.message.map((msg, idx) => (
                      <p key={idx} className="day11-card-p">
                        {msg}
                      </p>
                    ))}
                  </div>
                )}

                <div className="day11-textarea-wrap">
                  <textarea
                    id="day11-thoughts-input"
                    value={thoughts}
                    onChange={(e) => {
                      setThoughts(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder={DAY11_QUESTIONS.part2.placeholder}
                    className="day11-textarea"
                    rows={6}
                    required
                  />
                </div>

                {/* Gentle Inline Validation (Never aggressive or red) */}
                {validationError && (
                  <div className="day11-gentle-validation">
                    <span style={{ fontSize: '1.1rem' }}>🤍</span>
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="day11-submit-wrap">
                <button
                  type="submit"
                  id="btn-save-words-in-book"
                  disabled={isSubmitting}
                  className="day11-glow-btn"
                >
                  {isSubmitting ? 'SAVING YOUR WORDS...' : 'SAVE YOUR WORDS IN OUR BOOK 🤍'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPageTurnTone();
                    setBookState('reading');
                  }}
                  className="day11-subtle-link"
                >
                  ← Re-read the letter in our book
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* STATE 4: CONFIRMATION & COMPLETION SCREEN                         */}
        {/* ================================================================= */}
        {bookState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="day11-confirmation-card"
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
              📖 🤍 ✨
            </div>

            {/* Gentle Confirmation */}
            <div className="day11-saved-box">
              <h3 className="day11-saved-title">
                “{DAY11_QUESTIONS.completion.savedConfirmation}”
              </h3>
            </div>

            {/* Copy option so she can copy both answers and send to Tosif */}
            <div className="day11-copy-actions">
              <button
                type="button"
                id="btn-copy-answers"
                onClick={handleCopyAnswers}
                className="day11-copy-btn"
              >
                <span>{copied ? '✓' : '📋'}</span>
                <span>{copied ? 'COPIED TO CLIPBOARD!' : 'Copy My Answers To Send To Tosif'}</span>
              </button>

              {copied && (
                <div className="day11-copy-feedback">
                  ✓ Copied! You can paste and send this directly to Tosif via WhatsApp or chat.
                </div>
              )}
            </div>

            {/* Statements after saving */}
            <p className="day11-trust-statement">
              “{DAY11_QUESTIONS.completion.trustMessage}”
            </p>

            <p className="day11-openheart-statement">
              “{DAY11_QUESTIONS.completion.openHeartMessage}”
            </p>

            {/* Final Reveal: DAY 11 COMPLETE 🤍 */}
            <div className="day11-complete-badge" id="day11-complete-badge">
              {DAY11_QUESTIONS.completion.completeTitle}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  playPageTurnTone();
                  setBookState('finalQuestions');
                }}
                className="day11-subtle-link"
              >
                ✎ Edit your answers
              </button>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <button
                type="button"
                onClick={() => {
                  playPageTurnTone();
                  setBookState('reading');
                  setCurrentPage(1);
                }}
                className="day11-subtle-link"
              >
                📖 Re-read our little book
              </button>
            </div>
          </motion.div>
        )}

        {/* Fullscreen Lightbox for reading handwritten letter in high detail */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="day11-lightbox-overlay"
              onClick={() => setLightboxImg(null)}
            >
              <button
                type="button"
                className="day11-lightbox-close"
                onClick={() => setLightboxImg(null)}
                aria-label="Close zoomed view"
              >
                ✕
              </button>
              <img
                src={lightboxImg}
                alt={`Handwritten letter full view`}
                className="day11-lightbox-img"
                onClick={(e) => e.stopPropagation()}
              />
              <p style={{ color: '#fbe2a8', fontSize: '0.85rem', marginTop: '14px', opacity: 0.85, textAlign: 'center' }}>
                Tap anywhere outside to close · Page {currentPage} of {DAY11_LETTER_PAGES.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
