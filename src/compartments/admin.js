import React, { useState, useEffect } from 'react';
import { openDatabase, addOrUpdateGame, getAllGames, deleteGame } from './indexedDB'; // Adjust path as needed

import { getDatabase, ref, set, onValue } from 'firebase/database';
import gameData from './gameData/data.json';

const Results = () => {
  // State variables
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [scoreInput, setScoreInput] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch initial game data
  useEffect(() => {
    setGames(gameData);
  }, []);

  // Fetch submitted data from Firebase
  useEffect(() => {
    const submittedDataRef = ref(getDatabase(), 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      const data = snapshot.val();
      setSubmittedData(data || {});
    });
  }, []);

  // Fetch results input from Firebase
  useEffect(() => {
    const resultsRef = ref(getDatabase(), 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      setResultsInput(data || []);
      setSubmittedResults(!!data);
    });
  }, []);

  // Calculate points based on bets and results
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

  // Handle change in result input
  const handleResultChange = (index, result) => {
    setResultsInput(prevResults => {
      const updatedResults = [...prevResults];
      updatedResults[index] = result;
      return updatedResults;
    });
  };

  // Handle submission of results
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

  // Handle submission of admin password
  const handlePasswordSubmit = () => {
    if (password === 'maniek123') {
      setAuthenticated(true);
    } else {
      alert('Nieprawidłowe hasło. Spróbuj ponownie.');
    }
  };

  // Handle toggling disable status of game
  const handleToggleDisableGame = (index) => {
    const updatedGames = [...games];
    updatedGames[index].disabled = !updatedGames[index].disabled; // Toggle disabled flag
    setGames(updatedGames);

    // Update IndexedDB (replace with your logic)
    openDatabase()
      .then(db => {
        addOrUpdateGame(db, updatedGames[index])
          .then(() => console.log('Game disabled/enabled successfully'))
          .catch(error => console.error('Failed to disable/enable game:', error));
      })
      .catch(error => console.error('Error opening IndexedDB:', error));
  };

  // Fetch users from IndexedDB on component mount
  useEffect(() => {
    openDatabase()
      .then(db => {
        getAllGames(db)
          .then(games => setUsers(games))
          .catch(error => console.error('Error fetching users from IndexedDB:', error));
      })
      .catch(error => console.error('Error opening IndexedDB:', error));
  }, []);

  // Render component based on authentication status
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

  // Render component for authenticated users
  return (
    <div style={styles.resultsContainer}>
      <h2>Wprowadź wyniki:</h2>
      <div style={styles.gamesContainer}>
        {games.map((game, index) => (
          <div key={index} style={styles.gameEntry}>
            <p>{game.home} vs {game.away}:</p>
            <input
              type="text"
              maxLength="3"
              placeholder="x:x"
              value={resultsInput[index] || ''}
              onChange={(e) => handleResultChange(index, e.target.value)}
              style={styles.resultInput}
              disabled={game.disabled} // Disable input if game is disabled
            />
            <button
              onClick={() => handleToggleDisableGame(index)}
              style={{
                ...styles.button,
                backgroundColor: game.disabled ? '#15ff007d' : '#ff19007d'
              }}
            >
              {game.disabled ? 'Włącz grę' : 'Wyłącz grę'}
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSubmitResults} style={styles.button}>Zatwierdź wyniki</button>

      {submittedResults && <p style={styles.submittedMessage}>Wyniki zostały już przesłane.</p>}

    </div>
  );
};

// Styles for the component
const styles = {
  authContainer: {
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '400px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#00000046',
  },
  resultsContainer: {
    textAlign: 'center',
    margin: '10px auto',
    width: '80%',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#00000046',
  },
  input: {
    margin: '10px 0',
    padding: '8px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    borderRadius: '4px',
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
    alignItems: 'left',
    
  },
  gameEntry: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  resultInput: {
    marginLeft: '10px',
    padding: '8px',
    fontSize: '16px',
    textAlign: 'center',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '50px',
  },
  submittedMessage: {
    marginTop: '20px',
    fontSize: '16px',
  }
};

export default Results;