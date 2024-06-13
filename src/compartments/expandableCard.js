import React, { useState } from 'react';

const ExpandableCard = ({ user, bets, results }) => {
  const [expanded, setExpanded] = useState(false);

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: 'PenFont',
    fontSize: '12px',
    color: 'black',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    margin: '10px'
  };

  const betContainerStyle = {
    marginTop: '10px',
    padding: '2px'
  };

  const gameStyle = {
    marginBottom: '10px',
    fontSize: '10px', // smaller font for mobile
    textAlign: 'center',
    lineHeight: '1.5',
    
  };

  const resultsStyle = {
    color: 'red',
    marginLeft: '10px',
    fontSize: '10px' // smaller font for mobile
  };

  const correctIndicator = {
    color: 'green',
    marginLeft: '5px',
    fontWeight: 'bold',
    fontSize: '14px' // keep the indicator visible
  };

  const headerStyle = {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    textDecoration: 'underline',
    fontSize: '14px'
  };

  return (
    <div
      className="paper-card"
      style={cardStyle}
      onClick={() => setExpanded(!expanded)}
    >
      <h4 style={headerStyle}>
        {user} {expanded ? '-' : '+'}
      </h4>
      {expanded && (
        <div style={betContainerStyle}>
          {Object.keys(bets).map((index) => (
            <div key={index} style={gameStyle}>
              <div style={{ fontSize: '10px' }}>
                <span style={{ color: 'black' }}>{bets[index].home}</span>
                {' vs. '}
                <span style={{ color: 'black' }}>{bets[index].away}</span>
                {' | '}
                <span style={{ color: 'blue' }}>Typ: [ {bets[index].bet} ]</span>
                {' | '}
                <span style={{ color: 'black' }}> {bets[index].score}</span>
                <span style={resultsStyle}>Wynik: </span>
                <span>{results[index]}</span>
                {bets[index].score === results[index] && (
                  <span style={correctIndicator}>✔️</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
