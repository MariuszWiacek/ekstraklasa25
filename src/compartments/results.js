import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import gameData from './gameData/data.json';

const Results = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

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

  const handleResultChange = (index, result) => {
    setResultsInput(prevResults => {
      const updatedResults = [...prevResults];
      updatedResults[index] = result;
      return updatedResults;
    });
  };

  const handleSubmitResults = () => {
    set(ref(getDatabase(), 'results'), resultsInput)
      .then(() => {
        setSubmittedResults(true);
        alert('Wyniki zostały pomyślnie przesłane!');
      })
      .catch((error) => {
        console.error('Error submitting results:', error);
        alert('Wystąpił błąd podczas przesyłania wyników. Spróbuj ponownie.');
      });
  };

  const handlePasswordSubmit = () => {
    if (password === 'maniek123') {
      setAuthenticated(true);
    } else {
      alert('Nieprawidłowe hasło. Spróbuj ponownie.');
    }
  };

  if (!authenticated) {
    return (
      <div style={styles.authContainer}>
        <h2>Hasło Admina:</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handlePasswordSubmit} style={styles.button}>Zatwierdź</button>
      </div>
    );
  }

  return (
    <div style={styles.resultsContainer}>
      <h2>Wprowadź wyniki:</h2>
      {games.map((game, index) => (
        <div key={index} style={styles.gameEntry}>
          <span style={{color: 'white'}}>{game.home} vs {game.away}:</span>
          <input
            type="text"
            maxLength="3"
            placeholder="x:x"
            value={resultsInput[index] || ''}
            onChange={(e) => handleResultChange(index, e.target.value)}
            style={styles.resultInput}
          />
        </div>
      ))}
      <button onClick={handleSubmitResults} style={styles.button}>Zatwierdź wyniki</button>

      {submittedResults && (
        <div style={styles.pointsTable}>
          <h2>Tabela punktów:</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Użytkownik</th>
                <th style={styles.th}>Punkty</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(submittedData).map((user) => (
                <tr key={user}>
                  <td style={styles.td}>{user}</td>
                  <td style={styles.td}>{calculatePoints(Object.values(submittedData[user]), resultsInput)}</td>
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
  authContainer: {
    textAlign: 'center',
    margin: '20px',
  },
  resultsContainer: {
    textAlign: 'center',
    margin: '20px',
  },
  input: {
    margin: '10px 0',
    padding: '5px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  gameEntry: {
    margin: '10px 0',
  },
  resultInput: {
    width: '50px',
    color: 'red',
  },
  pointsTable: {
    marginTop: '20px',
  },
  table: {
    margin: '0 auto',
    borderCollapse: 'collapse',
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
};

export default Results;
