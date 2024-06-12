import React from 'react';
import logo from '../images/logo.jpg'


const homeStyle = {
  textAlign: 'center',
  marginTop: '5vh',
  background: `url("path/to/pitch.png") no-repeat center center fixed`,
  backgroundSize: 'cover',

};

const Home = () => {
  return (
    <div style={homeStyle}>
    <img src={logo} alt="Logo" style={{ width: '50%', height: '1%' }} />
    </div>
  );
};

export default Home;
