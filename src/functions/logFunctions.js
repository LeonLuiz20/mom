module.exports.generateAck = function(code, message, responseData, xmlbuilder) {

    var xmlAck;

    if(responseData) {
        xmlAck = `
        <?xml version="1.0" encoding="utf-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header/>
            <soapenv:Body>
                <somCommon:serviceOrderSyncResponse xmlns:somCommon="http://oi.com.br/som/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <code>${code}</code>
                    <description>${message}</description>
                </somCommon:serviceOrderSyncResponse>
                <nativeReturn>
                    <return>${responseData}</return>
                </nativeReturn>
            </soapenv:Body>
        </soapenv:Envelope>
        `        
    } else {
        xmlAck = `
        <?xml version="1.0" encoding="utf-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header/>
            <soapenv:Body>
                <somCommon:serviceOrderSyncResponse xmlns:somCommon="http://oi.com.br/som/common" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <code>${code}</code>
                <description>${message}</description>
                </somCommon:serviceOrderSyncResponse>                
            </soapenv:Body>
        </soapenv:Envelope>
        `
    }
    
    return xmlAck;
}