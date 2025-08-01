import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import usersData from '../gameData/users.json';
import gameData from '../gameData/data.json';
import teamsData from '../gameData/teams.json';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import ExpandableCard from '../components/expandableCard';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

const firebaseConfig = {
  apiKey: "AIzaSyCGVW31sTa6Giafh0-JTsnJ9ghybYEsJvE",
  authDomain: "wiosna25-66ab3.firebaseapp.com",
  databaseURL: "https://wiosna25-66ab3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wiosna25-66ab3",
  storageBucket: "wiosna25-66ab3.appspot.com",
  messagingSenderId: "29219460780",
  appId: "1:29219460780:web:de984a281514ab6cdc7109",
  measurementId: "G-8Z3CMMQKE8"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth();
const database = getDatabase();

const groupGamesIntoKolejki = (games) => {
  const kolejki = [];
  games.forEach((game, index) => {
    const currentKolejkaId = Math.floor(index / 9) + 1;
    game.kolejkaId = currentKolejkaId;
    if (!kolejki[currentKolejkaId - 1]) {
      kolejki[currentKolejkaId - 1] = { id: currentKolejkaId, games: [] };
    }
    kolejki[currentKolejkaId - 1].games.push(game);
  });
  return kolejki;
};

const Bets = () => {
  const [kolejki, setKolejki] = useState(groupGamesIntoKolejki(gameData));
  const [selectedUser, setSelectedUser] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [currentKolejkaIndex, setCurrentKolejkaIndex] = useState(0);
  const [areInputsEditable, setAreInputsEditable] = useState(true);

  useEffect(() => {
    const lastChosenUser = localStorage.getItem('selectedUser');
    if (lastChosenUser) setSelectedUser(lastChosenUser);

    auth.onAuthStateChanged((user) => {
      if (user) setSelectedUser(user.displayName);
    });

    const dbRef = ref(database, 'submittedData');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubmittedData(data);
        setIsDataSubmitted(true);
      }
    });

    const resultsRef = ref(database, 'results');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setResults(data);
    });

    // ✅ Only this part updated (find next closest valid game)
    const now = new Date();
    let closestGameIndex = -1;
    let closestGameDate = null;

    gameData.forEach((game, index) => {
      if (!game.kickoff) return; // skip games without kickoff

      const gameDate = new Date(`${game.date}T${game.kickoff}:00+02:00`);
      if (gameDate > now && (!closestGameDate || gameDate < closestGameDate)) {
        closestGameDate = gameDate;
        closestGameIndex = index;
      }
    });

    if (closestGameIndex !== -1) {
      const kolejkaIndex = Math.floor(closestGameIndex / 9);
      setCurrentKolejkaIndex(kolejkaIndex);
    }

  }, []);

  const isReadOnly = (user, gameId) => submittedData[user] && submittedData[user][gameId];

  const gameStarted = (gameDate, gameKickoff) => {
    const now = DateTime.now().setZone('Europe/Warsaw');
    const kickoff = DateTime.fromISO(`${gameDate}T${gameKickoff}:00`, { zone: 'Europe/Warsaw' });
    return now >= kickoff;
  };

  const autoDetectBetType = (score) => {
    const [home, away] = score.split(':').map(Number);
    if (home === away) return 'X';
    return home > away ? '1' : '2';
  };

  const handleScoreChange = (gameId, scoreInput) => {
    const cleaned = scoreInput.replace(/[^0-9:]/g, '');
    const formatted = cleaned.replace(/^(?:(\d))([^:]*$)/, '$1:$2');

    const updated = kolejki.map(kolejka => ({
      ...kolejka,
      games: kolejka.games.map(game =>
        game.id === gameId
          ? { ...game, score: formatted, bet: autoDetectBetType(formatted) }
          : game
      )
    }));
    setKolejki(updated);
  };

  const handleUserChange = (e) => {
    const user = e.target.value;
    setSelectedUser(user);
    localStorage.setItem('selectedUser', user);
  };

  const handleSubmit = () => {
    if (!selectedUser) {
      alert('Proszę wybrać użytkownika.');
      return;
    }

    const currentKolejka = kolejki[currentKolejkaIndex];
    const userSubmittedBets = submittedData[selectedUser] || {};

    const newBetsToSubmit = currentKolejka.games.reduce((acc, game) => {
      if (game.score && !userSubmittedBets[game.id]) {
        acc[game.id] = {
          home: game.home,
          away: game.away,
          score: game.score,
          bet: autoDetectBetType(game.score),
          kolejkaId: game.kolejkaId,
        };
      }
      return acc;
    }, {});

    if (Object.keys(newBetsToSubmit).length === 0) {
      alert("Wszystkie zakłady zostały już przesłane.");
      return;
    }

    update(ref(database, `submittedData/${selectedUser}`), newBetsToSubmit)
      .then(() => {
        setSubmittedData(prev => ({
          ...prev,
          [selectedUser]: {
            ...prev[selectedUser],
            ...newBetsToSubmit
          }
        }));
        setIsDataSubmitted(true);
        alert('Zakłady zostały pomyślnie przesłane!');
      })
      .catch((error) => {
        console.error('Błąd:', error);
        alert('Wystąpił błąd przy zapisie. Spróbuj ponownie.');
      });
  };

  const getTeamLogo = (name) => teamsData[name]?.logo || '';
  const toggleEditableOff = () => setAreInputsEditable(false);
  const toggleEditableOn = () => setAreInputsEditable(true);

  return (
    <div className="fade-in" style={{ textAlign: 'center' }}>
      {/* ... UI remains unchanged ... */}
    </div>
  );
};

export default Bets;