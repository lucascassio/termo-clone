const express = require("express");
const app = express();

const db = require('./database');
const Word = require('./word');

(async () => {
  try {
    await db.authenticate();
    console.log("CONEXAO COM O BANCO DE DADOS FEITA COM SUCESSO!");

    await db.sync();
    console.log("Model synchronization completed.");

    app.get("/", async (req, res) => {
      res.send("Pagina inicial - termo");
    });


app.get("/word", async (req, res) => {
    try {
      const words = await Word.findAll();
      res.json(words);
    } catch (error) {
      console.error("Error retrieving words:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
    app.listen(8080, () => {
      console.log("Servidor iniciado na porta 8080: http://localhost:8080");
    });
  } catch (error) {
    console.error("ERRO! CONEXAO COM O BANCO DE DADOS FALHOU!");
  }
})();
