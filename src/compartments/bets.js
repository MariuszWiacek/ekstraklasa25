import React, { useState, useEffect } from 'react';
import gameData from './gameData.json'; // Import the JSON data

const Bets = () => {
  const [games, setGames] = useState(gameData); // Use the imported gameData
  const [username, setUsername] = useState('');
  const [submittedData, setSubmittedData] = useState([]);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  useEffect(() => {
    // Load the username from local storage if available
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Load submitted data from local storage
    const savedData = localStorage.getItem('submittedData');
    if (savedData) {
      setSubmittedData(JSON.parse(savedData));
      setIsDataSubmitted(true); // Set the flag to true
    }
  }, []);

  const handleGameChange = (gameId, selectedBet) => {
    const updatedGames = games.map((game) =>
      game.id === gameId ? { ...game, bet: selectedBet } : game
    );
    setGames(updatedGames);
  };

  const handleScoreChange = (gameId, score) => {
    // Ensure that the score follows the format "1:1"
    // Allow only two numbers and automatically insert a colon
    score = score.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
    if (score.length > 1) {
      // If the input contains two numbers, insert a colon
      score = score[0] + ':' + score[1];
    }
    const updatedGames = games.map((game) =>
      game.id === gameId ? { ...game, score: score } : game
    );
    setGames(updatedGames);
  };

  const handleSubmit = () => {
    // Check if data has already been submitted
    if (isDataSubmitted) {
      alert('You have already submitted your bets!');
      return;
    }

    // Save the username to local storage
    localStorage.setItem('username', username);

    // Save the submitted data to local storage
    const newData = games
      .filter((game) => game.bet && game.score)
      .map((game) => `${game.home} - ${game.away}, Bet: ${game.bet}, Score: ${game.score}`);

    const updatedData = [...newData, ...submittedData];
    localStorage.setItem('submittedData', JSON.stringify(updatedData));

    // Set the submitted data and show it
    setSubmittedData(updatedData);
    setIsDataSubmitted(true);

    // Send the data to Firebase here
    // Example: Use Firebase Realtime Database or Firestore
  };

  const handleReset = () => {
    // Clear local storage and reset the state
    localStorage.removeItem('username');
    localStorage.removeItem('submittedData');
    setUsername('');
    setSubmittedData([]);
    setIsDataSubmitted(false);
  };

  return (
    <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', borderBottom: '1px solid #444' }}>Football Games to Bet On</h2>
      <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '1px solid #444' }}>
        <input style={{ margin: '10px' }}
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {games.map((game, index) => (
        <div key={game.id} style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
          <p>
             {game.home} vs. {game.away}
          </p>
          <div style={{ display: 'flex', justifyContent:"center", alignItems: 'center', marginLeft: '5%' }}>
           <label>
              <span style={{   color: 'aliceblue' , marginLeft: '0.5%' }}>1</span>
              <input
                type="radio"
                name={`bet-${game.id}`}
                value="1"
                checked={game.bet === '1'}
                onChange={() => handleGameChange(game.id, '1')}
              />
            </label>
            <label>
              <span style={{ color: 'aliceblue',marginLeft: '1%' }}>X</span>
              <input
                type="radio"
                name={`bet-${game.id}`}
                value="X"
                checked={game.bet === 'X'}
                onChange={() => handleGameChange(game.id, 'X')}
              />
            </label>
            <label>
              <span style={{ color: 'aliceblue',  marginLeft: '1%' }}>2</span>
              <input
                type="radio"
                name={`bet-${game.id}`}
                value="2"
                checked={game.bet === '2'}
                onChange={() => handleGameChange(game.id, '2')}
              />
            </label>
            <input
        
              type="text"
              placeholder="1:1"
              value={game.score}
              style={{ width: '50px', fontSize: '16px', marginLeft: '5%' }}
              onChange={(e) => handleScoreChange(game.id, e.target.value)}
            /></div>
          
        </div>
      ))}


<div style={{ textAlign: 'center' }}>
        <button
          style={{
            backgroundColor: '#DC3545',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'inline-block',
            margin: '10px',
            fontSize: '14px',
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button
          style={{
            backgroundColor: '#0D6EFD',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'inline-block',
            margin: '10px',
            fontSize: '14px',
          }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {/* Display submitted data */}
      {isDataSubmitted && (
        <div style={{textAlign:"center"}}>
          <h3 style={{ color: 'red' }}>{username}'s submitted bets: </h3>
    
      {submittedData.map((data, index) => (
        <div key={index}>{data}</div>
      ))}
    
        </div>
      )}
    </div>
  );
};

export default Bets;
