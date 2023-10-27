import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const footerStyle = {
    fontSize: "15px",
    backgroundColor: 'darkgreen',
    backgroundImage: 'linear-gradient(to right, red, black, red)',
    color: 'white',
  };

  const mwStyle = {
    textAlign: 'center',
    fontSize: '12px',
    backgroundImage: 'linear-gradient(to right, red, black, red)',
  };

  return (
    <>
      <div className="site-footer">
        <footer style={footerStyle}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="social-icons" style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
                  <a href="#">
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                  </a>
                </div>
              </div>
              <div className="col-md-6" style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
                <a href="#">
                  <FontAwesomeIcon icon={faFutbol} size="1.5x" /> Football Club
                </a>
                <p>&copy; Superliga</p>
                <p>Contact Us</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <div style={mwStyle}>
        <p>&copy; 2023 Created by MW</p>
      </div>
    </>
  );
};

export default Footer;
