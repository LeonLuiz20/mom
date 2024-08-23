module.exports.configMOM = async function() {

    let bauth = {};

    bauth.users = {'mssom': 'som#01#ms'};
    bauth.challenge = true;
    bauth.ur = 'Unauthorized';

    return bauth;

}

module.exports.configSrvSOM = async function() {

    const url = 'http://osmdx02:7003/OrderManagement/wsapi';
    const usernameSOM = 'soa';
    const passwordSOM = 'soati#01';
    const tokenSOM = `${usernameSOM}:${passwordSOM}`;
    const encondedTokenSOM = Buffer.from(tokenSOM).toString("base64");

    let sc = {
        url: url,
        ets: encondedTokenSOM
    };

    return sc;

}

// Configuração para execução local | 
module.exports.configSrvSOMDev = async function() {

    const url = 'http://192.168.56.101:7001/OrderManagement/wsapi';
    const usernameSOM = 'deployAdmin';
    const passwordSOM = 'admin#10';
    const tokenSOM = `${usernameSOM}:${passwordSOM}`;
    const encondedTokenSOM = Buffer.from(tokenSOM).toString("base64");

    let sc = {
        url: url,
        ets: encondedTokenSOM
    };

    return sc;

}