import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import gameData from '../compartments/gameData/data.json';

const Results = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});

  const welcomeMessageStyle = {
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: window.innerWidth <= 480 ? '12px' : 'initial', // Adjust font size for mobile
  };

  useEffect(() => {
    setGames(gameData);
  }, []);

  useEffect(() => {
    const submittedDataRef = ref(getDatabase(), 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      const data = snapshot.val();
      setSubmittedData(data || {});
    });
  }, []);

  useEffect(() => {
    const resultsRef = ref(getDatabase(), 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      setResultsInput(data || []);
      setSubmittedResults(!!data);
    });
  }, []);

  const calculatePoints = (bets, results) => {
    let points = 0;
    bets.forEach((bet, index) => {
      const result = results[index];
      if (result && bet.score === result) {
        points += 3;
      } else if (result && bet.bet === (result.split(':')[0] === result.split(':')[1] ? 'X' : result.split(':')[0] > result.split(':')[1] ? '1' : '2')) {
        points += 1;
      }
    });
    return points;
  };

  const getCorrectTyp = (gameIndex) => {
    return Object.keys(submittedData).filter((user) => submittedData[user][gameIndex] && submittedData[user][gameIndex].score === resultsInput[gameIndex]);
  };

  const getBetPercentages = (gameIndex) => {
    const totalBets = Object.keys(submittedData).length;
    if (totalBets === 0) return { home: 0, draw: 0, away: 0 };

    const betCounts = { home: 0, draw: 0, away: 0 };

    Object.values(submittedData).forEach((userBets) => {
      const bet = userBets[gameIndex]?.bet;
      if (bet === '1') betCounts.home++;
      else if (bet === 'X') betCounts.draw++;
      else if (bet === '2') betCounts.away++;
    });

    return {
      home: ((betCounts.home / totalBets) * 100).toFixed(0),
      draw: ((betCounts.draw / totalBets) * 100).toFixed(0),
      away: ((betCounts.away / totalBets) * 100).toFixed(0),
    };
  };

  const getParticipationPercentage = (gameIndex) => {
    const totalUsers = Object.keys(submittedData).length;
    const usersWhoBet = Object.values(submittedData).filter(userBets => userBets[gameIndex] !== undefined).length;
    return totalUsers > 0 ? ((usersWhoBet / totalUsers) * 100).toFixed(0) : 0;
  };

  return (
    <div style={welcomeMessageStyle}>
      <h2>Wyniki:</h2>
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', fontWeight: 'normal' }}>
        <div style={styles.container}>
          {submittedResults && (
            <div style={styles.resultsSection}>
              <hr style={styles.hr} />
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Mecz</th>
                    <th>Wynik</th>
                    <th>Kto trafił prawidłowy wynik?</th>
                    <th>Udział w zakładach (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, index) => {
                    const betPercentages = getBetPercentages(index);
                    const participationPercentage = getParticipationPercentage(index);
                    return (
                      <React.Fragment key={index}>
                        <tr style={styles.gameRow}>
                          <td>{game.date}</td>
                          <td>
                            {game.home} vs {game.away}
                            <div style={styles.percentages}>
                              {`1: ${betPercentages.home}%, X: ${betPercentages.draw}%, 2: ${betPercentages.away}%`}
                            </div>
                          </td>
                          <td>{resultsInput[index]}</td>
                          <td>{getCorrectTyp(index).join(', ')}</td>
                          <td>{participationPercentage}%</td>
                        </tr>
                        <tr>
                          <td colSpan="5"><hr style={styles.rowHr} /></td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'left',
    margin: '20px',
  },
  resultsSection: {
    textAlign: 'center',
    color: 'red',
    marginBottom: '20px',
  },
  hr: {
    margin: '20px 0',
  },
  rowHr: {
    border: '0',
    borderTop: '1px solid #ddd',
    margin: '10px 0',
  },
  table: {
    margin: '0 auto',
    borderCollapse: 'collapse',
    width: '90%',
    fontSize: window.innerWidth <= 480 ? '12px' : 'initial', // Adjust table font size for mobile
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  gameRow: {
    marginBottom: '10px',
  },
  percentages: {
    fontSize: window.innerWidth <= 480 ? '10px' : '12px', // Adjust percentages font size for mobile
    color: '#ddd',
    marginTop: '5px',
  },
};

export default Results;