var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const Gpio = require('onoff').Gpio;
const util = require('util')

const master = new Gpio(24, 'out');
const v1 = new Gpio(4, 'out');
const v2 = new Gpio(17, 'out');
const v3 = new Gpio(18, 'out');
const v4 = new Gpio(27, 'out');
const v5 = new Gpio(22, 'out');
const v6 = new Gpio(23, 'out');
const lights = new Gpio(25, 'out');

var timer;

clearZones()
lights.writeSync(0);

myEmitter.on('watering', function(schedule_row) {
    console.log("watering: Start watering the following schedule");
    console.log(schedule_row);
    waterZone(schedule_row.zone, schedule_row.duration);
});

myEmitter.on('water_zone', function(message) {
    console.log("watering: water_zone received: " + message);
    waterZone(Number(message.zone), Number(message.duration));
});

//scheduleTest - fired from api due to trigger button being pressed
myEmitter.on('schedule_test', function(id) {
    console.log("watering: schedule_test received, id: " + id)
    executeSchedule(id)
});

function clearZones() {
    master.writeSync(0);
    v1.writeSync(0);
    v2.writeSync(0);
    v3.writeSync(0);
    v4.writeSync(0);
    v5.writeSync(0);
    v6.writeSync(0);
    console.log("watering: Stop watering in all zones");
}

function waterZone(zone, duration) {
    console.log(`watering: water zone ${zone} for ${duration} seconds`);
    if (duration < 1 || duration > (60 * 20)) return;
    
    console.log(`enable master valve`);
    master.writeSync(1);

    switch (zone) {
        case 1:
            console.log(`enable Zone 1 valve`);
            v1.writeSync(1);
            break
        case 2:
            console.log(`enable Zone 2 valve`);
            v2.writeSync(1);
            break
        case 3:
            console.log(`enable Zone 3 valve`);
            v3.writeSync(1);
            break
        case 4:
            console.log(`enable Zone 4 valve`);
            v4.writeSync(1);
            break
        case 5:
            console.log(`enable Zone 5 valve`);
            v5.writeSync(1);
            break
        case 6:
            console.log(`enable Zone 6 valve`);
            v6.writeSync(1);
            break
    }

    console.log(`schedule valve switch off`);
    clearTimeout( timer );
    timer = setTimeout( function (){
        clearZones();
    }, 1000 * duration);
}

function executeSchedule(id) {
    console.log(`execute schedule ${id}`);
    temp_mysql = new mysql_conection(function(err, connection) {
        if (err) throw err;
        connection.query(`SELECT * FROM schedule where id = ${id}`, function (err, result, fields) {
            if (err) {
                console.log("Error when reading database");
            }
            else
            {
                let schedule = result[0];
                if (schedule.zone_1) waterZoneAdjusted(1)
                if (schedule.zone_2) waterZoneAdjusted(2)
                if (schedule.zone_3) waterZoneAdjusted(3)
                if (schedule.zone_4) waterZoneAdjusted(4)
                if (schedule.zone_5) waterZoneAdjusted(5)
                if (schedule.zone_6) waterZoneAdjusted(6)
            }
        });
        connection.release();
    });
}

function waterZoneAdjusted(zone) {
    console.log(`water Zone ${zone}`);
}