import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkerCard from '../components/WorkerCard';
import { workers, categories } from '../data/mockData';
import './Home.css';

const locations = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'HSR Layout, Bengaluru',
  'Whitefield, Bengaluru',
  'Jayanagar, Bengaluru',
];

const featureCards = [
  {
    id: 1,
    num: '01',
    color: 'green',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Find Local Workers',
    desc: 'Discover and book independent professionals near you.',
    link: '/explore',
  },
  {
    id: 2,
    num: '02',
    color: 'blue',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        <path d="M16 4l1.5 1.5L21 2"/>
      </svg>
    ),
    title: 'Identity Verification',
    desc: 'Confirm the person at your door is your booked worker.',
    link: '/safety',
  },
  {
    id: 3,
    num: '03',
    color: 'purple',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 13h4M9 17h2"/>
      </svg>
    ),
    title: 'Document Verification',
    desc: 'Check uploaded documents for expiry and tampering signs.',
    link: '/safety',
  },
  {
    id: 4,
    num: '04',
    color: 'orange',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Government Portal',
    desc: 'No local worker? Register your need on a government portal.',
    link: '#',
  },
];

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(locations[0]);
  const [showLocPicker, setShowLocPicker] = useState(false);
  const navigate = useNavigate();

  const topWorkers = workers.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="page home-page">
      {/* Greeting Row */}
      <div className="home-greeting container">
        <div className="home-greeting__user">
          <img
            src="https://randomuser.me/api/portraits/women/75.jpg"
            alt="Ananya"
            className="home-greeting__avatar"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Ananya&background=84cc16&color=1a2e1a';
            }}
          />
          <div>
            <p className="home-greeting__label">Welcome back,</p>
            <p className="home-greeting__name">Ananya 👋</p>
          </div>
        </div>
        <div className="home-location-picker">
          <button
            className="home-location-btn"
            onClick={() => setShowLocPicker(!showLocPicker)}
            aria-expanded={showLocPicker}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{location}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showLocPicker && (
            <div className="home-location-dropdown">
              {locations.map((loc) => (
                <button
                  key={loc}
                  className={`home-location-option${loc === location ? ' active' : ''}`}
                  onClick={() => { setLocation(loc); setShowLocPicker(false); }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="home-hero container">
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            Trusted local help,<br />
            <span className="home-hero__title--accent">verified at your door.</span>
          </h1>
          <p className="home-hero__subtitle">
            Find independent workers near you — and know exactly who's arriving.
          </p>
          <form className="home-hero__search" onSubmit={handleSearch}>
            <div className="home-search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="home-search-input"
                placeholder="Search plumber, cleaning, Ravi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search workers"
              />
              <button type="submit" className="home-search-btn">Search</button>
            </div>
          </form>
        </div>
        <div className="home-hero__image-wrap">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format"
            alt="Professional worker at your doorstep"
            className="home-hero__image"
          />
          <div className="home-hero__gradient" />
        </div>
      </div>

      {/* Feature Cards */}
      <section className="home-features container">
        <h2 className="section-title">What TruVantra does</h2>
        <p className="section-subtitle">Four pillars that keep every doorstep visit safe and simple.</p>
        <div className="home-features__grid">
          {featureCards.map((card) => (
            <div key={card.id} className={`feature-card feature-card--${card.color}`}>
              <div className="feature-card__header">
                <div className="feature-card__icon">{card.icon}</div>
                <span className="feature-card__num">{card.num}</span>
              </div>
              <h3 className="feature-card__title">{card.title}</h3>
              <p className="feature-card__desc">{card.desc}</p>
              <button
                className="feature-card__link"
                onClick={() => navigate(card.link)}
              >
                Open →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="home-categories container">
        <h2 className="section-title">Find workers near you</h2>
        <div className="home-categories__scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-pill"
              onClick={() => navigate(`/explore?cat=${cat.id}`)}
            >
              <span className="category-pill__icon">{cat.icon}</span>
              <span className="category-pill__label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated Workers */}
      <section className="home-workers container">
        <div className="home-workers__header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Top-rated workers nearby</h2>
          <button className="home-workers__view-all" onClick={() => navigate('/explore')}>
            View all <ChevronIcon />
          </button>
        </div>
        <div className="home-workers__scroll">
          {topWorkers.map((w) => (
            <WorkerCard key={w.id} worker={w} compact />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <div className="home-cta container">
        <div className="home-cta__inner">
          <div>
            <h3 className="home-cta__title">No local worker for your need?</h3>
            <p className="home-cta__subtitle">Register your request on a government service portal instead.</p>
          </div>
          <button className="btn-primary home-cta__btn">
            Go to Gov Portal →
          </button>
        </div>
      </div>
    </div>
  );
}
