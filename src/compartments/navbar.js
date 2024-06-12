import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import footballLogo2 from '../images/icon2.png'
import logo from '../images/logo.jpg'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuClass = isMenuOpen ? 'collapse navbar-collapse show' : 'collapse navbar-collapse';

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: scrollPosition > 0 ? 'red' : 'black',
    zIndex: 1000,
    transition: 'background-color 0.3s ease',
  };

  const logoStyle = {
    width: '30px',
    marginRight: '10px',
    background: 'black',
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Impact',
    fontSize: '36px',
    fontStyle: 'italic',
    letterSpacing: '2px',
    color: scrollPosition > 0 ? 'red' : 'black',
    transition: 'color 0.3s ease',
  };

  const linksStyle = {
    marginLeft: 'auto',
    fontWeight: '700',
  };



  return (
    <nav className={`navbar navbar-expand-lg navbar-light navbar-white`} style={navbarStyle}>
      <div className="container">
        <AnimatePresence>
          <motion.div
            key="superliga"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 1.5 }}
          >
            <Link to="/home" className="navbar-brand" style={brandStyle}>
              <motion.img src={footballLogo2} alt="Logo piłkarski" style={logoStyle} initial={{ scale: 0 }} animate={{ scale: 1 }} />
              EUROBET 2024
            </Link>
          </motion.div>
        </AnimatePresence>
      
        <button
          className={`navbar-toggler ${isMenuOpen ? 'open' : ''}`}
          type="button"
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={menuClass} id="navbarNav">
          <ul className="navbar-nav" style={linksStyle}>
            <li className="nav-item">
              <Link to="/bets" className="nav-link" onClick={closeMenu}>
                Zakłady
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/table" className="nav-link" onClick={closeMenu}>
                Tabela
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/games2" className="nav-link" onClick={closeMenu}>
                Wyniki
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rules" className="nav-link" onClick={closeMenu}>
                Regulamin
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/games" className="nav-link" onClick={closeMenu}>
                Admin
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
