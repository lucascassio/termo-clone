// db.js
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error("ERRO! CONEXAO COM O BANCO DE DADOS FALHOU!", err);
  } else {
    console.log("CONEXAO COM O BANCO DE DADOS FEITA COM SUCESSO!");
  }
});

module.exports = connection;
