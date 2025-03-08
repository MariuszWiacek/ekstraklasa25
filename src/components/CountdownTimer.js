import React, { useState, useEffect } from 'react';
import gameData from '../gameData/data.json'; 
import teamsData from '../gameData/teams.json'; // Assuming the logos are stored in this file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

// Function to get team logo from teamsData
const getTeamLogo = (teamName) => {
  const team = teamsData[teamName];
  if (team && team.logo) {
    // Return the correct logo path, assuming logos are under the public folder
    return `${team.logo}`; // Adjust this based on the path where the images are located
  } else {
    console.log('No logo found for:', teamName); // Debugging log
    return '/assets/default-logo.png'; // Fallback logo if not found
  }
};

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = DateTime.now().setZone("Europe/Warsaw");
      console.log('Current Time:', now.toISO()); // Debugging log

      // Find the next upcoming game
      const upcomingGame = gameData.find(game => {
        const gameDateTime = DateTime.fromISO(`${game.date}T${game.kickoff}:00`, { zone: "Europe/Warsaw" });
        console.log('Game Time:', gameDateTime.toISO()); // Debugging log

        return gameDateTime > now;
      });

      if (upcomingGame) {
        console.log('Next Game:', upcomingGame); // Debugging log to see the full game object
        setNextGame(upcomingGame); // Set next game if found
        const gameDateTime = DateTime.fromISO(`${upcomingGame.date}T${upcomingGame.kickoff}:00`, { zone: "Europe/Warsaw" });
        const diff = gameDateTime.diff(now, ["days", "hours", "minutes", "seconds"]).toObject();

        setTimeRemaining({
          days: Math.floor(diff.days),
          hours: Math.floor(diff.hours),
          minutes: Math.floor(diff.minutes),
          seconds: Math.floor(diff.seconds),
        });
      } else {
        console.log('No upcoming game found'); // Debugging log
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nextGame) {
      console.log('Next Game Home Team:', nextGame.home);
      console.log('Next Game Away Team:', nextGame.away);
    }
  }, [nextGame]);

  return (
    nextGame ? (
      <div style={{ backgroundColor: '#212529ab', color: 'aliceblue', padding: '24px', textAlign: 'center', marginBottom: '10px'}}>
        <p style={{color: "gold", fontSize: '14px', marginBottom: '10px'}}>Następny mecz:</p>
        
         {/* Display teams and logos */} 
         <div style={{ marginTop: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '50%', height: '50%' }}  src={getTeamLogo(nextGame.home)}  alt={nextGame.home} />
            <hr></hr>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'gold' }}>VS</span>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '50%', height: '50%' }} src={getTeamLogo(nextGame.away)} alt={nextGame.away} />
            <hr></hr>
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
      <p>No upcoming games!</p> // If no game is found, display a message
    )
  );
};

export default CountdownTimer;
