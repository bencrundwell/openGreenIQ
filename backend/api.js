var mysql_conection = require('./mysql');

module.exports = {
    setup: function(app) {
        app.get('/', (req, res) => res.send('Hello World!'));
    },
    getTable: function(app, table) {
        app.get(`/api/${table}`, (req, res) => {
            temp_mysql = new mysql_conection(function(err, connection) {
            if (err) throw err;
            connection.query(`SELECT * FROM ${table}`, function (err, result, fields) {
                if (err) {
                    res.status(400).send("Error when reading database");
                }
                else
                {
                    res.json(result);
                }
            });
            connection.release();
            });
        });
    }

}