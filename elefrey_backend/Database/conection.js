const cassandra = require('cassandra-driver');
const hostDatabase = process.env.HOST_DATABASE;
const portDatabase = process.env.PORT_DATABASE;

let host = `${hostDatabase}:${portDatabase}`;
let client;
let fs = require('fs');

let ssl_option = {
    cert: fs.readFileSync(__dirname + '\\..\\Certificate\\cacert.pem'),
    secureProtocol: 'TLSv1_2_method'
};

const authProviderLocalCassandra = new cassandra.auth.PlainTextAuthProvider(process.env.USER_DATABASE, process.env.PASSWORD_DATABASE);

client = new cassandra.Client({
    contactPoints: [host],
    authProvider: authProviderLocalCassandra,
    sslOptions: ssl_option,
    localDataCenter: 'East US',
    keyspace: 'elefrey_services'
});


client.connect(function (err, result) {
    console.log("cassandrac connet:" + "result=" + result + ",error=" + err);
});

module.exports = client;