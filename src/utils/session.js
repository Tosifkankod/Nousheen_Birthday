/**
 * Session & Device Utility for Day 4 Tracking
 * Manages unique session IDs, device metadata, and timestamps without requiring user login.
 */

const SESSION_KEY = 'day4_session_id';
const STARTED_KEY = 'day4_started_at';
const COMPLETED_KEY = 'day4_completed_at';

// Generate a clean random alphanumeric ID
function generateId(prefix = 'ses') {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36).substring(4);
  return `${prefix}_${rand}_${time}`;
}

// Detect simple device category
export function getDeviceInfo() {
  if (typeof window === 'undefined' || !navigator) {
    return { device: 'unknown', userAgent: 'unknown' };
  }

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua);

  let device = 'Desktop';
  if (isTablet) device = 'Tablet';
  else if (isMobile) device = 'Mobile (Phone)';

  return {
    device,
    userAgent: ua,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  };
}

// Retrieve or create a persistent session for any day (default: 4)
export function getOrCreateSessionId(day = 4) {
  if (typeof window === 'undefined') return 'server_session';

  const sessionKey = `day${day}_session_id`;
  const startedKey = `day${day}_started_at`;

  let sessionId = localStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = generateId(`day${day}`);
    localStorage.setItem(sessionKey, sessionId);
    localStorage.setItem(startedKey, new Date().toISOString());
  }
  return sessionId;
}

// Get started timestamp
export function getSessionStartedAt(day = 4) {
  const startedKey = `day${day}_started_at`;
  return localStorage.getItem(startedKey) || new Date().toISOString();
}

// Mark session as completed
export function markSessionCompleted(day = 4) {
  const completedKey = `day${day}_completed_at`;
  const completedAt = new Date().toISOString();
  localStorage.setItem(completedKey, completedAt);
  localStorage.setItem(`day${day}_completed`, 'true');
  return completedAt;
}

// Check completion
export function getSessionCompletedAt(day = 4) {
  const completedKey = `day${day}_completed_at`;
  return localStorage.getItem(completedKey);
}

// Reset session (for replay/testing)
export function resetSession(day = 4) {
  const sessionKey = `day${day}_session_id`;
  const startedKey = `day${day}_started_at`;
  const completedKey = `day${day}_completed_at`;
  
  const newId = generateId(`day${day}`);
  localStorage.setItem(sessionKey, newId);
  localStorage.setItem(startedKey, new Date().toISOString());
  localStorage.removeItem(completedKey);
  localStorage.removeItem(`day${day}_completed`);
  return newId;
}

