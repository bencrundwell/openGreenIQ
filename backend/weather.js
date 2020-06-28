const request = require('request-promise');
var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const config = require('./config.json');
var Promise = require('promise');

var con;

// http://www.fao.org/3/a-f2430e.pdf
var p_lookup = [.19, .22, .27, .31, .35, .37, .36, .33, .28, .24, .20, .17];

var evapotranspirationShort = 0;
var evapotranspirationLong = 0;
var rainfall_24h = 0;
var cloud_24h = 0;
var evapotranspirationShort_24h = 0;
var evapotranspirationLong_24h = 0;
var temp = 0;
var forecast = [];
var irrisat = [];
    
// IrriSAT API for ET0 lookup
//https://irrisat-cloud.appspot.com/_ah/api/irrisat/v1/services/forecast/evapotranspiration/52.084621/0.026227
var irrisat_url = `https://irrisat-cloud.appspot.com/_ah/api/irrisat/v1/services/forecast/evapotranspiration/${config.weather_config.lat}/${config.weather_config.lon}`;
// http://api.openweathermap.org/data/2.5/weather?lat=52.084621&lon=0.026227&APPID=295f784636f873e16ec2ac1cef165df7&units=metric
var ow_url = `http://api.openweathermap.org/data/2.5/weather?lat=${config.weather_config.lat}&lon=${config.weather_config.lon}&appid=${config.weather_config.apiKey}&units=metric`;

console.log('weather: load module');
// get ET on boot
request(irrisat_url)
    .then (function (body) {
        irrisat = JSON.parse(body);
        evapotranspirationShort = irrisat.Series.ET0short[0];
        evapotranspirationLong = irrisat.Series.ET0tall[0];
        // console.log (`evapotranspiration = ${evapotranspiration}mm/day`);
    })

myEmitter.on('hourTimer', function() {

    console.log('openGreenIQ.weather Check weather...');

    request(irrisat_url)
        .then (function (body) {
            irrisat = JSON.parse(body);
            evapotranspirationShort = irrisat.Series.ET0short[0];
            evapotranspirationLong = irrisat.Series.ET0tall[0];
            // console.log (`evapotranspiration = ${evapotranspiration}mm/day`);
            return request(ow_url);
        })
        .catch (error => {
            console.log('irrisat error: ' + error);
        })
        .then (function (body) {
            var d = new Date();
            console.log('body:', body);
            forecast = JSON.parse(body);
            var rain = 0.0;
            var cloud = 0;

            if (forecast.rain)
                if (forecast.rain[ "1h" ])
                    rain = forecast.rain[ "1h" ];
            console.log( "rain:", rain, "mm");

            if (forecast.main.temp) temp = forecast.main.temp

            if (forecast.clouds.all)
                cloud = forecast.clouds.all;

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;
                connection.query(`UPDATE db.hourly SET rain = ${rain}, cloud = ${cloud}, temp = ${forecast.main.temp}, evapotranspiration = ${evapotranspirationLong}, evapotranspiration_short = ${evapotranspirationShort} WHERE id = ${d.getHours()+1}`, function (err, result, fields) {
                    if (err) throw err;
                    console.log("openGreenIQ.weather : rain updated");
                });
                connection.release();
            });

            // look up 24h worth of data in hourly table
            temp_mysql2 = new mysql_conection(function(err, connection) {
                if (err) throw err;
                connection.query(`SELECT * FROM db.hourly`, function (err, result, fields) {
                    if (err) throw err;
                    
                    var rainfall_total = 0;
                    var cloud_total = 0;
                    var evapotranspirationShort_total = 0;
                    var evapotranspirationLong_total = 0;
        
                    result.forEach(element => {
                        if (element.rain > 0) {
                            rainfall_total += element.rain;
                        }
                        if (element.cloud > 0) {
                            cloud_total += element.cloud;
                        }
                        if (element.evapotranspiration > 0) {
                            evapotranspirationLong_total += element.evapotranspiration;
                        }
                        if (element.evapotranspiration_short > 0) {
                            evapotranspirationShort_total += element.evapotranspiration_short;
                        }
                    });

                    rainfall_24h = rainfall_total;
                    cloud_24h = cloud_total / 24;
                    evapotranspirationShort_24h = evapotranspirationShort_total / 24;
                    evapotranspirationLong_24h = evapotranspirationLong_total / 24;
                });
                connection.release();
            });
        });
});

myEmitter.on('dayTimer', function() {
    setTimeout(function () {
        console.log('openGreenIQ.weather Store Historical Data...');
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var yesterday = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        console.log(`openGreenIQ.weather for yesterday: ${yesterday}...`);
        
        temp_mysql = new mysql_conection(function(err, connection) {
            connection.query(`INSERT INTO db.history (date, rainfall, evapotranspiration, evapotranspiration_short, cloud, temp) VALUES ('${yesterday}', ${rainfall_24h}, ${evapotranspirationLong_24h}, ${evapotranspirationShort_24h}, ${cloud_24h}, ${temp})`, function (err, result, fields) {
                if (err) throw err;
                console.log("openGreenIQ.weather : history added");
            });
            connection.release();
        });
    }, 10000);
});

exports.getEvapotranspirationLong = function() {
    return evapotranspirationLong;
  };

exports.getEvapotranspirationShort = function() {
    return evapotranspirationShort;
};
exports.getEvapotranspiration = function() {
    return 0;
};

exports.getRainfall = function() {
    return rainfall_24h;
  };

exports.getForecast = function() {
    return forecast;
};

exports.getIrrisat = function() {
    return irrisat;
};


//myEmitter.emit('hourTimer');
//myEmitter.emit('dayTimer');
