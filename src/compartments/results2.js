import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import gameData from './gameData/data.json';

const Results2 = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});

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

  return (
    <div style={styles.container}>
      {submittedResults && (
        <div style={styles.resultsSection}>
          <h2>Wyniki:</h2>
          <hr style={styles.hr} />
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Mecz</th>
                <th>Wynik</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <React.Fragment key={index}>
                  <tr style={styles.gameRow}>
                    <td>{game.date}</td>
                    <td>{game.home} vs {game.away}</td>
                    <td>{resultsInput[index]}</td>
                  </tr>
                  <tr>
                    <td colSpan="3"><hr style={styles.rowHr} /></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {submittedResults && (
        <div style={styles.pointsSection}>
          <hr style={styles.hr} />
          <h3>Aktualna tabela:</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Użytkownik</th>
                <th>Punkty</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(submittedData)
                .sort((a, b) => calculatePoints(Object.values(submittedData[b]), resultsInput) - calculatePoints(Object.values(submittedData[a]), resultsInput))
                .map((user) => (
                  <tr key={user}>
                    <td>{user}</td>
                    <td>{calculatePoints(Object.values(submittedData[user]), resultsInput)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
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
  pointsSection: {
    marginTop: '20px',
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
};

export default Results2;
