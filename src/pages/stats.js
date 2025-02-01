import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Firebase configuration
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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stats = () => {
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    // Fetch results
    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      setResults(snapshot.val() || {});
    });

    // Fetch submitted data
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
      const userStats = {
        user,
        chosenTeams: {},
        failureTeams: {},
        successTeams: {},
        maxPointsInOneKolejka: 0,
        kolejki: [],
      };

      // Process each bet
      bets.forEach(([id, bet]) => {
        const result = results[id];
        if (!result || !bet.home || !bet.away || !bet.bet) return;

        const { home: homeTeam, away: awayTeam, bet: betOutcome, homeScore, awayScore } = bet;
        const [actualHomeScore, actualAwayScore] = result.split(':').map(Number);
        const actualOutcome = actualHomeScore === actualAwayScore ? 'X' : actualHomeScore > actualAwayScore ? '1' : '2';

        // Points Calculation
        let points = 0;

        // Exact Score Calculation: 3 points for exact match
        if (homeScore === actualHomeScore && awayScore === actualAwayScore) {
          points = 3;
        } 
        // Correct Outcome Calculation: 1 point for correct win/loss/draw prediction
        else if (betOutcome === actualOutcome) {
          points = 1;
        }

        // Track statistics for user
        const kolejkaId = Math.floor((id - 1) / 9);
        if (!userStats.kolejki[kolejkaId]) {
          userStats.kolejki[kolejkaId] = { points: 0 };
        }
        userStats.kolejki[kolejkaId].points += points;
        userStats.maxPointsInOneKolejka = Math.max(userStats.maxPointsInOneKolejka, userStats.kolejki[kolejkaId].points);

        // Ignore draws for chosen teams
        if (betOutcome !== 'X') {
          const chosenTeam = betOutcome === '1' ? homeTeam : awayTeam;
          userStats.chosenTeams[chosenTeam] = (userStats.chosenTeams[chosenTeam] || 0) + 1;

          // Track success and failure
          if (actualOutcome === betOutcome) {
            userStats.successTeams[chosenTeam] = (userStats.successTeams[chosenTeam] || 0) + 1;
          } else {
            userStats.failureTeams[chosenTeam] = (userStats.failureTeams[chosenTeam] || 0) + 1;
          }
        }
      });

      // Find most chosen team
      const mostChosenTeams = findMostFrequent(userStats.chosenTeams);
      const mostFailureTeams = findMostFrequent(userStats.failureTeams);
      const mostSuccessTeams = findMostFrequent(userStats.successTeams);

      userStats.mostChosenTeams = mostChosenTeams.length ? mostChosenTeams : ['------'];
      userStats.mostFailureTeams = mostFailureTeams.length ? mostFailureTeams : ['------'];
      userStats.mostSuccessTeams = mostSuccessTeams.length ? mostSuccessTeams : ['------'];

      userStatsData.push(userStats);
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  // Function to find the most frequent teams
  const findMostFrequent = (teams) => {
    const maxCount = Math.max(...Object.values(teams), 0);
    return Object.keys(teams).filter(team => teams[team] === maxCount);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Użytkowników</h2>
          <hr />
          {userStats.length > 0 ? userStats.map((stats, idx) => (
            <div key={idx}>
              <h3>{stats.user}</h3>
              <hr />
              <p><strong>⚽ Najczęściej Wybierane Drużyny: </strong> {stats.mostChosenTeams.join(', ')}</p>
              <p><strong>👎🏿 Najbardziej Zawodzące Drużyny: </strong> {stats.mostFailureTeams.join(', ')}</p>
              <p><strong>👍 Najbardziej Punktujące Drużyny: </strong> {stats.mostSuccessTeams.join(', ')}</p>
              
              
              <hr />
            </div>
          )) : <p>------</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;