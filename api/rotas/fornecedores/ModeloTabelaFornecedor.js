const Sequelize = require('sequelize')
const instancia = require('../../banco-de-dados')


//cria tabelas MYSQL em código, utilizando sequelize;
//define o tipo do campo e se pode ser nulo ou nao.
const colunas = {
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull: false
    }
}

//freezeTableName -> Congela e nao altera o nome da nossa tabela
//tablename -> o nome da nossa tabela
//timestamps -> ativa colunas de data, atraves do sequelize
//createdAt -> datacriacao
//updatedAt -> data atualizacao
//version -> versao do nosso fornecedor.
const opcoes = {
    freezeTableName: true,
    tableName: 'fornecedores',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}


//primeiro argumento, passamos o nome da nossa tablea,segundo argumento as colunas, opcoes
module.exports = instancia.define('fornecedor', colunas, opcoes)