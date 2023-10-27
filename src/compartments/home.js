import React from 'react';
import { Link } from 'react-router-dom';

const brandStyle = {
  fontFamily: 'Impact',
  fontSize: '36px',
  fontStyle: 'italic',
  letterSpacing: '5x',
  color: 'red',
  textShadow: '0.5 0.5 5px white', // Add a white border
};

const homeStyle = {
  textAlign: 'center',
  marginTop: '5vh',
  background: `url("path/to/pitch.png") no-repeat center center fixed`,
  backgroundSize: 'cover',
};

const Home = () => {
  return (
    <div style={homeStyle}>
      <h1 style={{ color: 'white' }}>
        <span style={brandStyle}>Superliga</span>
      </h1>
      <p style={{ color: 'white', animation: 'fade-in 1.5s ease-out' }}>
        Miejsce, gdzie możesz się dobrze bawić, obstawiając wyniki meczów piłkarskich
      </p>
    </div>
  );
};

export default Home;
