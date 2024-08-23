module.exports.getContact = function(os, reqData, xmlbuilder) {
    const account = os['Pedido']['ListaDeContaCliente']['ContaCliente'];
    const contact = os['Pedido']['ContatoSolicitante'];
    const xmlContact = xmlbuilder.create('contato');    
    
    if(account.IdConta === reqData.idConta.value){                        
        xmlContact.ele('nome', contact.Nome).up()
            .ele('numeroDocumento', account.NumeroDoc).up()
            .ele('dataNascimento', account.DtNascimento).up()
            .ele('nomeMae', account.NomeMae).up()
            .ele('sexo', account.Sexo).up()
            .ele('email', account.Email).up()
            .ele('telefoneContato1', contact.TelefoneContato1).up()
            .ele('telefoneContato2', contact.TelefoneContato2).up()
            .ele('telefoneContato3', contact.TelefoneContato3).up()
            .ele('nomeRazaoSocial', account.NomeRazaoSocial).up()
            .ele('nomeConta', account.NomeConta).up()
            .ele('unidadeNegocio', account.UnidadeNegocio).up()
            .ele('segmentoMercado', account.SegmentoMercado).up();
    }
    return xmlContact;
}