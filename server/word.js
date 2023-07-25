// word.js
const connection = require('./database');

// Function to fetch all words from the database
const getAllWords = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM palavras', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { getAllWords };
