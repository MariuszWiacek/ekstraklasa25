import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import footballLogo from '../images/icon.jpg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuClass = isMenuOpen ? "collapse navbar-collapse show" : "collapse navbar-collapse";

  const navbarStyle = {
    background: 'linear-gradient(to right, darkgreen, black)',
    position: 'fixed', // Set the navbar to a fixed position
    top: 0, // Position at the top
    width: '100%', // Occupy the full width
    zIndex: 1000, // Ensure it's above other content
  };

  const logoStyle = {
    width: '30px',
    marginRight: '10px',
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const linksStyle = {
    marginLeft: 'auto',
  };

  useEffect(() => {
    // Handle scrolling to adjust the navbar's appearance
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Add a background color or other styling when scrolling down
        navbarStyle.backgroundColor = 'darkgreen';
      } else {
        // Revert to the original styling when at the top
        navbarStyle.backgroundColor = 'transparent';
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-light navbar-white`} style={navbarStyle}>
      <div className="container">
        <Link to="/" className="navbar-brand" style={brandStyle}>
          <img src={footballLogo} alt="Football Logo" style={logoStyle} />
          Superliga
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={menuClass} id="navbarNav">
          <ul className="navbar-nav" style={linksStyle}>
            <li className="nav-item">
              <Link to="/table" className="nav-link" onClick={closeMenu}>
                League Table
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/games" className="nav-link" onClick={closeMenu}>
                Games
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/guestbook" className="nav-link" onClick={closeMenu}>
                Chatbox
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
