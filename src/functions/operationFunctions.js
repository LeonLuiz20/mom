module.exports.getOperations = function (reqData, xmlOperations, xmlbuilder) {
    xmlOperations.ele('operacao')
        .ele('nomeOperacao', 'mudancaEnderecoFTTH').up()
        .ele(reqData.idAtivo.name, reqData.idAtivo.value).up()
        .ele('tipoProduto', reqData.tipoBundle.value).up()
        .up();
    return xmlOperations;
}