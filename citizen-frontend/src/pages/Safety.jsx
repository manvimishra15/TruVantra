import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookings, safetyTips, verificationHistory } from '../data/mockData';
import './Safety.css';

/* ─── QR Code SVG (decorative, matches screenshot style) ─────── */
function QRDisplay({ bookingId }) {
  return (
    <div className="qr-display">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top-left finder */}
        <rect x="8" y="8" width="30" height="30" rx="4" stroke="#84cc16" strokeWidth="4" fill="none"/>
        <rect x="16" y="16" width="14" height="14" rx="2" fill="#84cc16"/>
        {/* Top-right finder */}
        <rect x="82" y="8" width="30" height="30" rx="4" stroke="#84cc16" strokeWidth="4" fill="none"/>
        <rect x="90" y="16" width="14" height="14" rx="2" fill="#84cc16"/>
        {/* Bottom-left finder */}
        <rect x="8" y="82" width="30" height="30" rx="4" stroke="#84cc16" strokeWidth="4" fill="none"/>
        <rect x="16" y="90" width="14" height="14" rx="2" fill="#84cc16"/>
        {/* Data dots */}
        <rect x="48" y="8" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="58" y="8" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="68" y="8" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="48" y="18" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="68" y="28" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="8" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="18" y="58" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="28" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="8" y="68" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="48" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="58" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="68" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="78" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="88" y="58" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="98" y="48" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="108" y="58" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="48" y="68" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="58" y="78" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="68" y="68" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="78" y="88" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="88" y="98" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="98" y="88" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="108" y="98" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="48" y="98" width="6" height="6" rx="1" fill="#84cc16"/>
        <rect x="58" y="108" width="6" height="6" rx="1" fill="#84cc16"/>
      </svg>
      <p className="qr-display__label">Ask worker to show the QR for {bookingId}</p>
    </div>
  );
}

/* ─── OTP Input ──────────────────────────────────────────────── */
function OTPInput({ onSubmit, disabled }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const fullOtp = otp.join('');

  return (
    <div className="otp-wrap">
      <p className="otp-label">Enter the 6-digit code shown on worker's app:</p>
      <div className="otp-inputs">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            disabled={disabled}
            aria-label={`OTP digit ${i + 1}`}
            id={`otp-digit-${i}`}
          />
        ))}
      </div>
      <button
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
        onClick={() => onSubmit(fullOtp)}
        disabled={fullOtp.length < 6 || disabled}
        id="verify-otp-btn"
      >
        Verify OTP
      </button>
    </div>
  );
}

/* ─── Status Panel ───────────────────────────────────────────── */
function StatusPanel({ status }) {
  const states = {
    idle: {
      icon: '🔒',
      label: 'Not verified',
      cls: 'status-idle',
      note: 'Simulated check only — no real identity verification happens in this demo. A profile or uploaded document alone is not proof of identity.',
    },
    verified: {
      icon: '✅',
      label: 'Identity Verified',
      cls: 'status-verified',
      note: 'This is a simulated result. In production, this would confirm the worker matches the booked profile via a secure token exchange.',
    },
    failed: {
      icon: '❌',
      label: 'Verification Failed',
      cls: 'status-failed',
      note: 'QR code did not match the booking. Do not allow entry. Contact support or file a report below.',
    },
    pending: {
      icon: '⏳',
      label: 'Verifying...',
      cls: 'status-pending',
      note: 'Checking credentials. Please wait.',
    },
  };
  const s = states[status] || states.idle;

  return (
    <div className={`status-panel ${s.cls}`}>
      <div className="status-panel__top">
        <span className="status-panel__icon">{s.icon}</span>
        <span className="status-panel__label">{s.label}</span>
      </div>
      <p className="status-panel__note">{s.note}</p>
    </div>
  );
}

