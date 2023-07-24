const Sequelize = require('sequelize');
const sequelize = new Sequelize("termo", "root", "password", {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(function() {
    console.log("CONEXAO COM O BANCO DE DADOS FEITA COM SUCESSO!");
  })
  .catch(function(error) {
    console.error("ERRO! CONEXAO COM O BANCO DE DADOS FALHOU!", error);
  });

module.exports = sequelize;
