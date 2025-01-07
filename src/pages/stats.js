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
      const bets = Object.entries(submittedData[user]);
      const userStats = {
        user,
        chosenTeams: {},
        kolejki: [],
        mostChosenTeam: '',
        mostDisappointingTeam: '',
        mostSuccessfulTeam: '',
        maxPointsInOneKolejka: 0,
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

        // Update team stats
        const updateTeamStats = (teamName, isSuccess) => {
          if (!teamChosenCount[teamName]) teamChosenCount[teamName] = 0;
          teamChosenCount[teamName]++;

          if (isSuccess) {
            if (!teamSuccessCount[teamName]) teamSuccessCount[teamName] = 0;
            teamSuccessCount[teamName]++;
          } else {
            if (!teamFailureCount[teamName]) teamFailureCount[teamName] = 0;
            teamFailureCount[teamName]++;
          }
        };

        // Track statistics for each user bet
        if (betOutcome === '1') {
          updateTeamStats(homeTeam, actualOutcome === '1');
        } else if (betOutcome === '2') {
          updateTeamStats(awayTeam, actualOutcome === '2');
        } else if (betOutcome === 'X') {
          updateTeamStats(homeTeam, actualOutcome === 'X');
          updateTeamStats(awayTeam, actualOutcome === 'X');
        }

        // Collect data for user stats by Kolejka
        const kolejkaId = Math.floor((id - 1) / 9); // assuming each kolejka has 9 games
        if (!userStats.kolejki[kolejkaId]) {
          userStats.kolejki[kolejkaId] = {
            points: 0,
          };
        }

        const userKolejka = userStats.kolejki[kolejkaId];
        const isSuccess = betOutcome === actualOutcome;
        userKolejka.points += isSuccess ? 3 : 0; // 3 points for correct outcome

        // Update max points in one round
        userStats.maxPointsInOneKolejka = Math.max(userStats.maxPointsInOneKolejka, userKolejka.points);

        // Track the most chosen team for each user
        userStats.chosenTeams[homeTeam] = (userStats.chosenTeams[homeTeam] || 0) + 1;
        userStats.chosenTeams[awayTeam] = (userStats.chosenTeams[awayTeam] || 0) + 1;
      });

      // Find the most chosen, most disappointing, and most successful teams
      const mostChosenTeam = Object.entries(userStats.chosenTeams)
        .sort((a, b) => b[1] - a[1])[0][0]; // Get team with most selections
      userStats.mostChosenTeam = mostChosenTeam;

      // Find most disappointing team: the one most chosen but least successful
      const mostDisappointingTeam = Object.entries(userStats.chosenTeams)
        .sort((a, b) => (teamFailureCount[b[0]] || 0) - (teamFailureCount[a[0]] || 0))[0][0]; // Most disappointing team
      userStats.mostDisappointingTeam = mostDisappointingTeam;

      // Find the most successful team: the team with the highest success rate
      const mostSuccessfulTeam = Object.entries(userStats.chosenTeams)
        .sort((a, b) => (teamSuccessCount[b[0]] || 0) - (teamSuccessCount[a[0]] || 0))[0][0]; // Most successful team
      userStats.mostSuccessfulTeam = mostSuccessfulTeam;

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
        {/* Hall of Fame Section */}
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Hall of Fame</h2>
          <hr />
          {hallOfFame.length > 0 ? (
            hallOfFame.map((userStats, idx) => (
              <div key={idx}>
                <h3>{userStats.user}</h3>
                <p><strong>⚽ Najczęściej Wybierana Drużyna:   </strong>  
                  {userStats.mostChosenTeam} 
                </p>
                <p><strong>👎🏿 Najbardziej Zawodząca Drużyna:   </strong> 
                  {userStats.mostDisappointingTeam || '------'} 
                </p>
                <p><strong> 👍 Najbardziej Punktująca Drużyna:    </strong> 
                  {userStats.mostSuccessfulTeam || '------'} 
                </p>
                <p><strong>🎖️ Najwięcej Punktów w Jednej Kolejce:   </strong> 
                  {userStats.maxPointsInOneKolejka}
                </p>
                <p><strong>🎖️ Trofea:   </strong> 
                  {userStats.maxPointsInOneKolejka}
                </p>
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
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>------</p>
          )}
        </Col>

        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki Użytkowników</h2>
          <hr />
          <div>
            <hr />
            {userStats.length > 0 ? (
              userStats.map((userStats, idx) => (
                <div key={idx}>
                  <h3>{userStats.user}</h3>
                  <p><strong>⚽ Najczęściej Wybierana Drużyna:   </strong>  
                    {userStats.mostChosenTeam} 
                  </p>
                  <p><strong>👎🏿 Najbardziej Zawodząca Drużyna:   </strong> 
                    {userStats.mostDisappointingTeam || '------'} 
                  </p>
                  <p><strong> 👍 Najbardziej Punktująca Drużyna:    </strong> 
                    {userStats.mostSuccessfulTeam || '------'} 
                  </p>
                  <p><strong>🎖️ Najwięcej Punktów w Jednej Kolejce:   </strong> 
                    {userStats.maxPointsInOneKolejka}
                  </p>
                  <p><strong>🎖️ Trofea:   </strong> 
                    {userStats.maxPointsInOneKolejka}
                  </p>
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
