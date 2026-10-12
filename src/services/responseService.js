/**
 * Response Service for Day 04
 * Handles resilient local storage and background synchronization to Google Sheets.
 * 
 * --------------------------------------------------------------------------
 * GOOGLE APPS SCRIPT SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (create a sheet with 2 tabs: 'RESPONSES' and 'DAY4_SUMMARY')
 * 2. Go to Extensions > Apps Script
 * 3. Paste the Google Apps Script code provided in the comments below or in AdminDay4.jsx
 * 4. Deploy > New Deployment > Web App > Execute as: Me > Who has access: Anyone
 * 5. Copy the Web App URL and paste it into `GOOGLE_SCRIPT_URL` below!
 * --------------------------------------------------------------------------
 */

import { getDeviceInfo } from '../utils/session';

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7Fa14WDr0JEJnZb2EDmvFYcVhdiM2hQuQmJQ7Vz3lPQWnvwo2i6b-QvSa_1t-gR5iew/exec';

const STORAGE_KEYS = {
  CURRENT_ANSWERS: 'day4_session_answers',
  PENDING_QUEUE: 'day4_pending_sync_queue',
  ALL_SESSIONS: 'day4_all_sessions_history',
};

/**
 * Save a single question response.
 * @param {Object} data - Response object
 * @param {string} data.sessionId
 * @param {number} [data.day=4]
 * @param {string} data.questionId
 * @param {string} data.question
 * @param {string} data.optionId
 * @param {string} data.answer
 * @param {string} [data.customText]
 * @param {string} [data.timestamp]
 */
export async function saveResponse({
  sessionId,
  day = 4,
  questionId,
  question,
  optionId,
  answer,
  customText = '',
  timestamp = new Date().toISOString(),
}) {
  const deviceInfo = getDeviceInfo();

  const record = {
    sessionId,
    day,
    questionId,
    question,
    optionId,
    answer,
    customText,
    timestamp,
    device: deviceInfo.device,
    userAgent: deviceInfo.userAgent,
  };

  // 1. Save to current session state in localStorage
  try {
    const rawAnswers = localStorage.getItem(STORAGE_KEYS.CURRENT_ANSWERS);
    const answersMap = rawAnswers ? JSON.parse(rawAnswers) : {};
    answersMap[questionId] = record;
    localStorage.setItem(STORAGE_KEYS.CURRENT_ANSWERS, JSON.stringify(answersMap));

    // Also update all sessions archive
    saveToSessionsArchive(sessionId, record);
  } catch (err) {
    console.warn('[ResponseService] LocalStorage save warning:', err);
  }

  // 2. Add to sync queue
  enqueueForSync(record);

  // 3. Attempt non-blocking sync in background
  syncPendingResponses().catch(() => {
    // Failures silently handled - queue preserves items for next sync
  });

  return record;
}

/**
 * Save multiple responses at once
 */
export async function saveResponses(records) {
  for (const record of records) {
    await saveResponse(record);
  }
}

/**
 * Adds an item to the pending sync queue
 */
function enqueueForSync(record) {
  try {
    const rawQueue = localStorage.getItem(STORAGE_KEYS.PENDING_QUEUE);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];
    queue.push(record);
    localStorage.setItem(STORAGE_KEYS.PENDING_QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.warn('[ResponseService] Queue error:', err);
  }
}

/**
 * Sync all pending items to Google Sheets
 */
export async function syncPendingResponses() {
  if (
    !GOOGLE_SCRIPT_URL ||
    GOOGLE_SCRIPT_URL.includes('PASTE_') ||
    !GOOGLE_SCRIPT_URL.startsWith('http')
  ) {
    // URL not configured yet, records safely stored in localStorage
    return { success: false, reason: 'URL not configured' };
  }

  let queue = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_QUEUE);
    queue = raw ? JSON.parse(raw) : [];
  } catch (e) {
    queue = [];
  }

  if (!queue || queue.length === 0) {
    return { success: true, count: 0 };
  }

  const itemsToSend = [...queue];

  try {
    // We send using no-cors mode to Google Apps Script Web App
    // Note: text/plain prevents CORS preflight issues with Google Apps Script
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        type: 'batch_responses',
        records: itemsToSend,
      }),
    });

    // In no-cors, we assume successful delivery if fetch did not throw network error
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEYS.PENDING_QUEUE);
      const currentQueue = currentRaw ? JSON.parse(currentRaw) : [];
      // Keep only items that were added after this batch was created
      const remaining = currentQueue.slice(itemsToSend.length);
      localStorage.setItem(STORAGE_KEYS.PENDING_QUEUE, JSON.stringify(remaining));
    } catch (_) { }

    return { success: true, count: itemsToSend.length };
  } catch (networkError) {
    console.warn('[ResponseService] Sync delayed, will retry next time:', networkError);
    return { success: false, error: networkError.message };
  }
}

/**
 * Archive sessions in localStorage for Admin dashboard inspection
 */
function saveToSessionsArchive(sessionId, record) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_SESSIONS);
    const allSessions = raw ? JSON.parse(raw) : {};

    if (!allSessions[sessionId]) {
      allSessions[sessionId] = {
        sessionId,
        startedAt: record.timestamp,
        completedAt: null,
        device: record.device,
        userAgent: record.userAgent,
        responses: {},
      };
    }

    allSessions[sessionId].responses[record.questionId] = record;
    allSessions[sessionId].lastUpdated = record.timestamp;

    localStorage.setItem(STORAGE_KEYS.ALL_SESSIONS, JSON.stringify(allSessions));
  } catch (err) {
    console.warn('[ResponseService] Archive update warning:', err);
  }
}

