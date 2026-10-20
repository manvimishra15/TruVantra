import { useNavigate } from 'react-router-dom';
import './WorkerCard.css';

const CheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#3b82f6"/>
    <path d="M7 12.5l3.5 3.5 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function WorkerCard({ worker, compact = false }) {
  const navigate = useNavigate();

  return (
    <div
      className={`worker-card${compact ? ' worker-card--compact' : ''} fade-in`}
      onClick={() => navigate(`/explore`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/explore')}
    >
      <div className="worker-card__image-wrap">
        <img
          src={worker.avatar}
          alt={worker.name}
          className="worker-card__image"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=84cc16&color=1a2e1a&size=200`;
          }}
        />
        <span className={`worker-card__status-badge ${worker.available ? 'available' : 'busy'}`}>
          {worker.available ? 'Available now' : 'Busy today'}
        </span>
      </div>

      <div className="worker-card__body">
        <div className="worker-card__name-row">
          <span className="worker-card__name">{worker.name}</span>
          {worker.verified && <CheckCircle />}
        </div>
        <p className="worker-card__service">
          {worker.service} · {worker.experience} yrs
        </p>
        <div className="worker-card__meta">
          <span className="worker-card__rating">
            <StarIcon /> {worker.rating}
          </span>
          <span className="worker-card__distance">
            <LocationIcon /> {worker.distance} km
          </span>
          <span className="worker-card__price">₹{worker.price}+</span>
        </div>
      </div>
    </div>
  );
}
