import React, { useState } from 'react';
import gameData from './gameData.json';

const Games = () => {
  const [gameScores, setGameScores] = useState(gameData.map(() => ({ result: '' })));

  const tableStyle = {
    backgroundColor: '#212529ab',
    width: '100%',
    maxWidth: '90%',
    margin: '0 auto',
  };

  const cellStyle = {
    fontSize: '16px',
    color: 'grey',
    '@media (max-width: 767px)': {
      fontSize: '1px',
    },
    padding: '10px',
  };

  const handleResultChange = (index, newResult) => {
    const newGameScores = [...gameScores];
    newGameScores[index].result = newResult;
    setGameScores(newGameScores);
  };

  const handleEnterPress = (event, index) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // You can choose to do something with the result here (e.g., display it).
    console.log(`Result for game ${index}: ${gameScores[index].result}`);
  };

  return (
    <div style={{ paddingBottom: '5%' }}>
      <h2 style={{ textAlign: 'center', textDecoration: 'underline', paddingBottom: '2%' }}>
        Wyniki
      </h2>
      <div className="table-responsive">
        <div style={tableStyle}>
          <table style={{ width: '100%' }}>
            <tbody>
              {gameData.map((game, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{game.home}:</td>
                  <td style={cellStyle}>{game.away}</td>
                  <td style={cellStyle}>
                    <input
                      type="text"
                      value={gameScores[index].result}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEnterPress(e, index); // Pass the event and index
                        }
                      }}
                    />
                  </td>
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
