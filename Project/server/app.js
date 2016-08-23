var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var googleMaps = require('@google/maps');
var googleMapsClient;
var app = express();
var server = http.createServer(app);
var con;

var zipcodeRegex = new RegExp(/^\d{5}$/);
var nameRegex = new RegExp(/^[\w .]{1,16}$/);
var messageRegex = new RegExp(/^.{1,140}$/);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var connectToSQL = function () {
    var obj = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    googleMapsClient = googleMaps.createClient({
        key: obj.apiKey
    });

    con = mysql.createConnection(obj.mysql);
    con.connect(function (err) {
        if (err) {
            console.log("Error connecting to database.");
            console.log(err);
            setTimeout(connectToSQL, 2000);
        } else {
            console.log("Connected to the database.");
        }
    });

    con.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToSQL();
        } else {
            throw err;
        }
    });
};


app.post('/api/get', function (req, res) {
    var type = req.body.type;
    if (type == null) {
        console.log("Error :(");
        return;
    }
    switch (type.toLowerCase()) {
        case "get": {
            var count = parseInt(req.body.count, 10);
            if (count <= 0 || count > 24) {
                count = 12;
            }
            var zipcode = req.body.zipcode;
            var result = zipcodeRegex.test(zipcode);

            if (!result) {
                console.log("Zipcode was incorrect");
                return;
            }

            var query = "SELECT * FROM `amir_project` WHERE zipcode=? ORDER BY `ts` DESC LIMIT ?;";
            con.query(query, [zipcode, count], function (err, rows, fields) {
                if (err) throw err;

                var result = {
                    messages: []
                };

                for (var i in rows) {
                    if (!rows.hasOwnProperty(i)) {
                        console.log("Broke!!");
                        break;
                    }
                    var message = {
                        author: "",
                        tweet: ""
                    };
                    message.author = rows[i].poster;
                    message.tweet = rows[i].message;

                    result.messages.push(message);
                }
                sendResults(result, req, res);
            });
            break;
        }
        case "getzip": {
            googleMapsClient.reverseGeocode({
                latlng: [req.body.lat, req.body.long],
                result_type: ['postal_code']
            }, function (err, resp) {
                var result = {
                    zipcode: 10000,
                    found: false,
                    err: ""
                };
                if (err) {
                    console.log(err);
                    sendResults(result, req, res);
                    return;
                }
                for (var i in resp.json.results[0].address_components) {
                    var addr = resp.json.results[0].address_components[i];
                    if (addr.types[0] === "postal_code") {
                        result.zipcode = addr.short_name;
                        result.found = true;
                        if (!zipcodeRegex.test(result.zipcode)) {
                            result.zipcode = 12345;
                            result.found = false;
                            result.err = "Sorry your country isn't supported :(";
                        }
                        break;
                    }
                }
                sendResults(result, req, res);
            });
            break;
        }
    }
});
app.post('/api/put', function (req, res) {
    console.log(req.body);
    var type = req.body.type;
    if (type == null) {
        console.log("Error :(");
        return;
    }
    switch (type.toLowerCase()) {
        case "put": {
            var result = {
                success: true,
                errMessage: ""
            };

            var zipcode = req.body.zipcode;
            var str = req.body.message;
            var name = req.body.name;

            var r = zipcodeRegex.test(zipcode);
            if (!r) {
                var msg = "Zipcode was incorrect";
                result.success = false;
                result.errMessage = msg;
                console.log(msg);
            }

            r = messageRegex.test(str);
            if (!r && result.success) {
                var msg = "Message was incorrect";
                result.success = false;
                result.errMessage = msg;
                console.log(msg);
            }

            r = nameRegex.test(name);
            if (!r && result.success) {
                var msg = "Name was incorrect";
                result.success = false;
                result.errMessage = msg;
                console.log(msg);
            }

            if (result.success) {
                var query = "INSERT INTO `amir_project`(`message`,`zipcode`,`poster`) VALUES (?,?,?);";
                con.query(query, [str, zipcode, name], function (err, row, fields) {
                    if (err) throw err;
                    result.success = true;
                });
            }

            sendResults(result, req, res);
            break;
        }
    }
});

function sendResults(result, request, response) {
    response.jsonp(result);
}

server.listen(4754);

if (require.main === module) {
    connectToSQL();

}
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
