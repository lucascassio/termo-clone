const express = require('express');
import mysql from "mysql";

const app = new express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "termo"
})

app.get('/', (req, res) => {
  con.query('SELECR * FROM palavras', (err, result) => {
    res.send(result);
  })
})

app.listen('3030', () => {
  console.log('Running server');
})