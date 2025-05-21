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

  // Final Round Banner
  if (upcomingGames.length === 9 && timeRemaining) {
    return (
      <div style={{
        backgroundColor: '#212529ab',
        color: 'aliceblue',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '10px',
        fontFamily: '"Bebas Neue", sans-serif',
      }}>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}
        </style>
        <p style={{
          color: "gold",
          fontSize: '20px',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Ostatnia kolejka! Czas na wielki finał!
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8%',
          fontSize: '24px',
          fontWeight: 'bold',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFF5BA' }}>{timeRemaining.days}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>dni</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFF1A3' }}>{timeRemaining.hours}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>godz.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFE862' }}>{timeRemaining.minutes}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>min.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFDE21' }}>{timeRemaining.seconds}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '800' }}>sek.</div>
          </div>
        </div>
      </div>
    );
  }

  // Other Rounds - Show mini countdowns for each match
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