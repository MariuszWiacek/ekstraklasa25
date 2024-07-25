import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import usersData from '../gameData/users.json';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json'; // Import the teams data
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import ExpandableCard from '../components/expandableCard';
import Pagination from '../components/Pagination'; // Custom component for pagination

const firebaseConfig = {
  apiKey: "AIzaSyAEUAgb7dUt7ZO8S5-B4P3p1fHMJ_LqdPc",
  authDomain: "polskibet-71ef6.firebaseapp.com",
  databaseURL: "https://polskibet-71ef6-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "polskibet-71ef6",
  storageBucket: "polskibet-71ef6.appspot.com",
  messagingSenderId: "185818867502",
  appId: "1:185818867502:web:b582993ede95b06f80bcbf",
  measurementId: "G-VRP9QW7LRN"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const database = getDatabase();

const groupGamesIntoKolejki = (games) => {
  const kolejki = [];
  for (let i = 0; i < games.length; i += 9) {
    kolejki.push({
      id: Math.floor(i / 9) + 1,
      games: games.slice(i, i + 9)
    });
  }
  return kolejki;
};

const Bets = () => {
  const [kolejki, setKolejki] = useState(groupGamesIntoKolejki(gameData));
  const [selectedUser, setSelectedUser] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [timeRemaining, setTimeRemaining] = useState('');
  const [currentKolejkaIndex, setCurrentKolejkaIndex] = useState(0);

  useEffect(() => {
    const lastChosenUser = localStorage.getItem('selectedUser');
    if (lastChosenUser) {
      setSelectedUser(lastChosenUser);
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        setSelectedUser(user.displayName);
      }
    });

    const dbRef = ref(database, 'submittedData');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedData(data);
        setIsDataSubmitted(true);
      }
    });

    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResults(data);
      }
    });

    const now = new Date();
    const nextGameIndex = gameData.findIndex(game => new Date(`${game.date}T${game.kickoff}:00+02:00`) > now);
    const kolejkaIndex = Math.floor(nextGameIndex / 9);
    setCurrentKolejkaIndex(kolejkaIndex);
  }, []);

  const updateTimeRemaining = () => {
    const now = new Date();
    const nextGame = gameData.find(game => new Date(`${game.date}T${game.kickoff}:00+02:00`) > now);

    if (nextGame) {
      const kickoffTimeCEST = new Date(`${nextGame.date}T${nextGame.kickoff}:00+02:00`);
      const diff = kickoffTimeCEST - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h :${minutes}min :${seconds}s`);
    }
  };

  useEffect(() => {
    updateTimeRemaining();
  }, [kolejki]);

  useEffect(() => {
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const isReadOnly = (selectedUser, index) => {
    return submittedData[selectedUser] && submittedData[selectedUser][index];
  };

  const gameStarted = (gameDate, gameKickoff) => {
    const currentDateTime = new Date();
    const gameDateTimeCEST = new Date(`${gameDate}T${gameKickoff}:00+02:00`);
    return currentDateTime >= gameDateTimeCEST;
  };

  const handleUserChange = (e) => {
    const user = e.target.value;
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user);
  };

  const autoDetectBetType = (score) => {
    const [homeScore, awayScore] = score.split(':').map(Number);
    if (homeScore === awayScore) {
      return 'X';
    } else if (homeScore > awayScore) {
      return '1';
    } else {
      return '2';
    }
  };

  const handleScoreChange = (gameId, newScore) => {
    const cleanedScore = newScore.replace(/[^0-9:]/g, '');
    const formattedScore = cleanedScore.replace(/^(?:(\d))([^:]*$)/, '$1:$2');

    const updatedKolejki = kolejki.map(kolejka => ({
      ...kolejka,
      games: kolejka.games.map(game =>
        game.id === gameId
          ? { ...game, score: formattedScore, bet: autoDetectBetType(formattedScore) }
          : game
      )
    }));
    setKolejki(updatedKolejki);
  };

  const handleSubmit = () => {
    if (!selectedUser) {
      alert('Proszę wybrać użytkownika.');
      return;
    }

    const currentKolejka = kolejki[currentKolejkaIndex];
    const userSubmittedBets = submittedData[selectedUser] || {};

    const newBetsToSubmit = currentKolejka.games.reduce((newBets, game) => {
      if (game.score && !userSubmittedBets[game.id]) {
        newBets[game.id] = {
          home: game.home,
          away: game.away,
          score: game.score,
          bet: autoDetectBetType(game.score),
          kolejkaId: currentKolejka.id,
        };
      }
      return newBets;
    }, {});

    if (Object.keys(newBetsToSubmit).length === 0) {
      alert("Wszystkie zakłady zostały już przesłane.");
      return;
    }

    set(ref(database, `submittedData/${selectedUser}`), { ...userSubmittedBets, ...newBetsToSubmit })
      .then(() => {
        setSubmittedData({ ...submittedData, [selectedUser]: { ...userSubmittedBets, ...newBetsToSubmit } });
        setIsDataSubmitted(true);
        alert('Zakłady zostały pomyślnie przesłane!');
      })
      .catch((error) => {
        console.error('Błąd podczas przesyłania danych:', error);
        alert('Wystąpił błąd podczas przesyłania zakładów. Proszę spróbować ponownie.');
      });

    setKolejki(prevKolejki =>
      prevKolejki.map((kolejka, idx) =>
        idx === currentKolejkaIndex
          ? {
            ...kolejka,
            games: kolejka.games.map(game =>
              userSubmittedBets[game.id]
                ? { ...game, readOnly: true }
                : game
            )
          }
          : kolejka
      )
    );
  };

  const getTeamLogo = (teamName) => {
    const team = teamsData[teamName];
    return team ? team.logo : ''; // Default logo if not found
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Wybrany użytkownik : </p>
      <select
        style={{ margin: '1px', backgroundColor: 'red', fontWeight: 'bold', fontFamily: 'Rubik' }}
        value={selectedUser}
        onChange={handleUserChange}
      >
        <option value="">Użytkownik</option>
        {Object.keys(usersData).map((user, index) => (
          <option key={index} value={user}>{user}</option>
        ))}
      </select>
      {timeRemaining && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{ color: "red" }}> </h1><hr></hr>
          <p>Do kolejnego meczu pozostało: {timeRemaining}</p><hr></hr>
        </div>
      )}
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <Pagination
          currentPage={currentKolejkaIndex}
          totalPages={kolejki.length}
          onPageChange={(page) => setCurrentKolejkaIndex(page)}
        />
        <table
          style={{
            width: '100%',
            border: '0px solid #444',
            borderCollapse: 'collapse',
            marginTop: '5%',
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: '0.5px solid #444' }}>Data</th>
              <th style={{ borderBottom: '0.5px solid #444' }}>Godzina</th>
              <th style={{ borderBottom: '0.5px solid #444' }}>Gospodarz</th>
              <th style={{ borderBottom: '0.5px solid #444' }}>Gość</th>
              <th style={{ borderBottom: '0.5px solid #444' }}>Wynik</th>
              <th style={{ borderBottom: '0.5px solid #444' }}></th>
              <th style={{ borderBottom: '0.5px solid #444' }}>Typ</th>
            </tr>
          </thead>
          <tbody>
            {kolejki[currentKolejkaIndex].games.map((game, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '0.5px solid #444',
                  opacity: game.disabled ? '0.5' : '1',
                  pointerEvents: game.disabled ? 'none' : 'auto',
                  backgroundColor: gameStarted(game.date, game.kickoff) ? '#214029ab' : 'transparent',
                }}
              >
                <td>{game.date}</td>
                <td>{game.kickoff}</td>
                <td style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={getTeamLogo(game.home)}
                    
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  {game.home}
                </td>
                <td style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={getTeamLogo(game.away)}
                 
                    style={{ width: '20px', height: 'auto', marginRight: '10px' }}
                  />
                  {game.away}
                </td>
                <td>{results[game.id]}</td>
                <td>
                  <select value={game.bet} disabled>
                    <option value="1">1</option>
                    <option value="X">X</option>
                    <option value="2">2</option>
                  </select>
                </td>
                <td>
                  <input
                    style={{
                      width: '50px',
                      backgroundColor: game.score ? (isReadOnly(selectedUser, game.id) ? 'transparent' : 'white') : 'white',
                      cursor: isReadOnly(selectedUser, game.id) ? 'not-allowed' : 'text',
                      color: 'red',
                    }}
                    type="text"
                    placeholder={isReadOnly(selectedUser, game.id) ? "✔️" : "x:x"}
                    value={game.score}
                    onChange={(e) => handleScoreChange(game.id, e.target.value)}
                    maxLength="3"
                    readOnly={isReadOnly(selectedUser, game.id)}
                    title={isReadOnly(selectedUser, game.id) ? "✔️" : ""}
                    disabled={gameStarted(game.date, game.kickoff)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            style={{
              backgroundColor: '#DC3545',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'inline-block',
              margin: '10px',
              fontSize: '14px',
              width: '60%',
              transition: 'background-color 0.3s',
            }}
            onClick={handleSubmit}
          >
            Prześlij
          </button>
        </div>
        {isDataSubmitted && Object.keys(submittedData).map((user) => (
          <ExpandableCard key={user} user={user} bets={submittedData[user]} results={results} />
        ))}
      </div>
    </div>
  );
};

export default Bets;
