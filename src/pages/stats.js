import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';

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

const linkContainerStyle = {
  fontFamily: 'Rubik',
  textAlign: 'left',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
};


const cardStyle = {
  backgroundColor: '#ffea007d',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer', 
};

const cardHoverStyle = {
  transform: 'scale(1.05)', // Slightly enlarge the card
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)', // Darker shadow
};

const averagePointsStyle = {
  fontFamily: 'Rubik',
  color: 'aliceblue',
  backgroundColor: '#0090cdf1',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};

const averagePointsHoverStyle = {
  transform: 'scale(1.05)',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
};

const calculatePoints = (bets, results) => {
  let points = 0;
  let correctTypes = 0;
  let correctResults = 0;
  let correctTypesWithResults = 0;

  bets.forEach((bet) => {
    const result = results[bet.id];
    if (result) {
      const [homeScore, awayScore] = result.split(':').map(Number);
      const betScore = bet.score.split(':').map(Number);

      if (betScore[0] === homeScore && betScore[1] === awayScore) {
        points += 3;
        correctResults++;
        correctTypes++;
        correctTypesWithResults++;
      } else if (bet.bet === (homeScore === awayScore ? 'X' : homeScore > awayScore ? '1' : '2')) {
        points += 1;
        correctTypes++;
      }
    }
  });

  return { points, correctTypes, correctResults, correctTypesWithResults };
};

const Stats = () => {
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [hallOfFame, setHallOfFame] = useState([]);
  const [averagePoints, setAveragePoints] = useState([]);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

  useEffect(() => {
    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      setResults(data || {});
    });

    const submittedDataRef = ref(database, 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      const data = snapshot.val();
      setSubmittedData(data || {});
    });
  }, []);

  useEffect(() => {
    const updatedTableData = Object.keys(submittedData).map((user) => {
      const bets = Object.entries(submittedData[user]).map(([id, bet]) => ({
        ...bet,
        id,
      }));

      const kolejkaPoints = {};
      bets.forEach((bet) => {
        const kolejkaId = Math.floor((bet.id - 1) / 9); 
        if (!kolejkaPoints[kolejkaId]) {
          kolejkaPoints[kolejkaId] = [];
        }
        kolejkaPoints[kolejkaId].push(bet);
      });

      let maxPoints = 0;
      let bestKolejkaId = null;
      let totalPoints = 0;
      let totalKolejkas = 0;
      let mostCorrectTypes = 0;
      let mostCorrectResults = 0;
      let mostCorrectTypesWithResults = 0;

      for (const kolejkaId in kolejkaPoints) {
        const kolejekBets = kolejkaPoints[kolejkaId];
        const { points, correctTypes, correctResults, correctTypesWithResults } = calculatePoints(kolejekBets, results);

        totalPoints += points;
        totalKolejkas++;

        if (points > maxPoints) {
          maxPoints = points;
          bestKolejkaId = kolejkaId;
        }

        mostCorrectTypes = Math.max(mostCorrectTypes, correctTypes);
        mostCorrectResults = Math.max(mostCorrectResults, correctResults);
        mostCorrectTypesWithResults = Math.max(mostCorrectTypesWithResults, correctTypesWithResults);
      }

      const averagePoints = totalKolejkas > 0 ? (totalPoints / totalKolejkas).toFixed(2) : 0;

      return {
        user,
        points: maxPoints,
        bestKolejkaId,
        averagePoints,
        mostCorrectTypes,
        mostCorrectResults,
        mostCorrectTypesWithResults,
      };
    });

    updatedTableData.sort((a, b) => b.points - a.points);

    const maxPoints = Math.max(...updatedTableData.map(entry => entry.points));
    const maxCorrectTypes = Math.max(...updatedTableData.map(entry => entry.mostCorrectTypes));
    const maxCorrectTypesWithResults = Math.max(...updatedTableData.map(entry => entry.mostCorrectTypesWithResults));

    const hallOfFameData = [
      {
        title: "Najwięcej pkt w jednej kolejce",
        value: maxPoints,
        users: updatedTableData.filter(entry => entry.points === maxPoints).map(entry => entry.user),
      },
      {
        title: "Najwięcej typów ☑️ * w jednej kolejce",
        value: maxCorrectTypes,
        users: updatedTableData.filter(entry => entry.mostCorrectTypes === maxCorrectTypes).map(entry => entry.user),
      },
      {
        title: "Najwięcej typ+wynik ✅☑️ w jednej kolejce",
        value: maxCorrectTypesWithResults,
        users: updatedTableData.filter(entry => entry.mostCorrectTypesWithResults === maxCorrectTypesWithResults).map(entry => entry.user),
      },
    ];

    const averagePointsData = updatedTableData.map(entry => ({
      value: entry.averagePoints,
      user: entry.user,
    }));

    setHallOfFame(hallOfFameData);
    setAveragePoints(averagePointsData.sort((a, b) => b.value - a.value));
  }, [submittedData, results]);

  return (
    <Container fluid style={linkContainerStyle}>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki</h2>
          <hr />
          <h3 style={{ textAlign: 'center', fontFamily: 'Rubik' }}>🏆 Rekordy ligi 🏆</h3><hr />
          {hallOfFame.map((stat, index) => (
            <div
              key={index}
              style={{
                ...cardStyle,
                ...(hoveredCardIndex === index ? cardHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
            >
              <h4>{stat.title}:</h4><hr />
              {stat.users && stat.users.length > 0 ? (
                stat.users.map((user, idx) => (
                  <h2 key={idx} style={{ fontSize: '40px', color: 'aliceblue' }}>
                    {user} - {stat.value}
                  </h2>
                ))
              ) : (
                <h2 style={{ fontSize: '40px', color: 'aliceblue' }}>Brak danych</h2>
              )}
              <hr />
            </div>
          ))}
          <p style={{ color: 'red', fontFamily: 'Rubik' }}> * Typy uwzględnione łącznie z tymi z typ+wynik </p>
          {averagePoints.length > 0 && (
            <div
              style={{
                ...averagePointsStyle,
                ...(hoveredCardIndex === 'average' ? averagePointsHoverStyle : {})
              }}
              onMouseEnter={() => setHoveredCardIndex('average')}
              onMouseLeave={() => setHoveredCardIndex(null)}
            >
              <h3>📊 Średnia pkt/kolejkę </h3><hr />
              {averagePoints.map((stat, index) => (
                <p key={index} style={{ color: 'black', fontWeight: 'bold' }}>
                  <h2 style={{ fontSize: '40px', color: '#155724' }}>{stat.user} - {stat.value}</h2>
                  <hr />
                </p>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;