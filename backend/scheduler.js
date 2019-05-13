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
                if ((1 << d.getDay()) & element.days) {
                    //console.log("Day matches");
                    //myEmitter.emit('schedule', element); // Test to always trigger an event, remove this line when finished testing
                    if (element.start_time == timecode) {
                        //console.log("Schedule Match, water for " + element.duration + " secs");
                        myEmitter.emit('schedule', element);
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