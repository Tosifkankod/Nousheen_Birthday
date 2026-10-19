/**
 * Live Page Access & Visitor Telemetry Tracker
 * Automatically logs visitor details to Tosif's Google Sheet (Excel)
 * whenever anyone opens or accesses the page.
 */

import { saveResponse, syncPendingResponses, GOOGLE_SCRIPT_URL } from './responseService';
import { getDeviceInfo } from '../utils/session';

const VISITOR_ID_KEY = 'nousheen_visitor_id';
const LAST_LOGGED_KEY = 'nousheen_last_page_access';

/**
 * Generate a persistent visitor ID
 */
function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return 'visitor_server';
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      const rand = Math.random().toString(36).substring(2, 9);
      const time = Date.now().toString(36);
      vid = `visitor_${rand}_${time}`;
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return `visitor_${Date.now()}`;
  }
}

/**
 * Fetch visitor IP & Geolocation with fast timeout
 */
async function fetchVisitorGeo() {
  // 1. Try freeipapi.com (rich geo info)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2400);

    const res = await fetch('https://freeipapi.com/api/json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const parts = [data.cityName, data.regionName, data.countryName].filter(Boolean);
      return {
        ip: data.ipAddress || 'Unknown IP',
        location: parts.length > 0 ? parts.join(', ') : 'Unknown Location',
        isp: data.asnOrganization || 'Standard ISP',
      };
    }
  } catch (_) {
    // Timeout or blocked, try fallback
  }

  // 2. Fallback to api.ipify.org (ultra fast IP lookup)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        ip: data.ip || 'Unknown IP',
        location: 'Geo lookup omitted',
        isp: 'Standard ISP',
      };
    }
  } catch (_) {
    // Offline or network restricted
  }

  return {
    ip: 'Direct Connection',
    location: 'Location service unavailable',
    isp: 'Standard',
  };
}

/**
 * Format human-readable local time (e.g. "19 Oct 2026, 06:45 PM IST")
 */
function getReadableLocalTime() {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(new Date()) + ' (IST)';
  } catch {
    return new Date().toLocaleString();
  }
}

/**
 * Main Tracker Function: Call whenever someone accesses a page
 * @param {string} pageTitle - Friendly name of the page (e.g. 'Safe Space Sanctuary')
 */
export async function trackPageAccess(pageTitle = 'Home (Safe Space Sanctuary)') {
  if (typeof window === 'undefined') return;

  // Prevent duplicate logs within 5 seconds for the exact same page (e.g. StrictMode double-render)
  try {
    const lastLogStr = sessionStorage.getItem(LAST_LOGGED_KEY);
    const now = Date.now();
    if (lastLogStr) {
      const { page, time } = JSON.parse(lastLogStr);
      if (page === pageTitle && now - time < 5000) {
        return; // Skip duplicate burst
      }
    }
    sessionStorage.setItem(LAST_LOGGED_KEY, JSON.stringify({ page: pageTitle, time: now }));
  } catch (_) {}

  try {
    const visitorId = getOrCreateVisitorId();
    const deviceInfo = getDeviceInfo();
    const readableTime = getReadableLocalTime();

    // Screen & Display info
    const screenWidth = window.screen?.width || window.innerWidth;
    const screenHeight = window.screen?.height || window.innerHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const screenStr = `${screenWidth}x${screenHeight} (Viewport: ${viewportWidth}x${viewportHeight})`;
    const dpr = window.devicePixelRatio ? `${window.devicePixelRatio}x` : '1x';

    // Context
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown TZ';
    const language = navigator.language || 'Unknown';
    const referrer = document.referrer ? document.referrer : 'Direct / WhatsApp Link';
    const connection = navigator.connection?.effectiveType 
      ? `${navigator.connection.effectiveType.toUpperCase()}`
      : 'Standard';

    // Fetch IP and Geo in background
    const geo = await fetchVisitorGeo();

    const answerSummary = `IP: ${geo.ip} | Location: ${geo.location} | ISP: ${geo.isp}`;
    const customTextDetails = `Time: ${readableTime} | Screen: ${screenStr} | DPR: ${dpr} | TZ: ${timezone} | Lang: ${language} | Net: ${connection} | Ref: ${referrer}`;

    const record = {
      timestamp: new Date().toISOString(),
      sessionId: visitorId,
      day: 'ACCESS',
      questionId: 'page_access_tracker',
      question: `Page Accessed: ${pageTitle}`,
      optionId: 'live_visitor_entry',
      answer: answerSummary,
      customText: customTextDetails,
      device: deviceInfo.device || 'Unknown Device',
      userAgent: deviceInfo.userAgent || navigator.userAgent || 'Unknown UserAgent',
    };

    // Save locally and sync immediately to Google Sheet (Excel)
    await saveResponse(record);
    await syncPendingResponses();

    console.log('[AccessTracker] Logged page access to Excel/Google Sheet:', {
      page: pageTitle,
      visitorId,
      geo,
    });
  } catch (err) {
    console.warn('[AccessTracker] Tracking error:', err);
  }
}
