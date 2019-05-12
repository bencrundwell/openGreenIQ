var myEmitter = require('./my_emitter');
var watering = require('./watering');
var scheduler_module = require('./scheduler');
var timers_module = require('./timers');
var weather = require('./weather');
var api = require('./api');
var mysql_conection = require('./mysql');

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const morgan = require('morgan');

var timers = new timers_module();

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

api.setup(app);
api.getTable(app, "schedule");
api.getTable(app, "history");

// app.get('/api/schedule', (req, res) => {
//   temp_mysql = new mysql_conection(function(err, connection) {
//     if (err) throw err;
//     connection.query("SELECT * FROM schedule", function (err, result, fields) {
//         if (err) {
//           res.status(400).send("Error when reading database");
//         }
//         else
//         {
//           res.json(result);
//         }
//     });
//     connection.release();
//   });
// });

// app.get('/api/history', (req, res) => {
//   temp_mysql = new mysql_conection(function(err, connection) {
//     if (err) throw err;
//     connection.query("SELECT * FROM history", function (err, result, fields) {
//         if (err) {
//           res.status(400).send("Error when reading database");
//         }
//         else
//         {
//           res.json(result);
//         }
//     });
//     connection.release();
//   });
// });

app.listen(port, () => console.log(`listening on port ${port}!`));

//TODO: erase rain history on startup
