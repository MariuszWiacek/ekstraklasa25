import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stats = () => {
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    // Fetch match results
    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      setResults(snapshot.val() || {});
    });

    // Fetch user predictions
    const submittedDataRef = ref(database, 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      setSubmittedData(snapshot.val() || {});
    });
  }, []);

  useEffect(() => {
    if (!submittedData || !results) return;

    const userStatsData = [];

    Object.keys(submittedData).forEach((user) => {
      const bets = Object.entries(submittedData[user] || {});
      const teamChosenCount = {};
      const teamFailureCount = {};
      const teamPointCount = {};
      let kolejkaPoints = {}; // Track points per kolejka
      let maxPointsInOneKolejka = 0;

      bets.forEach(([id, bet]) => {
        const result = results[id];
        if (!result) return;

        const [homeScore, awayScore] = result.split(':').map(Number);
        const actualOutcome = homeScore === awayScore ? 'X' : homeScore > awayScore ? '1' : '2';

        const { home, away, bet: betOutcome } = bet;
        let chosenTeam = null;
        let pointsEarned = 0;

        if (betOutcome === '1') {
          chosenTeam = home;
        } else if (betOutcome === '2') {
          chosenTeam = away;
        }

        if (chosenTeam) {
          teamChosenCount[chosenTeam] = (teamChosenCount[chosenTeam] || 0) + 1;

          if (betOutcome === actualOutcome) {
            pointsEarned = 3; // Correct match result
          } else if (actualOutcome === 'X') {
            pointsEarned = 1; // Draw
            teamFailureCount[chosenTeam] = (teamFailureCount[chosenTeam] || 0) + 1;
          } else {
            teamFailureCount[chosenTeam] = (teamFailureCount[chosenTeam] || 0) + 1;
          }

          teamPointCount[chosenTeam] = (teamPointCount[chosenTeam] || 0) + pointsEarned;

          // Track kolejka points
          const kolejkaId = Math.floor((id - 1) / 9);
          kolejkaPoints[kolejkaId] = (kolejkaPoints[kolejkaId] || 0) + pointsEarned;
          maxPointsInOneKolejka = Math.max(maxPointsInOneKolejka, kolejkaPoints[kolejkaId]);
        }
      });

      const mostChosenTeam = Object.entries(teamChosenCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '------';

      const mostDisappointingTeam = Object.entries(teamFailureCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '------';

      const mostSuccessfulTeam = Object.entries(teamPointCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '------';

      userStatsData.push({
        user,
        mostChosenTeam,
        mostDisappointingTeam,
        mostSuccessfulTeam,
        maxPointsInOneKolejka
      });
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Użytkowników</h2>
          <hr />
          <div>
            {userStats.length > 0 ? (
              userStats.map((userStats, idx) => (
                <div key={idx}>
                  <h3>{userStats.user}</h3>
                  <hr />
                  <p><strong>⚽ Najczęściej Wybierana Drużyna: </strong> {userStats.mostChosenTeam}</p>
                  <p><strong>👎🏿 Najbardziej Zawodząca Drużyna: </strong> {userStats.mostDisappointingTeam}</p>
                  <p><strong>👍 Najbardziej Punktująca Drużyna: </strong> {userStats.mostSuccessfulTeam}</p>
                  <p><strong>🎖️ Najwięcej Punktów w Jednej Kolejce: </strong> {userStats.maxPointsInOneKolejka}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>------</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;