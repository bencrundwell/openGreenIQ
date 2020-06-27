var myEmitter = require('./my_emitter');
var watering = require('./watering');
var scheduler_module = require('./scheduler');
var timers_module = require('./timers');
var weather = require('./weather');
var api = require('./api');
var mysql_conection = require('./mysql');
var events_module = require('./events');

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const morgan = require('morgan');
var history = require('connect-history-api-fallback');

var timers = new timers_module();
console.log("**** Start openGreenIQ Server ****");

const app = express();
console.log("Express Server Running...");

//watering.connectWeather(weather);

app.use(history());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

api.setup(app);
api.getTable(app, "history");
api.getTable(app, "hourly");
api.getTable(app, "zones");
api.getSchedule(app);
api.updateSchedule(app);
api.addSchedule(app);
api.deleteSchedule(app);
api.updateZone(app); 
api.addZone(app);
api.deleteZone(app);
api.getEvents(app); 
api.postWater(app);
api.postScheduletest(app);
//api.getStatus(app);

app.get(`/api/status`, (req, res) => res.json(watering.status()) );


app.listen(port, () => console.log(`listening on port ${port}!`));

//TODO: erase rain history on startup
