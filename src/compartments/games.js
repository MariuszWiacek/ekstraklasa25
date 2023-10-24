import React from 'react';
import gameData from './gameData.json'; // Import the JSON data

const Games = () => {
  // Generate random results for the games
  const games = gameData.map((game) => ({
    homeTeam: game.home,
    awayTeam: game.away,
    result: game.score,
  }));

  const tableStyle = {
    backgroundColor: '#212529ab', // Background color
    width: '100%',
    maxWidth: '800px', // You can adjust the maximum width as needed
    margin: '0 auto', // Center the table horizontally
  };

  const cellStyle = {
    color: 'AliceBlue', // Font color
    fontSize: '1.2rem', // Font size
    padding: '10px', // Add some padding for better spacing
  };

  return (
    <div>
      <h2>Recent Games</h2>
      <div className="table-responsive">
        <div style={tableStyle}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={cellStyle}>Home Team</th>
                <th style={cellStyle}>Away Team</th>
                <th style={cellStyle}>Result</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{game.homeTeam}</td>
                  <td style={cellStyle}>{game.awayTeam}</td>
                  <td style={cellStyle}>{game.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Games;
