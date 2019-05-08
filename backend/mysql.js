var mysql = require('mysql');
const config = require('./config.json');

var pool  = mysql.createPool(config.database_config);

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;