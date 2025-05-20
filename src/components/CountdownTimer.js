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
  const [finalRoundTime, setFinalRoundTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const now = DateTime.now().setZone("Europe/Warsaw");

    const upcoming = gameData
      .map(game => ({
        ...game,
        gameDateTime: DateTime.fromISO(`${game.date}T${game.kickoff}:00`, { zone: "Europe/Warsaw" })
      }))
      .filter(game => game.gameDateTime > now)
      .sort((a, b) => a.gameDateTime - b.gameDateTime);

    setUpcomingGames(upcoming);

    if (upcoming.length === 9) {
      const firstGameTime = upcoming[0].gameDateTime;
      setFinalRoundTime(firstGameTime);

      const updateCountdown = () => {
        const current = DateTime.now().setZone("Europe/Warsaw");
        const diff = firstGameTime.diff(current, ['days', 'hours', 'minutes', 'seconds']).toObject();
        setTimeRemaining({
          days: Math.floor(diff.days),
          hours: Math.floor(diff.hours),
          minutes: Math.floor(diff.minutes),
          seconds: Math.floor(diff.seconds),
        });
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  if (upcomingGames.length === 9 && timeRemaining) {
    return (
      <div style={{
        textAlign: 'center',
        backgroundColor: '#1e1e1e',
        color: 'gold',
        padding: '30px',
        borderRadius: '12px',
        fontFamily: 'Arial Black, sans-serif'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '10px' }}>
          Ostatnia kolejka! Czas na wielki finał!
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          fontSize: '20px',
          color: '#FFF9C4'
        }}>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.days}</div>
            <div style={{ fontWeight: 'bold' }}>dni</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.hours}</div>
            <div style={{ fontWeight: 'bold' }}>godz.</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.minutes}</div>
            <div style={{ fontWeight: 'bold' }}>min.</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.seconds}</div>
            <div style={{ fontWeight: 'bold' }}>sek.</div>
          </div>
        </div>
      </div>
    );
  }

  // Show all upcoming games if not 9
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', padding: '16px', backgroundColor: '#212529ab', color: 'aliceblue' }}>
      {upcomingGames.map((game, idx) => {
        const now = DateTime.now().setZone("Europe/Warsaw");
        const diff = game.gameDateTime.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
        const time = {
          days: Math.floor(diff.days),
          hours: Math.floor(diff.hours),
          minutes: Math.floor(diff.minutes),
          seconds: Math.floor(diff.seconds),
        };
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