const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

//metodos que usamos dentro da nossa aplicacao
//retona os dados que estao no banco de dados da api
//findAll -> metodo do sequelize
module.exports = {
    listar () {
        return Modelo.findAll({ raw: true })
    },
    //metodo para inserir fornecedor no banco
    inserir (fornecedor) {
        //cria fornecedor
        return Modelo.create(fornecedor)
    },

    //metodo usado para buscar o fornecedor pelo seu id usando
    //sequelize, comk o metodo findOne
    async pegarPorId (id) {
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })

        //se o id nao foi encontrado, joga um erro para mostrar para o usuario
        if (!encontrado) {
            throw new NaoEncontrado()
        }
        //se nao retorna o fornecedor encontrado
        return encontrado
    },

    //metodo usado para editar o fornecedor
    atualizar (id, dadosParaAtualizar) {
        //usamos o Update para atualizar o fornecedor, buscando o fornecedor pelo id desejado
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: { id: id }
            }
        )
   },
   //metodo usado para remover um fornecedor, com a palavra chave do sequelize destroy
   //procura o fornecedor pelo seu id
    remover (id) {
        return Modelo.destroy({
            where: { id: id }
        })
    }
}