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

    setTableData(updatedTableData.sort((a, b) => b.points - a.points));
  }, [submittedData, results]);

  return (
    <div>
      <h2>Tabela punktów:</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#212529', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Użytkownik</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Punkty</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((entry, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'black' }}>
              <td style={{ color: 'red', padding: '10px', border: '1px solid #dddddd' }}>{entry.user}</td>
              <td style={{ color: 'red', padding: '10px', border: '1px solid #dddddd' }}>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;