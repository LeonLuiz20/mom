module.exports.getAddress = function (items, os, xmlAddresses, xmlbuilder) {
    let addressOld = '';
    let addressNew = '';

    items.forEach(item => {

        if (item.IdCatalogo === 'OI_INTERNET') {

            item.ListaAtributos.Atributo.forEach(atributo => {

                if (atributo.Nome === 'Id Acesso') {

                    addressOld = atributo.ValorAntigo;
                    addressNew = atributo.Valor;

                    let addresses = os['Pedido']['ListaDeEndereco']['Endereco'];
                    addresses.forEach(address => {

                        address.change = '';

                        if (address.IdEndereco === addressOld) {
                            address.change = 'Original';
                        }
                        if (address.IdEndereco === addressNew) {
                            address.change = 'Novo';
                        }

                        if (address.change !== '') {

                            xmlAddresses.ele('endereco')
                                .ele('tipoEndereco', address.change).up()
                                .ele('id', address.IdEndereco).up()
                                .ele('tipoLogradouro', address.TipoLogr).up()
                                .ele('nomeLogradouro', address.NomeLogr).up()
                                .ele('numero', address.Numero).up()
                                .ele('tipoComplemento1', address.TipoCompl1).up()
                                .ele('complemento1', address.NroCompl1).up()
                                .ele('tipoComplemento2', address.TipoCompl2).up()
                                .ele('complemento2', address.NroCompl2).up()
                                .ele('tipoComplemento3', address.TipoCompl3).up()
                                .ele('complemento3', address.NroCompl3).up()
                                .ele('codigoLocalidade', address.CodLocalidade).up()
                                .ele('localidade', address.Localidade).up()
                                .ele('bairro', address.Bairro).up()
                                .ele('cidade', address.Localidade).up()
                                .ele('estado', address.Estado).up()
                                .ele('pontoDeReferencia', address.PontoRef).up()
                                .ele('cep', address.CEP).up()
                                .ele('idLogradouro', address.idLogradouro).up()
                                .ele('siglaLocalidade', address.SiglaLocalidade).up()
                                .up();

                        }

                    });

                }

            });

        }

    });
    return xmlAddresses;
}