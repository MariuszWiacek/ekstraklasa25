import React, { useState, useEffect } from 'react';
import '../styles/card.css';
import Pagination from './Pagination';

const ExpandableCard = ({ user, bets, results }) => {
  const gamesPerKolejka = 9;
  const [currentKolejka, setCurrentKolejka] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Group bets into kolejkas
  const groupedBets = Object.keys(bets).reduce((acc, key) => {
    const betID = parseInt(key, 10);
    const kolejkaIndex = Math.floor((betID - 1) / gamesPerKolejka);
    if (!acc[kolejkaIndex]) acc[kolejkaIndex] = [];
    acc[kolejkaIndex].push({ id: key, ...bets[key] });
    return acc;
  }, []);

  const totalKolejkas = groupedBets.length;

  useEffect(() => {
    if (totalKolejkas > 0) {
      setCurrentKolejka(totalKolejkas - 1);
    }
  }, [totalKolejkas]);

  const getTypeFromResult = (result) => {
    if (!result) return null;
    const [homeScore, awayScore] = result.split(':');
    if (homeScore === awayScore) return 'X';
    return homeScore > awayScore ? '1' : '2';
  };

  const handleKolejkaChange = (page) => {
    setCurrentKolejka(page);
  };

  return (
    <div className="paper-card">
      <h4 className="header-style" onClick={() => setExpanded(!expanded)}>
        {user} {expanded ? '-' : '+'}
      </h4>

      {expanded && (
        <div className="bet-container">
          <Pagination
            currentPage={currentKolejka}
            totalPages={totalKolejkas}
            onPageChange={handleKolejkaChange}
            label="Kolejka"
          />
          <hr />

          {groupedBets[currentKolejka]?.map((bet) => (
            <div key={bet.id} className="game-style">
              <div style={{ fontSize: '10px' }}>
                <span style={{ color: 'black' }}>{bet.home}</span> vs. <span style={{ color: 'black' }}>{bet.away}</span> |{' '}

                {currentKolejka === 15 ? (
                  <>
                    <span style={{ color: 'green' }}>Typ: [ ✔️ ]</span> | 
                    <span style={{ color: 'green' }}>Wynik: [ ✔️ ]</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'blue' }}>Typ: [ {bet.bet} ]</span> | 
                    <span style={{ color: 'black' }}>{bet.score}</span>
                  </>
                )}

                <span className="results-style"> Wynik: </span>
                <span>{results[bet.id]}</span>

                {currentKolejka !== 15 && bet.score === results[bet.id] && (
                  <span className="correct-score">✅</span>
                )}
                {currentKolejka !== 15 && getTypeFromResult(results[bet.id]) === bet.bet && (
                  <span className="correct-type">☑️</span>
                )}
              </div>
            </div>
          ))}

          <hr />
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;