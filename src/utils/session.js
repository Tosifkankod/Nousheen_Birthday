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

// Retrieve or create a persistent session for Day 4
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server_session';

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId('day4');
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(STARTED_KEY, new Date().toISOString());
  }
  return sessionId;
}

// Get started timestamp
export function getSessionStartedAt() {
  return localStorage.getItem(STARTED_KEY) || new Date().toISOString();
}

// Mark session as completed
export function markSessionCompleted() {
  const completedAt = new Date().toISOString();
  localStorage.setItem(COMPLETED_KEY, completedAt);
  localStorage.setItem('day4_completed', 'true');
  return completedAt;
}

// Check completion
export function getSessionCompletedAt() {
  return localStorage.getItem(COMPLETED_KEY);
}

// Reset session (for replay/testing if explicitly invoked)
export function resetSession() {
  const newId = generateId('day4');
  localStorage.setItem(SESSION_KEY, newId);
  localStorage.setItem(STARTED_KEY, new Date().toISOString());
  localStorage.removeItem(COMPLETED_KEY);
  return newId;
}
