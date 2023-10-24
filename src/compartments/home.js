import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div>
      <h1 style={{ color: "white" }}>Welcome to Superliga</h1>
      <p style={{ color: "white" }}>Place where you can have some fun guessing football scores</p>
      <Link to="/bets">
        <div className="arrow" style={{ position: 'relative',animation: 'bounce 2s infinite', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>➜</span>
        </div>
      </Link>
      <Link to="/bets" style={{ color: "white", textDecoration: "underline", position: 'relative' }}>
        Guess Your Scores Here
      </Link>
    </div>
  );
};

export default Home;
