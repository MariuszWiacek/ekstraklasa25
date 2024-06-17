import React, { useState } from 'react';
import '../styles/card.css'; // Import your CSS file with styles

const ExpandableCard = ({ user, bets, results }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeFromResult = (result) => {
    if (!result) return null;
    const [homeScore, awayScore] = result.split(':');
    if (homeScore === awayScore) return 'X';
    return homeScore > awayScore ? '1' : '2';
  };

  return (
    <div
      className="paper-card"
      onClick={() => setExpanded(!expanded)}
    >
      <h4 className="header-style">
        {user} {expanded ? '-' : '+'}
      </h4>
      {expanded && (
        <div className="bet-container">
          {Object.keys(bets).map((index) => (
            <div key={index} className="game-style">
              <div style={{ fontSize: '10px' }}>
                <span style={{ color: 'black' }}>{bets[index].home}</span>
                {' vs. '}
                <span style={{ color: 'black' }}>{bets[index].away}</span>
                {' | '}
                <span style={{ color: 'blue' }}>Typ: [ {bets[index].bet} ]</span>
                {' | '}
                <span style={{ color: 'black' }}> {bets[index].score}</span>
                <span className="results-style">Wynik: </span>
                <span>{results[index]}</span>
                {bets[index].score === results[index] && (
                  <span className="correct-score">✅</span>
                )}
                {getTypeFromResult(results[index]) === bets[index].bet && (
                  <span className="correct-type">☑️</span>
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
