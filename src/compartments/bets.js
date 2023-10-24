import React, { useState } from 'react';

const initialGames = [
  {
    id: 1,
    home: 'GKS Katowice',
    away: 'Legia Warszawa',
    score: '',
    bet: '',
  },
  {
    id: 2,
    home: 'Wisła Kraków',
    away: 'Lech Poznań',
    score: '',
    bet: '',
  },
  {
    id: 3,
    home: 'Jagiellonia Białystok',
    away: 'Cracovia Kraków',
    score: '',
    bet: '',
  },
  {
    id: 4,
    home: 'Śląsk Wrocław',
    away: 'Pogoń Szczecin',
    score: '',
    bet: '',
  },
  {
    id: 5,
    home: 'Legia Warszawa',
    away: 'Raków Częstochowa',
    score: '',
    bet: '',
  },
];

const Bets = () => {
  const [games, setGames] = useState(initialGames);

  return (
    <div>
      <h2 style={{ color: 'aliceblue' }}>Football Games to Bet On</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id} style={{ color: 'aliceblue', width: '100%', marginBottom: '1%' }}>
            <span style={{ display: 'inline-block', width: '55%', marginLeft:"5%" }}>
              {game.home} vs. {game.away}
            </span>
            <div style={{ display: 'inline-block', width: '5%' }}>
              <label>
                <span style={{ color: 'aliceblue' }}>1</span>
                <input
                  type="radio"
                  name={`bet-${game.id}`}
                  value="1"
                  checked={game.bet === '1'}
                  onChange={(e) => {
                    const updatedGames = games.map((g) =>
                      g.id === game.id ? { ...g, bet: e.target.value } : g
                    );
                    setGames(updatedGames);
                  }}
                />
              </label>
            </div>
            <div style={{ display: 'inline-block', width: '5%' }}>
              <label>
                <span style={{ color: 'aliceblue' }}>X</span>
                <input
                  type="radio"
                  name={`bet-${game.id}`}
                  value="X"
                  checked={game.bet === 'X'}
                  onChange={(e) => {
                    const updatedGames = games.map((g) =>
                      g.id === game.id ? { ...g, bet: e.target.value } : g
                    );
                    setGames(updatedGames);
                  }}
                />
              </label>
            </div>
            <div style={{ display: 'inline-block', width: '5%' }}>
              <label>
                <span style={{ color: 'aliceblue' }}>2</span>
                <input
                  type="radio"
                  name={`bet-${game.id}`}
                  value="2"
                  checked={game.bet === '2'}
                  onChange={(e) => {
                    const updatedGames = games.map((g) =>
                      g.id === game.id ? { ...g, bet: e.target.value } : g
                    );
                    setGames(updatedGames);
                  }}
                />
              </label>
            </div>
            <input 
              type="text"
              placeholder="0:0"
              value={game.score}
              style={{ width: '10%', fontSize:"16px",marginLeft:"5%" }}
              onChange={(e) => {
                const updatedGames = games.map((g) =>
                  g.id === game.id ? { ...g, score: e.target.value } : g
                );
                setGames(updatedGames);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bets;
