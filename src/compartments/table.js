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

  const tableStyle = {
    backgroundColor: '#212529ab', // Background color
    width: '100%',
    maxWidth: '800px', 
    margin: '0 auto', 
    fontSize: '16px', 
  };

  const cellStyle = {
    color: 'AliceBlue', 
    padding: '10px',

  };

  return (
    <div>
      <h2 style={{textAlign:"center", color: "red"}}>Tabela</h2>
      <div className="table-responsive">
        <div style={tableStyle}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={cellStyle}>Team</th>
                <th style={cellStyle}>Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{team.name}</td>
                  <td style={cellStyle}>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
