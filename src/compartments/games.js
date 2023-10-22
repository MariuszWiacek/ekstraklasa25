import React from 'react';
import { teamNames } from './teamdata'; // Import the team names from the data file

const Games = () => {
  // Generate random results for the games
  const games = teamNames.map((homeTeam, index) => ({
    homeTeam,
    awayTeam: teamNames[(index + 1) % teamNames.length], // Ensure different teams
    result: `${Math.floor(Math.random() * 5)} - ${Math.floor(Math.random() * 5)}`,
  }));

  return (
    <div>
      <h2>Recent Games</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index}>
              <td>{game.homeTeam}</td>
              <td>{game.awayTeam}</td>
              <td>{game.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Games;
