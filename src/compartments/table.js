import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import gameData from './gameData/week1.json';

const Table = () => {
  const [gameResults, setGameResults] = useState([]);
  const [submittedData, setSubmittedData] = useState({});
  const [userPoints, setUserPoints] = useState({});

  useEffect(() => {
    const gameRef = firebase.database().ref('games');
    gameRef.on('value', (snapshot) => {
      const games = snapshot.val();
      setGameResults(games);
    });

    const userBetsRef = firebase.database().ref('submittedData');
    userBetsRef.on('value', (snapshot) => {
      const bets = snapshot.val();
      if (bets) {
        setSubmittedData(bets);
      }
    });
  }, []);

  useEffect(() => {
    if (gameData && Object.keys(submittedData).length > 0) {
      const points = {};

      Object.keys(submittedData).forEach((username) => {
        let userPoints = 0;

        submittedData[username].forEach((bet) => {
          const gameResult = gameData.games.find((game) => game.id === bet.id);

          if (gameResult) {
            if (gameResult.result === bet.score && gameResult.type === bet.bet) {
              userPoints += 4; // 4 points for both matched result and type
            } else if (gameResult.result === bet.score) {
              userPoints += 3; // 3 points for matched result
            } else if (gameResult.type === bet.bet) {
              userPoints += 1; // 1 point for matched type
            }
          }
        });

        points[username] = userPoints;
      });

      // Sort user points in descending order
      const sortedUserPoints = Object.keys(points).sort((a, b) => points[b] - points[a]);

      // Create a sorted user points object
      const sortedPoints = {};
      sortedUserPoints.forEach((username) => {
        sortedPoints[username] = points[username];
      });

      setUserPoints(sortedPoints);
    }
  }, [submittedData, gameData]);

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Tabela:</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '5%',
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: '0.5px solid #444' }}>Place</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Username</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(userPoints).map((username, index) => (
            <tr
              key={username}
              style={{
                borderBottom: '0.5px solid #444',
                background: index === 0 ? 'rgba(255, 255, 0, 0.7)' : 'transparent',
              }}
            >
              <td>{index + 1}</td>
              <td>{username}</td>
              <td>{userPoints[username]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
