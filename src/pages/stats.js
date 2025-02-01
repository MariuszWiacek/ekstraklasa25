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
  const [kolejkaPoints, setKolejkaPoints] = useState([]); // Points for each round

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
        maxPointsInOneKolejka: 0,
        kolejki: [],
      };

      // Track statistics for each bet
      bets.forEach(([id, bet]) => {
        const result = results[id];
        if (!result || (!bet.home && !bet.away)) {
          console.warn(`Missing result or home/away team for bet ID: ${id}`);
          return;
        }

        const { home: homeTeam, away: awayTeam, bet: betOutcome } = bet;
        const [homeScore, awayScore] = result.split(':').map(Number);
        const actualOutcome = homeScore === awayScore ? 'X' : homeScore > awayScore ? '1' : '2';

        // Points calculation: 3 for exact score, 1 for correct outcome
        let points = 0;
        if (homeScore === Number(bet.home) && awayScore === Number(bet.away)) {
          points = 3;  // Exact score match
        } else if (betOutcome === actualOutcome) {
          points = 1;  // Correct outcome, but not exact score
        }

        // Track points in each "kolejka"
        const kolejkaId = Math.floor((id - 1) / 9); // assuming each kolejka has 9 games
        if (!userStats.kolejki[kolejkaId]) {
          userStats.kolejki[kolejkaId] = { points: 0 };
        }
        userStats.kolejki[kolejkaId].points += points;

        // Track max points in one round
        userStats.maxPointsInOneKolejka = Math.max(userStats.maxPointsInOneKolejka, userStats.kolejki[kolejkaId].points);
      });

      userStatsData.push(userStats);
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  // Prepare data for chart
  const chartData = {
    labels: kolejkaPoints.map((_, index) => `Kolejka ${index + 1}`),
    datasets: [
      {
        label: 'Punkty w Kolejkach',
        data: kolejkaPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart data for each user
  const getUserChartData = (userKolejki) => {
    const userPoints = userKolejki.map(kolejka => kolejka.points);
    return {
      labels: userKolejki.map((_, index) => `Kolejka ${index + 1}`),
      datasets: [
        {
          label: 'Punkty użytkownika',
          data: userPoints,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
      ],
    };
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Użytkowników</h2>
          <hr />
          <div>
            <hr />
            {userStats.length > 0 ? (
              userStats.map((userStats, idx) => (
                <div key={idx}>
                  <h3>{userStats.user}</h3><hr></hr>
                  <p><strong>⚽ Najczęściej Wybierana Drużyna: </strong> {userStats.mostChosenTeam}</p>
                  <p><strong>👎🏿 Najbardziej Zawodząca Drużyna: </strong> {userStats.mostDisappointingTeam}</p>
                  <p><strong>👍 Najbardziej Punktująca Drużyna: </strong> {userStats.mostSuccessfulTeam}</p>
                  <p><strong>🎖️ Najwięcej Punktów w Jednej Kolejce: </strong> {userStats.maxPointsInOneKolejka}</p>
                  <div>
                    <Line 
                      data={getUserChartData(userStats.kolejki)} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              autoSkip: true,
                              maxTicksLimit: 5,
                            },
                          },
                          y: {
                            beginAtZero: false,
                            max: 27,
                          },
                        },
                      }} 
                      style={{ height: 'auto', width: '100%', backgroundColor: 'white', opacity: '0.8', color: 'red' }} 
                    />
                  </div><hr style={{color: 'white'}}></hr>
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