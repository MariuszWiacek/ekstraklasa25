import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import week1Data from './gameData/week1.json';
import week2Data from './gameData/week2.json';
// Import other week data as needed

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

const weekData = [
  { id: 1, data: week1Data },
  { id: 2, data: week2Data },
  
];

const Bets = () => {
  const [games, setGames] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [missingBets, setMissingBets] = useState(false);
  const [currentWeekData, setCurrentWeekData] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
      }
    });

    const currentDate = new Date();
    const currentWeek = weekData.find(week => new Date(week.data.changeDate) > currentDate);

    if (currentWeek) {
      console.log("Current week data:", currentWeek.data); // Debugging
      setCurrentWeekData(currentWeek.data);
      setGames(currentWeek.data.games); // Set games here
      console.log("Games:", currentWeek.data.games); // Debugging
     

      const dbRef = firebase.database().ref(`submittedData/week${currentWeek.id}`);
      dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSubmittedData(data);
          setIsDataSubmitted(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (currentWeekData) {
      setGames(currentWeekData.games);
    }
  }, [currentWeekData]);

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
    const updatedGames = games.map((game) =>
      game.id === gameId
        ? { ...game, score: formattedScore, bet: autoDetectBetType(formattedScore) }
        : game
    );
    setGames(updatedGames);
  };

  const handleSubmit = () => {
    if (!username) {
      alert('Please enter your username.');
      return;
    }
    const hasMissingBets = games.some((game) => !game.score);
    if (hasMissingBets) {
      setMissingBets(true);
      alert('Please make a bet for all games before submitting.');
      return;
    }
    if (submittedData[username]) {
      alert('You have already submitted your bets for this round.');
      return;
    }
    const userBets = games
      .filter((game) => game.score)
      .map((game) => ({
        id: game.id,
        home: game.home,
        away: game.away,
        score: game.score,
        bet: autoDetectBetType(game.score),
      }));
    const updatedSubmittedData = { ...submittedData };
    updatedSubmittedData[username] = userBets;
    setSubmittedData(updatedSubmittedData);
    const dbRef = firebase.database().ref(`submittedData/week${currentWeekData.id}/${username}`);
    dbRef.set(userBets);
    setIsDataSubmitted(true);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    localStorage.setItem('username', value);
  };

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px' }}>
      <p style={{ textAlign: 'left', color: 'white' }}>Current week: {currentWeekData ? currentWeekData.id : 'Loading...'}</p>
      <div style={{ textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <input
          style={{ margin: '1px' }}
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      {missingBets && (
        <div style={{ textAlign: 'center', color: 'red', fontSize: '16px', marginBottom: '10px' }}>
          Please make a bet for all games before submitting.
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
            <th style={{ borderBottom: '0.5px solid #444' }}>Home Team</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Away Team</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Result</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Your Bet</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Your Score</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} style={{ borderBottom: '0.5px solid #444' }}>
              <td style={{ color: 'white' }}>{game.home}</td>
              <td style={{ color: 'white' }}>{game.away}</td>
              <td style={{ color: 'red' }}>{game.result}</td>
              <td>
                <select value={game.bet} disabled>
                  <option value="1">1</option>
                  <option value="X">X</option>
                  <option value="2">2</option>
                </select>
              </td>
              <td>
                <input
                  style={{ width: '50px', color: 'red', textDecoration: 'bo' }}
                  type="text"
                  placeholder="1:1"
                  value={game.score}
                  onChange={(e) => handleScoreChange(game.id, e.target.value)}
                  maxLength="3"
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
          Submit
        </button>
      </div>
      {isDataSubmitted && (
        <div
          className="cards-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <div
            className="card"
            style={{
              backgroundColor: 'white',
              color: 'black',
              fontSize: '12px',
              padding: '10px',
              margin: '10px',
              borderRadius: '10px',
              textAlign: 'center',
              width: 'calc(100% - 20px)',
            }}
          >
            <h3 style={{ color: 'red' }}>Submitted Bets for Week {currentWeekData ? currentWeekData.id : 'Loading...'}</h3>
            {Object.keys(submittedData).map((user) => (
              <div key={user} style={{ marginBottom: '10px' }}>
                <h4 style={{ color: 'blue' }}>{user}</h4>
                {submittedData[user].map((bet, index) => (
                  <div key={index}>
                    {`${bet.home} vs. ${bet.away}, Bet: `}
                    <span style={{ color: 'red' }}>{bet.bet}</span>
                    {`, Score: `}
                    <span style={{ color: 'red' }}>{bet.score}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bets;
