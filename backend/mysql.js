var mysql = require('mysql');
const config = require('./config_custom.json');

var pool  = mysql.createPool(config.database_config);

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;