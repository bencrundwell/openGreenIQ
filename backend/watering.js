var myEmitter = require('./my_emitter');

myEmitter.on('schedule', function(schedule_row) {
    console.log("watering: Start watering in zone " + schedule_row.zone + " for " + schedule_row.duration + " minutes");
    console.log(schedule_row);
});