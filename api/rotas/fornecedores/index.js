const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor


//await -> pedir para esperar terminar o metodo listar, mandar os dados
roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar();
    //retorna o status se a operacao foi bem sucedida
    resposta.status(200)
    const serializador = new SerializadorFornecedor(
        //vai retornar o tipo da resposta com o setHeader, o cabeçalho ou formato do valor
        resposta.getHeader('Content-Type')
    )
    //vai enviar os dados serializados
    resposta.send(
        serializador.serializar(resultados)
    )
})

//metodo para cadastrar um novo usuario
roteador.post('/', async (requisicao, resposta, proximo) => {
    //tratamento para caso de algum erro
    try {
        //vai retornar o corpo da requisicao
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos);
        //espera o metodo criar ser executado
        await fornecedor.criar();
        //se foi sucesso, retorna o status 201;
        resposta.status(201)
        const serializador = new SerializadorFornecedor(
            //passa o tipo do cabeçalho
            resposta.getHeader('Content-Type')
        )
        //envia dados serializados;
        resposta.send(
            serializador.serializar(fornecedor)
        )
        //se houver algum erro, o catch pega e retorna para nós
    } catch (erro) {
        proximo(erro)
    }
})

//aqui pegamos o fornecedor que desejamos, pelo seu ID
roteador.get('/:idFornecedor', async (requisicao, resposta, proximo) => {
    //tratamento para caso houver alguma excessao
    try {
        //pega as informacoes que estamos recebendo
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        //carrega os dados do fornecedor desejado
        await fornecedor.carregar()
        //se der tudo certo, retorna o status 200
        resposta.status(200);
        //retorna os dados serializados, para pegar os detalhes do id
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            //passando uma lista com os campos extras, como é realizado uma busca
            //queremos ver todos os dados de determinado fornecedor,
            //entao queremos todos os detalhes
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        //vai retornar detalhadamente os dados do fornecedor
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})


//metodo utilizado para editarmos um fornecedor
roteador.put('/:idFornecedor', async (requisicao, resposta, proximo) => {
    //tratamento se houver alguma excessao
    try {
        //pega as informacoes que estamos recebendo.
        const id = requisicao.params.idFornecedor
        //pega o corpo da requisicao
        const dadosRecebidos = requisicao.body

        //juntando as duas variaveis
        //assign -> conseguimos juntar varios objetos em um só
        //nossa classe de fornecedor so aceita um objeto pra instanciar,
        //por isso usmos o assign
        const dados = Object.assign({}, dadosRecebidos, { id: id });
        //passamos os dados que foram juntados
        const fornecedor = new Fornecedor(dados)
        //chamamos o metodo de atualizar o fornecedor
        await fornecedor.atualizar()
        //retornamos status 204, que foi criado
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

//metodo usado para deletar o fornecedor
roteador.delete('/:idFornecedor', async (requisicao, resposta, proximo) => {
    //usamos um tratamento para evitar excessoes
    try {
        //pega as informacoes que estamos recebendo
        const id = requisicao.params.idFornecedor
        //pega o id do fornecedor
        const fornecedor = new Fornecedor({ id: id })
        //carrega o fornecdor pelo id
        await fornecedor.carregar()
        //remove o fornecedor
        await fornecedor.remover()
        //retornamos status 204;
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

//exportamos o roteador para usarmos em outro lugar;
module.exports = roteador