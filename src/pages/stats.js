import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2'; // Importing Line chart from Chart.js
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
  const [teamStats, setTeamStats] = useState({
    teamChosenCount: {},
    teamSuccessCount: {},
    teamFailureCount: {},
  });
  const [userStats, setUserStats] = useState([]);
  const [kolejkaPoints, setKolejkaPoints] = useState([]); // Points for each round
  const [hallOfFame, setHallOfFame] = useState([]); // Hall of Fame data

  useEffect(() => {
    // Fetch results
    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      setResults(data || {});
    });

    // Fetch submitted data
    const submittedDataRef = ref(database, 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      const data = snapshot.val();
      setSubmittedData(data || {});
    });
  }, []);

  useEffect(() => {
    if (!submittedData || !results) return;

    const teamChosenCount = {};
    const teamSuccessCount = {};
    const teamFailureCount = {};
    const userStatsData = [];
    const kolejkaPointsData = [];
    const hallOfFameData = []; // To store Hall of Fame data

    // Process submitted data
    Object.keys(submittedData).forEach((user) => {
      const bets = Object.entries(submittedData[user] || {});
      const userStats = {
        user,
        chosenTeams: {},
        mostChosenTeam: '',  // Track most chosen team for this user
        mostDisappointingTeam: '',
        mostSuccessfulTeam: '',
        maxPointsInOneKolejka: 0,
        kolejki: [],
      };

      const teamFailureCountUser = {}; // To track failures per team
      const teamSuccessCountUser = {}; // To track successes per team

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

        // Track statistics for each user bet
        if (betOutcome === '1') {
          userStats.chosenTeams[homeTeam] = (userStats.chosenTeams[homeTeam] || 0) + 1;
          if (actualOutcome === '1') {
            teamSuccessCountUser[homeTeam] = (teamSuccessCountUser[homeTeam] || 0) + 1;
          } else {
            teamFailureCountUser[homeTeam] = (teamFailureCountUser[homeTeam] || 0) + 1;
          }
        } else if (betOutcome === '2') {
          userStats.chosenTeams[awayTeam] = (userStats.chosenTeams[awayTeam] || 0) + 1;
          if (actualOutcome === '2') {
            teamSuccessCountUser[awayTeam] = (teamSuccessCountUser[awayTeam] || 0) + 1;
          } else {
            teamFailureCountUser[awayTeam] = (teamFailureCountUser[awayTeam] || 0) + 1;
          }
        }

        // Collect data for user stats by Kolejka
        const kolejkaId = Math.floor((id - 1) / 9); // assuming each kolejka has 9 games
        if (!userStats.kolejki[kolejkaId]) {
          userStats.kolejki[kolejkaId] = { points: 0 };
        }

        const userKolejka = userStats.kolejki[kolejkaId];
        const isSuccess = betOutcome === actualOutcome;
        userKolejka.points += isSuccess ? 3 : 0; // 3 points for correct outcome

        // Update max points in one round
        userStats.maxPointsInOneKolejka = Math.max(userStats.maxPointsInOneKolejka, userKolejka.points);
      });

      // Find the most chosen team for the user
      const mostChosenTeam = Object.entries(userStats.chosenTeams)
        .sort((a, b) => b[1] - a[1])[0]?.[0]; // Get team with most selections
      userStats.mostChosenTeam = mostChosenTeam || '------';

      // Find the most disappointing team: the one most chosen but least successful
      const mostDisappointingTeam = Object.entries(userStats.chosenTeams)
        .sort((a, b) => {
          const failuresA = teamFailureCountUser[a[0]] || 0;
          const failuresB = teamFailureCountUser[b[0]] || 0;
          return failuresB - failuresA; // Sort by most failures
        })[0]?.[0]; // Most disappointing team
      userStats.mostDisappointingTeam = mostDisappointingTeam || '------';

      // Find the most successful team: the team with the highest success rate
      const mostSuccessfulTeam = Object.entries(userStats.chosenTeams)
        .sort((a, b) => (teamSuccessCountUser[b[0]] || 0) - (teamSuccessCountUser[a[0]] || 0))[0]?.[0]; // Most successful team
      userStats.mostSuccessfulTeam = mostSuccessfulTeam || '------';

      userStatsData.push(userStats);

      // Add user to Hall of Fame if they achieved the highest points
      if (userStats.maxPointsInOneKolejka >= 20) {
        hallOfFameData.push(userStats); // Add to Hall of Fame if they reached a certain threshold
      }
    });

    setUserStats(userStatsData);
    setTeamStats({ teamChosenCount, teamSuccessCount, teamFailureCount });
    setKolejkaPoints(kolejkaPointsData); // Save points per kolejka
    setHallOfFame(hallOfFameData); // Set Hall of Fame data
  }, [submittedData, results]);

  const { teamChosenCount, teamSuccessCount, teamFailureCount } = teamStats;

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
                  </div><hr />
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
