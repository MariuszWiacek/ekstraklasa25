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

  const getCorrectTyp = (gameIndex) => {
    return Object.keys(submittedData).filter((user) => submittedData[user][gameIndex] && submittedData[user][gameIndex].score === resultsInput[gameIndex]);
  };

  const getBetPercentages = (gameIndex) => {
    const betCounts = { home: 0, draw: 0, away: 0 };
    let totalBets = 0;

    Object.values(submittedData).forEach((userBets) => {
      const bet = userBets[gameIndex]?.bet;
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

  const getParticipationFraction = (gameIndex) => {
    const totalUsers = Object.keys(submittedData).length;
    const usersWhoBet = Object.values(submittedData).filter(userBets => userBets[gameIndex] !== undefined).length;
    return `${usersWhoBet}/${totalUsers}`;
  };

  return (
    <div className="text-left" style={{ backgroundColor: 'rgba(33, 37, 41, 0.67)' }}>
      <div className="bg-gray-800 text-gray p-1 rounded-lg shadow-lg overflow-x-auto">
        {submittedResults && (
          <div className="text-center text-red-500 mb-5">
            <hr className="my-5" />
            <table className="table-auto mx-2 w-full max-w-screen-md border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-green-600 text-gray">Data</th>
                  <th className="border p-2 bg-green-600 text-gray">Mecz</th>
                  <th className="border p-2 bg-green-600 text-gray">Wynik</th>
                  <th className="border p-2 bg-green-600 text-gray">Kto trafił prawidłowy wynik?</th>
                  <th className="border p-2 bg-green-600 text-gray">Udział w zakładach</th>
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
                          <div style={{ fontSize: '10px', fontWeight: 'bold', display: 'flex', textAlign: 'center', gap: '6px', marginTop: '4px' }}>
                            <div style={{ color: 'yellow' }}>1:</div>
                            <div style={{ color: 'red' }}>{betPercentages.home}%</div>, 
                            <div style={{ color: 'yellow' }}>X:</div>
                            <div style={{ color: 'red' }}>{betPercentages.draw}%</div>, 
                            <div style={{ color: 'yellow' }}>2:</div>
                            <div style={{ color: 'red' }}>{betPercentages.away}%</div>
                          </div>
                        </td>
                        <td className="border p-2">{resultsInput[index]}</td>
                        <td className="border p-2">{getCorrectTyp(index).join(', ')}</td>
                        <td className={`border p-2 ${getParticipationFraction(index) === '14/14' ? 'text-yellow-500 font-bold' : ''}`}>
                          {getParticipationFraction(index)}
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
    </div>
  );
};

export default Results;
