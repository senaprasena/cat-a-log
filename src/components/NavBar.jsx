import React, { useState, useEffect } from 'react';
import catALogLogo from '../assets/images/cat-a-log-s.png';

export default function NavBar({ onDashboardClick, isDashboard, onHomeClick }) {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="home-btn" onClick={onHomeClick} aria-label="Home" title="Home">
          🏠
        </button>
        <img src={catALogLogo} alt="Cat-a-Log Logo" className="navbar-logo" />
        <span className="navbar-title">Cat-a-Log</span>
        <button className="dashboard-btn" onClick={onDashboardClick} aria-label="Dashboard">
          {isDashboard ? 'Inventory' : 'Dashboard'}
        </button>
        {showTopBtn && (
          <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
            ⬆ Top
          </button>
        )}
      </div>
    </nav>
  );
} 