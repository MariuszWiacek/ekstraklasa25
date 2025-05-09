import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

// Function to get team logo from teamsData
const getTeamLogo = (teamName) => {
  const team = teamsData[teamName];
  if (team && team.logo) {
    return `${team.logo}`;
  } else {
    console.log('No logo found for:', teamName);
    return '/assets/default-logo.png'; // Fallback logo
  }
};

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = DateTime.now().setZone("Europe/Warsaw");
      console.log('Current Time:', now.toISO());

      // Find the next upcoming game sorted by closest datetime
      const upcomingGame = gameData
        .map(game => ({
          ...game,
          gameDateTime: DateTime.fromISO(`${game.date}T${game.kickoff}:00`, { zone: "Europe/Warsaw" })
        }))
        .filter(game => game.gameDateTime > now)
        .sort((a, b) => a.gameDateTime - b.gameDateTime)[0];

      if (upcomingGame) {
        setNextGame(upcomingGame);
        const diff = upcomingGame.gameDateTime.diff(now, ["days", "hours", "minutes", "seconds"]).toObject();

        setTimeRemaining({
          days: Math.floor(diff.days),
          hours: Math.floor(diff.hours),
          minutes: Math.floor(diff.minutes),
          seconds: Math.floor(diff.seconds),
        });
      } else {
        console.log('No upcoming game found');
        setNextGame(null);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    nextGame ? (
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '24px', textAlign: 'center', marginBottom: '10px' }}>
        <p style={{ color: "gold", fontSize: '14px', marginBottom: '10px' }}>Następny mecz:</p>

        <div style={{ marginTop: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '50%', height: '50%' }} src={getTeamLogo(nextGame.home)} alt={nextGame.home} />
            <hr />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'gold' }}>VS</span>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '50%', height: '50%' }} src={getTeamLogo(nextGame.away)} alt={nextGame.away} />
            <hr />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#FFF5BA', fontWeight: 'bold' }}>{timeRemaining.days}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>dni</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#FFF1A3', fontWeight: 'bold' }}>{timeRemaining.hours}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>godz.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#FFE862', fontWeight: 'bold' }}>{timeRemaining.minutes}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>min.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#FFDE21', fontWeight: 'bold' }}>{timeRemaining.seconds}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '800' }}>sek.</div>
          </div>
        </div>
      </div>
    ) : (
      <p>No upcoming games!</p>
    )
  );
};

export default CountdownTimer;
