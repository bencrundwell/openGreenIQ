const util = require('util')
var mysql_conection = require('./mysql');
var myEmitter = require('./my_emitter');

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
    },
    getSchedule: function(app) {
        app.get('/api/schedule', (req, res) => {
            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;
                const query = `SELECT schedule.id, zones.name, schedule.days, schedule.start_time, schedule.duration 
                    FROM schedule
                    INNER JOIN zones ON schedule.zone=zones.pin;`;
                connection.query(query, function (err, result, fields) {
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
    },
    postWater: function(app) {
        app.post('/api/water', (req, res) => {
            console.log("API: POST to /api/water");
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))
            if (req.body.zone && req.body.duration) {
                const message = req.body;
                myEmitter.emit('water_zone', message);
            }
            res.send('OK');
            res.end();
            return (false);
        });
    },
    postScheduletest: function(app) {
        app.post('/api/scheduletest', (req, res) => {
            console.log("API: POST to /api/scheduletest");
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))
            if (req.body.id) {
                myEmitter.emit('schedule_test', req.body.id);
            }
            res.send('OK');
        });
    }
}