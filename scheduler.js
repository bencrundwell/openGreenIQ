var mysql = require('mysql');
var intervalId;
var schedule;

console.log('openGreenIQ.scheduler running...');

var con = mysql.createConnection({
    host: "ogiq",
    user: "ogiq",
    password: "ogiqp@55",
    database: "db"
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM schedule", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        schedule = result;
        updateClock();
        });
    });


function updateClock() {
    var d = new Date();
    var timecode = (d.getHours() * 60) + d.getMinutes();
    console.log( "Day " + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + " - (" + timecode + ")");

    schedule.forEach(element => {
        console.log(element);
        if ((1 << d.getDay()) & element.days) {
            console.log("Day matches");
            if (element.start_time == timecode) {
                console.log("Schedule Match, water for " + element.duration + " secs");
            }
        }
    });

    clearInterval( intervalId );
    intervalId = setInterval( updateClock, 60000 - (d.getSeconds() * 1000) - d.getMilliseconds() + 500);
}
