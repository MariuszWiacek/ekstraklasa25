import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import gameData from '../gameData/data.json';

const Admin = () => {
  const [games, setGames] = useState([]);
  const [resultsInput, setResultsInput] = useState({});
  const [submittedResults, setSubmittedResults] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [betCounts, setBetCounts] = useState({});
  const [nonBettors, setNonBettors] = useState({});
  const [selectedKolejka, setSelectedKolejka] = useState(1);

  useEffect(() => {
    setGames(gameData);

    // Initialize the current kolejka based on games
    const totalGames = gameData.length;
    const gamesPerKolejka = 9;
    const currentKolejka = Math.ceil(totalGames / gamesPerKolejka);
    setSelectedKolejka(currentKolejka);
  }, []);

  useEffect(() => {
    const submittedDataRef = ref(getDatabase(), 'submittedData');
    onValue(submittedDataRef, (snapshot) => {
      const data = snapshot.val();
      setSubmittedData(data || {});
    });
  }, []);

  useEffect(() => {
    const resultsRef = ref(getDatabase(), 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      setResultsInput(data || {});
      setSubmittedResults(!!data);
    });
  }, []);

  useEffect(() => {
    const betCountsRef = ref(getDatabase(), 'betCounts');
    onValue(betCountsRef, (snapshot) => {
      const data = snapshot.val();
      setBetCounts(data || {});
    });
  }, []);

  useEffect(() => {
    const nonBettorsData = {};
    Object.keys(submittedData).forEach((user) => {
      games.forEach((game) => {
        if (!submittedData[user][game.id]) {
          if (!nonBettorsData[game.id]) {
            nonBettorsData[game.id] = [];
          }
          nonBettorsData[game.id].push(user);
        }
      });
    });
    setNonBettors(nonBettorsData);
  }, [submittedData, games]);

  const handleResultChange = (gameId, result) => {
    setResultsInput(prevResults => ({
      ...prevResults,
      [gameId]: result
    }));
  };

  const handleSubmitResults = () => {
    set(ref(getDatabase(), 'results'), resultsInput)
      .then(() => {
        setSubmittedResults(true);
        alert('Wyniki zostały pomyślnie przesłane!');
      })
      .catch((error) => {
        console.error('Error submitting results:', error);
        alert('Wystąpił błąd podczas przesyłania wyników. Spróbuj ponownie.');
      });
  };

  const handlePasswordSubmit = () => {
    if (password === 'maniek123') {
      setAuthenticated(true);
    } else {
      alert('Nieprawidłowe hasło. Spróbuj ponownie.');
    }
  };

  const handleKeyPress = (event, callback) => {
    if (event.key === 'Enter') {
      callback();
    }
  };

  // Calculate games for the selected kolejka
  const getGamesForKolejka = (kolejkaNumber) => {
    const gamesPerKolejka = 9;
    const startIndex = (kolejkaNumber - 1) * gamesPerKolejka;
    const endIndex = startIndex + gamesPerKolejka;
    return games.slice(startIndex, endIndex);
  };

  // If not authenticated, show password form
  if (!authenticated) {
    return (
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
        <h2 className="text-xl font-bold mb-4">Wprowadź hasło:</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
          className="p-2 text-center border border-gray-300 rounded-md"
          style={{ marginRight: '10px' }}
        />
        <button
          onClick={handlePasswordSubmit}
          style={{
            backgroundColor: 'red',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          Zaloguj
        </button>
      </div>
    );
  }

  // If authenticated, show admin panel
  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px', marginTop: '5%' }}>
      <h2 className="text-xl font-bold mb-4">Wprowadź wyniki:</h2>
      <div className="mb-4">
        <label htmlFor="kolejka" className="mr-4">Wybierz kolejkę:</label>
        <select
          id="kolejka"
          value={selectedKolejka}
          onChange={(e) => setSelectedKolejka(Number(e.target.value))}
          className="p-2 text-center border border-gray-300 rounded-md"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(num => (
            <option key={num} value={num}>Kolejka {num}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-center">
        {getGamesForKolejka(selectedKolejka).map((game) => (
          <div key={game.id} className="mb-4">
            <div className="flex items-center mb-2">
              <p>{game.home} vs {game.away}:</p>
              <input
                type="text"
                maxLength="3"
                placeholder="x:x"
                value={resultsInput[game.id] || ''}
                onChange={(e) => handleResultChange(game.id, e.target.value)}
                className="ml-2 p-2 text-center border border-gray-300 rounded-md w-16"
                onKeyDown={(e) => handleKeyPress(e, handleSubmitResults)}
              />
            </div>
            {nonBettors[game.id]?.length === 0 ? (
              <div className="text-center mb-1">
                <p className="mb-1 text-red-500">Nie obstawili:</p>
                <h5 className="text-red-500">Nikt jeszcze nie typował</h5>
              </div>
            ) : nonBettors[game.id]?.length > 0 ? (
              <div className="text-center mb-1">
                <p className="mb-1">Nie obstawili:</p>
                <p>{nonBettors[game.id].join(', ')}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmitResults}
        style={{
          backgroundColor: 'red',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          margin: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
      >
        Zatwierdź wyniki
      </button>
    </div>
  );
};

export default Admin;
