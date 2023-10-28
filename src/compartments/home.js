import React from 'react';

const homeStyle = {
  textAlign: 'center',
  marginTop: '5vh',
  background: `url("path/to/pitch.png") no-repeat center center fixed`,
  backgroundSize: 'cover',
 
};

const Home = () => {
  return (
    <div style={homeStyle}>
      <p style={{ color: 'grey', animation: 'fade-in 1.5s ease-out', fontStyle:'italic' }}>
        Superliga - Miejsce, gdzie możesz się dobrze bawić, obstawiając wyniki meczów piłkarskich
      </p>
      <p style={{color: "white"}}>Nastepna kolejka : 22/11/2023</p>
    </div>
  );
};

export default Home;
