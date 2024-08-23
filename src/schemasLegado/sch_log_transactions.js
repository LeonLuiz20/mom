const mongoose = require('mongoose');
const schema = mongoose.Schema;

const log = new schema ({

    /** service
     *  origin
     *  xml original
     *  receive date
     *  destination
     *  xml sended
     *  sended date
     *  acknowledge
     *  ack date
     *  code
     *  status
     *  message
     *  native return
     */

    service: {
        type: String,
        required: true
    },

    origin: {
        type: String,
        required: true,
        enum: [
            'SBL8',
            'SYS'
        ]
    },

    xmlOriginal: {
        type: String,
        required: true
    },

    receiveDate: {
        type: Date,
        default: new Date
    },

    destination: {
        type: String,
        enum: [
            'SOM',
            'OM'
        ]
    },

    xmlSended: {
        type: String
    },

    sendedDate: {
        type: Date
    },

    acknowledge: {
        type: String
    },

    ackDate: {
        type: Date
    },

    code: {
        type: String
    },

    status: {
        type: String
    },

    message: {
        type: String
    },

    nativeReturn: {
        type: String
    }

});

module.exports = mongoose.model('logTransactions', log);