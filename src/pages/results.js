import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import gameData from '../compartments/gameData/data.json';

const Results = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState([]);
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
      setResultsInput(data || []);
      setSubmittedResults(!!data);
    });
  }, []);

  const calculatePoints = (bets, results) => {
    let points = 0;
    bets.forEach((bet, index) => {
      const result = results[index];
      if (result && bet.score === result) {
        points += 3;
      } else if (result && bet.bet === (result.split(':')[0] === result.split(':')[1] ? 'X' : result.split(':')[0] > result.split(':')[1] ? '1' : '2')) {
        points += 1;
      }
    });
    return points;
  };

  const getCorrectTyp = (gameIndex) => {
    return Object.keys(submittedData).filter((user) => submittedData[user][gameIndex] && submittedData[user][gameIndex].score === resultsInput[gameIndex]);
  };

  const getBetPercentages = (gameIndex) => {
    const totalBets = Object.keys(submittedData).length;
    if (totalBets === 0) return { home: 0, draw: 0, away: 0 };

    const betCounts = { home: 0, draw: 0, away: 0 };

    Object.values(submittedData).forEach((userBets) => {
      const bet = userBets[gameIndex]?.bet;
      if (bet === '1') betCounts.home++;
      else if (bet === 'X') betCounts.draw++;
      else if (bet === '2') betCounts.away++;
    });

    return {
      home: ((betCounts.home / totalBets) * 100).toFixed(0),
      draw: ((betCounts.draw / totalBets) * 100).toFixed(0),
      away: ((betCounts.away / totalBets) * 100).toFixed(0),
    };
  };

  const getParticipationFraction = (gameIndex) => {
    const totalUsers = Object.keys(submittedData).length;
    const usersWhoBet = Object.values(submittedData).filter(userBets => userBets[gameIndex] !== undefined).length;
    return `${usersWhoBet}/${totalUsers}`;
  };

  return (
    <div className="text-left mx-1 my-1">
      <h2 className="text-2xl font-bold mb-5">Wyniki:</h2>
      <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
        {submittedResults && (
          <div className="text-center text-red-500 mb-5">
            <hr className="my-5" />
            <table className="table-auto mx-auto w-full max-w-5xl border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-green-600 text-white">Data</th>
                  <th className="border p-2 bg-green-600 text-white">Mecz</th>
                  <th className="border p-2 bg-green-600 text-white">Wynik</th>
                  <th className="border p-2 bg-green-600 text-white">Kto trafił prawidłowy wynik?</th>
                  <th className="border p-2 bg-green-600 text-white">Udział w zakładach</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, index) => {
                  const betPercentages = getBetPercentages(index);
                  return (
                    <React.Fragment key={index}>
                      <tr className="mb-2">
                        <td className="border p-2">{game.date}</td>
                        <td className="border p-2">
                          {game.home} vs {game.away}
                          <div className="text-red-500 mt-2 text-sm">
                            {`1: ${betPercentages.home}%, X: ${betPercentages.draw}%, 2: ${betPercentages.away}%`}
                          </div>
                        </td>
                        <td className="border p-2">{resultsInput[index]}</td>
                        <td className="border p-2">{getCorrectTyp(index).join(', ')}</td>
                        <td className={`border p-2 ${getParticipationFraction(index) === '14/14' ? 'text-yellow-500 font-bold' : ''}`}>
                          {getParticipationFraction(index)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="5"><hr className="border-t border-gray-300 my-2" /></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;