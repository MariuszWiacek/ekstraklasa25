import React from 'react';
import logo from '../images/logo.jpg';

const homeStyle = {
  textAlign: 'center',
  background: `url("../images/pitch.png") no-repeat center center fixed`,
  backgroundSize: 'cover',
  padding: '20px',
  color: '#fff',
  fontFamily: 'Arial, sans-serif',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const logoStyle = {
  width: '100%',
  maxWidth: '300px',
  height: 'auto',
  margin: '20px auto',
};

const linkContainerStyle = {
  textAlign: 'left',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
};

const linkStyle = {
  color: '#ff4500',
  textDecoration: 'none',
  fontSize: '16px',
  display: 'block',
  marginBottom: '10px',
  transition: 'color 0.3s ease',
};

const linkHoverStyle = {
  color: '#ff6347',
};

const welcomeMessageStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const Home = () => {
  return (<div style={linkContainerStyle}>
    <p style={welcomeMessageStyle}>Witaj w typerze!</p>
    <a
      href="/bets"
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
      onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
    >
      TYPUJ - <p2>TUTAJ <br></br></p2>
    </a>
    <a
      href="https://www.flashscore.pl/tabela/ABkrguJ9/EcpQtcVi/#/EcpQtcVi/table"
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
      onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
    >
      Euro 2024 - <p2>Tabela na żywo</p2>
    </a>
    <a
      href="https://www.polsatsport.pl/liga/euro-2024/"
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
      onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
    >
      Euro 2024 - <p2>wiadomości, wyniki, tabele</p2>
    </a>
  
    
      <img src={logo} alt="Logo" style={logoStyle} />
      
    </div>
  );
};

export default Home;