/**
 * Retrieve current session answers from localStorage
 */
export function getCurrentSessionAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ANSWERS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Retrieve all sessions for Tosif's private dashboard
 */
export function getAllStoredSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_SESSIONS);
    const sessions = raw ? JSON.parse(raw) : {};
    return Object.values(sessions).sort((a, b) => {
      const timeA = new Date(b.startedAt || 0).getTime();
      const timeB = new Date(a.startedAt || 0).getTime();
      return timeA - timeB;
    });
  } catch (e) {
    return [];
  }
}

/**
 * Generate CSV text of all responses across sessions
 */
export function generateResponsesCSV() {
  const sessions = getAllStoredSessions();
  const headers = [
    'Timestamp',
    'Session ID',
    'Day',
    'Question ID',
    'Question',
    'Option ID',
    'Answer',
    'Custom Text',
    'Device',
    'User Agent',
  ];

  const rows = [headers];

  sessions.forEach((session) => {
    const responses = Object.values(session.responses || {});
    responses.forEach((resp) => {
      rows.push([
        `"${resp.timestamp || ''}"`,
        `"${resp.sessionId || ''}"`,
        `"${resp.day || 4}"`,
        `"${resp.questionId || ''}"`,
        `"${(resp.question || '').replace(/"/g, '""')}"`,
        `"${resp.optionId || ''}"`,
        `"${(resp.answer || '').replace(/"/g, '""')}"`,
        `"${(resp.customText || '').replace(/"/g, '""')}"`,
        `"${resp.device || ''}"`,
        `"${(resp.userAgent || '').replace(/"/g, '""')}"`,
      ]);
    });
  });

  return rows.map((r) => r.join(',')).join('\n');
}

/**
 * Google Apps Script Code Template
 * Copy and paste this into Extensions > Apps Script in your Google Sheet!
 */
export const GOOGLE_APPS_SCRIPT_CODE = `
// Test endpoint: Opening your web app URL in a browser tab will show this!
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Apps Script for Day 04 is connected and active!"
  })).setMimeType(ContentService.MimeType.JSON);
}

// Handles incoming responses from the website
function doPost(e) {
  try {
    var rawContents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(rawContents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // ==========================================
    // TAB 1: RESPONSES (Log every single answer)
    // ==========================================
    var sheet = ss.getSheetByName("RESPONSES") || ss.insertSheet("RESPONSES");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Session ID", "Day", "Question ID", 
        "Question", "Option ID", "Answer", "Custom Text", 
        "Device", "User Agent"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#f0e6ec");
    }

    var records = [];
    if (data.type === "batch_responses" && Array.isArray(data.records)) {
      records = data.records;
    } else if (data.questionId) {
      records = [data];
    }
    
    // Append to RESPONSES tab
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      sheet.appendRow([
        r.timestamp || new Date().toISOString(),
        r.sessionId || "",
        r.day || 4,
        r.questionId || "",
        r.question || "",
        r.optionId || "",
        r.answer || "",
        r.customText || "",
        r.device || "",
        r.userAgent || ""
      ]);
    }

    // ==========================================
    // TAB 2: DAY4_SUMMARY (Overview per session)
    // ==========================================
    var summarySheet = ss.getSheetByName("DAY4_SUMMARY") || ss.insertSheet("DAY4_SUMMARY");
    if (summarySheet.getLastRow() === 0) {
      summarySheet.appendRow([
        "Session ID", "Timestamp", "Morning Choice", "Chai Conversation", 
        "Outfit Choice", "Before Office", "Commute Choice", "Office Message", 
        "Afternoon Call", "Evening Destination", "Date Activity", 
        "Quiet Moment", "Late Night", "Goodnight Choice", "Her Custom Memory"
      ]);
      summarySheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#e8d0db");
    }

    // Update or append session summary
    if (records.length > 0) {
      var sId = records[0].sessionId;
      var summaryRow = [
        sId,
        records[0].timestamp || new Date().toISOString(),
        getAnswerByQ(records, "morning_choice"),
        getAnswerByQ(records, "tea_conversation"),
        getAnswerByQ(records, "outfit_choice"),
        getAnswerByQ(records, "before_office_affection"),
        getAnswerByQ(records, "commute_contact"),
        getAnswerByQ(records, "office_message"),
        getAnswerByQ(records, "afternoon_call_duration"),
        getAnswerByQ(records, "evening_destination"),
        getAnswerByQ(records, "date_activity"),
        getAnswerByQ(records, "quiet_moment"),
        getAnswerByQ(records, "late_night_choice"),
        getAnswerByQ(records, "goodnight_choice"),
        getCustomMemory(records)
      ];
      summarySheet.appendRow(summaryRow);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      count: records.length 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getAnswerByQ(records, qId) {
  for (var i = records.length - 1; i >= 0; i--) {
    if (records[i].questionId === qId) {
      var ans = records[i].answer || "";
      if (records[i].customText) {
        ans += " (" + records[i].customText + ")";
      }
      return ans;
    }
  }
  return "-";
}

function getCustomMemory(records) {
  for (var i = records.length - 1; i >= 0; i--) {
    if (records[i].questionId === "her_perfect_day_addition") {
      return records[i].customText || records[i].answer || "-";
    }
  }
  return "-";
}
`;
