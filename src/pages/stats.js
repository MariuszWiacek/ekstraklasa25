import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';

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

    const userStatsData = [];

    Object.keys(submittedData).forEach((user) => {
      const bets = Object.entries(submittedData[user] || {});
      const teamChosenCount = {}; // For "Najczęściej wybierana"
      const teamFailureCount = {}; // For "Najczęściej zawodząca"
      const teamPointCount = {}; // For "Najczęściej punktująca"

      bets.forEach(([id, bet]) => {
        const result = results[id];
        if (!result || !bet.kolejkaId || !bet.bet) return;

        const [homeScore, awayScore] = result.split(':').map(Number);
        const [betHomeScore, betAwayScore] = bet.bet.split(':').map(Number);

        const actualOutcome = homeScore === awayScore ? 'X' : homeScore > awayScore ? '1' : '2';
        const betOutcome = betHomeScore === betAwayScore ? 'X' : betHomeScore > betAwayScore ? '1' : '2';

        const { home, away } = bet;
        let chosenTeam = null;
        let pointsEarned = 0;

        // Assign chosen team unless the user bet a draw (X)
        if (betOutcome === '1') chosenTeam = home;
        else if (betOutcome === '2') chosenTeam = away;

        // Calculate points based on the bet
        if (betHomeScore === homeScore && betAwayScore === awayScore) {
          pointsEarned = 3; // Exact score match
        } else if (betOutcome === actualOutcome) {
          pointsEarned = 1; // Correct match type (1, X, 2)
        }

        // Count the most chosen team (excluding draws)
        if (chosenTeam) {
          teamChosenCount[chosenTeam] = (teamChosenCount[chosenTeam] || 0) + 1;
        }

        // Count most failing team (chosen but gave 0 points)
        if (chosenTeam && pointsEarned === 0) {
          teamFailureCount[chosenTeam] = (teamFailureCount[chosenTeam] || 0) + 1;
        }

        // Count most successful team (chosen and gave points)
        if (chosenTeam && pointsEarned > 0) {
          teamPointCount[chosenTeam] = (teamPointCount[chosenTeam] || 0) + pointsEarned;
        }
      });

      const mostChosenTeams = getTopTeams(teamChosenCount);
      const mostDisappointingTeams = getTopTeams(teamFailureCount);
      const mostSuccessfulTeams = getTopTeams(teamPointCount, true);

      userStatsData.push({
        user,
        mostChosenTeams,
        mostDisappointingTeams,
        mostSuccessfulTeams,
      });
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  // Function to get teams with max count
  const getTopTeams = (teamData, allowEmpty = false) => {
    if (Object.keys(teamData).length === 0) return allowEmpty ? [] : ['------'];
    const maxCount = Math.max(...Object.values(teamData));
    return Object.keys(teamData).filter(team => teamData[team] === maxCount);
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
                <p><strong>⚽ Najczęściej Wybierana Drużyna: </strong> {userStats.mostChosenTeams.join(', ') || '------'}</p>
                <p><strong>👎🏿 Najczęściej Zawodząca Drużyna: </strong> {userStats.mostDisappointingTeams.join(', ') || '------'}</p>
                <p><strong>👍 Najczęściej Punktująca Drużyna: </strong> {userStats.mostSuccessfulTeams.join(', ') || '------'}</p>
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