/* ─── Safety Tips Accordion ──────────────────────────────────── */
function TipsAccordion({ tips }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="tips-accordion">
      {tips.map((tip, i) => (
        <div key={i} className={`tip-item${open === i ? ' open' : ''}`}>
          <button
            className="tip-item__header"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="tip-item__title">💡 {tip.title}</span>
            <span className="tip-item__chevron">{open === i ? '▲' : '▼'}</span>
          </button>
          {open === i && (
            <div className="tip-item__body">{tip.body}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Safety Page ───────────────────────────────────────── */
export default function Safety() {
  const [searchParams] = useSearchParams();
  const defaultBookingId = searchParams.get('booking') || bookings.find((b) => b.status === 'upcoming')?.id || bookings[0].id;

  const [selectedBookingId, setSelectedBookingId] = useState(defaultBookingId);
  const [verifyMethod, setVerifyMethod] = useState('qr'); // 'qr' | 'otp'
  const [verifyStatus, setVerifyStatus] = useState('idle');
  const [docStatus, setDocStatus] = useState('idle'); // idle | checking | ok | tampered
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const [activeSection, setActiveSection] = useState('verify'); // 'verify' | 'doc' | 'report' | 'history' | 'tips'

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const allBookings = bookings;
  const selectedBooking = allBookings.find((b) => b.id === selectedBookingId) || allBookings[0];

  // Reset verify status on booking change
  useEffect(() => {
    setVerifyStatus('idle');
  }, [selectedBookingId, verifyMethod]);

  const simulateScan = (match) => {
    setVerifyStatus('pending');
    setTimeout(() => {
      setVerifyStatus(match ? 'verified' : 'failed');
    }, 1500);
  };

  const handleOtpSubmit = (otp) => {
    setVerifyStatus('pending');
    setTimeout(() => {
      setVerifyStatus(otp === '123456' ? 'verified' : 'failed');
    }, 1500);
  };

  const handleDocCheck = () => {
    setDocStatus('checking');
    setTimeout(() => {
      setDocStatus('ok');
    }, 2000);
  };

  const handleSOS = () => {
    setSosActive(true);
    let count = 5;
    setSosCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setSosCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setSosActive(false);
        setSosCountdown(null);
        alert('[DEMO] SOS would alert your emergency contact. No real call was made.');
      }
    }, 1000);
  };

  return (
    <div className="page safety-page">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 className="section-title">Safety Centre</h1>
        <p className="section-subtitle">Verify identity, check documents, and stay safe. All actions below are simulations.</p>

        {/* Section Tabs */}
        <div className="safety-section-tabs">
          {[
            { id: 'verify', label: '🔍 Verify Identity' },
            { id: 'doc', label: '📄 Documents' },
            { id: 'report', label: '🚨 Report' },
            { id: 'history', label: '📋 History' },
            { id: 'tips', label: '💡 Safety Tips' },
          ].map((s) => (
            <button
              key={s.id}
              className={`safety-section-tab${activeSection === s.id ? ' active' : ''}`}
              onClick={() => setActiveSection(s.id)}
              id={`safety-tab-${s.id}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ─── Identity Verification ─── */}
        {activeSection === 'verify' && (
          <div className="safety-content fade-in">
            <div className="safety-verify-grid">
              <div className="safety-verify-main">
                {/* Booking selector */}
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-select">Booking</label>
                  <select
                    id="booking-select"
                    className="form-select"
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                  >
                    {allBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} — {b.workerName}, {b.service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Method tabs */}
                <div className="verify-method-tabs">
                  <button
                    className={`verify-method-btn${verifyMethod === 'qr' ? ' active' : ''}`}
                    onClick={() => setVerifyMethod('qr')}
                    id="method-qr-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h.01M17 14h.01M17 17h.01M20 14h.01M20 17h.01M20 20h.01"/>
                    </svg>
                    Scan QR
                  </button>
                  <button
                    className={`verify-method-btn${verifyMethod === 'otp' ? ' active' : ''}`}
                    onClick={() => setVerifyMethod('otp')}
                    id="method-otp-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    Enter OTP
                  </button>
                </div>

                {/* QR / OTP panels */}
                {verifyMethod === 'qr' ? (
                  <div className="qr-panel">
                    <QRDisplay bookingId={selectedBookingId} />
                    <div className="qr-sim-btns">
                      <button
                        className="btn-primary"
                        onClick={() => simulateScan(true)}
                        disabled={verifyStatus === 'pending'}
                        id="sim-match-btn"
                      >
                        {verifyStatus === 'pending' ? 'Scanning...' : 'Simulate matching scan'}
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => simulateScan(false)}
                        disabled={verifyStatus === 'pending'}
                        id="sim-wrong-btn"
                      >
                        Simulate wrong QR
                      </button>
                    </div>
                  </div>
                ) : (
                  <OTPInput
                    onSubmit={handleOtpSubmit}
                    disabled={verifyStatus === 'pending'}
                  />
                )}
                {verifyMethod === 'otp' && (
                  <p className="otp-hint">[Demo] Use code <strong>123456</strong> to simulate success.</p>
                )}
              </div>

              {/* Status Panel */}
              <div className="safety-verify-aside">
                <h3 className="safety-aside-title">Status</h3>
                <StatusPanel status={verifyStatus} />

                {verifyStatus === 'failed' && (
                  <button
                    className="btn-primary"
                    style={{ marginTop: 16, width: '100%', justifyContent: 'center', background: '#ef4444', color: '#fff' }}
                    onClick={() => setActiveSection('report')}
                  >
                    🚨 Report Suspicious Worker
                  </button>
                )}
                {verifyStatus !== 'idle' && (
                  <button
                    className="btn-secondary"
                    style={{ marginTop: 10, width: '100%', justifyContent: 'center', fontSize: 13 }}
                    onClick={() => setVerifyStatus('idle')}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Document Verification ─── */}
        {activeSection === 'doc' && (
          <div className="safety-content fade-in">
            <div className="doc-verify-wrap">
              <div className="doc-disclaimer">
                ⚠️ <strong>Demo only.</strong> No real document analysis is performed. Uploaded files are not stored or processed.
              </div>
              <div className="doc-upload-zone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drag & drop a document image, or</p>
                <label className="doc-upload-label" htmlFor="doc-upload">Browse file</label>
                <input type="file" id="doc-upload" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleDocCheck} />
                <p className="doc-upload-hint">Accepted: JPEG, PNG, PDF — Max 5MB</p>
              </div>

              {docStatus !== 'idle' && (
                <div className={`doc-result doc-result--${docStatus}`}>
                  {docStatus === 'checking' && (
                    <><span className="doc-result__spinner" /> Analysing document…</>
                  )}
                  {docStatus === 'ok' && (
                    <>✅ Document appears authentic. No obvious signs of tampering detected. (Simulated result)</>
                  )}
                  {docStatus === 'tampered' && (
                    <>❌ Possible tampering detected. Do not trust this document. (Simulated result)</>
                  )}
                </div>
              )}

              <div className="doc-check-types">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>What gets checked (simulated):</h3>
                {[
                  { icon: '📅', label: 'Expiry date validation' },
                  { icon: '🖼️', label: 'Photo tampering detection' },
                  { icon: '🔢', label: 'ID number format check' },
                  { icon: '🏛️', label: 'Government seal presence' },
                ].map((c) => (
                  <div key={c.label} className="doc-check-item">
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                    <span className="badge badge-gray">Simulated</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Report ─── */}
        {activeSection === 'report' && (
          <div className="safety-content fade-in">
            <div className="report-wrap">
              {/* SOS */}
              <div className="sos-card">
                <div className="sos-card__left">
                  <h3 className="sos-card__title">🆘 Emergency SOS</h3>
                  <p className="sos-card__desc">
                    Triggers an alert to your emergency contact. <strong>Demo mode only — no real call is made.</strong>
                  </p>
                </div>
                {sosActive ? (
                  <div className="sos-countdown">
                    <div className="sos-countdown__ring">{sosCountdown}</div>
                    <span>Alerting…</span>
                  </div>
                ) : (
                  <button className="sos-btn" onClick={handleSOS} id="sos-btn">
                    SOS
                  </button>
                )}
              </div>

              <div className="divider" />

              {/* Report Form */}
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Report Suspicious Worker</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                This form is for demonstration purposes. No data is submitted.
              </p>

              <ReportForm bookings={allBookings} />
            </div>
          </div>
        )}

        {/* ─── Verification History ─── */}
        {activeSection === 'history' && (
          <div className="safety-content fade-in">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Booking</th>
                  <th>Worker</th>
                  <th>Method</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {verificationHistory.map((v) => (
                  <tr key={v.id}>
                    <td>{new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td><code>{v.bookingId}</code></td>
                    <td>{v.workerName}</td>
                    <td>{v.method}</td>
                    <td>
                      <span className={`badge ${v.result === 'verified' ? 'badge-green' : 'badge-red'}`}>
                        {v.result === 'verified' ? '✓ Verified' : '✗ Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Safety Tips ─── */}
        {activeSection === 'tips' && (
          <div className="safety-content fade-in">
            <TipsAccordion tips={safetyTips} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Report Form ─────────────────────────────────────────────── */
function ReportForm({ bookings }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ bookingId: '', reason: '', detail: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="report-success">
        <span style={{ fontSize: 40 }}>✅</span>
        <h3>Report submitted (demo)</h3>
        <p>In a real app, this would be reviewed by TruVantra's safety team within 24 hours.</p>
        <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => setSubmitted(false)}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <div className="form-group">
        <label className="form-label" htmlFor="report-booking">Booking ID</label>
        <select
          id="report-booking"
          className="form-select"
          value={form.bookingId}
          onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
          required
        >
          <option value="">Select booking</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>{b.id} — {b.workerName}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="report-reason">Reason</label>
        <select
          id="report-reason"
          className="form-select"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        >
          <option value="">Select reason</option>
          <option>Worker did not match booking</option>
          <option>Suspicious behaviour</option>
          <option>Demanded extra money</option>
          <option>QR code mismatch</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="report-detail">Additional details</label>
        <textarea
          id="report-detail"
          className="form-input"
          style={{ minHeight: 100, resize: 'vertical' }}
          placeholder="Describe what happened..."
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
        />
      </div>
      <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
        Submit Report (Demo)
      </button>
    </form>
  );
}
