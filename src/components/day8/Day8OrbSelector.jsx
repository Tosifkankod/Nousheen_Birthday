import { motion } from 'framer-motion';

export default function Day8OrbSelector({
  songs = [],
  activeIndex = 0,
  onSelectSong,
}) {
  const getOrbVisual = (type) => {
    switch (type) {
      case 'vinyl':
        return (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #df9b3a 18%, #1b161f 22%, #0c0a10 100%)',
              border: '1px solid rgba(255, 215, 120, 0.4)',
              boxShadow: '0 0 16px rgba(223, 155, 58, 0.6), inset 0 0 8px rgba(255, 230, 160, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffeaad' }} />
          </div>
        );
      case 'cassette':
        return (
          <div
            style={{
              width: '42px',
              height: '26px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #3d2616 0%, #170f0a 100%)',
              border: '1px solid rgba(255, 190, 100, 0.5)',
              boxShadow: '0 0 14px rgba(230, 140, 50, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 4px',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #ffcc77' }} />
            <div style={{ width: '12px', height: '4px', background: '#ffaa44', borderRadius: '1px' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #ffcc77' }} />
          </div>
        );
      case 'moon':
        return (
          <div
            style={{
              fontSize: '1.6rem',
              filter: 'drop-shadow(0 0 12px rgba(255, 220, 120, 0.9))',
              color: '#ffe596',
              lineHeight: 1,
            }}
          >
            🌙
          </div>
        );
      case 'frame':
        return (
          <div
            style={{
              width: '28px',
              height: '36px',
              background: '#f7ede2',
              borderRadius: '2px',
              padding: '2px 2px 6px 2px',
              boxShadow: '0 0 14px rgba(255, 230, 180, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '24px',
                background: 'linear-gradient(180deg, #c96d48 0%, #301f2f 100%)',
                borderRadius: '1px',
              }}
            />
          </div>
        );
      case 'flower':
        return (
          <div
            style={{
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 0 14px rgba(255, 240, 200, 0.95))',
              lineHeight: 1,
            }}
          >
            🌼
          </div>
        );
      case 'heart':
      default:
        return (
          <div
            style={{
              fontSize: '1.6rem',
              filter: 'drop-shadow(0 0 16px rgba(255, 170, 120, 1))',
              color: '#ffb38a',
              lineHeight: 1,
            }}
          >
            💛
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 'clamp(0.6rem, 2.5vw, 2.2rem)',
        flexWrap: 'wrap',
        margin: '1.5rem auto 2rem',
        maxWidth: '920px',
        padding: '0 1rem',
      }}
    >
      {songs.map((song, idx) => {
        const isSelected = activeIndex === idx;
        return (
          <motion.div
            key={song.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectSong(idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              width: 'clamp(80px, 14vw, 110px)',
              textAlign: 'center',
            }}
          >
            {/* Glass Drop Orb with glowing gold rim & atmospheric interior */}
            <div
              style={{
                position: 'relative',
                width: 'clamp(60px, 10vw, 76px)',
                height: 'clamp(60px, 10vw, 76px)',
                borderRadius: '50%',
                background: isSelected
                  ? 'radial-gradient(circle at 35% 30%, rgba(255, 235, 180, 0.4) 0%, rgba(229, 150, 50, 0.25) 50%, rgba(20, 14, 25, 0.8) 100%)'
                  : 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(100, 75, 50, 0.1) 50%, rgba(10, 8, 16, 0.7) 100%)',
                border: isSelected
                  ? '1.5px solid rgba(255, 220, 130, 0.9)'
                  : '1px solid rgba(255, 220, 140, 0.3)',
                boxShadow: isSelected
                  ? '0 0 24px rgba(255, 190, 80, 0.6), inset 0 0 14px rgba(255, 230, 150, 0.5)'
                  : '0 4px 15px rgba(0, 0, 0, 0.5), inset 0 0 8px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                marginBottom: '0.65rem',
              }}
            >
              {/* Glass Glare Highlight */}
              <div
                style={{
                  position: 'absolute',
                  top: '12%',
                  left: '18%',
                  width: '35%',
                  height: '25%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 80%)',
                  transform: 'rotate(-30deg)',
                  pointerEvents: 'none',
                }}
              />

              {/* Glowing internal icon */}
              <motion.div
                animate={{
                  scale: isSelected ? [1, 1.08, 1] : 1,
                  rotate: isSelected && song.icon === 'vinyl' ? 360 : 0,
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                  rotate: { repeat: Infinity, duration: 6, ease: 'linear' },
                }}
              >
                {getOrbVisual(song.icon)}
              </motion.div>
            </div>

            {/* Song Number */}
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: isSelected ? '#ffd57e' : 'rgba(255, 255, 255, 0.5)',
                fontWeight: 600,
                marginBottom: '0.15rem',
              }}
            >
              {song.number}
            </span>

            {/* Song Title */}
            <span
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.88rem)',
                color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.25,
                marginBottom: '0.2rem',
                textShadow: isSelected ? '0 0 12px rgba(255, 215, 120, 0.6)' : 'none',
              }}
            >
              {song.category || song.title}
            </span>

            {/* Delicate Heart */}
            <span
              style={{
                fontSize: '0.75rem',
                color: isSelected ? '#e88d9d' : 'rgba(255, 255, 255, 0.35)',
                transition: 'color 0.3s ease',
              }}
            >
              ♡
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
