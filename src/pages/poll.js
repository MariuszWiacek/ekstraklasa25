import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGVW31sTa6Giafh0-JTsnJ9ghybYEsJvE",
  authDomain: "wiosna25-66ab3.firebaseapp.com",
  databaseURL: "https://wiosna25-66ab3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wiosna25-66ab3",
  storageBucket: "wiosna25-66ab3.firebasestorage.app",
  messagingSenderId: "29219460780",
  appId: "1:29219460780:web:de984a281514ab6cdc7109",
  measurementId: "G-8Z3CMMQKE8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Poll = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [votes, setVotes] = useState(null);

  // Load votes from Firebase on component mount
  useEffect(() => {
    const votesRef = ref(database, "votes");
    onValue(votesRef, (snapshot) => {
      if (snapshot.exists()) {
        setVotes(snapshot.val());
      } else {
        const initialVotes = {
          option1: { count: 0, voters: [] },
          option2: { count: 0, voters: [] },
          oldRules: { count: 0, voters: [] },
        };
        setVotes(initialVotes);
        set(ref(database, "votes"), initialVotes);
      }
    });
  }, []);

  // Load last chosen user from local storage
  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem("users.json"));
      if (users && users.length > 0) {
        const lastUser = users[users.length - 1];
        setUsername(lastUser.username || "");
      }
    } catch (error) {
      console.error("Error loading users from local storage:", error);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username && selectedOption) {
      const updatedVotes = { ...votes };

      if (selectedOption === "Option 1") {
        updatedVotes.option1.count += 1;
        updatedVotes.option1.voters = [...(updatedVotes.option1.voters || []), username];
      } else if (selectedOption === "Option 2") {
        updatedVotes.option2.count += 1;
        updatedVotes.option2.voters = [...(updatedVotes.option2.voters || []), username];
      } else if (selectedOption === "Old Rules") {
        updatedVotes.oldRules.count += 1;
        updatedVotes.oldRules.voters = [...(updatedVotes.oldRules.voters || []), username];
      }

      update(ref(database, "votes"), updatedVotes);

      setUsername("");
      setSelectedOption("");
      alert("Dziękujemy za Twój głos!");
    } else {
      alert("Wypełnij wszystkie pola!");
    }
  };

  if (!votes) {
    return <div style={{ color: "white" }}>Ładowanie ankiety...</div>;
  }

  // Calculate the total number of votes
  const totalVotes = votes.option1.count + votes.option2.count + votes.oldRules.count;

  // Calculate the percentage for each option
  const option1Percentage = totalVotes ? (votes.option1.count / totalVotes) * 100 : 0;
  const option2Percentage = totalVotes ? (votes.option2.count / totalVotes) * 100 : 0;
  const oldRulesPercentage = totalVotes ? (votes.oldRules.count / totalVotes) * 100 : 0;

  return (
    <div style={pollContainerStyle}>
      <div style={pollContentStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          X
        </button><br></br>
        <h3>Uwaga!</h3>
        <p style={{ color: "black" }}>
          Zastanawiamy się nad wprowadzeniem jednego z dwóch bonusów, aby urozmaicić grę do konca i żeby dać szansę tym, którym
          idzie trochę gorzej.
        <br></br>
        Robimy małą ankietę do 24.1
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Wpisz swoją nazwę użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <div>
            <label style={optionLabelStyle}>
              <hr></hr><input
                type="radio"
                value="Option 1"
                checked={selectedOption === "Option 1"}
                onChange={(e) => setSelectedOption(e.target.value)}
              /><br></br>
              1. Bonus 10 zł - za każdą wygraną kolejkę – jeśli kolejkę wygra więcej osób, pula przechodzi na następną rundę.
            </label>
            <p style={voteCountStyle}>Głosy: {votes.option1.count}</p>
            <div style={progressBarContainerStyle}>
              <div
                style={{
                  ...progressBarStyle,
                  width: `${option1Percentage}%`, // Set width dynamically
                }}
              ></div>
            </div>
            <div style={votersStyle}>
              {(votes.option1.voters || []).map((voter, index) => (
                <span key={index}>{voter} </span>
              ))}
            </div>
          </div>
          <div>
            <label style={optionLabelStyle}>
              <hr></hr> <input
                type="radio"
                value="Option 2"
                checked={selectedOption === "Option 2"}
                onChange={(e) => setSelectedOption(e.target.value)}
              /><br></br>
              2. Bonus 50 zł dla najlepszego typera miesiąca (4 kolejki).
            </label>
            <p style={voteCountStyle}>Głosy: {votes.option2.count}</p>
            <div style={progressBarContainerStyle}>
              <div
                style={{
                  ...progressBarStyle,
                  width: `${option2Percentage}%`, // Set width dynamically
                }}
              ></div>
            </div>
            <div style={votersStyle}>
              {(votes.option2.voters || []).map((voter, index) => (
                <span key={index}>{voter} </span>
              ))}
            </div>
          </div>
          <div>
            <label style={optionLabelStyle}>
              <hr></hr><input
                type="radio"
                value="Old Rules"
                checked={selectedOption === "Old Rules"}
                onChange={(e) => setSelectedOption(e.target.value)}
              /><br></br>
              Stare zasady - bez dodatkowych bonusów
            </label>
            <p style={voteCountStyle}>Głosy: {votes.oldRules.count}</p>
            <div style={progressBarContainerStyle}>
              <div
                style={{
                  ...progressBarStyle,
                  width: `${oldRulesPercentage}%`, // Set width dynamically
                }}
              ></div>
               <div style={votersStyle}>
              {(votes.oldRules.voters || []).map((voter, index) => (
                <span key={index}>{voter} </span>
              ))}
            </div>
            </div>
          </div>
          <button type="submit" style={submitButtonStyle}>
            Wyślij
          </button>
        </form>
      </div>
    </div>
  );
};

const pollContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
  overflow: "hidden",
};

const pollContentStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
  width: "90%",
  maxWidth: "500px",
  textAlign: "center",
  position: "relative",
  maxHeight: "80%", // Limit the height to allow for scrolling
  overflowY: "auto", // Enable vertical scrolling
};

const votersStyle = {
  fontSize: "12px",
  color: "gray",
  marginBottom: "10px",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  cursor: "pointer",
};

const inputStyle = {
  margin: "10px 0",
  padding: "10px",
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const optionLabelStyle = {
  display: "block",
  margin: "10px 0",
  color: "black",
};

const voteCountStyle = {
  fontSize: "14px",
  color: "black",
};

const progressBarContainerStyle = {
  width: "100%",
  height: "10px",
  backgroundColor: "#ccc",
  borderRadius: "5px",
  marginBottom: "10px",
};

const progressBarStyle = {
  height: "100%",
  backgroundColor: "green",
  borderRadius: "5px",
};

const submitButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Poll;
