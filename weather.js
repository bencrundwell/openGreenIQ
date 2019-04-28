const request = require('request');
var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const config = require('./config.json');

var con;

myEmitter.on('hourTimer', function() {

    console.log('openGreenIQ.weather Check weather...');
    var url = `http://api.openweathermap.org/data/2.5/weather?lat=${config.weather_config.lat}&lon=${config.weather_config.lon}&appid=${config.weather_config.apiKey}&units=metric`;

    request(url, function (err, response, body) {
        var d = new Date();
        if(err){
        console.log('error:', err);
        } else {
            //body = "{\"rain\":{\"1h\":3}}";
            console.log('body:', body);
            var weather = JSON.parse(body);
            var rain = 0.0;
            if (weather.rain)
                if (weather.rain[ "1h" ])
                    rain = weather.rain[ "1h" ];
            console.log( "rain:", rain, "mm");

            temp_mysql = new mysql_conection(function(err, connection) {
                if (err) throw err;
                connection.query(`UPDATE db.rainfall SET rain = ${rain} WHERE id = ${d.getHours()+1}`, function (err, result, fields) {
                    if (err) throw err;
                    console.log("openGreenIQ.weather : rain updated");
                });
                connection.release();
            });
        }
    });
});

