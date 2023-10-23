import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'darkgreen',
    backgroundImage: 'linear-gradient(to right, darkgreen, black)',
    color: 'white',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: '25%', // Set the maximum height to 20%
  };

  const whiteBackgroundStyle = {
    backgroundColor: 'black',
    textAlign: 'center',
  };

  const mwStyle = {
    backgroundColor: 'black',
    textAlign: 'center',
    color: 'white',
    fontSize: '12px', // Adjust the font size as needed
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: '5%', 
  };

  return (
    <>
      <footer style={footerStyle}>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <a href="#">
                <FontAwesomeIcon icon={faFutbol} size="2x" /> Football Club
              </a>
            </div>
            <div className="col-md-3">
              <div className="social-icons">
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
            <div className="col-md-3">
              <p>Contact Us:</p>
              <ul>
                <li>
                  <a href="#">Email</a>
                </li>
                <li>
                  <a href="#">Phone</a>
                </li>
                <li>
                  <a href="#">Address</a>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <div>
                <p>&copy; Superliga</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div style={mwStyle}>
        <p>&copy; 2023 Created by MW</p>
      </div>
    </>
  );
};

export default Footer;
