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
    fontSize: '16px', 
color: "grey",
    '@media (max-width: 767px)': {
      fontSize: '1px', 
    },
    padding: '10px', 
  };

  return (
    <div style={{paddingBottom:'5%'}}>
      <h2 style={{ textAlign: "center",  textDecoration:'underline', paddingBottom:'2%'}}>Wyniki</h2>
      <div className="table-responsive">
        <div style={tableStyle}>
          <table style={{ width: '100%', }}>
            
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
