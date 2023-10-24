import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import the CSS file
import footballLogo from '../images/icon.jpg'; // Replace with your football logo path

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
    position: 'fixed', // Fixed position
    top: 0, // Stick to the top
    width: '100%', // Full width
    background: 'linear-gradient(to right, black, black, black)',
    zIndex: 1000, // Ensure it's above other content
  };

  const logoStyle = {
    width: '30px', // Adjust the size of the logo as needed
    marginRight: '10px', // Add spacing between the logo and text
    background: 'transparent', // Make the logo background transparent
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center', // Align the logo and text vertically
    fontFamily: 'Impact',
    fontSize: '36px',
    fontStyle: 'italic',
    letterSpacing: '2px',
  };

  const linksStyle = {
    marginLeft: 'auto', // Push the links to the right
  };

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
              <Link to="/bets" className="nav-link" onClick={closeMenu}>
                Bets
              </Link>
            </li>
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
