import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';
import { calculatePoints } from '../components/calculatePoints';

// Firebase Configuration
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
  const [userStats, setUserStats] = useState([]);

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
    if (!submittedData || !results) return;

    const userStatsData = Object.keys(submittedData).map((user) => {
      const bets = Object.entries(submittedData[user] || {}).map(([id, bet]) => ({
        ...bet,
        id,
      }));

      const pointsData = calculatePoints(bets, results);
      const teamChosenCount = {};
      const teamFailureCount = {};
      const teamPointCount = {};
      const kolejkaPoints = {};
      let maxPointsInOneKolejka = 0;

      bets.forEach((bet) => {
        const gameResult = results[bet.id];
        if (!gameResult || !bet.kolejkaId || !bet.bet) return;

        const { home, away, kolejkaId } = bet;
        let chosenTeam = null;
        let pointsEarned = pointsData[bet.id] || 0;

        if (bet.bet.includes(':')) {
          const [betHomeScore, betAwayScore] = bet.bet.split(':').map(Number);
          chosenTeam = betHomeScore > betAwayScore ? home : betHomeScore < betAwayScore ? away : null;
        }

        if (chosenTeam) {
          teamChosenCount[chosenTeam] = (teamChosenCount[chosenTeam] || 0) + 1;

          if (pointsEarned === 0) {
            teamFailureCount[chosenTeam] = (teamFailureCount[chosenTeam] || 0) + 1;
          } else {
            teamPointCount[chosenTeam] = (teamPointCount[chosenTeam] || 0) + pointsEarned;
          }

          kolejkaPoints[kolejkaId] = (kolejkaPoints[kolejkaId] || 0) + pointsEarned;
          maxPointsInOneKolejka = Math.max(maxPointsInOneKolejka, kolejkaPoints[kolejkaId]);
        }
      });

      return {
        user,
        mostChosenTeams: getTopTeams(teamChosenCount),
        mostDisappointingTeams: getTopTeams(teamFailureCount),
        mostSuccessfulTeams: getTopTeams(teamPointCount, true),
        maxPointsInOneKolejka,
      };
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  // Helper function to get teams with max count
  const getTopTeams = (teamData, allowEmpty = false) => {
    if (Object.keys(teamData).length === 0) return allowEmpty ? [] : ['------'];
    const maxCount = Math.max(...Object.values(teamData));
    return Object.keys(teamData).filter((team) => teamData[team] === maxCount);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Użytkowników</h2>
          <hr />
          {userStats.length > 0 ? (
            userStats.map((userStats, idx) => (
              <div key={idx}>
                <h3>{userStats.user}</h3>
                <hr />
                <p><strong>⚽ Najczęściej Wybierana Drużyna: </strong> {userStats.mostChosenTeams.join(', ')}</p>
                <p><strong>👎🏿 Najbardziej Zawodząca Drużyna: </strong> {userStats.mostDisappointingTeams.join(', ')}</p>
                <p><strong>👍 Najbardziej Punktująca Drużyna: </strong> {userStats.mostSuccessfulTeams.join(', ')}</p>
                <p><strong>🎖️ Najwięcej Punktów w Jednej Kolejce: </strong> {userStats.maxPointsInOneKolejka}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>------</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;