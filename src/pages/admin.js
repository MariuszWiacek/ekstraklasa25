import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import gameData from '../gameData/data.json';

const Admin = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [betCounts, setBetCounts] = useState({});
  const [nonBettors, setNonBettors] = useState({});

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

  useEffect(() => {
    const betCountsRef = ref(getDatabase(), 'betCounts');
    onValue(betCountsRef, (snapshot) => {
      const data = snapshot.val();
      setBetCounts(data || {});
    });
  }, []);

  useEffect(() => {
    const nonBettorsData = {};
    Object.keys(submittedData).forEach((user) => {
      for (let i = 0; i < games.length; i++) {
        if (!submittedData[user][i]) {
          if (!nonBettorsData[i]) {
            nonBettorsData[i] = [];
          }
          nonBettorsData[i].push(user);
        }
      }
    });
    setNonBettors(nonBettorsData);
  }, [submittedData, games]);

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

  const handleKeyPress = (event, callback) => {
    if (event.key === 'Enter') {
      callback();
    }
  };

  return (
    <div style={styles.resultsContainer}>
      <h2>Wprowadź wyniki:</h2>
      <div style={styles.gamesContainer}>
        {games.map((game, index) => (
          <div key={index} style={styles.gameEntry}>
            <div style={styles.gameInfo}>
              <p>{game.home} vs {game.away}:</p>
              <input
                type="text"
                maxLength="5" // Allow 5 characters (e.g., "x:y")
                placeholder="x:y"
                value={resultsInput[index] || ''}
                onChange={(e) => handleResultChange(index, e.target.value)}
                style={styles.resultInput}
                onKeyDown={(e) => handleKeyPress(e, handleSubmitResults)}
              />
            </div>
            <div style={styles.nonBettors}>
              <p>Nie obstawili:</p>
              <p>{nonBettors[index]?.join(', ') || 'brak'}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmitResults} style={styles.button}>
        Zatwierdź wyniki
      </button>
    </div>
  );
};

const styles = {
  resultsContainer: {
    textAlign: 'center',
    margin: '10px auto',
    width: '80%',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#00000046',
  },
  button: {
    padding: '10px 20px',
    fontSize: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '10px',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  gamesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center align the game entries
  },
  gameEntry: {
    marginBottom: '10px',
  },
  gameInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
  resultInput: {
    marginLeft: '10px',
    padding: '8px',
    fontSize: '12px',
    textAlign: 'center',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '40px',
  },
  nonBettors: {
    textAlign: 'center',
  },
};

export default Admin;
