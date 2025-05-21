import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

// Get team logo
const getTeamLogo = (teamName) => {
  const team = teamsData[teamName];
  return team && team.logo ? `${team.logo}` : '/assets/default-logo.png';
};

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = DateTime.now().setZone("Europe/Warsaw");

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
          {["dni", "godz.", "min.", "sek."].map((label, index) => {
            const value = Object.values(timeRemaining)[index];
            const colors = ["#FFF5BA", "#FFF1A3", "#FFE862", "#FFDE21"];
            return (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: colors[index], fontWeight: 'bold' }}>{value}</div>
                <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* Additional Message */}
        <div style={{ marginTop: '20px', fontSize: '14px', lineHeight: '1.6', color: '#fff' }}>
          <div><b>Uwaga!</b> Jeśli w <b>ostatniej kolejce (16)</b> będzie więcej niż jeden zwycięzca, cała nagroda <b>przechodzi na mistrza ligi</b>.</div>

          <div style={{ marginTop: '10px', color: '#FFD700' }}>
            <b>Nagrody:</b><br />
            1. miejsce – 400 <img src="/assets/coin.png" alt="coin" style={{ width: '16px', verticalAlign: 'middle' }} /> <br />
            2. miejsce – 200 <img src="/assets/coin.png" alt="coin" style={{ width: '16px', verticalAlign: 'middle' }} /> <br />
            3. miejsce – 100 <img src="/assets/coin.png" alt="coin" style={{ width: '16px', verticalAlign: 'middle' }} />
          </div>

          <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '16px', color: '#00FFAA' }}>Powodzenia!</div>
        </div>
      </div>
    ) : (
      <p>No upcoming games!</p>
    )
  );
};

export default CountdownTimer;