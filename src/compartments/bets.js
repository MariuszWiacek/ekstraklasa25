import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import gameData from './gameData.json';

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

const Bets = () => {
  const [games, setGames] = useState(gameData);
  const [username, setUsername] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [missingBets, setMissingBets] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
      }
    });

    const dbRef = firebase.database().ref('submittedData');
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedData(data);
        setIsDataSubmitted(true);
      }
    });
  }, []);

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
    // Check for missing bets
    const hasMissingBets = games.some((game) => !game.score);

    if (hasMissingBets) {
      setMissingBets(true);
      alert('Please make a bet for all games before submitting.');
      return;
    }

    // Check if the user has already submitted bets for the current round
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

    const dbRef = firebase.database().ref('submittedData');
    dbRef.set(updatedSubmittedData);
    setIsDataSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Aktualna kolejka:</h2>
      <p style={{ textAlign: 'center' }}>11/11/2023</p>
      <div style={{ textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <input
          style={{ margin: '10px' }}
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
              <td>{game.home}</td>
              <td>{game.away}</td>
              <td>{game.result}</td>
              <td>
                <select
                  value={game.bet}
                  onChange={(e) => handleScoreChange(game.id, game.score)}
                >
                  <option value="1">1</option>
                  <option value="X">X</option>
                  <option value="2">2</option>
                </select>
              </td>
              <td>
                <input
                  style={{ width: '50px' }}
                  type="text"
                  placeholder="1:1"
                  value={game.score}
                  onChange={(e) => handleScoreChange(game.id, e.target.value)}
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
      {isDataSubmitted &&
        Object.keys(submittedData).map((user) => (
          <div key={user} className="card" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'aliceblue', fontSize: '10px', padding: '10px', margin: '10px', borderRadius: '10px', textAlign: 'center', width: '100%' }}>
            <h3 style={{ color: 'red' }}>{user}: </h3>
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
  );
};

export default Bets;
