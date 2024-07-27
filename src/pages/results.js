import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json'; // Import teams data
import '../styles/results.css';
import Pagination from '../components/Pagination'; // Import your Pagination component

const groupGamesIntoKolejki = (games) => {
  const kolejki = [];
  for (let i = 0; i < games.length; i += 9) {
    kolejki.push({
      id: Math.floor(i / 9) + 1,
      games: games.slice(i, i + 9),
    });
  }
  return kolejki;
};

const Results = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState({});
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0); // Start at page 0
  const [itemsPerPage] = useState(9); // Number of items per page

  const [kolejki, setKolejki] = useState(groupGamesIntoKolejki(gameData));
  const [currentKolejkaIndex, setCurrentKolejkaIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

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

  useEffect(() => {
    const now = new Date();
    const getNextGameIndex = () => {
      return gameData.findIndex(game => {
        const gameDate = new Date(`${game.date}T${game.kickoff}:00+02:00`);
        return gameDate > now;
      });
    };

    const nextGameIndex = getNextGameIndex();
    const kolejkaIndex = Math.floor(nextGameIndex / 9);
    setCurrentKolejkaIndex(kolejkaIndex);

    const updateTimeRemaining = () => {
      const nextGame = gameData[nextGameIndex];
      if (nextGame) {
        const kickoffTimeCEST = new Date(`${nextGame.date}T${nextGame.kickoff}:00+02:00`);
        const diff = kickoffTimeCEST - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h :${minutes}min :${seconds}s`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Fetch team logo from teamsData
  const getTeamLogo = (teamName) => {
    const team = teamsData[teamName];
    return team ? team.logo : ''; // Default logo if not found
  };

  // Calculate paginated games
  const indexOfLastGame = (currentPage + 1) * itemsPerPage;
  const indexOfFirstGame = indexOfLastGame - itemsPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px' }}>
      {submittedResults && (
        <div className="text-center text-red-500 mb-5 table-container">
          <h2>Wyniki</h2>
          <hr />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(games.length / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
            label="Kolejka"
          />
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border bg-green-600 text-gray-100">Data i godzina</th>
                <th className="border bg-green-600 text-gray-100">Mecz</th>
                <th className="border bg-green-600 text-gray-100">Wynik</th>
                <th className="border bg-green-600 text-gray-100">Kto trafił wynik?</th>
                <th className="border bg-green-600 text-gray-100">Udział</th>
              </tr>
            </thead>
            <tbody>
              {currentGames.map((game) => {
                const gameId = game.id; // Use game ID directly
                const betPercentages = getBetPercentages(gameId);
                return (
                  <React.Fragment key={gameId}>
                    <tr className="mb-2 ">
                    <td className="border p-2 td-mobile">
  {game.date} {game.kickoff}
</td>

                      <td className="border p-2">
                        <div className="flex items-center justify-center gap-2 td-mobile">
                          <img src={getTeamLogo(game.home)} alt={`${game.home} logo`} className="logo" />
                          <span>{game.home}</span>
                          <span>&nbsp;-&nbsp;&nbsp;&nbsp;</span>
                          <img src={getTeamLogo(game.away)} alt={`${game.away} logo`} className="logo" />
                          <span>{game.away}</span>
                        </div>
                        <div className="flex justify-center gap-1 mt-1 small-font">
                          <span style={{ color: 'yellow' }}> 1: </span>
                          <span style={{ color: 'red' }}>{betPercentages.home}%</span>
                          <span style={{ color: 'yellow' }}> X: </span>
                          <span style={{ color: 'red' }}>{betPercentages.draw}%</span>
                          <span style={{ color: 'yellow' }}> 2: </span>
                          <span style={{ color: 'red' }}>{betPercentages.away}%</span>
                        </div>
                      </td>
                      <td className="border p-2 td-mobile">{resultsInput[gameId]}</td>
                      <td className="border p-2 td-mobile">{getCorrectTyp(gameId).join(', ')}</td>
                      <td className={`border p-2 td-mobile ${getParticipationFraction(gameId) === '14/14' ? 'text-yellow-500 font-bold' : ''}`}>
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
