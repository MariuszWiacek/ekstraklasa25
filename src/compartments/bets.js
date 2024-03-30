import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import gameData from './gameData/data.json';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';



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
  const [username, setUsername] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [missingBets, setMissingBets] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
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
    // Check if the username is not inputted
    if (!username) {
      alert('Wprowadź nazwę użytkownika.'); // Display an alert in Polish
      return;
    }
  
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
  
    // Create an object to hold the user's bets
    const userBetsObject = {};
    games.forEach((game) => {
      if (game.score) {
        userBetsObject[game.id] = {
          home: game.home,
          away: game.away,
          score: game.score,
          bet: autoDetectBetType(game.score),
        };
      }
    });
  
    // Update Firebase database with the user's bets
    firebase.database().ref('submittedData').child(username).set(userBetsObject)
      .then(() => {
        // Update local state to indicate data submission
        setSubmittedData({ ...submittedData, [username]: userBetsObject });
        setIsDataSubmitted(true);
      })
      .catch((error) => {
        // Handle error if data submission fails
        console.error('Error submitting data:', error);
        alert('An error occurred while submitting your bets. Please try again.');
      });
  };

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Current round:</h2>
      <p style={{ textAlign: 'center' }}>22/03/24</p>
      <div style={{ textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <input
          style={{ margin: '1px' }}
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
              <select value={game.bet} disabled>
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
                maxLength="3" // Limit the input length to 3 characters
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
        <div key={user} className="paper-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '20px', margin: '10px', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', fontFamily: 'PenFont', fontSize: '16px', color: 'black' }}>
          {/* User header */}
          <h3 style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{user}: </h3>
          {/* Display user bets */}
          {Array.isArray(submittedData[user]) ? (
            submittedData[user].map((bet, index) => (
              <div key={index} style={{ marginBottom: '5px', textAlign: 'center' }}>
                {`${bet.home} vs. ${bet.away}, Bet: `}
                <span style={{ color: 'red', fontWeight: 'bold' }}>{bet.bet}</span>
                {`, Score: `}
                
                <span style={{ color: 'red', fontWeight: 'bold' }}>{bet.score}</span>
              </div>
              
            ))
          ) : (
            <div style={{ marginBottom: '5px', textAlign: 'center' }}>
              {`${submittedData[user].home} vs. ${submittedData[user].away}, Bet: `}
              <span style={{ color: 'red', fontWeight: 'bold' }}>{submittedData[user].bet}</span>
              {`, Score: `}
              <span style={{ color: 'red', fontWeight: 'bold' }}>{submittedData[user].score}</span>
            </div>
            
            
          )}
          
        </div>
      ))}
    </div>
  );
};

export default Bets;