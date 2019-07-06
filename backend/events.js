var mysql_conection = require('./mysql');
var myEmitter = require('./my_emitter');

console.log("events: module loaded")

myEmitter.on('log_event', function(message) {
    console.log(`events: log eventL type ${message.type}: ${message.event}`);
    temp_mysql = new mysql_conection(function(err, connection) {
        if (err) throw err;
        connection.query(`INSERT INTO events (timestamp, type, event, zone, value) VALUES (NOW(), ${message.type}, "${message.event}", ${message.zone}, ${message.value})`, function (err, result, fields) {
            if (err) throw err;
        });
        connection.release();
    });
});
