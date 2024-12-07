import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Row, Col, Container } from 'react-bootstrap';
import Stats from './stats';

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

// Styles and configurations
const linkContainerStyle = {
  textAlign: 'left',
  backgroundColor: '#212529ab',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
};

const tableHeaderStyle = {
  padding: '10px',
  border: '1px solid #444',
  backgroundColor: '#212529',
  color: 'white',
  textAlign: 'center',
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #444',
  textAlign: 'center',
};

const tableCellStyle2 = {
  padding: '10px',
  border: '1px solid #444',
  textAlign: 'center',
  color: 'aliceblue',
  fontWeight: 'bold'
};

const trendStyle = {
  up: { color: 'green' },
  down: { color: 'red' },
  same: { display: 'none' }
};

// Prize information
const prizes = [ 
  { place: '🥇 1 miejsce', reward: 400 },
  { place: '🥈 2 miejsce', reward: 100 },
  { place: '🥉 3 miejsce', reward: 50 }
];

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const previousTableData = useRef([]);

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
    const updatedTableData = Object.keys(submittedData).map((user) => {
      const bets = Object.entries(submittedData[user]).map(([id, bet]) => ({
        ...bet,
        id
      }));
      const { points, correctTypes, correctResults } = calculatePoints(bets, results);
      return { user, points, correctTypes, correctResults };
    });

    updatedTableData.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.correctResults - a.correctResults;
    });

    updatedTableData.forEach((entry, index) => {
      entry.place = getPlace(index + 1);
      const previousEntry = previousTableData.current.find(e => e.user === entry.user);
      entry.trend = previousEntry
        ? previousEntry.place > entry.place ? 'up' : previousEntry.place < entry.place ? 'down' : 'same'
        : 'same';
    });

    previousTableData.current = updatedTableData;
    setTableData(updatedTableData);
  }, [submittedData, results]);

  const getPlace = (place) => {
    const j = place % 10, k = place % 100;
    if (j === 1 && k !== 11) return `${place}`;
    if (j === 2 && k !== 12) return `${place}`;
    if (j === 3 && k !== 13) return `${place}`;
    return `${place}`;
  };

  const calculatePoints = (bets, results) => {
    let points = 0, correctTypes = 0, correctResults = 0;

    bets.forEach((bet) => {
      const result = results[bet.id];
      if (result) {
        if (bet.score === result) {
          points += 3;
          correctResults++;
        } else if (bet.bet === (result.split(':')[0] === result.split(':')[1] ? 'X' : result.split(':')[0] > result.split(':')[1] ? '1' : '2')) {
          points += 1;
          correctTypes++;
        }
      }
    });

    return { points, correctTypes, correctResults };
  };

  return (
    <Container fluid style={linkContainerStyle}>
      <Row>
        <Col md={12}><h2 style={{ textAlign: 'center' }}>Tabela</h2><hr />
          <div className="fade-in" style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#212529', color: 'white' }}>
                  <th style={tableHeaderStyle}>Miejsce</th>
                  <th style={tableHeaderStyle}>Użytkownik</th>
                  <th style={tableHeaderStyle}>Pkt</th>
                  <th style={tableHeaderStyle}>☑️ <br />typ</th>
                  <th style={tableHeaderStyle}>✅☑️ <br />typ+wynik</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((entry, index) => (
                  <tr key={index} style={{ backgroundColor: index < 3 ? '#ffea007d' : 'rgba(0, 0, 0, 0.336)' }}>
                    <td style={tableCellStyle}>{entry.place}</td>
                    <td style={tableCellStyle}>
                      {entry.user}
                      <span style={trendStyle[entry.trend]}>
                        {entry.trend === 'up' && '▲'}
                        {entry.trend === 'down' && '▼'}
                      </span>
                    </td>
                    <td style={tableCellStyle2}>{entry.points}</td>
                    <td style={tableCellStyle}>{entry.correctTypes}</td>
                    <td style={tableCellStyle}>{entry.correctResults}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />

          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>💰 Nagrody 💰</h2><hr></hr>
            {prizes.map((prize, index) => (
              <p key={index} style={{ fontSize: '1.2em', color: '#ffd700' }}>
                 {prize.place} - {prize.reward} ⛃
              </p>
            ))}
          </div>
          <hr></hr>
          <Stats />
        </Col>
      </Row>
    </Container>
  );
};

export default Table;
