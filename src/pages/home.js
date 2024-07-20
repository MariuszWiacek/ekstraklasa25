import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';
import logo from '../images/ekstra.png';

const Home = () => {
  return (
    <div>
      <Container fluid style={linkContainerStyle}>
        <Row>
        
          <Col md={6}>
          
            <h2 style={welcomeMessageStyle}>Witaj w typerze LIGI POLSKIEJ</h2><hr></hr>
            <a
              href="/bets"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
            >
              TYPUJ - <span style={{ color: '#00ff0d' }}>TUTAJ</span>
            </a>
            <p>
              Masz pytanie lub problem? Skontaktuj się na WhatsApp
              <br />
              <a
                href="https://wa.me/447448952003"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ff0d', textDecoration: 'none' }}
              >
                <FontAwesomeIcon icon={faWhatsapp} size="2x" style={{ color: '#00ff0d', marginLeft: '5px' }} />
              </a>
            </p>
            <a
              href="https://www.flashscore.pl/tabela/ABkrguJ9/EcpQtcVi/#/EcpQtcVi/live"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
            >
              Euro 2024 - <span style={{ color: '#ff6347' }}>Tabela na żywo</span>
            </a>
            <br />
            <a
              href="https://wyniki.onet.pl/euro2024"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
            >
              Euro 2024 - <span style={{ color: '#ff6347' }}>wiadomości, wyniki, tabele</span>
            </a>
          </Col>
          <Col md={6} className="text-center">
            <img src={logo} alt="Logo" style={logoStyle} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const welcomeMessageStyle = {
  fontWeight: 'bold',
  marginBottom: '8px',
  textAlign: 'center',
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

const logoStyle = {
  width: '100%',
  maxWidth: '300px',
  height: 'auto',
  margin: '20px auto',
};

export default Home;
