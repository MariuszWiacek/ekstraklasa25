import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json';
import { DateTime } from 'luxon';

const getTeamLogo = (teamName) => {
  const team = teamsData[teamName];
  return team?.logo || '/assets/default-logo.png';
};

const CountdownTimer = () => {
  const [upcomingGames, setUpcomingGames] = useState([]);

  useEffect(() => {
    const updateGames = () => {
      const now = DateTime.now().setZone("Europe/Warsaw");

      const upcoming = gameData
        .map(game => ({
          ...game,
          gameDateTime: DateTime.fromISO(`${game.date}T${game.kickoff}:00`, { zone: "Europe/Warsaw" })
        }))
        .filter(game => game.gameDateTime > now)
        .sort((a, b) => a.gameDateTime - b.gameDateTime);

      setUpcomingGames(upcoming);
    };

    updateGames();
    const interval = setInterval(updateGames, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeDiff = (gameTime) => {
    const now = DateTime.now().setZone("Europe/Warsaw");
    const diff = gameTime.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
    return {
      days: Math.floor(diff.days),
      hours: Math.floor(diff.hours),
      minutes: Math.floor(diff.minutes),
      seconds: Math.floor(diff.seconds),
    };
  };

  if (upcomingGames.length === 9) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#1e1e1e', color: 'gold', padding: '30px', fontSize: '24px', fontWeight: 'bold' }}>
        Ostatnia kolejka! Czas na wielki finał!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', padding: '16px', backgroundColor: '#212529ab', color: 'aliceblue' }}>
      {upcomingGames.map((game, idx) => {
        const time = getTimeDiff(game.gameDateTime);
        return (
          <div key={idx} style={{ width: '160px', padding: '10px', backgroundColor: '#2c2c2c', borderRadius: '12px', textAlign: 'center' }}>
            <div>
              <img src={getTeamLogo(game.home)} alt={game.home} style={{ width: '40px', height: '40px' }} />
              <div style={{ fontSize: '12px', margin: '4px 0' }}>{game.home}</div>
            </div>
            <div style={{ color: 'gold', fontWeight: 'bold' }}>VS</div>
            <div>
              <img src={getTeamLogo(game.away)} alt={game.away} style={{ width: '40px', height: '40px' }} />
              <div style={{ fontSize: '12px', margin: '4px 0' }}>{game.away}</div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <div>{time.days}d {time.hours}h</div>
              <div>{time.minutes}m {time.seconds}s</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountdownTimer;