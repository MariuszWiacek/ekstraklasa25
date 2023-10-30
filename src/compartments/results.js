import React from 'react';
import gameData from './gameData.json';

const Games = () => {
  const tableStyle = {
    backgroundColor: '#212529ab',
    width: '100%',
    maxWidth: '90%',
    margin: '0 auto',
  };

  const cellStyle = {
    fontSize: '16px',
    color: 'grey',
    padding: '10px',
  };

  const redStyle = {
    color: 'red',
  };

  const determineType = (result) => {
    if (!result) {
      return "";
    }

    const [homeScore, awayScore] = result.split(':').map(Number);
    if (homeScore > awayScore) {
      return "1";
    } else if (homeScore < awayScore) {
      return "2";
    } else {
      return "X";
    }
  };

  return (
    <div style={{ paddingBottom: '5%' }}>
      <h2 style={{ textAlign: 'center', textDecoration: 'underline', paddingBottom: '2%' }}>
        Wyniki
      </h2><p  style={{ color: "grey", textAlign: 'center',paddingBottom: '2%' }}>ostatnia kolejka :</p>
      <div className="table-responsive">
        <div style={tableStyle}>
          <table style={{ width: '100%' }}>
            <tbody>
              {gameData.map((game, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{game.home}</td>
                  <td style={cellStyle}>{game.away}</td>
                  <td style={cellStyle}>Wynik: <span style={redStyle}>{game.result || ""}</span></td>
                  <td style={cellStyle}>Typ: <span style={redStyle}>{determineType(game.result)}</span></td>
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
