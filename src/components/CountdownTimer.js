import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState('');

  const updateTimeRemaining = () => {
    const now = new Date();
    const nextGame = gameData.find(game => new Date(`${game.date}T${game.kickoff}:00+02:00`) > now);

    if (nextGame) {
      const kickoffTimeCEST = new Date(`${nextGame.date}T${nextGame.kickoff}:00+02:00`);
      const diff = kickoffTimeCEST - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Days
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours remaining after removing days
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
      const seconds = Math.floor((diff % (1000 * 60)) / 1000); // Seconds

      setTimeRemaining({ days, hours, minutes, seconds });
    }
  };

  useEffect(() => {
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    timeRemaining && (
      <div style={{ textAlign: 'center', marginBottom: '0px' }}>
        <p style={{color: "gold", fontSize: '14px', marginBottom: '10px'}}>Do kolejnego meczu pozostało:</p>
        <FontAwesomeIcon icon={faClock} style={{fontSize: '115%', color: '#FFF5BA', marginRight: '8px' }} />
       
       
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10%' }}>
          <div style={{ textAlign: 'center' }}>
            
            <div style={{ fontSize: '32px', color: '#FFF5BA', fontWeight: 'bold' }}>{timeRemaining.days}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>dni</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#FFF1A3', fontWeight: 'bold' }}>{timeRemaining.hours}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>godz.</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#FFE862', fontWeight: 'bold' }}>{timeRemaining.minutes}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>min</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#FFDE21', fontWeight: 'bold' }}>{timeRemaining.seconds}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '800' }}>s</div>
          </div>
        </div>
      </div>
    )
  );
};

export default CountdownTimer;
