// client.js
const apiUrl = 'http://localhost:3000/api/palavras';

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // This will be an array of palavras fetched from the database
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
