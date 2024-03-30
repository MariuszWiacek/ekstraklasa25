import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import gameData from './gameData/data.json';

const Games = () => {
  const [results, setResults] = useState([]);
  const [submittedBets, setSubmittedBets] = useState(null);

  useEffect(() => {
    const fetchSubmittedBets = async () => {
      const submittedDataRef = firebase.database().ref('submittedData');
      submittedDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        setSubmittedBets(data);
      });
    };

    fetchSubmittedBets();

    // Setting results from JSON data
    setResults(gameData);

    return () => firebase.database().ref('submittedData').off('value');
  }, []);

  const handleChange = (gameIndex, key) => (event) => {
    const newResults = [...results];
    newResults[gameIndex][key] = event.target.value;
    setResults(newResults);
  };

  const handleSubmit = () => {
    firebase.database().ref('gameResults').set(results);
    alert('Results submitted successfully!');
  };

  const renderSubmittedBets = () => {
    if (!submittedBets) {
      return <p>Loading...</p>;
    }
  
    const currentWeek = 'week1'; // Change this to the current week
  
    if (submittedBets[currentWeek] && Array.isArray(submittedBets[currentWeek])) {
      return submittedBets[currentWeek].map((bettor) => (
        <div key={bettor}>
          <h3>{bettor}</h3>
          <ul>
            {submittedBets[currentWeek][bettor].map((bet, index) => (
              <li key={index}>{`${bet.home} vs ${bet.away}: ${bet.score || 'No result'}`}</li>
            ))}
          </ul>
        </div>
      ));
    } else {
      return <p>No bets</p>;
    }
  };
  

  return (
    <div style={{ paddingBottom: '5%' }}>
      <h2 style={{ textAlign: 'center', textDecoration: 'underline', paddingBottom: '2%' }}>
        Wyniki
      </h2>
      <div className="table-responsive">
        {results.map((game, gameIndex) => (
          <div key={gameIndex}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td>{game.home}</td>
                  <td>{game.away}</td>
                  <td>
                    <input
                      type="text"
                      maxLength="3"
                      placeholder="x:x"
                      value={game.result}
                      onChange={handleChange(gameIndex, 'result')}
                      style={{ width: '50px', color: 'red', textDecoration: 'bo' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit Results</button>
      {renderSubmittedBets()}
    </div>
  );
};

export default Games;
