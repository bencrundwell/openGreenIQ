const Gpio = require('onoff').Gpio;

const master = new Gpio(24, 'out');
const v1 = new Gpio(4, 'out');
const v2 = new Gpio(17, 'out');
const v3 = new Gpio(18, 'out');
const v4 = new Gpio(27, 'out');
const v5 = new Gpio(22, 'out');
const v6 = new Gpio(23, 'out');
const lights = new Gpio(25, 'out');

master.writeSync(0);
v1.writeSync(0);
v2.writeSync(0);
v3.writeSync(0);
v4.writeSync(0);
v5.writeSync(0);
v6.writeSync(0);

v1.writeSync(1);