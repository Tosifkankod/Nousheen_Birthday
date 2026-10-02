import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { ALBUM_PHOTOS } from '../../data/days';

const PLACEHOLDER_COLORS = ['#1a1510', '#111520', '#150d0d', '#0d1515'];

export default function Day7() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const photo = ALBUM_PHOTOS[page];

  const go = (dir) => {
    const next = page + dir;
    if (next < 0 || next >= ALBUM_PHOTOS.length) return;
    setDirection(dir);
    setPage(next);
  };

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={7} />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <div className="page-content z-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="mono dim mb-2" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 07 — DAY SEVEN
          </p>
          <h1 className="heading mb-1">Our Album</h1>
          <p className="subheading">The moments I keep coming back to.</p>
        </motion.div>

        {/* Album Book */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="album-page"
              style={{ maxWidth: '440px', margin: '0 auto' }}
            >
              {/* Page indicator */}
              <p className="mono dimmer mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                {(page + 1).toString().padStart(2, '0')} / {ALBUM_PHOTOS.length.toString().padStart(2, '0')}
              </p>

              {/* Photo area */}
              <div
                className="album-photo mb-3"
                style={{
                  background: PLACEHOLDER_COLORS[page],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  minHeight: '210px',
                  borderRadius: '6px',
                }}
              >
                {photo.src ? (
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: '2.8rem', opacity: 0.7 }}>{photo.emoji}</span>
                    <p className="mono dimmer" style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                      Add your photo here
                    </p>
                  </>
                )}
              </div>

              {/* Caption */}
              <p
                style={{
                  fontFamily: 'var(--font-elegant)',
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  color: 'var(--gold)',
                  marginBottom: '0.4rem',
                  lineHeight: 1.4,
                }}
              >
                "{photo.caption}"
              </p>
              <p className="body-text" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                {photo.note}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="btn"
            onClick={() => go(-1)}
            disabled={page === 0}
            id="album-prev-btn"
            aria-label="Previous photo"
            style={{ opacity: page === 0 ? 0.3 : 1, minHeight: '42px', padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}
          >
            ← Prev
          </button>

          {/* Dots */}
          <div className="flex gap-1" style={{ margin: '0 0.4rem' }}>
            {ALBUM_PHOTOS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: i === page ? 'var(--rose)' : 'var(--border)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          <button
            className="btn"
            onClick={() => go(1)}
            disabled={page === ALBUM_PHOTOS.length - 1}
            id="album-next-btn"
            aria-label="Next photo"
            style={{ opacity: page === ALBUM_PHOTOS.length - 1 ? 0.3 : 1, minHeight: '42px', padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
