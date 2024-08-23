module.exports.getAccesses = function (items, reqData, qtdPontos, xmlbuilder) {
    const xmlAccesses = xmlbuilder.create('acessos');
    let qtdPontosRFOverlay = qtdPontos.qtdPontosRFOverlay;
    let qtdPontosSTBDVRGratis = qtdPontos.qtdPontosSTBDVRGratis;
    let qtdPontosSTBHDGratis = qtdPontos.qtdPontosSTBHDGratis;
    let qtdPontosSTBHDPago = qtdPontos.qtdPontosSTBHDPago;

    
    items.forEach(item => {

        const xmlPlan = xmlbuilder.create('plano');
        const xmlBlocks = xmlbuilder.create('bloqueios');
        const xmlAttributs = xmlbuilder.create('atributos');
        const xmlDigitalServices = xmlbuilder.create('servicosDigitais');
        const xmlServices = xmlbuilder.create('servicos');
        const xmlFranchisePlans = xmlbuilder.create('planosFranquia');
        const xmlAditonalPackages = xmlbuilder.create('pacotesAdicionais');

        if (item.IdItemPaiPedido === reqData.idAtivo.value) {

            items.forEach(itemChild => {

                if (itemChild.IdItemPaiPedido === item.IdAtivo) {

                    if (itemChild.TipoProduto === 'Velocidade' || itemChild.TipoProduto === 'Plano') {

                        let xmlPlanAttributeList = xmlbuilder.create('listaDeAtributos');
                        itemChild.ListaAtributos.Atributo.forEach(atributo => {
                            xmlPlanAttributeList.ele('atributo')
                                .ele('nome', atributo.Nome).up()
                                .ele('valor', atributo.Valor).up()
                                .up();
                        });

                        xmlPlan.ele('idCatalogo', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.Nome).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up()
                            .importDocument(xmlPlanAttributeList);
                    }

                    if (itemChild.TipoProduto === 'Pacote de Canal Linear') {

                        let xmlPlanAttributeList = xmlbuilder.create('listaDeAtributos');
                        itemChild.ListaAtributos.Atributo.forEach(atributo => {
                            xmlPlanAttributeList.ele('atributo')
                                .ele('nome', atributo.Nome).up()
                                .ele('valor', atributo.Valor).up()
                                .up();
                        });

                        xmlPlan.ele('idCatalogo', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.Nome).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up()
                            .ele('qtdPontosRFOverlay', qtdPontosRFOverlay).up()
                            .ele('qtdPontosSTBDVRGratis', qtdPontosSTBDVRGratis).up()
                            .ele('qtdPontosSTBHDGratis', qtdPontosSTBHDGratis).up()
                            .ele('qtdPontosSTBHDPago', qtdPontosSTBHDPago).up()
                            .importDocument(xmlPlanAttributeList);
                    }

                    if (itemChild.TipoProduto === 'Serviço Digital') {

                        xmlDigitalServices.ele('servicoDigital')
                            .ele('idServico', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.Nome).up()
                            .ele('tipoProduto', itemChild.TipoProduto).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up();

                    }

                    if (itemChild.TipoProduto === 'Bloqueio') {

                        xmlDigitalServices.ele('bloqueio')
                            .ele('idServico', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.IdCatalogo).up()
                            .ele('tipoProduto', itemChild.TipoProduto).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up();

                    }

                    if (itemChild.TipoProduto === 'Serviço') {

                        let xmlServiceAttributeList = xmlbuilder.create('atributos');
                        itemChild.ListaAtributos.Atributo.forEach(atributo => {
                            xmlServiceAttributeList.ele('atributo')
                                .ele('nome', atributo.Nome).up()
                                .ele('valor', atributo.Valor).up()
                                .up();
                        });

                        xmlServices.ele('servico')
                            .ele('idCatalogo', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.Nome).up()
                            .ele('tipoProduto', itemChild.TipoProduto).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up()
                            .importDocument(xmlServiceAttributeList);

                    }

                    if(itemChild.TipoProduto === 'Plano de Franquia'){

                        let xmlFranchiseAttributeList = xmlbuilder.create('listaDeAtributos');
                        itemChild.ListaAtributos.Atributo.forEach(atributo => {
                            xmlPlanAttributeList.ele('atributo')
                                .ele('nome', atributo.Nome).up()
                                .ele('valor', atributo.Valor).up()
                            .up();
                        });

                        xmlFranchisePlans.ele('planoFranquia')
                            .ele('idCatalogo', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.Nome).up()
                            .ele('tipoProduto', itemChild.TipoProduto).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up()
                            .importDocument(xmlFranchiseAttributeList);

                    }

                    if (itemChild.TipoProduto === 'Pacote de Canal Adicional') {

                        xmlAditonalPackages.ele('pacoteAdicional')
                            .ele('idCatalogo', itemChild.IdCatalogo).up()
                            .ele('nome', itemChild.Nome).up()
                            .ele('tipoProduto', itemChild.TipoProduto).up()
                            .ele('acao', itemChild.Acao).up()
                            .ele('idAtivo', itemChild.IdAtivo).up();

                    }

                }

            });

            item.ListaAtributos.Atributo.forEach(atributo => {

                if (

                    (item.IdCatalogo === 'OI_VOIP' &&
                        (atributo.Nome === 'Código Nacional' ||
                            atributo.Nome === 'Código da Localidade' ||
                            atributo.Nome === 'Código da Localidade Estação' ||
                            atributo.Nome === 'Código da Localidade Fisico' ||
                            atributo.Nome === 'Código da Localidade Lista' ||
                            atributo.Nome === 'DDD Físico' ||
                            atributo.Nome === 'DDD Linha' ||
                            atributo.Nome === 'Estação' ||
                            atributo.Nome === 'Estação Literal' ||
                            atributo.Nome === 'Id Estação' ||
                            atributo.Nome === 'Localidade Linha' ||
                            atributo.Nome === 'Número Físico' ||
                            atributo.Nome === 'Portabilidade Interna' ||
                            atributo.Nome === 'Portabilidade Interna com Troca de Tecnologia' ||
                            atributo.Nome === 'Portabilidade Receptora' ||
                            atributo.Nome === 'Número da Linha' ||
                            atributo.Nome === 'Tipo Meio Acesso')) ||

                    (item.IdCatalogo === 'OI_INTERNET' &&
                        (atributo.Nome === 'Tipo Meio Acesso')) ||

                    (item.IdCatalogo === 'OI_IPTV' &&
                        (atributo.Nome === 'Tipo Meio Acesso'))

                ) {
                    xmlAttributs.ele('atributo')
                        .ele('nome', atributo.Nome).up()
                        .ele('valor', atributo.Valor).up();
                }

            });

            xmlAccesses.ele('acesso')
                .ele('idCatalogo', item.IdCatalogo).up()
                .ele('idAtivo', item.IdAtivo).up()
                .ele('nome', item.Nome).up()
                .ele('tipoProduto', item.TipoProduto).up()
                .ele('acao', item.Acao).up()
                .importDocument(xmlPlan)
                .importDocument(xmlBlocks)
                .importDocument(xmlAttributs)
                .importDocument(xmlDigitalServices)
                .importDocument(xmlServices)
                .importDocument(xmlAditonalPackages);

        }
        
    });    

    return xmlAccesses;
    
}