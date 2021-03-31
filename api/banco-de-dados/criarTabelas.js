const ModeloTabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')

//pega as configuracoes que criamos
//sincronizando as config
//vai executar quando a promise acabar
//caso tenha glum erro pegamos com o catch
ModeloTabela
    .sync()
    .then(() => console.log('Tabela criada com sucesso'))
    .catch(console.log)