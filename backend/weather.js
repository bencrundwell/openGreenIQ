const request = require('request');
var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const config = require('./config.json');

var con;

// http://www.fao.org/3/a-f2430e.pdf
var p_lookup = [.19, .22, .27, .31, .35, .37, .36, .33, .28, .24, .20, .17];

var evapotranspiration = 0;
var rainfall_24h = 0;
var cloud_24h = 0;



myEmitter.on('hourTimer', function() {

    console.log('openGreenIQ.weather Check weather...');
    
    // IrriSAT API for ET0 lookup
    //https://irrisat-cloud.appspot.com/_ah/api/irrisat/v1/services/forecast/evapotranspiration/52.084621/0.026227
    var url = `https://irrisat-cloud.appspot.com/_ah/api/irrisat/v1/services/forecast/evapotranspiration/${config.weather_config.lat}/${config.weather_config.lon}`;
    request(url, function (err, response, body) {
        if(err){
            console.log('IrriSAT API error:', err);
        } else {
            var irrisat = JSON.parse(body);
            evapotranspiration = irrisat.Daily[0].ET0;
            console.log (`evapotranspiration = ${evapotranspiration}mm/day`);
        }
    });
    console.log (`evapotranspiration = ${evapotranspiration}mm/day`);

    // http://api.openweathermap.org/data/2.5/weather?lat=52.084621&lon=0.026227&APPID=295f784636f873e16ec2ac1cef165df7&units=metric
    url = `http://api.openweathermap.org/data/2.5/weather?lat=${config.weather_config.lat}&lon=${config.weather_config.lon}&appid=${config.weather_config.apiKey}&units=metric`;
    request(url, function (err, response, body) {
        var d = new Date();
        if(err){
            console.log('OpenWeatherMap API error:', err);
        } else {
            //body = "{\"rain\":{\"1h\":3}}";
            console.log('body:', body);
            var weather = JSON.parse(body);
            var rain = 0.0;
            var cloud = 0;            

            if (weather.rain)
                if (weather.rain[ "1h" ])
                    rain = weather.rain[ "1h" ];
            console.log( "rain:", rain, "mm");

            if (weather.clouds.all)
                cloud = weather.clouds.all;

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;
                connection.query(`UPDATE db.rainfall SET rain = ${rain}, cloud = ${cloud}, temp = ${weather.main.temp} WHERE id = ${d.getHours()+1}`, function (err, result, fields) {
                    if (err) throw err;
                    console.log("openGreenIQ.weather : rain updated");
                });
                connection.release();
            });

            // look up 24h worth of rainfall in rainfall table
            temp_mysql2 = new mysql_conection(function(err, connection) {
                if (err) throw err;
                connection.query(`SELECT * FROM db.rainfall`, function (err, result, fields) {
                    if (err) throw err;
                    
                    var rainfall_total = 0;
                    var cloud_total = 0;
        
                    result.forEach(element => {
                        if (element.rain > 0) {
                            rainfall_total += element.rain;
                        }
                        if (element.cloud > 0) {
                            cloud_total += element.cloud;
                        }
                    });

                    rainfall_24h = rainfall_total;
                    cloud_24h = cloud_total / 24;
                });
                connection.release();
            });

        }
    });
});

myEmitter.on('dayTimer', function() {
    console.log('openGreenIQ.weather Store Historical Data...');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var yesterday = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    console.log(`openGreenIQ.weather for yesterday: ${yesterday}...`);
    
    temp_mysql = new mysql_conection(function(err, connection) {
        connection.query(`INSERT INTO db.history (date, rainfall, evapotranspiration, cloud) VALUES ('${yesterday}', ${rainfall_24h}, ${evapotranspiration}, ${cloud_24h})`, function (err, result, fields) {
            if (err) throw err;
            console.log("openGreenIQ.weather : history added");
        });
        connection.release();
    });
});

myEmitter.emit('hourTimer');