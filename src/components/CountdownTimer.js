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
        background: 'linear-gradient(to right, #111, #222)',
        color: '#fff',
        padding: '40px 20px',
        borderRadius: '16px',
        fontFamily: '"Bebas Neue", "Orbitron", sans-serif',
        letterSpacing: '1px',
        boxShadow: '0 0 20px #FFD70055',
        margin: '20px auto',
        maxWidth: '600px',
        animation: 'pulseGlow 3s infinite alternate',
      }}>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@500&display=swap');
            @keyframes pulseGlow {
              from {
                box-shadow: 0 0 20px #FFD70055;
              }
              to {
                box-shadow: 0 0 30px #FFD700AA;
              }
            }
          `}
        </style>
        <div style={{
          fontSize: '36px',
          color: '#FFD700',
          textShadow: '1px 1px 6px #000',
          marginBottom: '20px',
        }}>
          Ostatnia kolejka! Czas na wielki finał!
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '35px',
          fontSize: '20px',
          color: '#FFF9C4',
          fontWeight: 'bold',
        }}>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.days}</div>
            <div>dni</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.hours}</div>
            <div>godz.</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.minutes}</div>
            <div>min.</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFEB3B' }}>{timeRemaining.seconds}</div>
            <div>sek.</div>
          </div>
        </div>
      </div>
    );
  }

  // Display all games (if not final round)
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#212529ab',
      color: 'aliceblue',
    }}>
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
          <div key={idx} style={{
            width: '160px',
            padding: '10px',
            backgroundColor: '#2c2c2c',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 0 8px #0005',
          }}>
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