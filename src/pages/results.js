import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import gameData from '../gameData/data.json';
import '../styles/results.css';

const Results = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState({});
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
      console.log('Results from database:', data);

      // Filter out results for invalid game IDs
      const validResults = gameData.reduce((acc, game) => {
        if (data && data[game.id]) {
          acc[game.id] = data[game.id];
        }
        return acc;
      }, {});

      setResultsInput(validResults);
      setSubmittedResults(!!data);
    });
  }, [gameData]);

  const getCorrectTyp = (gameId) => {
    return Object.keys(submittedData).filter((user) => submittedData[user][gameId] && submittedData[user][gameId].score === resultsInput[gameId]);
  };

  const getBetPercentages = (gameId) => {
    const betCounts = { home: 0, draw: 0, away: 0 };
    let totalBets = 0;

    Object.values(submittedData).forEach((userBets) => {
      const bet = userBets[gameId]?.bet;
      if (bet) {
        totalBets++;
        if (bet === '1') betCounts.home++;
        else if (bet === 'X') betCounts.draw++;
        else if (bet === '2') betCounts.away++;
      }
    });

    if (totalBets === 0) return { home: 0, draw: 0, away: 0 };

    return {
      home: ((betCounts.home / totalBets) * 100).toFixed(0),
      draw: ((betCounts.draw / totalBets) * 100).toFixed(0),
      away: ((betCounts.away / totalBets) * 100).toFixed(0),
    };
  };

  const getParticipationFraction = (gameId) => {
    const totalUsers = Object.keys(submittedData).length;
    const usersWhoBet = Object.values(submittedData).filter(userBets => userBets[gameId] !== undefined).length;
    return `${usersWhoBet}/${totalUsers}`;
  };

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px' }}>
      {submittedResults && (
        <div className="text-center text-red-500 mb-5 table-container">
          <h2>Wyniki</h2>
          <hr />
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border bg-green-600 text-gray-100">Data</th>
                <th className="border bg-green-600 text-gray-100">Mecz</th>
                <th className="border bg-green-600 text-gray-100">Wynik</th>
                <th className="border bg-green-600 text-gray-100">Kto trafił wynik?</th>
                <th className="border bg-green-600 text-gray-100">Udział</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const gameId = game.id; // Use game ID directly
                const betPercentages = getBetPercentages(gameId);
                return (
                  <React.Fragment key={gameId}>
                    <tr className="mb-2">
                      <td className="border p-2">{game.date}</td>
                      <td className="border p-2">
                        {game.home} vs {game.away}
                        <div className="flex justify-center gap-1 mt-1 small-font">
                          <span style={{ color: 'yellow' }}> 1: </span>
                          <span style={{ color: 'red' }}>{betPercentages.home}%</span>
                          <span style={{ color: 'yellow' }}> X: </span>
                          <span style={{ color: 'red' }}>{betPercentages.draw}%</span>
                          <span style={{ color: 'yellow' }}> 2: </span>
                          <span style={{ color: 'red' }}>{betPercentages.away}%</span>
                        </div>
                      </td>
                      <td className="border p-2">{resultsInput[gameId]}</td>
                      <td className="border p-2">{getCorrectTyp(gameId).join(', ')}</td>
                      <td className={`border p-2 ${getParticipationFraction(gameId) === '14/14' ? 'text-yellow-500 font-bold' : ''}`}>
                        {getParticipationFraction(gameId)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5"><hr className="border-t border-gray-100 my-0" /></td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Results;
