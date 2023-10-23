const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Define the guestbook data file
const dataFile = 'guestbook.json';

// API endpoints
app.get('/api/entries', (req, res) => {
  // Read guestbook entries from the JSON file
  const entries = JSON.parse(fs.readFileSync(dataFile));
  res.json(entries);
});

app.post('/api/entries', (req, res) => {
  const newEntry = req.body;

  // Read existing entries from the JSON file
  const entries = JSON.parse(fs.readFileSync(dataFile));

  // Add the new entry
  entries.push(newEntry);

  // Write entries back to the JSON file
  fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));

  res.json({ message: 'Entry added successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
