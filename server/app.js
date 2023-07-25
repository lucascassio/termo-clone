// app.js
const express = require('express');
const app = express();
const { getAllWords } = require('./word');

// Rest of your application logic...

// Route to fetch all words from the database
app.get('/words', async (req, res) => {
  try {
    const words = await getAllWords();
    res.json(words);
  } catch (error) {
    console.error('Error retrieving words:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}: http://localhost:${PORT}`);
});
