import { useState } from 'react';
import { bookings, verificationHistory } from '../data/mockData';
import './Profile.css';

const NOTIF_DEFAULTS = {
  bookingReminders: true,
  safetyAlerts: true,
  workerUpdates: false,
  promotions: false,
};

const savedAddresses = [
  { id: 'a1', label: 'Home', address: '42, 5th Cross, Indiranagar, Bengaluru 560038', default: true },
  { id: 'a2', label: 'Office', address: '14, MG Road, Bengaluru 560001', default: false },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'Ananya Krishnan',
    phone: '+91 98765 43210',
    email: 'ananya.k@example.com',
  });
  const [draft, setDraft] = useState(form);
  const [notifs, setNotifs] = useState(NOTIF_DEFAULTS);
  const [addresses, setAddresses] = useState(savedAddresses);
  const [activeTab, setActiveTab] = useState('details');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setForm(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (key) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="page profile-page">
      <div className="container" style={{ paddingTop: 32 }}>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <img
              src="https://randomuser.me/api/portraits/women/75.jpg"
              alt={form.name}
              className="profile-avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=84cc16&color=1a2e1a&size=128`;
              }}
            />
            <button className="profile-avatar-edit" aria-label="Change photo">📷</button>
          </div>
          <div className="profile-header__info">
            <h1 className="profile-header__name">{form.name}</h1>
            <p className="profile-header__meta">{form.phone} · {form.email}</p>
            <div className="profile-header__stats">
              <div className="profile-stat">
                <span className="profile-stat__val">{bookings.length}</span>
                <span className="profile-stat__label">Total Bookings</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__val">{completedBookings.length}</span>
                <span className="profile-stat__label">Completed</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__val">{verificationHistory.filter(v => v.result === 'verified').length}</span>
                <span className="profile-stat__label">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="tabs" style={{ marginBottom: 28 }}>
          {[
            { id: 'details', label: 'Details' },
            { id: 'addresses', label: 'Addresses' },
            { id: 'history', label: 'Booking History' },
            { id: 'notifications', label: 'Notifications' },
          ].map((t) => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              id={`profile-tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Details ─── */}
        {activeTab === 'details' && (
          <div className="profile-section fade-in">
            {saved && (
              <div className="profile-saved-toast">✅ Profile updated successfully!</div>
            )}
            <div className="profile-card">
              <div className="profile-card__header">
                <h2 className="profile-card__title">Personal Information</h2>
                {!editing && (
                  <button className="btn-outline-green" onClick={() => { setDraft(form); setEditing(true); }}>
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="profile-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      className="form-input"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                    <input
                      id="profile-phone"
                      className="form-input"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">Email Address</label>
                    <input
                      id="profile-email"
                      type="email"
                      className="form-input"
                      value={draft.email}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    />
                  </div>
                  <div className="profile-form-actions">
                    <button type="submit" className="btn-primary">Save Changes</button>
                    <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info-list">
                  <ProfileInfoRow label="Full Name" value={form.name} />
                  <ProfileInfoRow label="Phone" value={form.phone} />
                  <ProfileInfoRow label="Email" value={form.email} />
                  <ProfileInfoRow label="Location" value="Indiranagar, Bengaluru" />
                  <ProfileInfoRow label="Member Since" value="January 2024" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Addresses ─── */}
        {activeTab === 'addresses' && (
          <div className="profile-section fade-in">
            <div className="addresses-list">
              {addresses.map((addr) => (
                <div key={addr.id} className="address-card">
                  <div className="address-card__icon">
                    {addr.label === 'Home' ? '🏠' : '🏢'}
                  </div>
                  <div className="address-card__body">
                    <div className="address-card__label-row">
                      <span className="address-card__label">{addr.label}</span>
                      {addr.default && <span className="badge badge-green">Default</span>}
                    </div>
                    <p className="address-card__text">{addr.address}</p>
                  </div>
                  <div className="address-card__actions">
                    <button className="btn-outline-green" style={{ fontSize: 12, padding: '5px 12px' }}>Edit</button>
                    {!addr.default && (
                      <button
                        className="btn-secondary"
                        style={{ fontSize: 12, padding: '5px 12px' }}
                        onClick={() => removeAddress(addr.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button className="add-address-btn">
                + Add New Address
              </button>
            </div>
          </div>
        )}

        {/* ─── Booking History ─── */}
        {activeTab === 'history' && (
          <div className="profile-section fade-in">
            <table className="history-table-profile">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Worker</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td><code>{b.id}</code></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img
                          src={b.workerAvatar}
                          alt={b.workerName}
                          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(b.workerName)}&size=28&background=84cc16&color=1a2e1a`; }}
                        />
                        {b.workerName}
                      </div>
                    </td>
                    <td>{b.service}</td>
                    <td>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>₹{b.price}</td>
                    <td>
                      <span className={`badge ${
                        b.status === 'completed' ? 'badge-green' :
                        b.status === 'upcoming' ? 'badge-blue' : 'badge-red'
                      }`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Notifications ─── */}
        {activeTab === 'notifications' && (
          <div className="profile-section fade-in">
            <div className="profile-card">
              <h2 className="profile-card__title" style={{ marginBottom: 20 }}>Notification Preferences</h2>
              <div className="notif-list">
                {[
                  { key: 'bookingReminders', label: 'Booking Reminders', desc: 'Reminders before a scheduled booking' },
                  { key: 'safetyAlerts', label: 'Safety Alerts', desc: 'Alerts for identity verification and safety events' },
                  { key: 'workerUpdates', label: 'Worker Status Updates', desc: 'When a worker marks as on the way' },
                  { key: 'promotions', label: 'Promotions & Offers', desc: 'Special deals and discount alerts' },
                ].map((item) => (
                  <div key={item.key} className="notif-row">
                    <div>
                      <p className="notif-row__label">{item.label}</p>
                      <p className="notif-row__desc">{item.desc}</p>
                    </div>
                    <label className="toggle" htmlFor={`notif-${item.key}`}>
                      <input
                        type="checkbox"
                        id={`notif-${item.key}`}
                        checked={notifs[item.key]}
                        onChange={() => handleToggle(item.key)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ProfileInfoRow({ label, value }) {
  return (
    <div className="profile-info-row">
      <span className="profile-info-row__label">{label}</span>
      <span className="profile-info-row__value">{value}</span>
    </div>
  );
}
