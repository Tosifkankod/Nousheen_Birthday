import { useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '../../components/StarField';
import DayNav from '../../components/DayNav';
import { SONG } from '../../data/days';

export default function Day3() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="page" style={{ minHeight: '100dvh', paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))', paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
      <StarField />
      <DayNav dayNumber={3} />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <div className="page-content z-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mono dim mb-3" style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}>
            OCTOBER 03 — DAY THREE
          </p>

          <p className="subheading mb-2">Today's gift</p>
          <div className="divider divider-center" />

          {/* Vinyl */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="mt-3 mb-4"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div
              className={`vinyl ${playing ? '' : 'vinyl-paused'}`}
              onClick={() => setPlaying(p => !p)}
              role="button"
              aria-label={playing ? 'Pause vinyl' : 'Play vinyl'}
              title={playing ? 'Tap to pause' : 'Tap to spin'}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h1
              className="heading mb-1"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.25rem, 4.5vw, 1.85rem)' }}
            >
              🎵 {SONG.title}
            </h1>
            <p className="subheading mb-3" style={{ fontSize: '0.92rem' }}>
              {SONG.artist}
            </p>

            <p className="body-text mb-4" style={{ maxWidth: '420px', margin: '0 auto 1.5rem', fontStyle: 'italic' }}>
              "{SONG.message}"
            </p>

            {/* YouTube embed */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                maxWidth: '520px',
                margin: '0 auto',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            >
              <iframe
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                }}
                src={`https://www.youtube.com/embed/${SONG.youtubeId}?autoplay=0&rel=0`}
                title={`${SONG.title} by ${SONG.artist}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>

            <motion.p
              className="mono dimmer mt-4"
              style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              close your eyes when you listen 🎧
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
