import React from 'react';
import { teamNames } from './teamdata';

const Table = () => {
  // Create an array of teams with random points
  const teams = teamNames.map((teamName) => ({
    name: teamName,
    points: Math.floor(Math.random() * 50),
  }));

  // Sort the teams array in descending order based on points
  teams.sort((a, b) => b.points - a.points);

  return (
    <div>
      <h2>League Table</h2>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index}>
                <td>{team.name}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
