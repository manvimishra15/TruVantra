import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../data/mockData';
import './Bookings.css';

const statusConfig = {
  upcoming: { label: 'Upcoming', cls: 'badge-blue' },
  completed: { label: 'Completed', cls: 'badge-green' },
  cancelled: { label: 'Cancelled', cls: 'badge-red' },
};

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

function BookingCard({ booking, onCancel, onVerify }) {
  const navigate = useNavigate();
  const status = statusConfig[booking.status];
  const dateObj = new Date(booking.date);
  const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="booking-card fade-in">
      <div className="booking-card__header">
        <div className="booking-card__worker">
          <img
            src={booking.workerAvatar}
            alt={booking.workerName}
            className="booking-card__avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.workerName)}&background=84cc16&color=1a2e1a`;
            }}
          />
          <div>
            <p className="booking-card__worker-name">{booking.workerName}</p>
            <p className="booking-card__service">{booking.service}</p>
          </div>
        </div>
        <div className="booking-card__right">
          <span className={`badge ${status.cls}`}>{status.label}</span>
          <span className="booking-card__price">₹{booking.price}</span>
        </div>
      </div>

      <div className="booking-card__meta">
        <span className="booking-card__meta-item">
          <CalendarIcon /> {dateStr}
        </span>
        <span className="booking-card__meta-item">
          <ClockIcon /> {booking.time}
        </span>
        <span className="booking-card__id">#{booking.id}</span>
      </div>

      <div className="booking-card__address">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {booking.address}
      </div>

      {booking.status === 'upcoming' && (
        <div className="booking-card__actions">
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: '8px 16px' }}
            onClick={() => navigate(`/safety?booking=${booking.id}`)}
          >
            Verify Worker
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: 13, padding: '8px 16px' }}
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        </div>
      )}
      {booking.status === 'completed' && (
        <div className="booking-card__actions">
          <button className="btn-outline-green" style={{ fontSize: 13, padding: '8px 16px' }}>
            ★ Leave Review
          </button>
          <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>
            Rebook
          </button>
        </div>
      )}
    </div>
  );
}

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookingList, setBookingList] = useState(bookings);

  const handleCancel = (id) => {
    setBookingList((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b)
    );
  };

  const displayed = bookingList.filter((b) =>
    activeTab === 'upcoming'
      ? b.status === 'upcoming'
      : b.status === 'completed' || b.status === 'cancelled'
  );

  return (
    <div className="page bookings-page">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 className="section-title">My Bookings</h1>
        <p className="section-subtitle">Track and manage your service appointments.</p>

        <div className="tabs" style={{ marginBottom: 24 }}>
          <button
            className={`tab-btn${activeTab === 'upcoming' ? ' active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
            id="tab-upcoming"
          >
            Upcoming
          </button>
          <button
            className={`tab-btn${activeTab === 'past' ? ' active' : ''}`}
            onClick={() => setActiveTab('past')}
            id="tab-past"
          >
            Past
          </button>
        </div>

        {displayed.length === 0 ? (
          <div className="bookings-empty">
            <span style={{ fontSize: 48 }}>📅</span>
            <h3>No {activeTab} bookings</h3>
            <p>
              {activeTab === 'upcoming'
                ? 'Book a worker to get started!'
                : 'Your past bookings will appear here.'}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {displayed.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
