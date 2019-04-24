var mysql = require('mysql');
var con;
var schedule;
var intervalId;
var watchdogInterval;

// Constructor
function Scheduler() {
    console.log('openGreenIQ.scheduler running...');

    con = mysql.createConnection({
        host: "ogiq",
        user: "ogiq",
        password: "ogiqp@55",
        database: "db"
    });
    
    con.connect(async function(err) {
        if (err) throw err;
        await updateSchedule();
        updateClock();
    });
}

function updateClock() {
    var d = new Date();
    var timecode = (d.getHours() * 60) + d.getMinutes();
    console.log( "scheduler: Day " + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + " - (" + timecode + ")");

    if (schedule) schedule.forEach(element => {
        console.log(element);
        if ((1 << d.getDay()) & element.days) {
            //console.log("Day matches");
            if (element.start_time == timecode) {
                console.log("Schedule Match, water for " + element.duration + " secs");
            }
        }
    });

    updateSchedule();

    clearInterval( watchdogInterval );
    watchdogInterval = setInterval( watchdogReset, 5 * 60 * 1000); // 5min watchdog timer

    clearInterval( intervalId );
    intervalId = setInterval( updateClock, 60000 - (d.getSeconds() * 1000) - d.getMilliseconds() + 500);
}

async function updateSchedule() {
    console.log("scheduler: request new Schedule");
    await con.query("SELECT * FROM schedule", function (err, result, fields) {
        if (err) throw err;
        console.log("scheduler: Schedule Updated from database");
        schedule = result;
    });
    console.log("scheduler: end updateSchedule");
}

function watchdogReset() {
    console.log("scheduler: ERROR - Watchdog timeout");
    throw ("Watchdog timeout");
}

module.exports = Scheduler;