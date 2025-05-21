import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json';
import { DateTime } from 'luxon';

// Function to get team logo from teamsData
const getTeamLogo = (teamName) => {
  const team = teamsData[teamName];
  return team && team.logo ? `${team.logo}` : '/assets/default-logo.png';
};

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextGame, setNextGame] = useState(null);
  const [isLastRound, setIsLastRound] = useState(false);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = DateTime.now().setZone("Europe/Warsaw");

      const upcomingGames = gameData
        .map(game => ({
          ...game,
          gameDateTime: DateTime.fromISO(`${game.date}T${game.kickoff}:00`, { zone: "Europe/Warsaw" })
        }))
        .filter(game => game.gameDateTime > now)
        .sort((a, b) => a.gameDateTime - b.gameDateTime);

      if (upcomingGames.length > 0) {
        setNextGame(upcomingGames[0]);
        setIsLastRound(upcomingGames.length === 9); // If all 9 games left, treat it as last kolejka

        const diff = upcomingGames[0].gameDateTime.diff(now, ["days", "hours", "minutes", "seconds"]).toObject();
        setTimeRemaining({
          days: Math.floor(diff.days),
          hours: Math.floor(diff.hours),
          minutes: Math.floor(diff.minutes),
          seconds: Math.floor(diff.seconds),
        });
      } else {
        setNextGame(null);
        setIsLastRound(false);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    nextGame ? (
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '24px', textAlign: 'center', marginBottom: '10px' }}>
        {!isLastRound && <p style={{ color: "gold", fontSize: '14px', marginBottom: '10px' }}>Następny mecz:</p>}

        {!isLastRound && (
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
        )}

        {isLastRound && (
          <div style={{ fontSize: '22px', color: 'gold', fontWeight: 'bold', marginBottom: '12px' }}>
            Ostatnia kolejka! Czas na finałowe rozstrzygnięcia!
          </div>
        )}

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

        {/* Bonus Kolejka info */}
        <div style={{ marginTop: '20px', fontSize: '14px', lineHeight: '1.6', color: '#fff' }}>
          <div><b>Bonusowa Kolejka:</b> Zwycięzca każdej kolejki otrzymuje nagrodę.</div>
          <div>W przypadku remisu – nagroda przechodzi na kolejną kolejkę, aż do wyłonienia jednego zwycięzcy.</div>
          <div>Jeśli w ostatniej kolejce będzie remis, pula trafia do zwycięzcy całej ligi.</div>
        </div>

        {/* Prize info */}
        <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: 'bold' }}>
          <div>
            1. miejsce: 400 <img src="/assets/coin.png" alt="coin" style={{ width: '20px', verticalAlign: 'middle' }} />
          </div>
          <div>
            2. miejsce: 200 <img src="/assets/coin.png" alt="coin" style={{ width: '20px', verticalAlign: 'middle' }} />
          </div>
          <div>
            3. miejsce: 100 <img src="/assets/coin.png" alt="coin" style={{ width: '20px', verticalAlign: 'middle' }} />
          </div>
        </div>

        <div style={{ marginTop: '12px', fontSize: '18px', color: 'lightgreen', fontWeight: 'bold' }}>
          Powodzenia!
        </div>
      </div>
    ) : (
      <p>Brak nadchodzących meczów!</p>
    )
  );
};

export default CountdownTimer;