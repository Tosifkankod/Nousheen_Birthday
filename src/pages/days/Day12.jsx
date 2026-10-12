import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import DayNav from '../../components/DayNav';
import { saveResponse, syncPendingResponses } from '../../services/responseService';
import { getOrCreateSessionId } from '../../utils/session';
import { DAY12_DATA } from '../../data/day12Data';
import './Day12.css';

const STORAGE_KEYS = {
  USER_RESPONSE: 'nousheen_day12_user_response',
  COMPLETED: 'nousheen_day12_completed',
  SAVED_AT: 'nousheen_day12_saved_at',
};

export default function Day12() {
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const id = getOrCreateSessionId(12);
    setSessionId(id);
  }, []);

  // Video State
  const videoRef = useRef(null);
  const [videoSrcIndex, setVideoSrcIndex] = useState(0);

  // Music & Lyrics State
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(DAY12_DATA.song.url);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  // Response Input State
  const [userResponse, setUserResponse] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_RESPONSE) || '';
    } catch {
      return '';
    }
  });

  const [isSaved, setIsSaved] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const song = DAY12_DATA.song;
  const currentVideoSrc = DAY12_DATA.videoSources[videoSrcIndex];

  // Autoplay video muted in continuous loop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      videoRef.current.playsInline = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video autoplay:', err);
        });
      }
    }
  }, [currentVideoSrc]);

  // Handle video error fallback
  const handleVideoError = () => {
    if (videoSrcIndex < DAY12_DATA.videoSources.length - 1) {
      setVideoSrcIndex(prev => prev + 1);
    }
  };

  // Music playback sync
  const togglePlaySong = () => {
    if (!audioRef.current) return;
    if (isPlayingSong) {
      audioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingSong(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  };

  const handleAudioError = () => {
    if (audioUrl !== song.fallbackUrl) {
      setAudioUrl(song.fallbackUrl);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    // Find active lyric line based on precise timestamp
    const lyrics = song.lyrics;
    let foundIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (time >= lyrics[i].time) {
        foundIndex = i;
      } else {
        break;
      }
    }

    if (foundIndex !== activeLyricIndex) {
      setActiveLyricIndex(foundIndex);

      // Smoothly scroll active line into center of container
      if (lyricsContainerRef.current) {
        const lineEl = lyricsContainerRef.current.children[foundIndex];
        if (lineEl) {
          lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newFraction * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleLyricClick = (targetTime) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    if (!isPlayingSong) {
      audioRef.current.play().then(() => setIsPlayingSong(true)).catch(() => {});
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Submit Nousheen's input
  const handleSubmitResponse = async (e) => {
    e?.preventDefault();
    if (!userResponse.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Save locally
      localStorage.setItem(STORAGE_KEYS.USER_RESPONSE, userResponse.trim());
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.SAVED_AT, new Date().toISOString());

      // 2. Sync to Google Sheets
      const currentSessionId = sessionId || getOrCreateSessionId(12);
      await saveResponse({
        sessionId: currentSessionId,
        day: 12,
        questionId: 'day12_nousheen_message',
        question: DAY12_DATA.inputSection.heading,
        optionId: 'written_response',
        answer: userResponse.trim(),
        customText: userResponse.trim(),
        timestamp: new Date().toISOString(),
      });

      syncPendingResponses();

      setIsSaved(true);
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#e8c37d', '#fbe2a8', '#ffffff', '#f48fb1'],
        });
      } catch (_) {}
    } catch (err) {
      console.error('Error saving response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyResponse = async () => {
    const textToCopy = `🤍 Day 12 Response for Tosif:\n\n${userResponse.trim()}\n\n— Sent with love from Nousheen 🤍`;
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
    <div className="day12-wrapper">
      <DayNav dayNumber={12} />
      <div className="day12-bg-glow" />

      {/* Hidden audio element for lyrics player */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
        onEnded={() => setIsPlayingSong(false)}
      />

      <main className="day12-section">
        {/* Header Pill */}
        <div className="day12-badge-pill">
          <span>🤍</span>
          <span>OCTOBER 12 · DAY TWELVE</span>
        </div>

        {/* ================================================================= */}
        {/* 1. AUTOPLAY VIDEO (MUTED IN LOOP)                                 */}
        {/* ================================================================= */}
        <section className="day12-video-card">
          <div className="day12-video-frame">
            <video
              ref={videoRef}
              src={currentVideoSrc}
              autoPlay
              muted
              loop
              playsInline
              onError={handleVideoError}
              className="day12-video-element"
            />

            {/* Video Bottom Bar */}
            <div className="day12-video-overlay-bar">
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.paused) {
                      videoRef.current.play();
                    } else {
                      videoRef.current.pause();
                    }
                  }
                }}
                className="day12-video-btn"
              >
                ⏯ Play / Pause
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('day12-message-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="day12-video-btn"
              >
                Read Letter Below ↓
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. TOSIF'S HEARTFELT MESSAGE                                      */}
        {/* ================================================================= */}
        <section id="day12-message-section" className="day12-message-card">
          <h2 className="day12-message-heading">
            {DAY12_DATA.message.heading}
          </h2>

          {DAY12_DATA.message.paragraphs.map((p, idx) => (
            <p key={idx} className="day12-message-p">
              {p}
            </p>
          ))}

          {/* Dedicated Song Callout */}
          <div className="day12-dedication-box">
            <p className="day12-dedication-text">
              “{DAY12_DATA.message.songDedicationPrompt}”
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('day12-music-player');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  if (!isPlayingSong) togglePlaySong();
                }
              }}
              className="day12-glow-btn"
            >
              LISTEN TO A THOUSAND YEARS 🎵
            </button>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. DEDICATED SONG: "A THOUSAND YEARS" & SYNCED LYRICS PLAYER      */}
        {/* ================================================================= */}
        <section id="day12-music-player" className="day12-player-card">
          <div className="day12-song-header">
            <h3 className="day12-song-title">{song.title}</h3>
            <p className="day12-song-artist">{song.artist} · Dedicated to you 🤍</p>
          </div>

          {/* Synced Lyrics Display */}
          <div ref={lyricsContainerRef} className="day12-lyrics-viewport">
            {song.lyrics.map((line, idx) => (
              <div
                key={idx}
                onClick={() => handleLyricClick(line.time)}
                className={`day12-lyric-line ${activeLyricIndex === idx ? 'active' : ''}`}
                title="Tap to jump here in song"
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Audio Controls */}
          <div className="day12-audio-controls">
            <div className="day12-progress-row">
              <span className="day12-time-label">{formatTime(currentTime)}</span>
              <div className="day12-progress-bar" onClick={handleSeek}>
                <div
                  className="day12-progress-fill"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="day12-time-label">{formatTime(duration)}</span>
            </div>

            <button
              type="button"
              onClick={togglePlaySong}
              className="day12-play-btn"
              aria-label={isPlayingSong ? 'Pause' : 'Play'}
            >
              {isPlayingSong ? '⏸' : '▶'}
            </button>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. HER INPUT BOX AT THE END                                       */}
        {/* ================================================================= */}
        <section className="day12-input-card">
          <h3 className="day12-input-heading">
            {DAY12_DATA.inputSection.heading}
          </h3>

          <form onSubmit={handleSubmitResponse}>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder={DAY12_DATA.inputSection.placeholder}
              className="day12-textarea"
              rows={5}
            />

            <div className="day12-input-submit-row">
              <button
                type="submit"
                disabled={isSubmitting || !userResponse.trim()}
                className="day12-glow-btn"
              >
                {isSubmitting ? 'Sending…' : DAY12_DATA.inputSection.buttonText}
              </button>

              {isSaved && (
                <button
                  type="button"
                  onClick={handleCopyResponse}
                  className="day12-copy-btn"
                >
                  {copied ? '✓ Copied' : '📋 Copy message for Tosif'}
                </button>
              )}
            </div>
          </form>

          {isSaved && (
            <div className="day12-confirmation-box">
              <p className="day12-confirmation-text">
                {DAY12_DATA.inputSection.confirmation}
              </p>
              <span style={{ fontSize: '0.78rem', color: 'rgba(251, 226, 168, 0.7)' }}>
                Your response is saved and will be sent to Tosif's sheet 🤍
              </span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
