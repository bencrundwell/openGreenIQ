const request = require('request');
var myEmitter = require('./my_emitter');
var mysql_conection = require('./mysql');
const config = require('./config.json');

var con;

// http://www.fao.org/3/a-f2430e.pdf
var p_lookup = [.19, .22, .27, .31, .35, .37, .36, .33, .28, .24, .20, .17];


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
            var evapotranspiration = 0;

            if (weather.rain)
                if (weather.rain[ "1h" ])
                    rain = weather.rain[ "1h" ];
            console.log( "rain:", rain, "mm");
            
            // https://mepas.pnnl.gov/mepas/formulations/source_term/5_0/5_13/5_13.html
            var p = p_lookup[d.getMonth()];
            var avg_temp = ((weather.main.temp_min + weather.main.temp_max)/ 2);
            evapotranspiration = p * ((0.457 * avg_temp) + 8.128);
            // console.log (((weather.sys.sunset - weather.sys.sunrise)*100) / (3600 * 24));
            // console.log ((weather.main.temp_min + weather.main.temp_max)/ 2);
            console.log (`evapotranspiration = ${evapotranspiration}mm/day`);

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


myEmitter.emit('hourTimer');