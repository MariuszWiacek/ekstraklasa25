import React from 'react';
import { Link } from 'react-router-dom';

const brandStyle = {
  fontFamily: 'Impact',
  fontSize: '36px',
  fontStyle: 'italic',
  letterSpacing: '2px',
  color: 'red',
};

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '5vh' }}>
      <h1 style={{ fontSize: '36px', color: 'aliceblue' }}>
        Welcome to <span style={{ ...brandStyle, animation: 'pulse 2s infinite' }}>Superliga</span>
      </h1>
      <p style={{ color: 'white' }}>Place where you can have some fun guessing football scores</p>
      <Link to="/bets">
        <div className="arrow" style={{ position: 'relative', animation: 'bounce 2s infinite', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>➜</span>
        </div>
      </Link>
      <Link to="/bets" style={{ color: 'white', textDecoration: 'underline', position: 'relative' }}>
        <span className="animated-text">Guess Your Scores Here</span>
      </Link>
    </div>
  );
};

export default Home;
