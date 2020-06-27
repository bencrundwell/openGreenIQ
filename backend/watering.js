var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const Gpio = require('onoff').Gpio;
const util = require('util')
var weather = require('./weather');

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
    payload.et = weather.getEvapotranspiration();
    payload.forecast = weather.getForecast();
    payload.irrisat = weather.getIrrisat();

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

async function waterZone(zone, duration, callback) {
    console.log(`watering.waterZone: water zone ${zone} for ${duration} seconds`);
    if (duration >= 1 && duration < (60 * 60))
    {
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
    }

    console.log(`schedule valve switch off`);
    clearTimeout( timer );
    timer = setTimeout( async function (){
        zone_obj = await lookupZone(zone)
        const volume = parseFloat((duration/60) * zone_obj.avg_flow).toFixed(1)
        const message = [];
        message.type = 1
        message.event = `Water ${zone_obj.name} with ${volume}L`
        message.zone = zone
        message.value = volume
        myEmitter.emit('log_event', message);

        clearZones();
        if (callback) callback();
    }, 1000 * duration);
}

let schedule_zones = [];

function executeSchedule(id) {
    console.log(`execute schedule ${id}`);
    temp_mysql = new mysql_conection(function(err, connection) {
        if (err) throw err;
        connection.query(`SELECT * FROM schedule where id = ${id}`, async function (err, result, fields) {
            if (err) {
                console.log("Error when reading database");
            }
            else
            {
                const message = [];
                message.type = 2
                message.event = `Execute Schedule ${id}`
                message.zone = id
                message.value = null
                myEmitter.emit('log_event', message);

                console.log("watering: executeSchedule: Current ET: " + weather.getEvapotranspiration())
                let schedule = result[0];

                if (schedule.zone_6) schedule_zones.push(6)
                if (schedule.zone_5) schedule_zones.push(5)
                if (schedule.zone_4) schedule_zones.push(4)
                if (schedule.zone_3) schedule_zones.push(3)
                if (schedule.zone_2) schedule_zones.push(2)
                if (schedule.zone_1) schedule_zones.push(1)
                console.log("watering: executeSchedule: schedule_zones:", schedule_zones);

                if (schedule_zones.length > 0) waterZoneAdjusted(schedule_zones.pop())
            }
        });
        connection.release();
    });
}

// var weather = null;

// module.exports.connectWeather = function (weather_in) {
//     console.log("connect weather module to watering: " + weather_in)
//     weather = weather_in
// }

async function lookupZone(id) {
    return new Promise(function(resolve, reject) {
        console.log(`watering.lookupZone: id = ${id}`);
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
                    console.log(`watering.lookupZone: result: ` + util.inspect(result, {showHidden: false, depth: null}))
                    if (result.length > 0) {
                        var zone = result[0];
                        console.log(`watering.lookupZone: zone = ${zone.name}`);
                        zone.water_required = weather.getEvapotranspiration() - weather.getRainfall()
                        console.log(`watering.lookupZone: weather.getRainfall() = ${weather.getRainfall()}`);
                        console.log(`watering.lookupZone: zone.water_required = ${zone.water_required}`);
                        if (zone.water_required < 0) zone.water_required = 0

                        zone.calculated_volume = (zone.area * (zone.water_required/1000) ) * 1000; // in litres
                        console.log(`watering.lookupZone: zone.calculated_volume = ${zone.calculated_volume}`);
                        zone.calculated_duration = (zone.calculated_volume / zone.avg_flow) * 60; // in seconds
                        console.log(`watering.lookupZone: zone.calculated_duration = ${zone.calculated_duration}`);
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


async function waterZoneAdjusted(id) {
    console.log(`watering.waterZoneAdjusted: id: ${id}`)
    zone = await lookupZone(id)
    if (zone != null && zone.avg_flow != null && zone.avg_flow != 0 && zone.area != null && zone.area != 0) {
        console.log(`watering.waterZoneAdjusted: calculated duration for ${zone.name} = ${zone.calculated_duration}`);
        waterZone(id, zone.calculated_duration, function() {
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