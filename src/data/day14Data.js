// ============================================================================
// DAY 14 CONFIGURATION: TOSIF'S VIDEO FOR NOUSHEEN 🤍
// ============================================================================

/**
 * --------------------------------------------------------------------------
 * 🎥 DAY 14 VIDEO URL CONFIGURATION
 * --------------------------------------------------------------------------
 * Paste your video URL below.
 *
 * Supported Formats:
 * 1. Local/Uploaded MP4: '/videos/day14.mp4' (place your video in public/videos/day14.mp4)
 * 2. Direct MP4 URL: 'https://example.com/video.mp4'
 * 3. YouTube link: 'https://www.youtube.com/watch?v=...' or 'https://youtu.be/...'
 *
 * Note: Never use a Google Drive "/view" or "/preview" link directly; use a direct
 * hosted MP4 or an unlisted YouTube video link instead.
 */
export const DAY14_VIDEO_URL = 'https://res.cloudinary.com/djahrqrul/video/upload/v1792090723/whatsapp-video-2026-10-15-at-115318-pm_oyZJb4O6_wtko5t.mp4';

export const DAY14_CONTENT = {
  dayBadge: "DAY 14 · THE FINALE",
  subBadge: "OCTOBER 14 · HAPPY BIRTHDAY NOUSHEEN",

  // Gradual intro lines revealed sequentially
  introLines: [
    { text: "Nousheen… ❤️", highlight: true },
    { text: "14 days." },
    { text: "14 little pieces of my heart." },
    { text: "And today, bachaa, I have something a little different for you." },
    { text: "I could write you a thousand letters, but today I want you to see something instead." },
    { text: "So, meri jaan… put on your headphones, get comfortable, and watch this till the end.", italic: true },
    { text: "I made this for you. For my Nousheen. 🤍", highlight: true }
  ],

  playButtonText: "PLAY YOUR SURPRISE, BACHAA ❤️",

  // After video finishes
  afterVideo: {
    heading: "Happy Birthday, My Nousheen 🎂",
    lines: [
      "That's all for today, bachaa. ❤️",
      "I hope you felt every word.",
      "Happy birthday, my Nousheen.",
      "I love you. Always. 🤍"
    ],
    nameAr: "نوشين",
    completionBadge: "DAY 14 COMPLETE 🤍"
  },

  // Input tag / message section for Nousheen to send message to Tosif
  inputSection: {
    heading: "Do you wanna say something? Please go ahead 🤍",
    subtext: "Whatever is in your heart after watching this, tell me… I'm listening. ❤️",
    placeholder: "Write whatever is on your mind or in your heart, Nousheen… 🤍",
    buttonText: "SEND TO TOSIF 🤍",
    confirmation: "Your message has been sent to Tosif, bachaa. Thank you for listening to my heart. 🤍"
  }
};

/**
 * Utility to parse any video URL (YouTube vs. Direct MP4)
 */
export function parseVideoSource(url) {
  if (!url || typeof url !== 'string') {
    return { type: 'none', url: '' };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { type: 'none', url: '' };
  }

  // Detect YouTube formats:
  // - youtube.com/watch?v=VIDEO_ID
  // - youtu.be/VIDEO_ID
  // - youtube.com/embed/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmed.match(ytRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`,
      originalUrl: trimmed
    };
  }

  // Resolve Cloudinary asset share URL to direct streaming MP4
  if (trimmed.includes('asset.cloudinary.com/djahrqrul/38e068e834650c6c39f2efa7220c964e')) {
    return {
      type: 'native',
      url: 'https://res.cloudinary.com/djahrqrul/video/upload/v1792090723/whatsapp-video-2026-10-15-at-115318-pm_oyZJb4O6_wtko5t.mp4',
      originalUrl: trimmed
    };
  }

  // Handle Google Drive warning if inadvertently used
  if (trimmed.includes('drive.google.com') && (trimmed.includes('/view') || trimmed.includes('/preview'))) {
    console.warn('[Day14] Google Drive preview links cannot be played directly via HTML5 video. Use direct MP4 or YouTube.');
  }

  return {
    type: 'native',
    url: trimmed,
    originalUrl: trimmed
  };
}
