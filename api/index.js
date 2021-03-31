const express = require('express')
const app = express()
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

//gerenciador de pacotes;
//raiz da api
//recebe as requisicoes como JSon e transforma em JavaScript
app.use(express.json());


app.use((requisicao, resposta, proximo) => {
    //tipo que o cliente da requisicao esta aceitando   
    let formatoRequisitado = requisicao.header('Accept')

    //se o formato que foi pedido foi qualquer coisa
    //mesmo quando nao especificar qual o formato da resposta
    if (formatoRequisitado === '*/*') {
        //vai transformar em json
        formatoRequisitado = 'application/json'
    }


    //verifica se o que foi requisitado esta dentro da lista
    // caso o valor nao exista na lista, retorna o valor -1
    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        //formato qequistida não é aceito pela api
        resposta.status(406)
        resposta.end()
        //depois da resposta.end o return nao deixa mais passar por esse codigo;
        return
    }
    //caso seja aceito, passamos o tipo do conteudo, o valor
    //continua a requisicao;
    resposta.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

//middler
//centralizando todo os erros que chegar na nossa api
//classificando os erros
app.use((erro, requisicao, resposta, proximo) => {
    let status = 500

    //verifica se o erro é uma instancia do notfound
    if (erro instanceof NaoEncontrado) {
        status = 404
    }

    //verifica se sao validos
    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }

    //formato de dados que nao existe
    if (erro instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
    )
    resposta.status(status)
    resposta.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

//configuracao da porta da api, aqui a porta esta rodando na porta 3000
//se voce quiser ver onde esta as config
//acesse a pasta config/default.json
//transformamos json em javaScript, por isso compila.
app.listen(config.get('api.porta'), () => console.log('A API está funcionando!'))