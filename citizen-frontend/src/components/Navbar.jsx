import { NavLink } from 'react-router-dom';

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6v6c0 5.25 3.75 10.16 9 11.5C17.25 22.16 21 17.25 21 12V6L12 2z" fill="#84cc16"/>
    <path d="M9.5 12.5L11 14l3.5-3.5" stroke="#1a2e1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <ShieldIcon />
          </div>
          <span>TruVantra</span>
        </NavLink>

        <div className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Explore
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Bookings
          </NavLink>
          <NavLink
            to="/safety"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Safety
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Profile
          </NavLink>
        </div>

        <div className="navbar-actions">
          <button className="bell-btn" aria-label="Notifications">
            <BellIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}
