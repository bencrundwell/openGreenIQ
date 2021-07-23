var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const Gpio = require('onoff').Gpio;
const util = require('util')
var weather = require('./weather');
var gpio = require('rpi-gpio');

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

exports.status = () => {
    payload = {}
    payload.master = master.readSync();
    payload.v1 = v1.readSync();
    payload.v2 = v2.readSync();
    payload.v3 = v3.readSync();
    payload.v4 = v4.readSync();
    payload.v5 = v5.readSync();
    payload.v6 = v6.readSync();
    payload.lights = lights.readSync();
    payload.etLong = weather.getEvapotranspirationLong();
    payload.etShort = weather.getEvapotranspirationShort();
    payload.forecast = weather.getForecast();
    payload.irrisat = weather.getIrrisat();
    payload.flow_rate = flow_rate;
    payload.flow_rate_avg = flow_rate_avg;

    return payload;
}

myEmitter.on('watering', function(schedule_row) {
    console.log("watering: Start watering the following schedule");
    console.log(schedule_row);
    executeSchedule(schedule_row.id)
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
    console.log("watering.clearZones: Stop watering in all zones");
}

let schedule_zones = [];

function executeSchedule(id) {
    console.log(`watering.executeSchedule: ${id}`);
    temp_mysql = new mysql_conection(function(err, connection) {
        if (err) throw err;
        connection.query(`SELECT * FROM schedule where id = ${id}`, async function (err, result, fields) {
            if (err) {
                console.log("Error when reading database");
            }
            else
            {
                let schedule = result[0];
                let water_mm = schedule.water_mm - weather.getRainfall();
                if (water_mm < 0) water_mm = 0;
                
                console.log(`watering.executeSchedule: ` + util.inspect(schedule, {showHidden: false, depth: null}))

                const message = [];
                message.type = 2
                message.event = `Execute Schedule ${id}`
                message.zone = id
                message.value = null
                message.value2 = null
                myEmitter.emit('log_event', message);

                if (schedule.zone_6) schedule_zones.push({id: 6, water_mm: water_mm})
                if (schedule.zone_5) schedule_zones.push({id: 5, water_mm: water_mm})
                if (schedule.zone_4) schedule_zones.push({id: 4, water_mm: water_mm})
                if (schedule.zone_3) schedule_zones.push({id: 3, water_mm: water_mm})
                if (schedule.zone_2) schedule_zones.push({id: 2, water_mm: water_mm})
                if (schedule.zone_1) schedule_zones.push({id: 1, water_mm: water_mm})
                console.log("watering.executeSchedule: schedule_zones:", schedule_zones);

                if (schedule_zones.length > 0) waterZoneAdjusted(schedule_zones.pop())
            }
        });
        connection.release();
    });
}


async function waterZoneAdjusted(data) {
    console.log(`watering.waterZoneAdjusted: id: ${data.id}`)
    zone = await lookupZone(data.id)
    if (zone != null && zone.avg_flow != null && zone.avg_flow != 0 && zone.area != null && zone.area != 0) {
        console.log(`watering.waterZoneAdjusted: calculated duration for ${zone.name} = ${zone.calculated_duration}`);
        zone.calculated_volume = (zone.area * (data.water_mm/1000) ) * 1000 * (zone.adjust/100); // in litres
        console.log(`watering.waterZoneAdjusted: zone.calculated_volume = ${zone.calculated_volume}`);
        zone.calculated_duration = (zone.calculated_volume / zone.avg_flow) * 60; // in seconds
        console.log(`watering.waterZoneAdjusted: zone.calculated_duration = ${zone.calculated_duration}`);
        waterZone(data.id, zone.calculated_duration, function() {
            if (schedule_zones.length > 0) {
                waterZoneAdjusted(schedule_zones.pop())    
            }
        })
    } else {
        console.log(`watering.waterZoneAdjusted: WARNING: invalid Zone in schedule`);
        if (schedule_zones.length > 0) {
            waterZoneAdjusted(schedule_zones.pop())    
        }
    }
}


async function lookupZone(id) {
    return new Promise(function(resolve, reject) {
        // console.log(`watering.lookupZone: id = ${id}`);
        temp_mysql = new mysql_conection(function(err, connection) {
            if (err) throw err;
            connection.query(`SELECT * FROM zones where pin = ${id}`, function (err, result, fields) {
                connection.release();
                if (err) {
                    console.log("Error when reading database");
                    reject(null);
                }
                else
                {
                    // console.log(`watering.lookupZone: result: ` + util.inspect(result, {showHidden: false, depth: null}))
                    if (result.length > 0) {
                        var zone = result[0];
                        resolve(zone);
                    }
                    else {
                        resolve(null);
                    }
                }
            })
        });
    })
}


async function waterZone(zone, duration, callback) {
    console.log(`watering.waterZone: water zone ${zone} for ${duration} seconds`);
    flow_counter = 0;
    if (duration >= 1 && duration < (60 * 60))
    {
        clearZones();
        console.log(`watering.waterZone: Enable master valve`);
        master.writeSync(1);
    
        switch (zone) {
            case 1:
                console.log(`watering.waterZone: Enable Zone 1 valve`);
                v1.writeSync(1);
                break
            case 2:
                console.log(`watering.waterZone: Enable Zone 2 valve`);
                v2.writeSync(1);
                break
            case 3:
                console.log(`watering.waterZone: Enable Zone 3 valve`);
                v3.writeSync(1);
                break
            case 4:
                console.log(`watering.waterZone: Enable Zone 4 valve`);
                v4.writeSync(1);
                break
            case 5:
                console.log(`watering.waterZone: Enable Zone 5 valve`);
                v5.writeSync(1);
                break
            case 6:
                console.log(`watering.waterZone: Enable Zone 6 valve`);
                v6.writeSync(1);
                break
        }
    }

    console.log(`schedule valve switch off`);
    clearTimeout( timer );
    timer = setTimeout( async function (){
        zone_obj = await lookupZone(zone)
        const volume = parseFloat((duration/60) * zone_obj.avg_flow).toFixed(1)
        const message = [];
        const flow = ((flow_counter/(duration/60))*0.00192953).toFixed(2);
        console.log(`watering.waterzone: count = ${flow_counter}, duration = ${duration}, flow = ${flow}`);
        console.log(`watering.waterzone: expected flow = ${zone_obj.avg_flow}`);

        //Check for leaks and blockages
        if ((flow > zone_obj.avg_flow + 2) || (flow < zone_obj.avg_flow - 2)) {
            message.type = 4;
            message.event = `Error! Flow was ${flow} vs ${zone_obj.avg_flow}. Potential Leak detected!`;
            message.zone = zone;
            message.value = flow;
            message.value2 = zone_obj.avg_flow;
            myEmitter.emit('log_event', message);
            myEmitter.emit('email', message.event);
        }
        message.type = 1;
        message.event = `Water ${zone_obj.name} with ${volume}L, flow = ${flow}lpm`;
        message.zone = zone;
        message.value = volume;
        message.value2 = flow;
        myEmitter.emit('log_event', message);

        clearZones();
        if (callback) callback();
    }, 1000 * duration);
}


// Flow rate sensing
let watchdogInterval
let flow_rate = 0
let flow_rate_history = []
let flow_rate_avg = 0
let flow_counter = 0
let hrtime = process.hrtime()
let previous_time = hrtime[0] * 1000000 + hrtime[1] / 1000
console.log("watering: Monitor flow pin...")

gpio.setup(10, gpio.DIR_IN, gpio.EDGE_BOTH);

gpio.on('change', function(channel, value) {
    //console.log('Channel ' + channel + ' value is now ' + value);
    if (channel == 10) {
        hrtime = process.hrtime()
        flow_counter++
        const current_time = hrtime[0] * 1000000 + hrtime[1] / 1000
        const time_difference = current_time - previous_time
        flow_rate = 115772/time_difference
        flow_rate_history.push(flow_rate);
        if (flow_rate_history.length > 100) flow_rate_history.shift();
        let average = (array) => array.reduce((a, b) => a + b) / array.length;
        flow_rate_avg = average(flow_rate_history);
        //console.log(`Flow: ${flow_rate}`)

        clearInterval( watchdogInterval );
        watchdogInterval = setTimeout( watchdogReset, 1 * 1000); // 1s watchdog timer

        previous_time = current_time
    }
});

function watchdogReset() {
    flow_rate = 0;
    flow_rate_avg = 0;
    flow_rate_history = []
    //console.log(`Flow: ${flow_rate}`);
}