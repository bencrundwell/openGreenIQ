var myEmitter = require('./my_emitter');
const Gpio = require('onoff').Gpio;

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
    // waterZone(schedule_row.zone, schedule_row.duration);
});

myEmitter.on('water_zone', function(message) {
    waterZone(message.zone, message.duration);
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
    master.writeSync(1);

    // switch (zone) {
    //     case 1:
    //         v1.writeSync(1);
    //         break
    //     case 2:
    //         v2.writeSync(1);
    //         break
    //     case 3:
    //         v3.writeSync(1);
    //         break
    //     case 4:
    //         v4.writeSync(1);
    //         break
    //     case 5:
    //         v5.writeSync(1);
    //         break
    //     case 6:
    //         v6.writeSync(1);
    //         break
    // }

    clearTimeout( timer );
    timer = setTimeout( function (){
        clearZones();
    }, 1000 * duration);
}