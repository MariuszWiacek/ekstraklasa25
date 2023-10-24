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
      <div style={{ display:"flex", justifyContent:"space-around", animation: 'bounce 2s infinite', cursor: 'pointer' }}>
      
      <Link to="/table" >
        <span className="animated-text">Tabela</span>
      </Link>
      <Link to="/bets">
        <span style={{color: "red" }} className="animated-text">Obstawiaj!</span>
      </Link>
      <Link to="/games">
        <span className="animated-text">Wyniki</span>
      </Link>
      </div>
    </div>
  );
};

export default Home;
