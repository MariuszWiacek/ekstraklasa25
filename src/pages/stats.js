import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';

const firebaseConfig = {
  apiKey: "AIzaSyAEUAgb7dUt7ZO8S5-B4P3p1fHMJ_LqdPc",
  authDomain: "polskibet-71ef6.firebaseapp.com",
  databaseURL: "https://polskibet-71ef6-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "polskibet-71ef6",
  storageBucket: "polskibet-71ef6.appspot.com",
  messagingSenderId: "185818867502",
  appId: "1:185818867502:web:b582993ede95b06f80bcbf",
  measurementId: "G-VRP9QW7LRN"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const linkContainerStyle = {
  textAlign: 'left',
  backgroundColor: '#212529ab',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
};

const hallOfFameStyle = {
  backgroundColor: '#ffea007d',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
  textAlign: 'center',
};

// Function to calculate points for a single kolejka (8 games)
const calculatePoints = (bets, results) => {
  let points = 0;
  let correctTypes = 0;
  let correctResults = 0;
  let correctTypesWithResults = 0;

  bets.forEach((bet) => {
    const result = results[bet.id]; // Ensure we're using the correct game ID
    if (result) {
      const [homeScore, awayScore] = result.split(':').map(Number);
      const betScore = bet.score.split(':').map(Number);

      // Check for exact score match
      if (betScore[0] === homeScore && betScore[1] === awayScore) {
        points += 3; // 3 points for correct result
        correctResults++;
        correctTypesWithResults++; // Count as correct type with result
      } 
      // Check for correct type based on the score
      else if (bet.bet === (homeScore === awayScore ? 'X' : homeScore > awayScore ? '1' : '2')) {
        points += 1; // 1 point for correct type
        correctTypes++;
      }
    }
  });

  return { points, correctTypes, correctResults, correctTypesWithResults };
};

const Stats = () => {
  const [results, setResults] = useState({}); // Hold game results
  const [submittedData, setSubmittedData] = useState({}); // User bets
  const [hallOfFame, setHallOfFame] = useState([]); // State for Hall of Fame data

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
        id // Use the game ID for correct mapping
      }));

      const kolejkaPoints = {};
      bets.forEach((bet) => {
        const kolejkaId = Math.floor((bet.id - 1) / 8); // Determine the kolejka based on the game ID
        if (!kolejkaPoints[kolejkaId]) {
          kolejkaPoints[kolejkaId] = [];
        }
        kolejkaPoints[kolejkaId].push(bet);
      });

      let maxPoints = 0;
      let bestKolejkaId = null; // To store the best kolejka ID for the user
      let mostCorrectTypes = 0;
      let mostCorrectResults = 0;
      let mostCorrectTypesWithResults = 0;

      for (const kolejkaId in kolejkaPoints) {
        const kolejekBets = kolejkaPoints[kolejkaId];
        const { points, correctTypes, correctResults, correctTypesWithResults } = calculatePoints(kolejekBets, results);
        
        // Update max points
        if (points > maxPoints) {
          maxPoints = points; 
          bestKolejkaId = kolejkaId; // Save the best kolejka ID
        }

        // Update most correct types, results, and types with results
        mostCorrectTypes = Math.max(mostCorrectTypes, correctTypes);
        mostCorrectResults = Math.max(mostCorrectResults, correctResults);
        mostCorrectTypesWithResults = Math.max(mostCorrectTypesWithResults, correctTypesWithResults);
      }

      return { 
        user, 
        points: maxPoints, 
        bestKolejkaId,
        mostCorrectTypes,
        mostCorrectResults,
        mostCorrectTypesWithResults
      }; 
    });

    // Sorting table data by points in descending order
    updatedTableData.sort((a, b) => b.points - a.points);

    // Create the Hall of Fame with usernames and their corresponding stats
    const hallOfFameData = [
      {
        title: "Najwięcej pkt w jednej kolejce",
        value: `${updatedTableData[0]?.points || 0}`, 
        user: updatedTableData[0]?.user || "Brak",
        bestKolejkaId: parseInt(updatedTableData[0]?.bestKolejkaId) || 0, // Best kolejka ID
      },
      {
        title: "Najwięcej typów ☑️ * w jednej kolejce ",
        value: `${Math.max(...updatedTableData.map(entry => entry.mostCorrectTypes), 0)}`,
        user: updatedTableData.find(entry => entry.mostCorrectTypes === Math.max(...updatedTableData.map(entry => entry.mostCorrectTypes)))?.user || "Brak",
      },
    
      {
        title: "Najwięcej typ+wynik ✅☑️ w jednej kolejce",
        value: `${Math.max(...updatedTableData.map(entry => entry.mostCorrectTypesWithResults), 0)}`,
        user: updatedTableData.find(entry => entry.mostCorrectTypesWithResults === Math.max(...updatedTableData.map(entry => entry.mostCorrectTypesWithResults)))?.user || "Brak",
      },
    ];

    setHallOfFame(hallOfFameData);
  }, [submittedData, results]);

  return (
    <Container fluid style={linkContainerStyle}>
      <Row>
        <Col md={12}>
          <h2 style={{ textAlign: 'center' }}>Statystyki</h2>
          <hr />

          
          {hallOfFame.length > 0 && (
            <div style={hallOfFameStyle}>
              <h3>🏆</h3><hr></hr>
              {hallOfFame.map((stat, index) => (
                <p key={index} style={{color: '#34495e', fontWeight: 'bold' }}>
                  {stat.title}:<br></br> <h2 style={{ fontSize: '40px', color: 'aliceblue' }}>{stat.user} - {stat.value}</h2>
                  <hr></hr>
                 </p>
                
                
                
              ))}
              <p style={{color: '#34495e'}}> * Typy uwzględnione łącznie z tymi z typ+wynik </p>
            </div>
            
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;
