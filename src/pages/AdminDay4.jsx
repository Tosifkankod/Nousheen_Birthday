import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllStoredSessions,
  generateResponsesCSV,
  syncPendingResponses,
  GOOGLE_SCRIPT_URL,
  GOOGLE_APPS_SCRIPT_CODE,
} from '../services/responseService';

export default function AdminDay4() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Default Passwords / PINs for Tosif
  const VALID_PINS = ['1404', 'nousheen', 'tosif', '1410', '14'];

  useEffect(() => {
    // Check if previously authenticated in session
    const auth = sessionStorage.getItem('admin_day4_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadSessions();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    if (VALID_PINS.includes(clean)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_day4_auth', 'true');
      setErrorMsg('');
      loadSessions();
    } else {
      setErrorMsg('Incorrect PIN. Try "1404" or "nousheen".');
    }
  };

  const loadSessions = () => {
    const data = getAllStoredSessions();
    setSessions(data);
    if (data.length > 0 && !expandedSession) {
      setExpandedSession(data[0].sessionId);
    }
  };

  const handleExportCSV = () => {
    const csvContent = generateResponsesCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nousheen_day4_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Attempting sync...');
    try {
      const res = await syncPendingResponses();
      if (res.success) {
        setSyncStatus(`Sync successful! (${res.count ?? 0} records processed)`);
      } else {
        setSyncStatus(`Sync info: ${res.reason || res.error || 'Check Google Script URL'}`);
      }
    } catch (err) {
      setSyncStatus(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.responses && s.responses.her_perfect_day_addition).length;
  const incompleteSessions = totalSessions - completedSessions;
  const latestSession = sessions[0];

  if (!isAuthenticated) {
    return (
      <div
        className="page"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09080d',
          padding: '1.5rem',
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: '380px',
            width: '100%',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(20, 20, 28, 0.9)',
            borderColor: 'rgba(232, 99, 122, 0.3)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '0.75rem' }}>
            🔒
          </span>
          <h2 className="heading mb-1" style={{ fontSize: '1.3rem', color: 'var(--white)' }}>
            Tosif's Response Portal
          </h2>
          <p className="body-text mb-4" style={{ fontSize: '0.85rem', color: 'var(--white-dim)' }}>
            Enter PIN to view Nousheen's Day 04 answers.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1404)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--white)',
                textAlign: 'center',
                fontSize: '1.1rem',
                letterSpacing: '0.2em',
                outline: 'none',
              }}
            />

            {errorMsg && (
              <p className="body-text mb-3" style={{ color: '#f87171', fontSize: '0.82rem' }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Unlock Dashboard 🔓
            </button>
          </form>

          <div className="divider divider-center my-4" />
          <button
            onClick={() => navigate('/')}
            className="btn"
            style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--white-dimmer)' }}
          >
            ← Return to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page"
      style={{
        minHeight: '100dvh',
        background: '#07070b',
        padding: 'max(2rem, env(safe-area-inset-top) + 1.5rem) 1rem 3rem 1rem',
        display: 'block',
      }}
    >
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: '1.4rem' }}>💌</span>
              <h1 className="heading" style={{ fontSize: '1.4rem', color: 'var(--white)' }}>
                Day 04 — Nousheen's Answers
              </h1>
            </div>
            <p className="mono dim" style={{ fontSize: '0.75rem' }}>
              One Perfect Day With You • Private Dashboard for Tosif
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            >
              📥 Export CSV
            </button>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="btn"
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
            >
              🔄 {isSyncing ? 'Syncing...' : 'Sync to Sheets'}
            </button>
            <button
              onClick={() => setShowScriptModal(true)}
              className="btn"
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                background: 'rgba(201, 169, 110, 0.1)',
                borderColor: 'rgba(201, 169, 110, 0.3)',
                color: 'var(--gold)',
              }}
            >
              ⚙️ Apps Script
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', background: 'none' }}
            >
              ← Home
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div
            className="card mb-4"
            style={{
              padding: '0.65rem 1rem',
              background: 'rgba(232, 99, 122, 0.1)',
              borderColor: 'rgba(232, 99, 122, 0.3)',
              fontSize: '0.85rem',
            }}
          >
            ℹ️ {syncStatus}
          </div>
        )}

        {/* Google Script Config Status Notice */}
        {(!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_')) && (
          <div
            className="card mb-4"
            style={{
              padding: '0.85rem 1.1rem',
              background: 'rgba(201, 169, 110, 0.08)',
              borderColor: 'rgba(201, 169, 110, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p className="heading" style={{ fontSize: '0.92rem', color: 'var(--gold)' }}>
                Google Sheets Not Linked Yet
              </p>
              <p className="body-text" style={{ fontSize: '0.8rem', color: 'var(--white-dim)' }}>
                All of Nousheen's responses are safely saved on this device. Click below to set up auto-sync to your Google Sheet.
              </p>
            </div>
            <button
              onClick={() => setShowScriptModal(true)}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              View Setup Code
            </button>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.85rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card text-center" style={{ padding: '1rem' }}>
            <p className="mono dim" style={{ fontSize: '0.72rem' }}>
              TOTAL SESSIONS
            </p>
            <p className="display" style={{ fontSize: '1.8rem', color: 'var(--white)', marginTop: '0.25rem' }}>
              {totalSessions}
            </p>
          </div>
          <div className="card text-center" style={{ padding: '1rem' }}>
            <p className="mono dim" style={{ fontSize: '0.72rem' }}>
              COMPLETED
            </p>
            <p className="display" style={{ fontSize: '1.8rem', color: '#4ade80', marginTop: '0.25rem' }}>
              {completedSessions}
            </p>
          </div>
          <div className="card text-center" style={{ padding: '1rem' }}>
            <p className="mono dim" style={{ fontSize: '0.72rem' }}>
              IN PROGRESS
            </p>
            <p className="display" style={{ fontSize: '1.8rem', color: '#facc15', marginTop: '0.25rem' }}>
              {incompleteSessions}
            </p>
          </div>
          <div className="card text-center" style={{ padding: '1rem' }}>
            <p className="mono dim" style={{ fontSize: '0.72rem' }}>
              LATEST ACTIVITY
            </p>
            <p
              className="mono"
              style={{ fontSize: '0.85rem', color: 'var(--rose-light)', marginTop: '0.5rem' }}
            >
              {latestSession ? new Date(latestSession.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'None'}
            </p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="mb-5">
          <h2 className="heading mb-3" style={{ fontSize: '1.15rem' }}>
            Logged Sessions ({sessions.length})
          </h2>

          {sessions.length === 0 ? (
            <div className="card text-center p-5">
              <p className="body-text" style={{ fontStyle: 'italic', color: 'var(--white-dim)' }}>
                No responses recorded yet. Once Nousheen opens Day 04, her choices will automatically appear here!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((ses, idx) => {
                const isExpanded = expandedSession === ses.sessionId;
                const respMap = ses.responses || {};
                const respList = Object.values(respMap);
                const hasMemory = respMap.her_perfect_day_addition?.customText;

                return (
                  <div
                    key={ses.sessionId || idx}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      background: isExpanded ? 'rgba(25, 22, 32, 0.85)' : 'rgba(18, 18, 24, 0.65)',
                      borderColor: isExpanded ? 'rgba(232, 99, 122, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {/* Session Accordion Header */}
                    <div
                      onClick={() => setExpandedSession(isExpanded ? null : ses.sessionId)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        gap: '0.75rem',
                        userSelect: 'none',
                      }}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontSize: '1.1rem' }}>
                          {hasMemory ? '❤️' : '⏳'}
                        </span>
                        <div>
                          <p className="heading" style={{ fontSize: '0.98rem', color: 'var(--white)' }}>
                            Session #{sessions.length - idx} • {ses.device || 'Mobile'}
                          </p>
                          <p className="mono dim" style={{ fontSize: '0.72rem' }}>
                            ID: {ses.sessionId} • {new Date(ses.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          style={{
                            padding: '0.2rem 0.65rem',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            background: hasMemory ? 'rgba(74, 222, 128, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                            color: hasMemory ? '#4ade80' : '#facc15',
                            border: `1px solid ${hasMemory ? 'rgba(74, 222, 128, 0.3)' : 'rgba(250, 204, 21, 0.3)'}`,
                          }}
                        >
                          {respList.length} Answers
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--white-dim)' }}>
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Answers */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        {/* Highlights Box if Nousheen wrote custom memory */}
                        {hasMemory && (
                          <div
                            className="card mb-4"
                            style={{
                              background: 'linear-gradient(135deg, rgba(232, 99, 122, 0.15), rgba(201, 169, 110, 0.1))',
                              borderColor: 'var(--rose-light)',
                              padding: '1.1rem',
                            }}
                          >
                            <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                              🌟 NOUSHEEN'S ADDITION TO YOUR PERFECT DAY:
                            </p>
                            <p
                              className="display-italic mt-2"
                              style={{
                                fontSize: '1.15rem',
                                color: 'var(--white)',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              "{respMap.her_perfect_day_addition.customText}"
                            </p>
                          </div>
                        )}

                        {/* Questions Breakdown */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '0.75rem',
                          }}
                        >
                          {respList.map((r, qIdx) => (
                            <div
                              key={r.questionId || qIdx}
                              style={{
                                background: 'rgba(0, 0, 0, 0.35)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.75rem 0.9rem',
                              }}
                            >
                              <p className="mono dim" style={{ fontSize: '0.68rem', color: 'var(--white-dimmer)' }}>
                                {r.questionId} • {new Date(r.timestamp).toLocaleTimeString()}
                              </p>
                              <p
                                className="body-text mt-1 mb-1"
                                style={{ fontSize: '0.82rem', color: 'var(--white-dim)', fontWeight: 500 }}
                              >
                                {r.question}
                              </p>
                              <p
                                className="heading"
                                style={{ fontSize: '0.92rem', color: 'var(--rose-light)' }}
                              >
                                👉 {r.answer}
                              </p>
                              {r.customText && r.questionId !== 'her_perfect_day_addition' && (
                                <p
                                  className="mono mt-1"
                                  style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--gold)',
                                    background: 'rgba(201, 169, 110, 0.1)',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '6px',
                                  }}
                                >
                                  Custom text: "{r.customText}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Google Apps Script Modal */}
      {showScriptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#12121a',
              borderColor: 'rgba(232, 99, 122, 0.3)',
              padding: '1.75rem',
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="heading" style={{ fontSize: '1.2rem', color: 'var(--white)' }}>
                Google Apps Script Setup
              </h3>
              <button
                onClick={() => setShowScriptModal(false)}
                className="btn"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}
              >
                ✕
              </button>
            </div>

            <p className="body-text mb-3" style={{ fontSize: '0.85rem', color: 'var(--white-dim)' }}>
              Follow these simple 3-minute steps to stream Nousheen's answers straight to Google Sheets:
            </p>

            <ol
              style={{
                paddingLeft: '1.25rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--white-dim)',
                lineHeight: 1.7,
              }}
            >
              <li>Create a new Google Sheet (add tabs: <strong style={{ color: 'var(--gold)' }}>RESPONSES</strong> and <strong style={{ color: 'var(--gold)' }}>DAY4_SUMMARY</strong>).</li>
              <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Delete all existing text in the editor, and paste the code below.</li>
              <li>Click <strong>Deploy &gt; New Deployment</strong>, select <strong>Web App</strong>.</li>
              <li>Set <em>Execute as</em>: <strong>Me</strong> and <em>Who has access</em>: <strong>Anyone</strong>.</li>
              <li>Copy the Web App URL and paste it into <code style={{ color: 'var(--rose-light)' }}>src/services/responseService.js</code> in <code style={{ color: 'var(--rose-light)' }}>GOOGLE_SCRIPT_URL</code>.</li>
            </ol>

            <div className="flex justify-between items-center mb-2">
              <span className="mono dim" style={{ fontSize: '0.75rem' }}>
                Google Apps Script Code (doPost)
              </span>
              <button
                onClick={handleCopyScript}
                className="btn btn-primary"
                style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
              >
                {copiedCode ? '✓ Copied Code!' : '📋 Copy Script'}
              </button>
            </div>

            <pre
              style={{
                background: '#08080c',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#e2e8f0',
                overflowX: 'auto',
                maxHeight: '260px',
              }}
            >
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>

            <div className="text-right mt-4">
              <button
                onClick={() => setShowScriptModal(false)}
                className="btn"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
