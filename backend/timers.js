var myEmitter = require('./my_emitter');

var intervalId;
var watchdogInterval;

// Constructor
function Timers() {
    console.log('openGreenIQ.timer running...');

    everyMinute();
}

function everyMinute() {
    var d = new Date();

    // console.log('openGreenIQ.timer fire: minuteTimer');
    myEmitter.emit("minuteTimer");
    //console.log( "Day " + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds());


    if (d.getMinutes() == 0) {
        // console.log('openGreenIQ.timer fire: hourTimer');
        myEmitter.emit("hourTimer");
        
        if (d.getHours() == 0) {
            // console.log('openGreenIQ.timer fire: dayTimer');
            myEmitter.emit("dayTimer");

            if (d.getDay() == 0) {
                // console.log('openGreenIQ.timer fire: weekTimer');
                myEmitter.emit("weekTimer");
            }
        }
    }

    clearInterval( intervalId );
    intervalId = setInterval( everyMinute, 60000 - (d.getSeconds() * 1000) - d.getMilliseconds() + 500);
}

module.exports = Timers;