var gpio = require('rpi-gpio');

let watchdogInterval
let flow_rate = 0
let flow_counter = 0

let hrtime = process.hrtime()
let previous_time = hrtime[0] * 1000000 + hrtime[1] / 1000
console.log("Monitor flow pin...")

gpio.on('change', function(channel, value) {
    //console.log('Channel ' + channel + ' value is now ' + value);
    if (channel == 10) {
        hrtime = process.hrtime()
        flow_counter++
        const current_time = hrtime[0] * 1000000 + hrtime[1] / 1000
        const time_difference = current_time - previous_time
        flow_rate = 115772/time_difference
        console.log(`Flow: ${flow_rate}`)

        clearInterval( watchdogInterval );
        watchdogInterval = setTimeout( watchdogReset, 1 * 1000); // 1s watchdog timer

        previous_time = current_time
    }
});

function watchdogReset() {
    flow_rate = 0
    console.log(`Flow: ${flow_rate}`)
}

gpio.setup(10, gpio.DIR_IN, gpio.EDGE_BOTH);