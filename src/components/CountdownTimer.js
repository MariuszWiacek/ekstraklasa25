
import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json'; 

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState('');

  const updateTimeRemaining = () => {
    const now = new Date();
    const nextGame = gameData.find(game => new Date(`${game.date}T${game.kickoff}:00+02:00`) > now);

    if (nextGame) {
      const kickoffTimeCEST = new Date(`${nextGame.date}T${nextGame.kickoff}:00+02:00`);
      const diff = kickoffTimeCEST - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h :${minutes}min :${seconds}s`);
    }
  };

  useEffect(() => {
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000); // 
    return () => clearInterval(interval); 
  }, []);

  return (
    timeRemaining && (
      <div style={{ textAlign: 'center', marginBottom: '2px' }}>
        <p style={{color: "yellow"}}>Do kolejnego meczu pozostało: {timeRemaining}</p>
      </div>
    )
  );
};

export default CountdownTimer;
