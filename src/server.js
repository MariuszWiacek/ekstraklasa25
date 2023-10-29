const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const submittedData = {}; // Store submitted data in memory (replace with a database in production)

app.post('/submit-bets', (req, res) => {
  const submittedBets = req.body;

  // Assuming submittedBets is an array of bets with a username field
  if (submittedBets && Array.isArray(submittedBets)) {
    submittedBets.forEach((bet) => {
      const { username, bets } = bet;
      submittedData[username] = bets;
    });

    res.status(200).json({ message: 'Bets submitted successfully' });
  } else {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.get('/retrieve-bets/:username', (req, res) => {
  const username = req.params.username;

  if (submittedData[username]) {
    res.status(200).json({ username, bets: submittedData[username] });
  } else {
    res.status(404).json({ error: 'Bets not found for this username' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
