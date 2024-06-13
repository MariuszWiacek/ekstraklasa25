import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCKjpxvNMm3Cb-cA8cPskPY6ROPsg8XO4Q",
  authDomain: "bets-3887b.firebaseapp.com",
  databaseURL: "https://bets-3887b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bets-3887b",
  storageBucket: "bets-3887b.appspot.com",
  messagingSenderId: "446338011209",
  appId: "1:446338011209:web:bc4a33a19b763564992f98",
  measurementId: "G-W9EB371N7C"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const calculatePoints = (bets, results) => {
  let points = 0;
  bets.forEach((bet, index) => {
    const result = results[index];
    if (result && bet.score === result) {
      points += 3;
    } else if (result && bet.bet === (result.split(':')[0] === result.split(':')[1] ? 'X' : result.split(':')[0] > result.split(':')[1] ? '1' : '2')) {
      points += 1;
    }
  });
  return points;
};

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [results, setResults] = useState({});
  const [submittedData, setSubmittedData] = useState({});

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
      const points = calculatePoints(Object.values(submittedData[user]), results);
      return { user, points };
    });

    // Sorting table data by points in descending order
    updatedTableData.sort((a, b) => b.points - a.points);

    // Assigning places (1st, 2nd, 3rd, etc.)
    updatedTableData.forEach((entry, index) => {
      entry.place = getPlace(index + 1); // index + 1 to start from 1
    });

    setTableData(updatedTableData);
  }, [submittedData, results]);

  // Function to get ordinal suffix for places (1st, 2nd, 3rd, etc.)
  const getPlace = (place) => {
    const j = place % 10,
          k = place % 100;
    if (j === 1 && k !== 11) {
        return place ;
    }
    if (j === 2 && k !== 12) {
        return place ;
    }
    if (j === 3 && k !== 13) {
        return place ;
    }
    return place ;
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Tabela punktów:</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
          <tr style={{ backgroundColor: '#212529', color: 'white' }}>
              <th style={tableHeaderStyle}>Miejsce</th>
              <th style={tableHeaderStyle}>Użytkownik</th>
              <th style={tableHeaderStyle}>Punkty</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((entry, index) => (
              <tr key={index} style={{ backgroundColor: index < 3 ? '#ffea007d' : 'rgba(0, 0, 0, 0.336)' }}>
                <td style={tableCellStyle}>{entry.place}</td>
                <td style={tableCellStyle}>{entry.user}</td>
                <td style={tableCellStyle}>{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles for table header and cell
const tableHeaderStyle = {
  padding: '10px',
  border: '1px solid #dddddd',
  backgroundColor: '#212529',
  color: 'white',
  textAlign: 'center',
};

const tableCellStyle = {
  padding: '10px',
  border: '1px solid #dddddd',
  textAlign: 'center',
};

export default Table;
