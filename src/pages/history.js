import React from "react";
import { FaMedal } from "react-icons/fa";

const historyData = [
  {
    title: "Ekstraklasa Jesień 2024",
    link: "https://ekstraklasa24.vercel.app/",
    podium: [
      { name: "Robert", place: 1 },
      { name: "Alan", place: 2 },
      { name: "Łukasz", place: 3 },
    ],
  },
  {
    title: "EURO 2024",
    link: "https://eurobet2024.vercel.app/",
    podium: [
      { name: "Piotr", place: 1 },
      { name: "Robert", place: 2 },
      { name: "Marek", place: 3 },
    ],
  },
];

const medalColors = {
  1: "#F6C90E", // gold
  2: "#C0C0C0", // silver
  3: "#CD7F32", // bronze
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(31,41,55,0.6), rgba(0,0,0,0.8))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "800",
    marginBottom: "3rem",
    color: "#FFD43B",
    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
  },
  summary: {
    marginBottom: "3rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1.5rem 2rem",
    borderRadius: "15px",
    maxWidth: "600px",
    width: "100%",
    color: "#FFD43B",
    fontWeight: "700",
    fontSize: "1.3rem",
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem", // increased spacing
    gap: "1rem", // space between name and medals
    cursor: "default",
  },
  summaryName: {
    fontSize: "2rem", // bigger font for names
    fontWeight: "700",
    color: "#FFD43B",
    minWidth: "120px", // consistent alignment
  },
  medalIcon: {
    marginLeft: "0.5rem", // more space between medals
    width: "22px",
    height: "22px",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))",
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "2rem 2.5rem",
    marginBottom: "3rem",
    maxWidth: "600px",
    width: "100%",
    color: "#FFE066",
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
  },
  header: {
    marginBottom: "0.5rem",
  },
  editionTitle: {
    fontSize: "2.25rem",
    fontWeight: "600",
    color: "#FFD43B",
  },
  link2: {
    display: "block",
    marginTop: "0.25rem",
    color: "#AAA",
    fontWeight: "500",
    fontStyle: "italic",
    textDecoration: "underline",
    fontSize: "1rem",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
    margin: "1.5rem 0 0 0",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.8rem", // increased vertical spacing
    cursor: "default",
  },
  medal: {
    marginRight: "0.8rem", // spacing between medal and name
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))",
    width: "36px",
    height: "36px",
  },
  winnerName: {
    fontSize: "42px", // bigger winner name font
    fontWeight: "800",
    color: medalColors[1],
  },
  secondThirdName: {
    fontSize: "20px", // bigger 2nd/3rd place font
    fontWeight: "700",
  },
};

const Historia = () => {
  // Collect medal counts for each user
  const medalCount = {};
  historyData.forEach(({ podium }) => {
    podium.forEach(({ name, place }) => {
      if (!medalCount[name]) medalCount[name] = { gold: 0, silver: 0, bronze: 0 };
      if (place === 1) medalCount[name].gold++;
      else if (place === 2) medalCount[name].silver++;
      else if (place === 3) medalCount[name].bronze++;
    });
  });

  // Convert to array and sort by:
  // 1) total medals desc
  // 2) gold desc
  // 3) silver desc
  // 4) bronze desc
  const sortedMedalists = Object.entries(medalCount)
    .map(([name, medals]) => ({
      name,
      ...medals,
      total: medals.gold + medals.silver + medals.bronze,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🏆 Galeria Mistrzów</h1>

      {/* Summary of medalists */}
      <section style={styles.summary}>
        <h2>Medaliści</h2>
        <hr />
        {sortedMedalists.map(({ name, gold, silver, bronze }) => (
          <div key={name} style={styles.summaryItem}>
            <span style={styles.summaryName}>{name}</span>
            {[...Array(gold)].map((_, i) => (
              <FaMedal
                key={`gold-${i}`}
                style={{ ...styles.medalIcon, color: medalColors[1] }}
                title="Złoty medal"
              />
            ))}
            {[...Array(silver)].map((_, i) => (
              <FaMedal
                key={`silver-${i}`}
                style={{ ...styles.medalIcon, color: medalColors[2] }}
                title="Srebrny medal"
              />
            ))}
            {[...Array(bronze)].map((_, i) => (
              <FaMedal
                key={`bronze-${i}`}
                style={{ ...styles.medalIcon, color: medalColors[3] }}
                title="Brązowy medal"
              />
            ))}
          </div>
        ))}
      </section>

      <h2>Poprzednie edycje :</h2>
      <hr />

      {/* Detailed podiums */}
      {historyData.map((edycja, index) => (
        <section key={index} style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.editionTitle}>{edycja.title}</h2>
            <a
              href={edycja.link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link2}
            >
              {edycja.link}
            </a>
          </div>

          <ul style={styles.list}>
            {edycja.podium.map(({ name, place }) => {
              const color = medalColors[place] || "#FFE066";
              let nameStyle = {};

              if (place === 1) {
                nameStyle = { ...styles.winnerName, color };
              } else if (place === 2) {
                nameStyle = { ...styles.secondThirdName, color: medalColors[2] };
              } else if (place === 3) {
                nameStyle = { ...styles.secondThirdName, color: medalColors[3] };
              } else {
                nameStyle = { color };
              }

              return (
                <li key={place} style={styles.listItem}>
                  <FaMedal style={{ ...styles.medal, color }} />
                  <span style={nameStyle}>
                    {place}. {name}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default Historia;
