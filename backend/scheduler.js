var mysql_conection = require('./mysql');
var myEmitter = require('./my_emitter');

var schedule;
var watchdogInterval;

// Constructor
function Scheduler() {
    console.log('openGreenIQ.scheduler running...');

    updateClock();
}

myEmitter.on('minuteTimer', function() {
    updateClock();
});

function updateClock() {
    var d = new Date();
    var timecode = (d.getHours() * 60) + d.getMinutes();
    console.log( "scheduler: Day " + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + " - (" + timecode + ")");

    temp_mysql = new mysql_conection(function(err, connection) {
        if (err) throw err;
        connection.query("SELECT * FROM schedule", function (err, result, fields) {
            if (err) throw err;
            console.log("scheduler: Schedule Updated from database");
            schedule = result;
            schedule.forEach(element => {
                console.log(element);
                const days_mask = (element.day_mon << 6) + (element.day_tue << 5) + (element.day_wed << 4) + (element.day_thu << 3) + (element.day_fri << 2) + (element.day_sat << 1) + (element.day_sun);
                if ((1 << d.getDay()) & days_mask) {
                    //myEmitter.emit('watering', element); // Test to always trigger an event, remove this line when finished testing
                    if (element.start_time == timecode) {
                        myEmitter.emit('watering', element);
                    }
                }
            });
        });
        connection.release();
    });

    clearInterval( watchdogInterval );
    watchdogInterval = setInterval( watchdogReset, 5 * 60 * 1000); // 5min watchdog timer
}

// function updateSchedule() {
    
// }

function watchdogReset() {
    console.log("scheduler: ERROR - Watchdog timeout");
    throw ("Watchdog timeout");
}

module.exports = Scheduler;