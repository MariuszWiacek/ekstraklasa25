import React, { useState } from 'react';

const ExpandableCard = ({ user, bets, results }) => {
  const [expanded, setExpanded] = useState(false);

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: 'PenFont',
    fontSize: '12px',
    color: 'black',
    cursor: 'pointer',
    width: '95%'
  };

  const betContainerStyle = {
    marginTop: '10px',
    padding: '2px'
  };

  const gameStyle = {
    marginBottom: '5px',
    fontSize: '12px',
     
    textAlign: 'center',
  };

  const resultsStyle = {
    color: 'red',
    
    marginLeft: '10px'
  };

  const correctIndicator = {
    color: 'green',
    marginLeft: '5px',
    fontWeight: 'bold'
  };

  return (
    <div
      className="paper-card"
      style={cardStyle}
      onClick={() => setExpanded(!expanded)}
    >
      <h4 style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', textDecoration : 'underline' }}>
        {user}  {expanded ? '-' : '+'}
      </h4>
      {expanded && (
        <div style={betContainerStyle}>
          {Object.keys(bets).map((index) => (
            <div key={index} style={gameStyle}>
              <div>
                <span style={{ color: 'blue' }}>{bets[index].home}</span>
                {' vs. '}
                <span style={{ color: 'red' }}>{bets[index].away}</span>
                {' | '}
                <span style={{ color: 'blue' }}>Typ: [ {bets[index].bet} ]</span>
                {' | '}
                <span style={{ color: 'black' }}> {bets[index].score}</span>
                
              
                 <span style={resultsStyle}>Wynik: </span><span>{results[index]}</span>
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
