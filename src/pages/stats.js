import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';

// Konfiguracja Firebase
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

// Inicjalizacja Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const Stats = () => {
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    // Pobranie wyników meczów
    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      setResults(snapshot.val() || {});
    });

    // Pobranie danych użytkowników
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

      // Przetwarzanie każdego zakładu
      bets.forEach(([id, bet]) => {
        const result = results[id];
        if (!result || !bet.home || !bet.away || !bet.bet) return;

        const { home: homeTeam, away: awayTeam, bet: betOutcome, homeScore, awayScore } = bet;
        const [actualHomeScore, actualAwayScore] = result.split(':').map(Number);
        const actualOutcome = actualHomeScore === actualAwayScore ? 'X' : actualHomeScore > actualAwayScore ? '1' : '2';

        // Obliczanie punktów
        let points = 0;

        // Dokładny wynik - 3 punkty
        if (homeScore === actualHomeScore && awayScore === actualAwayScore) {
          points = 3;
        } 
        // Poprawne wskazanie zwycięzcy/remisu - 1 punkt
        else if (betOutcome === actualOutcome) {
          points = 1;
        }

        // Przypisanie punktów do kolejki
        const kolejkaId = Math.floor((id - 1) / 9);
        if (!userStats.kolejki[kolejkaId]) {
          userStats.kolejki[kolejkaId] = { points: 0 };
        }
        userStats.kolejki[kolejkaId].points += points;
        userStats.maxPointsInOneKolejka = Math.max(userStats.maxPointsInOneKolejka, userStats.kolejki[kolejkaId].points);

        // Pomijanie remisów w analizie drużyn
        if (betOutcome !== 'X') {
          const chosenTeam = betOutcome === '1' ? homeTeam : awayTeam;
          userStats.chosenTeams[chosenTeam] = (userStats.chosenTeams[chosenTeam] || 0) + 1;

          // Śledzenie sukcesów i porażek drużyn
          if (actualOutcome === betOutcome) {
            userStats.successTeams[chosenTeam] = (userStats.successTeams[chosenTeam] || 0) + points;
          } else {
            userStats.failureTeams[chosenTeam] = (userStats.failureTeams[chosenTeam] || 0) + 1;
          }
        }
      });

      // Znalezienie tylko jednej najlepszej drużyny
      const mostChosenTeams = findMostFrequent(userStats.chosenTeams);
      const mostFailureTeams = findMostFrequent(userStats.failureTeams);
      const mostSuccessTeams = findTopScoringTeam(userStats.successTeams);

      userStats.mostChosenTeams = mostChosenTeams.length ? mostChosenTeams : ['------'];
      userStats.mostFailureTeams = mostFailureTeams.length ? mostFailureTeams : ['------'];
      userStats.mostSuccessTeams = mostSuccessTeams.length ? mostSuccessTeams : ['------'];

      userStatsData.push(userStats);
    });

    setUserStats(userStatsData);
  }, [submittedData, results]);

  // Funkcja wybierająca jedynie drużynę z największą liczbą punktów
  const findTopScoringTeam = (teams) => {
    if (Object.keys(teams).length === 0) return [];

    let maxPoints = Math.max(...Object.values(teams));
    
    return Object.keys(teams).filter(team => teams[team] === maxPoints);
  };

  const findMostFrequent = (teams) => {
    if (Object.keys(teams).length === 0) return [];

    let maxCount = Math.max(...Object.values(teams));

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