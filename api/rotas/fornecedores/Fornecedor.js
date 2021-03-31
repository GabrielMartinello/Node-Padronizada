const TabelaFornecedor = require('./TabelaFornecedor')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Fornecedor {
    constructor ({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    //cria usuario
    //chama o metodo inserir da TabelaFornecedor
    async criar () {
        //chama o metodo dessa classe, validar
        this.validar()
        //espera executar o metodo inserir
        const resultado = await TabelaFornecedor.inserir({
            //insere dados para os campos
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    //carrega os dados do fornecedor
    async carregar () {
        //pega o fornecedor desejado
        const encontrado = await TabelaFornecedor.pegarPorId(this.id)
        //mostra os campos do fornecedor
        this.empresa = encontrado.empresa
        this.email = encontrado.email
        this.categoria = encontrado.categoria
        this.dataCriacao = encontrado.dataCriacao
        this.dataAtualizacao = encontrado.dataAtualizacao
        this.versao = encontrado.versao
    }

    //metodo para editar fornecedor
    async atualizar () {
        //pega o id do fornecedor
        await TabelaFornecedor.pegarPorId(this.id)
        //campos que sao permitidos manipular
        const campos = ['empresa', 'email', 'categoria']
        //mostra uma lista vazia
        const dadosParaAtualizar = {}

        //percorre a lista
        campos.forEach((campo) => {
            const valor = this[campo]
            //verifica se o valor dos campos é string e se sao vazios
            if (typeof valor === 'string' && valor.length > 0) {
                //passa os campos para atualizar
                dadosParaAtualizar[campo] = valor
            }
        })

        //verifica se a lista tem os campos que o objeto possui, e verifica se é nulo
        if (Object.keys(dadosParaAtualizar).length === 0) {
            //se passar por aqui retona a excessao
            throw new DadosNaoFornecidos()
        }
        
    
        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar)
    }


    //metodo usado para remover o fornecedor por seu id
    remover () {
        //vai retornar o fornecedor e remover
        return TabelaFornecedor.remover(this.id)
    }

    //valida se os campos sao validos
    validar () {
        const campos = ['empresa', 'email', 'categoria']

        campos.forEach(campo => {
            const valor = this[campo]

            if (typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo)
            }
        })
    }
}

module.exports = Fornecedor