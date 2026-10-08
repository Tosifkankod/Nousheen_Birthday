import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Day8AudioPlayer({ song, onSongFinished }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Reset player state when song changes
  useEffect(() => {
    setIsPlaying(false);
    setShowEmbed(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [song.id]);

  const getEmbedUrl = (url, type) => {
    if (!url) return null;
    if (type === 'spotify') {
      if (url.includes('/embed/')) return url;
      // Convert standard spotify track link into embed link
      return url.replace('open.spotify.com/track/', 'open.spotify.com/embed/track/');
    }
    if (type === 'youtube') {
      if (url.includes('/embed/')) return url;
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
    }
    return null;
  };

  const handlePlayToggle = () => {
    if (song.type === 'audio' && song.url) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setShowEmbed(true);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const embedUrl = getEmbedUrl(song.url, song.type);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {/* Native HTML5 Audio if direct audio source */}
      {song.type === 'audio' && (
        <audio
          ref={audioRef}
          src={song.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            if (onSongFinished) onSongFinished();
          }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}

      {/* Main Play Action Bar */}
      <div
        style={{
          background: 'rgba(15, 12, 24, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 193, 123, 0.22)',
          borderRadius: '20px',
          padding: '1.25rem 1.4rem',
          boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.65)',
        }}
      >
        {/* Track Title & Artist Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ minWidth: 0, paddingRight: '1rem' }}>
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(229, 193, 123, 0.85)',
                fontFamily: 'var(--font-mono, monospace)',
                marginBottom: '0.2rem',
              }}
            >
              {song.feeling || 'Song selection'}
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.15rem',
                fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {song.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.65)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {song.artist}
            </p>
          </div>

          {/* Vinyl / Soundwave Icon */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #2a2038 0%, #130f1e 100%)',
              border: '1px solid rgba(229, 193, 123, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(229, 193, 123, 0.15)',
            }}
          >
            <motion.span
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              style={{ display: 'inline-block', fontSize: '1.2rem' }}
            >
              🎵
            </motion.span>
          </div>
        </div>

        {/* Audio Progress Bar (Active if HTML5 audio) */}
        {song.type === 'audio' && (
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (audioRef.current) {
                  audioRef.current.currentTime = pos * duration;
                }
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #e5c17b, #e88d9d)',
                  borderRadius: '2px',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.45)',
                marginTop: '0.35rem',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Main Intentional Play Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlayToggle}
            style={{
              flex: '1 1 140px',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #e5c17b 0%, #c9a456 100%)',
              color: '#0a0712',
              fontWeight: 600,
              fontSize: '0.88rem',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(229, 193, 123, 0.3)',
            }}
          >
            <span>{isPlaying ? '⏸ PAUSE' : '▶ PLAY THIS ONE'}</span>
          </motion.button>

          {/* External Link / Fallback Button */}
          {song.url && (
            <motion.a
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: '0 0 auto',
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
              }}
            >
              <span>OPEN {song.type ? song.type.toUpperCase() : 'SONG'} ↗</span>
            </motion.a>
          )}
        </div>

        {/* Embedded Iframe Player if active */}
        <AnimatePresence>
          {showEmbed && embedUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: song.type === 'spotify' ? '152px' : '200px' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: '1.25rem',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <iframe
                src={embedUrl}
                title={song.title}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: '12px', border: 'none' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
