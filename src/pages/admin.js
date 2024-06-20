import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import gameData from '../gameData/data.json';
import ExpandableCard from '../compartments/expandableCard';

const Results = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if any
      action(); // Execute the action associated with the Enter key press
    }
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
        setEditMode(false);
        alert('Wyniki zostały pomyślnie przesłane!');
      })
      .catch((error) => {
        console.error('Error submitting results:', error);
        alert('Wystąpił błąd podczas przesyłania wyników. Spróbuj ponownie.');
      });
  };
  
  // No change needed in button code, it remains the same
  
  
  

  const handlePasswordSubmit = () => {
    if (password === 'maniek123') {
      setAuthenticated(true);
    } else {
      alert('Nieprawidłowe hasło. Spróbuj ponownie.');
    }
  };

  const handleToggleDisableGame = (index) => {
    const updatedGames = [...games];
    updatedGames[index].disabled = !updatedGames[index].disabled;
    setGames(updatedGames);

    fetch('/updateGameData', {
      method: 'POST',
      body: JSON.stringify(updatedGames),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        console.log('Game disabled/enabled successfully');
      } else {
        console.error('Failed to disable/enable game');
      }
    }).catch(error => {
      console.error('Error toggling game disable:', error);
    });
  };

  const sortedUsers = Object.keys(submittedData).sort((a, b) => {
    const pointsA = calculatePoints(Object.values(submittedData[a]), resultsInput);
    const pointsB = calculatePoints(Object.values(submittedData[b]), resultsInput);
    return pointsB - pointsA;
  });

  if (!authenticated) {
    return (
      <div style={styles.authContainer}>
        <h2>Hasło Admina:</h2>
        <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={styles.input}
  onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
/>

<button onClick={handleSubmitResults} style={styles.button}>
    Zatwierdź wyniki
  </button>
      </div>
    );
  }

  return (
    <div style={styles.resultsContainer}>
      <h2>Wprowadź wyniki:</h2>
      <div style={styles.gamesContainer}>
        {games.map((game, index) => (
          <div key={index} style={styles.gameEntry}>
            <p>{game.home} vs {game.away}:</p>
            {editMode ? (
              <input
              type="text"
              maxLength="3"
              placeholder="x:x"
              value={resultsInput[index] || ''}
              onChange={(e) => handleResultChange(index, e.target.value)}
              style={styles.resultInput}
              disabled={game.disabled}
              onKeyPress={(e) => handleKeyPress(e, handleSubmitResults)}
            />
            
            ) : (
              <span>{resultsInput[index] || 'Brak wyniku'}</span>
            )}
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
      <button onClick={() => setEditMode(!editMode)} style={styles.button}>
        {editMode ? 'Zakończ Edycję' : 'Edytuj Wyniki'}
      </button>
      {editMode && (
        <button onClick={handleSubmitResults} style={styles.button}>
          Zatwierdź wyniki
        </button>
      )}

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
              {sortedUsers.map((user) => (
                <tr key={user}>
                  <td style={styles.td}>{user}</td>
                  <td style={styles.td}>{calculatePoints(Object.values(submittedData[user]), resultsInput)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.expandableCardsContainer}>
        {sortedUsers.map((user, userIndex) => (
          <ExpandableCard
            key={userIndex}
            user={user}
            bets={submittedData[user]}
            results={resultsInput}
          />
        ))}
      </div>
    </div>
  );
};

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
  pointsTable: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#00000046',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'center',
  },
  expandableCardsContainer: {
    marginTop: '20px',
  },
};

export default Results;
