import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { calculatePoints } from '../components/calculatePoints';

const firebaseConfig = {
  apiKey: "AIzaSyCGVW31sTa6Giafh0-JTsnJ9ghybYEsJvE",
  authDomain: "wiosna25-66ab3.firebaseapp.com",
  databaseURL: "https://wiosna25-66ab3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wiosna25-66ab3",
  storageBucket: "wiosna25-66ab3.firebasestorage.app",
  messagingSenderId: "29219460780",
  appId: "1:29219460780:web:de984a281514ab6cdc7109",
  measurementId: "G-8Z3CMMQKE8"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const Stats = () => {
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [teamStats, setTeamStats] = useState({});

  useEffect(() => {
    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      setResults(snapshot.val() || {});
    });

    const submittedDataRef = ref(database, 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      setSubmittedData(snapshot.val() || {});
    });
  }, []);

  useEffect(() => {
    const teamPoints = {};

    Object.keys(submittedData).forEach((user) => {
      const bets = Object.entries(submittedData[user]).map(([id, bet]) => ({
        ...bet,
        id,
      }));

      bets.forEach((bet) => {
        const game = results[bet.id];
        if (game && game.score) {
          const { points } = calculatePoints([bet], results);

          // Count points for both home and away teams
          if (!teamPoints[game.home]) teamPoints[game.home] = 0;
          if (!teamPoints[game.away]) teamPoints[game.away] = 0;

          teamPoints[game.home] += points;
          teamPoints[game.away] += points;
        }
      });
    });

    setTeamStats(teamPoints);
  }, [submittedData, results]);

  const mostScoringTeams = Object.entries(teamStats)
    .sort(([, a], [, b]) => b - a)
    .filter(([, points]) => points > 0);

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#212529ab', color: 'white' }}>
      <h3>📊 Statystyki</h3>
      <hr style={{ color: 'white' }} />

      <h4>🏆 Najbardziej Punktująca Drużyna:</h4>
      {mostScoringTeams.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mostScoringTeams.map(([team, points]) => (
            <li key={team} style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              {team}: {points} pkt
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak punktów</p>
      )}
    </div>
  );
};

export default Stats;