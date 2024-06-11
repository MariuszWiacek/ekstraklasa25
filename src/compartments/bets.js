import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import usersData from './gameData/users.json';
import gameData from './gameData/data.json';
import { getDatabase, ref, onValue, set } from 'firebase/database';
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
  const [selectedUser, setSelectedUser] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [missingBets, setMissingBets] = useState(false);
  const [results, setResults] = useState({}); // State to hold the results

 

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

    const resultsRef = ref(database, 'results'); // Reference to results in Firebase
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResults(data);
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

    const updatedGames = games.map((game, index) =>
      index === gameId
        ? { ...game, score: formattedScore, bet: autoDetectBetType(formattedScore) }
        : game
    );
    setGames(updatedGames);
  };

  const handleSubmit = () => {
    if (!selectedUser) {
      alert('Please select a user.');
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
        alert('You have already submitted your bets for all available games.');
        return;
      }
  
      set(ref(database, `submittedData/${selectedUser}`), { ...userSubmittedBets, ...newBetsToSubmit })
        .then(() => {
          setSubmittedData({ ...submittedData, [selectedUser]: { ...userSubmittedBets, ...newBetsToSubmit } });
          setIsDataSubmitted(true);
          alert('Results submitted successfully!');
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
          alert('An error occurred while submitting your bets. Please try again.');
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
          alert('Results submitted successfully!');
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
          alert('An error occurred while submitting your bets. Please try again.');
        });
    }
  };
  

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>KOLEJKA:</h2>
      <p style={{ textAlign: 'center' }}>22/03/24</p>
      <div style={{ textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <select
          style={{ margin: '1px' }}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Twój login</option>
          {Object.keys(usersData).map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
      </div>
      
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
            <th style={{ borderBottom: '0.5px solid #444' }}>Godzina</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Gospodarz</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Gość</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Wynik</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Twój Zakład</th>
            <th style={{ borderBottom: '0.5px solid #444' }}>Twój Wynik</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index} style={{ borderBottom: '0.5px solid #444', opacity: game.disabled ? '0.5' : '1', pointerEvents: game.disabled ? 'none' : 'auto' }}>
              <td>{game.date}</td> {/* Wyświetlenie daty */}
              <td>{game.kickoff}</td> {/* Wyświetlenie godziny */}
              <td>{game.home}</td>
              <td>{game.away}</td>
              <td>{results[index]}</td> {/* Wyświetlenie wyniku */}
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
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  maxLength="3"
                  disabled={submittedData[selectedUser] && submittedData[selectedUser][index]}
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
      </div>
      {isDataSubmitted &&
      Object.keys(submittedData).map((user) => (
        <div key={user} className="paper-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '20px', margin: '10px', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', fontFamily: 'PenFont', fontSize: '16px', color: 'black' }}>
          <h3 style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{user}: </h3>
          {Object.values(submittedData[user]).map((bet, index) => (
            <div key={index} style={{ marginBottom: '5px', textAlign: 'center' }}>
              {`${bet.home} vs. ${bet.away}, Bet: `}
              <span style={{ color: 'red', fontWeight: 'bold' }}>{bet.bet}</span>
              {`, Score: `}
              <span style={{ color: 'red', fontWeight: 'bold' }}>{bet.score}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Bets;
