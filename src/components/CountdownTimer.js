import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const updateTimeRemaining = () => {
    // Set the current time in Poland's timezone
    const now = DateTime.now().setZone("Europe/Warsaw");

    // Find the next game based on Warsaw time
    const nextGame = gameData.find(game => {
      const gameDateTime = DateTime.fromISO(`${game.date}T${game.kickoff}:00`, { zone: "Europe/Warsaw" });
      return gameDateTime > now;
    });

    if (nextGame) {
      // Calculate the difference to the next game's kickoff time
      const gameDateTime = DateTime.fromISO(`${nextGame.date}T${nextGame.kickoff}:00`, { zone: "Europe/Warsaw" });
      const diff = gameDateTime.diff(now, ["days", "hours", "minutes", "seconds"]).toObject();

      setTimeRemaining({
        days: Math.floor(diff.days),
        hours: Math.floor(diff.hours),
        minutes: Math.floor(diff.minutes),
        seconds: Math.floor(diff.seconds),
      });
    }
  };

  useEffect(() => {
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    timeRemaining && (
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '20px', textAlign: 'center', marginBottom: '10px'}}>
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
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '900' }}>min.</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#FFDE21', fontWeight: 'bold' }}>{timeRemaining.seconds}</div>
            <div style={{ color: 'red', fontSize: '14px', fontWeight: '800' }}>sek.</div>
          </div>
        </div>
      </div>
    )
  );
};

export default CountdownTimer;

