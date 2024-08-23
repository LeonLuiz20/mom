const express = require('express');
const cors = require('cors');
const xml2js = require('xml2js');
const xmlbuilder = require('xmlbuilder');
const basicAuth = require('express-basic-auth');
const axios = require('axios');

// Functions XML Structure
const contactF = require('../functions/contactFunctions');
const accessF = require('../functions/accessFunctions');
const requestF = require('../functions/requestFunctions');
const operationF =  require('../functions/operationFunctions');
const addressF = require('../functions/addressFunctions');
const logF = require('../functions/logFunctions');

//Parameters
const paramConfig = require('../config/parameters');

module.exports = function(server) {

    const router = express.Router();
    const paramsMOM = paramConfig.configMOM();
    const schLogTransactions = require('../schemasLegado/sch_log_transactions');

    server.use(cors());
    server.use('/api', router);

    paramsMOM.then(p => {

        let us = p.users;
        let ch = p.challenge;
        let ur = p.ur;

        server.use(basicAuth({
            us,
            challenge: ch,
            unauthorizedResponse: (req) => ur
        }));

    });

    /** Chamada ao SOM (NF) */    
    const urlSOM = 'http://osmdx02:7003/OrderManagement/wsapi';
    const usernameSOM = 'soa';
    const passwordSOM = 'soati#01';
    const tokenSOM = `${usernameSOM}:${passwordSOM}`;
    const encondedTokenSOM = Buffer.from(tokenSOM).toString("base64");
    
    const sendXmlToSOM = async (xml, env) => {        
        try {
            const response = await axios.post(urlSOM, xml, {
                headers: {                    
                    'Authorization': 'Basic ' + encondedTokenSOM,
                    'Content-Type': 'application/soap+xml; charset=utf-8'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    };
    /** Chamada ao SOM (NF) */

    /** Chamada ao OM (ITCore) */
    const urlOM = 'http://somhx09:7003/cwf/services/CRMListenerInterface';
    const soapAction = 'http://oi.com.br/ifaceCRM/ReceiveFromCRM';

    const sendXmlToOM = async (xml) => {

        try {

            const response = await axios.post(urlOM, xml, {
                headers: {                    
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': soapAction
                }
            });
            return response.data;

        } catch (error) {
            return error;
        }

    };
    /** Chamada ao OM (ITCore) */

    /** Chamada ao SOA */
    const urlSOA = 'http://osbom.intranet:7200/GestorOS/RetornarPedidoConcluidoProxySoap';
    const usernameSOA = 'cw';
    const passwordSOA = 'OM#S2015';
    const tokenSOA = `${usernameSOA}:${passwordSOA}`;
    const encondedTokenSOA = Buffer.from(tokenSOA).toString("base64");

    const sendXmlToSOA = async (xml) => {
        try {
            const response = await axios.post(urlSOA, xml, {
                headers: {                    
                    'Authorization': 'Basic ' + encondedTokenSOA,
                    'Content-Type': 'application/soap+xml; charset=utf-8'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    };
    /** Chamada ao SOA */

    server.post('/api/solicitation/legado/create', function(req, res) {

        let _idTransaction;
        const xml = req.body;
        
        //Rebendo o parâmetro de ambiente para a requisição | Contruir para definir a chamada do SOM (DEV ou Local)
        if(req.headers.env) { const env = req.headers.env } else {const env = ''};

        xml2js.parseString(xml, { explicitArray: false, trim: true, normalize: true }, (err, result) => {

            if(result){

                let log1 = {
                    service: '/api/solicitation/legado/create',
                    origin: result['soapenv:Envelope']['SOAP-ENV:Body']['ifac:ProcessarOS']['Ator']['Sistema'],
                    xmlOriginal: xml,
                    receiveDate: new Date
                };

                schLogTransactions.create(log1).then(recOne => {

                    _idTransaction = recOne._id;
                    
                    let qtdPontos = {
                        qtdPontosRFOverlay: 0,
                        qtdPontosSTBDVRGratis: 0,
                        qtdPontosSTBHDGratis: 0,
                        qtdPontosSTBHDPago: 0,
                    }
                    
                    let os = result['soapenv:Envelope']['SOAP-ENV:Body']['ifac:ProcessarOS'];
                    let reqData = {
                        pedido: {
                            name: 'idPedido',
                            value: os['Pedido'].IdPedido
                        },
                        versao: {
                            name: 'versao',
                            value: os['Pedido'].Versao
                        },
                        timestamp: {
                            name: 'timestamp',
                            value: os['Pedido'].TimeStamp
                        }
                    };
    
                    let otherOperations = false;
    
                    let items = os['Pedido']['ListaDeItens']['ItemDaOrdem'];
                    items.forEach(item => {
    
                        if(item.IdItemPaiPedido === ''){
    
                            reqData.nomeBundle = {name: 'nomeBundle', value: item.Nome};
                            reqData.tipoBundle = {name: 'tipoBundle', value: item.TipoProduto};
                            reqData.tipoPromocao = {name: 'tipoPromocao', value: item.TipoPromocao};
                            reqData.idCatalogo = {name: 'idCatalogo', value: item.IdCatalogo};
                            reqData.codAtividade = {name: 'codAtividade', value: item.codAtividade};
                            reqData.origemPedido = {name: 'origemPedido', value: item.origemPedido};
                            reqData.idAtivo = {name: 'idAtivo', value: item.IdAtivo};
                            reqData.idConta = {name: 'idConta', value: item.IDContaCliente};
    
                            if(item.QtdPontosRFOverlay !== undefined){
                                qtdPontos.qtdPontosRFOverlay = item.QtdPontosRFOverlay;
                            }
    
                            if(item.QtdPontosSTBDVRGratis !== undefined){
                                qtdPontos.qtdPontosSTBDVRGratis = item.QtdPontosSTBDVRGratis;
                            }
    
                            if(item.QtdPontosSTBHDGratis !== undefined){
                                qtdPontos.qtdPontosSTBHDGratis = item.QtdPontosSTBHDGratis;
                            }
    
                            if(item.QtdPontosSTBHDPago !== undefined){
                                qtdPontos.qtdPontosSTBHDPago = item.QtdPontosSTBHDPago;
                            }
    
                            if(item.Acao === 'adicionar' || item.Acao === 'remover'){
                                otherOperations = true
                            }
    
                        }
    
                    });

                    
                    let addressChange = false;
                    items.forEach(item => {
                        if(
                            item.IdCatalogo === 'OPER_MUDANCA_ENDERECO' && 
                            item.Acao === 'adicionar'
                        ){
                            addressChange = true;
                        }
                    });
                    
                    const xmlOperation = xmlbuilder.create('operacoes');
                    const xmlAddress = xmlbuilder.create('listaEnderecos');
                    
                    if(addressChange && !otherOperations){                        
                        
                        const xmlOperations = operationF.getOperations(reqData, xmlOperation, xmlbuilder);
                        const xmlAddresses = addressF.getAddress(items, os, xmlAddress, xmlbuilder);
                        const xmlContact = contactF.getContact(os, reqData, xmlbuilder);
                        const xmlAccesses = accessF.getAccesses(items, reqData, qtdPontos, xmlbuilder);
                        const xmlRequisicao = requestF.createRequest(reqData, xmlOperations, xmlAddresses, xmlContact, xmlAccesses, xmlbuilder);                        

                        let log2 = {
                            $set: {
                                destination: 'SOM',
                                xmlSended: xmlRequisicao,
                                sendedDate: new Date
                            }
                        };

                        schLogTransactions.updateOne({_id: _idTransaction}, log2).then(() => {

                            let resp = sendXmlToSOM(xmlRequisicao);                           
        
                            resp.then(r => {
        
                                var responseData = '';
                                if(r.response){
                                    responseData = r.response.data;
                                }
        
                                const xmlAck = logF.generateAck(r.code, r.message, responseData, xmlbuilder);
                                
                                let log3 = {
                                    $set: {
                                        acknowledge: xmlAck,
                                        ackDate: new Date,
                                        code: r.code,
                                        status: 'ok',
                                        message: r.message,
                                        nativeReturn: responseData
                                    }
                                };

                                schLogTransactions.updateOne({_id: _idTransaction}, log3).then(() => {
                                    res.set('Content-Type', 'application/xml; charset=utf-8');
                                    res.send(xmlAck);
                                }).catch(err => {

                                    const xmlAck = logF.generateAck('-104', err, '', xmlbuilder);
                
                                    let logErr = {
                                        $set: {
                                            acknowledge: xmlAck,
                                            ackDate: new Date,
                                            code: -104,
                                            status: 'error',
                                            message: err
                                        }
                                    };
                
                                    schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                                        res.set('Content-Type', 'application/xml; charset=utf-8');
                                        res.send(xmlAck);
                                    });
                
                                });
        
                            }).catch(err => {

                                const xmlAck = logF.generateAck('-103', err, '', xmlbuilder);
            
                                let logErr = {
                                    $set: {
                                        acknowledge: xmlAck,
                                        ackDate: new Date,
                                        code: -103,
                                        status: 'error',
                                        message: err
                                    }
                                };
            
                                schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                                    res.set('Content-Type', 'application/xml; charset=utf-8');
                                    res.send(xmlAck);
                                });
            
                            });

                        }).catch(err => {

                            const xmlAck = logF.generateAck('-102', err, '', xmlbuilder);
        
                            let logErr = {
                                $set: {
                                    acknowledge: xmlAck,
                                    ackDate: new Date,
                                    code: -102,
                                    status: 'error',
                                    message: err
                                }
                            };
        
                            schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                                res.set('Content-Type', 'application/xml; charset=utf-8');
                                res.send(xmlAck);
                            });
        
                        });
    
                    }else{

                        let log4 = {
                            $set: {
                                destination: 'OM',
                                xmlSended: xml,
                                sendedDate: new Date
                            }
                        };

                        schLogTransactions.updateOne({_id: _idTransaction}, log4).then(() => {
                            
                            let resp = sendXmlToOM(xml);
    
                            resp.then(r => {

                                let respnseData = '';
                                if(r.response){
                                    responseData = r.response.data;
                                }
    
                                let log5 = {
                                    $set: {
                                        acknowledge: r,
                                        ackDate: new Date,
                                        code: r.code,
                                        status: 'ok',
                                        message: respnseData,
                                        nativeReturn: r
                                    }
                                };
        
                                schLogTransactions.updateOne({_id: _idTransaction}, log5).then(() => {
                                    res.set('Content-Type', 'application/xml; charset=utf-8');
                                    res.send(r);
                                }).catch(err => {

                                    const xmlAck = logF.generateAck('-107', err, '', xmlbuilder);

                                    let logErr = {
                                        $set: {
                                            acknowledge: xmlAck,
                                            ackDate: new Date,
                                            code: -107,
                                            status: 'error',
                                            message: err
                                        }
                                    };
                
                                    schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                                        res.set('Content-Type', 'application/xml; charset=utf-8');
                                        res.send(xmlAck);
                                    });
                
                                });
        
                            }).catch(err => {

                                const xmlAck = logF.generateAck('-106', err, '', xmlbuilder);
            
                                let logErr = {
                                    $set: {
                                        acknowledge: xmlAck,
                                        ackDate: new Date,
                                        code: -106,
                                        status: 'error',
                                        message: err
                                    }
                                };
            
                                schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                                    res.set('Content-Type', 'application/xml; charset=utf-8');
                                    res.send(xmlAck);
                                });
            
                            });

                        }).catch(err => {

                            const xmlAck = logF.generateAck('-105', err, '', xmlbuilder);

                            let logErr = {
                                $set: {
                                    acknowledge: xmlAck,
                                    ackDate: new Date,
                                    code: -105,
                                    status: 'error',
                                    message: err
                                }
                            };
        
                            schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                                res.set('Content-Type', 'application/xml; charset=utf-8');
                                res.send(xmlAck);
                            });
        
                        });
    
                    }

                }).catch(err => {
                    
                    const xmlAck = logF.generateAck('-101', err, '', xmlbuilder);

                    let logErr = {
                        $set: {
                            acknowledge: xmlAck,
                            ackDate: new Date,
                            code: -101,
                            status: 'error',
                            message: err
                        }
                    };

                    schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                        res.set('Content-Type', 'application/xml; charset=utf-8');
                        res.send(xmlAck);
                    });

                });

            }else
            if(err){

                const xmlAck = logF.generateAck('-100', err, '', xmlbuilder);                

                let logErr = {
                    $set: {
                        acknowledge: xmlAck,
                        ackDate: new Date,
                        code: -100,
                        status: 'error',
                        message: err
                    }
                };

                schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                    res.set('Content-Type', 'application/xml; charset=utf-8');
                    res.send(xmlAck);
                });

            }

        });

    });

    server.post('/api/solicitation/legado/listener', function(req, res) {

        let _idTransaction;
        const xml = req.body;

        let log1 = {
            service: '/api/solicitation/legado/listener',
            origin: 'SYS',
            xmlOriginal: xml,
            receiveDate: new Date
        };

        schLogTransactions.create(log1).then(recOne => {

            _idTransaction = recOne._id;

            let log2 = {
                $set: {
                    destination: 'SBL8',
                    xmlSended: xml,
                    sendedDate: new Date
                }
            };

            schLogTransactions.updateOne({_id: _idTransaction}, log2).then(() => {
                
                let resp = sendXmlToSOA(xml);

                resp.then(r => {

                    console.log(r);

                    let log3 = {
                        $set: {
                            acknowledge: r,
                            ackDate: new Date,
                            code: 0,
                            status: 'ok',
                            message: r.message,
                            nativeReturn: r
                        }
                    };

                    schLogTransactions.updateOne({_id: _idTransaction}, log3).then(() => {
                        res.set('Content-Type', 'application/xml; charset=utf-8');
                        res.send(r);
                    }).catch(err => {

                        const xmlAck = logF.generateAck('-104', err, '', xmlbuilder);

                        let logErr = {
                            $set: {
                                acknowledge: xmlAck,
                                ackDate: new Date,
                                code: -104,
                                status: 'error',
                                message: err
                            }
                        };
    
                        schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                            res.set('Content-Type', 'application/xml; charset=utf-8');
                            res.send(xmlAck);
                        });
    
                    });

                }).catch(err => {

                    const xmlAck = logF.generateAck('-103', err, '', xmlbuilder);                    

                    let logErr = {
                        $set: {
                            acknowledge: xmlAck,
                            ackDate: new Date,
                            code: -103,
                            status: 'error',
                            message: err
                        }
                    };

                    schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                        res.set('Content-Type', 'application/xml; charset=utf-8');
                        res.send(xmlAck);
                    });

                });

            }).catch(err => {

                const xmlAck = logF.generateAck('-102', err, '', xmlbuilder);                

                let logErr = {
                    $set: {
                        acknowledge: xmlAck,
                        ackDate: new Date,
                        code: -102,
                        status: 'error',
                        message: err
                    }
                };

                schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                    res.set('Content-Type', 'application/xml; charset=utf-8');
                    res.send(xmlAck);
                });

            });

        }).catch(err => {

            const xmlAck = logF.generateAck('-101', err, '', xmlbuilder);
            
            let logErr = {
                $set: {
                    acknowledge: xmlAck,
                    ackDate: new Date,
                    code: -101,
                    status: 'error',
                    message: err
                }
            };

            schLogTransactions.updateOne({_id: _idTransaction}, logErr).then(() => {
                res.set('Content-Type', 'application/xml; charset=utf-8');
                res.send(xmlAck);
            });

        });

    });

    server.get('/api/solicitation/legado/log', function(req, res) {
        let resp = [];
        schLogTransactions.find({xmlOriginal: {$regex: req.query.filter, $options: 'i'}}).then(result => {
            result.forEach(r => {
                resp.push(r);
            });
            res.send(resp);
        });
    });

}