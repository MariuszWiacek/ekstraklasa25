import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const footerStyle = {
    fontSize: "15px",
    backgroundColor: 'darkgreen',
    backgroundImage: 'linear-gradient(to right, darkgreen, black)',
    color: 'white',
  };

  const mwStyle = {
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    fontSize: '12px', 
  };

  return (
    <>
      <div className="site-footer">
        <footer style={footerStyle}>
          <div className="container">
            <div className="row">
              <div className="col-md-2">
                <a href="#">
                  <FontAwesomeIcon icon={faFutbol} size="1.5x" /> Football Club
                </a>
              </div>
              <div className="col-md-6">
                <div className="social-icons" style={{display:"flex", justifyContent:"space-around"}}>
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
              <div className="col-md-2">
                <p>Contact Us</p>
              </div>
              <div className="col-md-2">
                <div>
                  <p>&copy; Superliga</p>
                </div>
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
