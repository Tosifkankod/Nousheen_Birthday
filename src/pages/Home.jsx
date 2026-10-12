import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DAYS } from '../data/days';
import { getCurrentDay, isDayUnlocked } from '../utils/dayUtils';
import StarField from '../components/StarField';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const STAGGER = {
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const navigate = useNavigate();
  const currentDay = getCurrentDay();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDayClick = (day) => {
    navigate(`/day/${day.day}`);
  };

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(3.5rem, calc(env(safe-area-inset-top) + 2rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <motion.div
        className="page-content z-1"
        variants={STAGGER}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={FADE_UP} className="text-center mb-5">
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.75rem' }}>
            OCTOBER 2026
          </p>
          <h1 className="display text-shimmer mb-3">
            14 Little Things
          </h1>
          <p className="subheading">
            One for every day leading to you.
          </p>
        </motion.div>

        {/* Intro message */}
        <motion.div
          variants={FADE_UP}
          className="card text-center mb-5"
          style={{ borderColor: 'rgba(232, 99, 122, 0.2)' }}
        >
          <p className="body-text mb-3" style={{ fontSize: '1.05rem', color: 'var(--white)' }}>
            Hey Nousheen ❤️
          </p>
          <p className="body-text mb-3">
            I could've given you one gift on your birthday...
          </p>
          <p className="body-text mb-3">
            But I wanted to give you <em style={{ color: 'var(--rose-light)', fontStyle: 'italic' }}>a little something every day.</em>
          </p>
          <div className="divider divider-center" />
          <p className="display-italic" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: 'var(--white)' }}>
            14 days.
          </p>
          <p className="subheading mt-2">
            14 little pieces of my heart.
          </p>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div variants={FADE_UP} className="mb-5">
          <p className="mono dim text-center mb-3" style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>
            OCTOBER — TAP TO OPEN
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.5rem',
            }}
            role="list"
            aria-label="14-day calendar"
          >
            {DAYS.map((day) => {
              const unlocked = isDayUnlocked(day.day);
              const isToday = day.day === currentDay;
              const isPast = day.day < currentDay;

              return (
                <motion.div
                  key={day.day}
                  role="listitem"
                  aria-label={`Day ${day.day}${unlocked ? ', unlocked' : ', locked'}`}
                  className={`cal-day ${isToday ? 'today' : isPast ? 'unlocked' : 'locked'}`}
                  whileHover={unlocked ? { scale: 1.12 } : {}}
                  whileTap={unlocked ? { scale: 0.95 } : {}}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoveredDay(day.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{ cursor: unlocked ? 'pointer' : 'default', aspectRatio: '1' }}
                  title={unlocked ? `Day ${day.day}: ${day.title}` : `Unlocks October ${day.day}`}
                >
                  {unlocked ? (
                    isToday ? (
                      <span style={{ fontSize: '1rem' }}>{day.emoji}</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem' }}>
                        {day.day.toString().padStart(2, '0')}
                        <span style={{ display: 'block', fontSize: '0.6rem', opacity: 0.7 }}>❤️</span>
                      </span>
                    )
                  ) : (
                    <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>🔒</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-center mt-2"
              >
                <p className="mono dim" style={{ fontSize: '0.75rem' }}>
                  {DAYS[hoveredDay - 1]?.emoji} {DAYS[hoveredDay - 1]?.title}
                  {!isDayUnlocked(hoveredDay) && (
                    <span style={{ color: 'var(--white-dimmer)' }}> — unlocks Oct {hoveredDay}</span>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Today's CTA */}
        <motion.div variants={FADE_UP} className="text-center mb-5">
          <motion.button
            className="btn-primary btn"
            onClick={() => navigate(`/day/${currentDay}`)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            id="open-today-btn"
            aria-label={`Open today's gift, Day ${currentDay}`}
          >
            Open Today's Gift {DAYS[currentDay - 1]?.emoji}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div variants={FADE_UP} className="text-center">
          <p className="mono dimmer" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
            Come back tomorrow. 🌙
          </p>
          <p className="mono dimmer mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
            Made by Tosif, for Nousheen — October 2026
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
