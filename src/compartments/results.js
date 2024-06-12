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
        alert('Results submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting results:', error);
        alert('An error occurred while submitting the results. Please try again.');
      });
  };

  const handlePasswordSubmit = () => {
    if (password === 'maniek123') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  if (!authenticated) {
    return (
      <div>
        <h2>Please Enter Password to Access Results:</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handlePasswordSubmit}>Submit</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Enter Results:</h2>
      {games.map((game, index) => (
        <div key={index}>
          <span style={{color:'white'}}>{game.home} vs {game.away}: </span>
          <input
          style={{
            width: '50px', color:'red'}}
            type="text"
            maxLength="3"
            placeholder="x:x"
            value={resultsInput[index] || ''}
            onChange={(e) => handleResultChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmitResults}>Submit Results</button>

      {submittedResults && (
        <div>
          <h2>Points Table:</h2>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(submittedData).map((user) => (
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

export default Results;
