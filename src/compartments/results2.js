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
    <div>
      
      {submittedResults && (
        <div>
          <h3>Wyniki:</h3><hr></hr>
          <table>
            <thead>
              <tr>
                <th>mecz</th>
                <th>wynik</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={index}>
                  <td>{game.home} vs {game.away}</td>
                  <td>{resultsInput[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {submittedResults && (
        <div>
            <hr></hr>
          <h3>Aktualna tabela:</h3>
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

export default Results2;
