import React, { useEffect, useState } from 'react';

const Table = ({ gameResults, submittedData }) => {
  const [userPoints, setUserPoints] = useState({});

  useEffect(() => {
    const calculateUserPoints = () => {
      const points = {};

      if (gameResults && submittedData) {
        Object.keys(submittedData).forEach((username) => {
          submittedData[username].forEach((bet, index) => {
            const gameResult = gameResults[index];
            if (gameResult && gameResult.result && bet.score) {
              const [homeScore, awayScore] = gameResult.result.split(':').map(Number);
              const [betHomeScore, betAwayScore] = bet.score.split(':').map(Number);
              let userPoints = 0;

              if (!isNaN(homeScore) && !isNaN(awayScore) && !isNaN(betHomeScore) && !isNaN(betAwayScore)) {
                if (homeScore === betHomeScore && awayScore === betAwayScore) {
                  userPoints += 3; // 3 points for correct score
                } else if (determineType(homeScore, awayScore) === determineType(betHomeScore, betAwayScore)) {
                  userPoints += 1; // 1 point for correct outcome
                }
              }

              points[username] = (points[username] || 0) + userPoints;
            }
          });
        });
      }

      setUserPoints(points);
    };

    calculateUserPoints();
  }, [gameResults, submittedData]);

  const determineType = (homeScore, awayScore) => {
    if (homeScore > awayScore) {
      return '1';
    } else if (homeScore < awayScore) {
      return '2';
    } else {
      return 'X';
    }
  };

  return (
    <div>
      <h2>Points Table</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(userPoints).map((username) => (
            <tr key={username}>
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
