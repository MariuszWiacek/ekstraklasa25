import React from 'react';
import logo from '../images/logo.png';
import {faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col } from 'react-bootstrap';
import doboju from '../images/doboju.jpeg'


const logoStyle = {
  width: '100%',
  maxWidth: '300px',
  height: 'auto',
  margin: '20px auto',
};

const linkContainerStyle = {
  textAlign: 'left',
  backgroundColor: '#212529ab',
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
  
  fontWeight: 'bold',
  marginBottom: '10px',
  textAlign: 'center'
};

const Home = () => {
  
  return (<div><h2 style={welcomeMessageStyle}>Witaj w typerze! DO BOJU POLSKA!</h2><div style={{ textAlign: 'center', marginBottom: '16px' }}>
    <img
      src={doboju}
      alt="Dobpoju Image"
      style={{ maxWidth: '100%', height: 'auto', marginBottom: '16px' }}
    />
    </div><Container fluid style={linkContainerStyle}><Row><Col md={6} >
    
    <a
      href="/bets"
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
      onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
    >
      TYPUJ - <p2>TUTAJ <br></br></p2>
    </a>
    <a>Masz pytanie lub problem? Skontaktuj się na WhatsApp <br></br><Link to="https://wa.me/447448952003" target="_blank">
  <FontAwesomeIcon icon={faWhatsapp} size="2x" style={{ color: '#00ff0d' }} />
</Link></a><br></br><br></br>
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
      href="https://wyniki.onet.pl/euro2024"
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
      onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
    >
      Euro 2024 - <p2>wiadomości, wyniki, tabele</p2>
      
    </a></Col>
    <Col md={6}>
    <img src={logo} alt="Logo" style={logoStyle} />
    
      
      
      </Col></Row></Container></div>
  );
};

export default Home;
