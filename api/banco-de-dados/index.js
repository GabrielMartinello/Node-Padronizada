const Sequelize = require('sequelize')
const config = require('config')

//vai pegar os dados em JSon da pasta config/default.json
//configuração do banco de dados com sequelize.
//gerencia conexao com o banco de dados, e trabalha com os formatos JSON em js;
const instancia = new Sequelize(
    config.get('mysql.banco-de-dados'),
    config.get('mysql.usuario'),
    config.get('mysql.senha'),
    {
        host: config.get('mysql.host'),
        dialect: 'mysql'
    }
)

module.exports = instancia