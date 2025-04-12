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
  const [generalStats, setGeneralStats] = useState({
    mostChosenCorrectScore: '',
    mostMatchedCorrectScore: '',
    mostChosenCorrectScoreCount: 0,
    mostMatchedCorrectScoreCount: 0,
    mostDraws: 0,
    userWithMostDraws: '',
    zapominalskiUser: '',  // Added zapominalski user
    zapominalskiCount: 0,  // Added zapominalski count
  });
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
    const scoreCount = {}; // To track most chosen scores
    const matchedScores = {}; // To track matched scores for general stats
    const drawCount = {}; // To track the number of correct draw predictions
    const userDraws = {}; // To track the number of draws for each user
    const missingPredictions = {}; // To track the number of "missing" predictions (with ':::')
    
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
        if (!result || !bet.home || !bet.away || !bet.bet || !bet.score) return;

        const { home: homeTeam, away: awayTeam, bet: betOutcome, score: betScore } = bet;
        const [actualHomeScore, actualAwayScore] = result.split(':').map(Number);
        const [betHomeScore, betAwayScore] = betScore.split(':').map(Number);
        const actualOutcome = actualHomeScore === actualAwayScore ? 'X' : actualHomeScore > actualAwayScore ? '1' : '2';

        // Points Calculation
        let points = 0;

        // Exact Score Calculation: 3 points for exact match
        if (betHomeScore === actualHomeScore && betAwayScore === actualAwayScore) {
          points = 3;
        } 
        // Correct Outcome Calculation: 1 point for correct win/loss/draw prediction
        else if (betOutcome === actualOutcome) {
          points = 1;
        }

        // Track statistics for user
        const kolejkaId = bet.kolejkaId;  // Updated based on bet.kolejkaId
        if (!userStats.kolejki[kolejkaId]) {
          userStats.kolejki[kolejkaId] = { points: 0 };
        }
        userStats.kolejki[kolejkaId].points += points;
        userStats.maxPointsInOneKolejka = Math.max(userStats.maxPointsInOneKolejka, userStats.kolejki[kolejkaId].points);

        // Track missing predictions (with ':::')
        if (betScore === ':::') {
          missingPredictions[user] = (missingPredictions[user] || 0) + 1;
        }

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

        // Track draws: if the actual outcome is a draw, check if the user predicted it as a draw
        if (actualOutcome === 'X') {
          if (betOutcome === 'X') {
            drawCount[user] = (drawCount[user] || 0) + 1;
          }
        }

        // Track scores for general stats
        scoreCount[betScore] = (scoreCount[betScore] || 0) + 1;
        if (betScore === result) {
          matchedScores[betScore] = (matchedScores[betScore] || 0) + 1;
        }
      });

      // Prepare data for the chart
      const kolejkaLabels = Array.from({ length: 16 }, (_, idx) => `Kolejka ${idx + 1}`);

      const pointsData = userStats.kolejki.slice(1, 16).map(kolejka => Math.min(Math.max(kolejka.points, 1), 27)); // Ensure points are between 1 and 27

      // Chart data
      const chartData = {
        labels: kolejkaLabels,
        datasets: [
          {
            label: 'Pkt/kolejke',
            data: pointsData,
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            tension: 1,
            backgroundColor: 'yellow'
          },
        ],
      };

      userStats.chartData = chartData;

      // Find most chosen team
      const mostChosenTeams = findMostFrequent(userStats.chosenTeams);
      const mostFailureTeams = findMostFrequent(userStats.failureTeams);
      const mostSuccessTeams = findMostFrequent(userStats.successTeams);

      userStats.mostChosenTeams = mostChosenTeams.length ? mostChosenTeams : ['------'];
      userStats.mostFailureTeams = mostFailureTeams.length ? mostFailureTeams : ['------'];
      userStats.mostSuccessTeams = mostSuccessTeams.length ? mostSuccessTeams : ['------'];

      userStatsData.push(userStats);
    });

    // Find the most chosen and matched scores
    const mostChosenCorrectScore = findMostFrequent(scoreCount);
    const mostMatchedCorrectScore = findMostFrequent(matchedScores);

    // Find the user with the most ":::"
    const zapominalskiUser = Object.keys(missingPredictions).reduce((a, b) =>
      missingPredictions[a] > missingPredictions[b] ? a : b, null);

    const zapominalskiCount = missingPredictions[zapominalskiUser] || 0;

    setGeneralStats({
      mostChosenCorrectScore: mostChosenCorrectScore.length ? mostChosenCorrectScore[0] : '------',
      mostMatchedCorrectScore: mostMatchedCorrectScore.length ? mostMatchedCorrectScore[0] : '------',
      mostChosenCorrectScoreCount: mostChosenCorrectScore.length ? scoreCount[mostChosenCorrectScore[0]] : 0,
      mostMatchedCorrectScoreCount: mostMatchedCorrectScore.length ? matchedScores[mostMatchedCorrectScore[0]] : 0,
      mostDraws: Math.max(...Object.values(drawCount), 0),
      userWithMostDraws: Object.keys(drawCount).find(user => drawCount[user] === Math.max(...Object.values(drawCount))) || '------',
      zapominalskiUser,  // Set zapominalski user
      zapominalskiCount,  // Set zapominalski count
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  // Function to find the most frequent items
  const findMostFrequent = (items) => {
    const maxCount = Math.max(...Object.values(items), 0);
    return Object.keys(items).filter(item => items[item] === maxCount);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Ogólne</h2>
          <hr />
          <p><strong>🏆 Najczęściej wybierany wynik: </strong> {generalStats.mostChosenCorrectScore} ({generalStats.mostChosenCorrectScoreCount} razy)</p>
          <p><strong>💥 Najczęściej trafiony wynik: </strong> {generalStats.mostMatchedCorrectScore} ({generalStats.mostMatchedCorrectScoreCount} razy)</p>
          <p><strong>🔴 Najwięcej trafionych remisów: </strong> {generalStats.mostDraws} (Użytkownik: {generalStats.userWithMostDraws})</p>
          <p><strong>🤯 Największy zapominalski: </strong> {generalStats.zapominalskiUser} ({generalStats.zapominalskiCount} razy)</p>  {/* Display zapominalski user */}
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Użytkowników</h2>
          <hr />
          {userStats.length > 0 ? userStats.map((stats, idx) => (
            <div key={idx}>
              <h3>{stats.user}</h3>
              <hr />
              <p><strong>⚽ Najczęściej obstawiane drużyny: </strong> {stats.mostChosenTeams.join(', ')}</p>
              <p><strong>👎🏿 Największe rozczarowania: </strong> {stats.mostFailureTeams.join(', ')}</p>
              <p><strong>👍 Najczęściej trafione zwycięstwa: </strong> {stats.mostSuccessTeams.join(', ')}</p>
              
              {/* Render Line chart for user */}
              <div style={{ width: 'max', height: '300px', backgroundColor: '#f0f8ff' }}>
                <Line data={stats.chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { color: '#e0e0e0' },
                      },
                      y: {
                        min: 1,
                        max: 27,
                        grid: { color: '#e0e0e0' },
                        ticks: { stepSize: 1 }
                      },
                    },
                  }} />
              </div>

              <hr />
            </div>
          )) : <p>------</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;
