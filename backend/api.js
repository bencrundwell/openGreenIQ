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
        app.get(`/api/schedule`, (req, res) => {
            temp_mysql = new mysql_conection(function(err, connection) {
            if (err) throw err;
            connection.query(`SELECT * FROM schedule`, function (err, result, fields) {
                if (err) {
                    res.status(400).send("Error when reading database");
                }
                else
                {
                    result = result.map(s => {
                        s.zone_1 = s.zone_1 != 0;
                        s.zone_2 = s.zone_2 != 0;
                        s.zone_3 = s.zone_3 != 0;
                        s.zone_4 = s.zone_4 != 0;
                        s.zone_5 = s.zone_5 != 0;
                        s.zone_6 = s.zone_6 != 0;
                        s.day_mon = s.day_mon != 0;
                        s.day_tue = s.day_tue != 0;
                        s.day_wed = s.day_wed != 0;
                        s.day_thu = s.day_thu != 0;
                        s.day_fri = s.day_fri != 0;
                        s.day_sat = s.day_sat != 0;
                        s.day_sun = s.day_sun != 0;
                        return s;
                    })

                    res.json(result);
                }
            });
            connection.release();
            });
        });
    },
    updateSchedule: function(app) {
        app.put('/api/schedule', (req, res) => {
            console.log("API: PUT to /api/schedule");
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;

                let id = req.body.id;

                let sql = "UPDATE schedule" +
                    " SET zone_1 = " + (req.body.zone_1 ? 1 : 0) +
                    ", zone_2 = " + (req.body.zone_2 ? 1 : 0) +
                    ", zone_3 = " + (req.body.zone_3 ? 1 : 0) +
                    ", zone_4 = " + (req.body.zone_4 ? 1 : 0) +
                    ", zone_5 = " + (req.body.zone_5 ? 1 : 0) +
                    ", zone_6 = " + (req.body.zone_6 ? 1 : 0) +
                    ", day_mon = " + (req.body.day_mon ? 1 : 0) +
                    ", day_tue = " + (req.body.day_tue ? 1 : 0) +
                    ", day_wed = " + (req.body.day_wed ? 1 : 0) +
                    ", day_thu = " + (req.body.day_thu ? 1 : 0) +
                    ", day_fri = " + (req.body.day_fri ? 1 : 0) +
                    ", day_sat = " + (req.body.day_sat ? 1 : 0) +
                    ", day_sun = " + (req.body.day_sun ? 1 : 0) +
                    ", start_time = " + req.body.start_time +
                    " WHERE id = " + req.body.id;
                
                console.log("SQL: " + sql);
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("result: " + result);
                        console.log("fields: " + fields);
                        res.status(400).send("Error when reading database");
                    }
                });
                connection.release();
            });
            res.send('OK');
            res.end();
            return (false);
        });
    },
    addSchedule: function(app) {
        app.post('/api/schedule', (req, res) => {
            console.log("API: POST to /api/schedule");
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;

                console.log(req.body);

                let sql = "INSERT INTO schedule (zone_1, zone_2, zone_3, zone_4, zone_5, zone_6, day_mon, day_tue, day_wed, day_thu, day_fri, day_sat, day_sun, start_time) VALUES (" +
                    (req.body.zone_1 ? 1 : 0) +
                    ", " + (req.body.zone_2 ? 1 : 0) +
                    ", " + (req.body.zone_3 ? 1 : 0) +
                    ", " + (req.body.zone_4 ? 1 : 0) +
                    ", " + (req.body.zone_5 ? 1 : 0) +
                    ", " + (req.body.zone_6 ? 1 : 0) +
                    ", " + (req.body.day_mon ? 1 : 0) +
                    ", " + (req.body.day_tue ? 1 : 0) +
                    ", " + (req.body.day_wed ? 1 : 0) +
                    ", " + (req.body.day_thu ? 1 : 0) +
                    ", " + (req.body.day_fri ? 1 : 0) +
                    ", " + (req.body.day_sat ? 1 : 0) +
                    ", " + (req.body.day_sun ? 1 : 0) +
                    ", " + req.body.start_time +
                    ")";
                
                console.log("SQL: " + sql);
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("result: " + result);
                        console.log("fields: " + fields);
                        res.status(400).send("Error when reading database");
                        return (false);
                    }
                });
                connection.release();
            });
            res.send('OK');
            res.end();
            return (false);
        });
    },
    deleteSchedule: function(app) {
        app.delete('/api/schedule/:id', (req, res) => {
            console.log("API: DELETE /api/schedule/"+req.params.id);
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;

                console.log(req.body);

                let sql = "DELETE FROM schedule WHERE id=" + req.params.id;
                
                console.log("SQL: " + sql);
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("result: " + result);
                        console.log("fields: " + fields);
                        res.status(400).send("Error when reading database");
                        return (false);
                    }
                });
                connection.release();
            });
            res.send('OK');
            res.end();
            return (false);
        });
    },
    getEvents: function(app) {
        app.get(`/api/events`, (req, res) => {
            temp_mysql = new mysql_conection(function(err, connection) {
            if (err) throw err;
            connection.query(`SELECT * FROM events ORDER BY id DESC LIMIT 50`, function (err, result, fields) {
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
    },
    updateZone: function(app) {
        app.put('/api/zone', (req, res) => {
            console.log("API: PUT to /api/zone");
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;

                let id = req.body.id;

                let sql = "UPDATE zones" +
                    " SET pin = " + req.body.pin +
                    ", name = '" + req.body.name + "'" +
                    ", avg_flow = " + req.body.avg_flow +
                    ", area = " + req.body.area +
                    " WHERE pin = " + req.body.pin;
                
                console.log("SQL: " + sql);
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("result: " + result);
                        console.log("fields: " + fields);
                        res.status(400).send("Error when reading database");
                    }
                });
                connection.release();
            });
            res.send('OK');
            res.end();
            return (false);
        });
    },
    addZone: function(app) {
        app.post('/api/zone', (req, res) => {
            console.log("API: POST to /api/zone");
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;

                console.log(req.body);

                let sql = "INSERT INTO zones (pin, name, avg_flow, area) VALUES (" +
                    req.body.pin +
                    ", " + req.body.name +
                    ", " + req.body.avg_flow +
                    ", " + req.body.area +
                    ")";
                
                console.log("SQL: " + sql);
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("result: " + result);
                        console.log("fields: " + fields);
                        res.status(400).send("Error when reading database");
                        return (false);
                    }
                });
                connection.release();
            });
            res.send('OK');
            res.end();
            return (false);
        });
    },
    deleteZone: function(app) {
        app.delete('/api/zone/:pin', (req, res) => {
            console.log("API: DELETE /api/zone/"+req.params.pin);
            console.log(`API: req.body: ` + util.inspect(req.body, {showHidden: false, depth: null}))

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;

                console.log(req.body);

                let sql = "DELETE FROM zones WHERE pin=" + req.params.pin;
                
                console.log("SQL: " + sql);
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log("result: " + result);
                        console.log("fields: " + fields);
                        res.status(400).send("Error when reading database");
                        return (false);
                    }
                });
                connection.release();
            });
            res.send('OK');
            res.end();
            return (false);
        });
    }
}