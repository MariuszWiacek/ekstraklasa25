import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import the CSS file

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
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light navbar-white`} style={navbarStyle}>
      <div className="container">
        <Link to="/" className="navbar-brand">
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
          <ul className="navbar-nav ml-auto">
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
              <Link to="/contact" className="nav-link" onClick={closeMenu}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
