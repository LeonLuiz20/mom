const port = 3002;
const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/momdb'

server.use(bodyParser.json({limit: '50MB'}));
server.use(express.urlencoded({limit: '50MB', extended: true, parameterLimit: 50000}))
server.use(bodyParser.urlencoded({extended: true, limit: '50MB', parameterLimit: 50000}));
server.use(bodyParser.text({type: 'application/xml', limit: '2MB'}));

server.listen(process.env.PORT || port, function() {
    console.log('\nServer Port ' + port + ' from MOM Listening!');
});

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('\nConnected to MongoDB.')
}).catch((error) => {
    console.error('Connection error: ', error);
});

module.exports = server;