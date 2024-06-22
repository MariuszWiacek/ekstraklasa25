import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import usersData from './gameData/users.json';
import gameData from './gameData/data.json';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import ExpandableCard from './expandableCard'; // Adjust the path as needed
import doboju from '../images/doboju.jpeg'

const firebaseConfig = {
  apiKey: "AIzaSyCKjpxvNMm3Cb-cA8cPskPY6ROPsg8XO4Q",
  authDomain: "bets-3887b.firebaseapp.com",
  databaseURL: "https://bets-3887b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bets-3887b",
  storageBucket: "bets-3887b.appspot.com",
  messagingSenderId: "446338011209",
  appId: "1:446338011209:web:bc4a33a19b763564992f98",
  measurementId: "G-W9EB371N7C"
};

firebase.initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

const Bets = () => {
  const [games, setGames] = useState(gameData);
  const [selectedUser, setSelectedUser] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [missingBets, setMissingBets] = useState(false);
  const [results, setResults] = useState({}); // State to hold the results
  const [timeRemaining, setTimeRemaining] = useState(''); // Define timeRemaining state

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
  }, []);

  const updateTimeRemaining = () => {
    // Calculate time remaining until next game in BST
    const now = new Date();
    console.log(now)

    const nextGame = games.find(game => new Date(`${game.date}T${game.kickoff}:00+02:00`) > now); // CEST is UTC+2

    if (nextGame) {
      const kickoffTimeCEST = new Date(`${nextGame.date}T${nextGame.kickoff}:00+02:00`); // CEST kickoff time
      const kickoffTimeBST = new Date(kickoffTimeCEST.getTime()); // Convert CEST kickoff time to BST by subtracting 1 hour
      const diff = kickoffTimeBST - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h :${minutes}min :${seconds}s`);
    }
  };

  useEffect(() => {
    updateTimeRemaining(); // Update time remaining when component mounts
  }, [games]); // Trigger update when games change

  useEffect(() => {
    const interval = setInterval(updateTimeRemaining, 1000); // Update time remaining every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Define isReadOnly function with index parameter
  const isReadOnly = (selectedUser, index) => {
    return submittedData[selectedUser] && submittedData[selectedUser][index];
  };

  const gameStarted = (gameDate, gameKickoff) => {
    // Convert current time to BST (UTC+1)
    const currentDateTime = new Date();
    const gameDateTimeCEST = new Date(`${gameDate}T${gameKickoff}:00+02:00`); // CEST game time
    return currentDateTime >= gameDateTimeCEST;
  };

  const handleUserChange = (e) => {
    const user = e.target.value;
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user);
    setGames(gameData.map(game => ({ ...game, score: '' }))); // Clear game scores
  };

  useEffect(() => {
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

    // Calculate time remaining until the first game
    const now = new Date();
    const nextGame = games.find(game => new Date(`${game.date} ${game.kickoff}`) > now);
    if (nextGame) {
      const kickoffTime = new Date(`${nextGame.date} ${nextGame.kickoff}`);
      const diff = kickoffTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h :${minutes}min :${seconds}s`);
    }
  }, [games, database]);

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

    const updatedGames = games.map((game, index) =>
      index === gameId
        ? { ...game, score: formattedScore, bet: autoDetectBetType(formattedScore) }
        : game
    );

    // Check if score is valid (contains numbers before and after the colon)
    const isValidScore = formattedScore.match(/^\d+:\d+$/);
    setGames(updatedGames.map((game, index) =>
      index === gameId
        ? { ...game, invalidScore: !isValidScore }
        : game
    ));
  };

  const handleSubmit = () => {
    if (!selectedUser) {
      alert('Please select a user.');
      return;
    }

    const invalidScores = games.some(game => game.invalidScore || game.score === '');

    if (invalidScores) {
      alert('Please enter valid scores for all games.');
      return;
    }

    const userSubmittedBets = submittedData[selectedUser];

    if (userSubmittedBets) {
      const alreadySubmittedGames = Object.keys(userSubmittedBets).map(Number);
      const alreadySubmittedIds = new Set(alreadySubmittedGames);

      const newBetsToSubmit = games.reduce((newBets, game, index) => {
        if (game.score && !alreadySubmittedIds.has(index)) {
          newBets[index] = {
            home: game.home,
            away: game.away,
            score: game.score,
            bet: autoDetectBetType(game.score),
          };
        }
        return newBets;
      }, {});

      if (Object.keys(newBetsToSubmit).length === 0) {
        alert("Już wysłałeś swoje zakłady na wszystkie dostępne gry.");
        return;
      }

      set(ref(database, `submittedData/${selectedUser}`), { ...userSubmittedBets, ...newBetsToSubmit })
        .then(() => {
          setSubmittedData({ ...submittedData, [selectedUser]: { ...userSubmittedBets, ...newBetsToSubmit } });
          setIsDataSubmitted(true);
          alert('Wyniki dodane prawidłowo!');
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
          alert('Podczas przesyłania Twoich zakładów wystąpił błąd. Proszę spróbuj ponownie');
        });
    } else {
      const userBetsObject = {};
      games.forEach((game, index) => {
        if (game.score) {
          userBetsObject[index] = {
            home: game.home,
            away: game.away,
            score: game.score,
            bet: autoDetectBetType(game.score),
          };
        }
      });

      set(ref(database, `submittedData/${selectedUser}`), userBetsObject)
        .then(() => {
          setSubmittedData({ ...submittedData, [selectedUser]: userBetsObject });
          setIsDataSubmitted(true);
          alert('Wyniki zostały pomyślnie przesłane!')
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
          alert('Wystąpił błąd podczas przesyłania Twoich zakładów. Spróbuj ponownie.');
        });
    }
    setGames(prevGames =>
      prevGames.map(game =>
        submittedData[selectedUser] && submittedData[selectedUser][game.id]
          ? { ...game, readOnly: true }
          : game
      )
    );
  };

  return (
    <div style={{}}>
      {timeRemaining && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p>Pozostały czas do kolejnego meczu: {timeRemaining}</p>
        </div>
      )}
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <select
          style={{ margin: '1px' }}
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="">Twój login</option>
          {Object.keys(usersData).map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
     
      {missingBets && (
        <div style={{ textAlign: 'center', color: 'red', fontSize: '16px', marginBottom: '10px' }}>
          Proszę dokonać zakładu dla wszystkich meczów przed zatwierdzeniem.
        </div>
      )}
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
            <th style={{ borderBottom: '0.5px solid #444' }}>h</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Gosp.</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Gość</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Wynik</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Twój Zakład</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Wpisz Wynik</th>
          </tr>
        </thead>
        <tbody>
        {games.map((game, index) => (
  <tr
    key={index}
    style={{
      borderBottom: '0.5px solid #444',
      opacity: game.disabled ? '0.5' : '1',
      pointerEvents: game.disabled ? 'none' : 'auto',
      backgroundColor: gameStarted(game.date, game.kickoff) ? '#214029ab' : 'transparent', // Change background color here
    }}
  >
    <td>{game.date}</td>
    <td>{game.kickoff}</td>
    <td>{game.home}</td>
    <td>{game.away}</td>
    <td>{results[index]}</td>
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
          backgroundColor: game.score ? (isReadOnly(selectedUser, index) ? 'transparent' : 'white') : 'white',
          cursor: isReadOnly(selectedUser, index) ? 'not-allowed' : 'text',
          color: 'red',
        }}
        type="text"
        placeholder={isReadOnly(selectedUser, index) ? "✔️" : "x:x"}
        value={game.score}
        onChange={(e) => handleScoreChange(index, e.target.value)}
        maxLength="3"
        readOnly={isReadOnly(selectedUser, index)}
        title={isReadOnly(selectedUser, index) ? "✔️" : ""}
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
            display: 'inlineblock',
            margin: '10px',
            fontSize: '14px',
            width: '60%',
            transition: 'backgroundcolor 0.3s',
          }}
          onClick={handleSubmit}
        >
          Zatwierdź
        </button>
      </div> </div>
      {isDataSubmitted && Object.keys(submittedData).map((user) => (
        <ExpandableCard key={user} user={user} bets={submittedData[user]} results={results} />
      ))}
    </div>
  );
};

export default Bets;
