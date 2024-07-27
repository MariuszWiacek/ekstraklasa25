import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/animations.css'; // Import the CSS file for animations
import logo from '../images/ekstra.png';
import TeamLogos from '../components/teamLogos'; // Adjust the path according to your folder structure

const Home = () => {
    return (
        
        <div className="fade-in">
            <TeamLogos />
            <Container fluid style={linkContainerStyle}>
                <Row>
                    <Col md={6} className="slide-in">
                        <h2 style={welcomeMessageStyle}>
                            Typer LIGI POLSKIEJ sezonu 2024/25
                        </h2>
                        <hr />
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
                        </p>
                    </Col>
                    <Col md={6} className="text-center slide-in">
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
    fontFamily: 'monospace',
    fontSize: '18px', // Adjust to your needs
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
