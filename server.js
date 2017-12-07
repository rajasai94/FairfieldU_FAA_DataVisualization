(function() {
    'use strict';
    /*jshint node:true*/

    var express = require('express');
    var compression = require('compression');
    var url = require('url');
    var request = require('request');
    var fs = require('fs');
    var path = require('path');
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var DBurl = 'mongodb://localhost:27017/spaceApp25'; // mongodb url

    // local data import
    var flightDataExport = require('./flightData');
    var boundaryDataExport = require('./boundaryData');
    
    var yargs = require('yargs').options({
        'port' : {
            'default' : 8080,
            'description' : 'Port to listen on.'
        },
        'public' : {
            'type' : 'boolean',
            'description' : 'Run a public server that listens on all interfaces.'
        },
        'upstream-proxy' : {
            'description' : 'A standard proxy server that will be used to retrieve data.  Specify a URL including port, e.g. "http://proxy:8000".'
        },
        'bypass-upstream-proxy-hosts' : {
            'description' : 'A comma separated list of hosts that will bypass the specified upstream_proxy, e.g. "lanhost1,lanhost2"'
        },
        'help' : {
            'alias' : 'h',
            'type' : 'boolean',
            'description' : 'Show this help.'
        }
    });
    var argv = yargs.argv;

    if (argv.help) {
        return yargs.showHelp();
    }

    // eventually this mime type configuration will need to change
    // https://github.com/visionmedia/send/commit/d2cb54658ce65948b0ed6e5fb5de69d022bef941
    // *NOTE* Any changes you make here must be mirrored in web.config.
    var mime = express.static.mime;
    mime.define({
        'application/json' : ['czml', 'json', 'geojson', 'topojson'],
        'image/crn' : ['crn'],
        'image/ktx' : ['ktx'],
        'model/gltf+json' : ['gltf'],
        'model/gltf.binary' : ['bgltf', 'glb'],
        'text/plain' : ['glsl']
    });

    var app = express();
    app.use(compression());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(express.static(__dirname));

    function getRemoteUrlFromParam(req) {
        var remoteUrl = req.params[0];
        if (remoteUrl) {
            // add http:// to the URL if no protocol is present
            if (!/^https?:\/\//.test(remoteUrl)) {
                remoteUrl = 'http://' + remoteUrl;
            }
            remoteUrl = url.parse(remoteUrl);
            // copy query string
            remoteUrl.search = url.parse(req.url).search;
        }
        return remoteUrl;
    }

    var dontProxyHeaderRegex = /^(?:Host|Proxy-Connection|Connection|Keep-Alive|Transfer-Encoding|TE|Trailer|Proxy-Authorization|Proxy-Authenticate|Upgrade)$/i;

    function filterHeaders(req, headers) {
        var result = {};
        // filter out headers that are listed in the regex above
        Object.keys(headers).forEach(function(name) {
            if (!dontProxyHeaderRegex.test(name)) {
                result[name] = headers[name];
            }
        });
        return result;
    }

    var upstreamProxy = argv['upstream-proxy'];
    var bypassUpstreamProxyHosts = {};
    if (argv['bypass-upstream-proxy-hosts']) {
        argv['bypass-upstream-proxy-hosts'].split(',').forEach(function(host) {
            bypassUpstreamProxyHosts[host.toLowerCase()] = true;
        });
    }

    // test ping pong method
    app.get('/ping', function(req, res, next) {
        res.send('pong');
    });

    /********************************************************************************************** */
    /**
     * SPACE APP START
     */
    app.get('/getFlightsData', function(req, res) {
        // local data
        res.send(flightDataExport.flightData);

        //DB data
        /* MongoClient.connect(DBurl, function (err, db) {

            /**
             * @param successCallback
             * this function is called when we successfully retrie flight data
             * from out database.
             * this function sends back the flight data to the user as response.
             *
            var successCallback = function(data) {
                res.send(data);
            }
            var connectionError = false; // boolean to let us know the db connection status
            // Exception Handling
            try{
                // check if db connection is established
                assert.equal(null, err);
            } catch(e) {
                // Error connecting to database
                connectionError = !connectionError; // because db connection failed
                console.log("Unable to establish connection to Database: ", e);
            } finally {
                // if connection is successfull
                if(!connectionError) {
                    var flightsArray = []; // an empty array to store the flights data
                    var cursor = db.collection('flight_data').find();
                    cursor.each(function (err, doc) { // each flight object from database
                        assert.equal(err, null);
                        if (doc != null) {
                            flightsArray.push(doc);
                        } else {
                            // send the data to our successCallback function to send it to users
                            successCallback(flightsArray);
                        }
                    });
                } else { // if database connection failed
                    res.send("error establishing database connection");
                }                 
            }
        }); */
    });

    app.get('/getBoundariesData', function(req, res) {
         // local data
        res.send(boundaryDataExport.boundaryData.features);
        
        // DB DAta
         /* MongoClient.connect(DBurl, function (err, db) {

            /**
             * @param successCallback
             * this function is called when we successfully retrie flight data
             * from out database.
             * this function sends back the flight data to the user as response.
             *
            var successCallback = function(data) {
                res.send(data);
            }
            var connectionError = false; // boolean to let us know the db connection status
            // Exception Handling
            try{
                // check if db connection is established
                assert.equal(null, err);
            } catch(e) {
                // Error connecting to database
                connectionError = !connectionError; // because db connection failed
                console.log("Unable to establish connection to Database: ", e);
            } finally {
                // if connection is successfull
                if(!connectionError) {
                    var boundariesArray = []; // an empty array to store the flights data
                    var cursor = db.collection('boundaries_data').find();
                    cursor.each(function (err, doc) { // each flight object from database
                        assert.equal(err, null);
                        if (doc != null) {
                            boundariesArray.push(doc);
                        } else {
                            // send the data to our successCallback function to send it to users
                            successCallback(boundariesArray);
                        }
                    });
                } else { // if database connection failed
                    res.send("error establishing database connection");
                }                 
            }
        }); */
    });

    // one time action 
    app.get('/insertBoundaryData', function(req, res) {
        // insert the data from json/flight.json into mongodb 
        fs.readFile('./json/boundaries.json', 'utf8', function (err, data) {
            if (err) throw err;
            else {
                MongoClient.connect(DBurl, function (err, db) {
                    // console.log(data);
                    var boundaries = JSON.parse(data);
                    var connectionError = false; // boolean to let us know the db connection status
                    // Exception Handling
                    try{
                        // check if db connection is established
                        // try block succeeds if 'err' is null
                        assert.equal(null, err);
                    } catch(e) {
                        // Error connecting to database
                        connectionError = !connectionError; // because db connection failed
                        console.log("Unable to establish connection to Database: ", e);
                    } finally {
                        // if connection is successfull
                        if(!connectionError) {
                            assert.equal(null, err);
                            insertDocument(db, "boundaries_data", boundaries.features, function () {
                                db.close();
                                res.send("inserted boundaries data into 'boundaries_data' collection");
                            });
                        } else { // if database connection failed
                            res.send("error establishing database connection. could'nt insert flights data");
                        } 
                    }
                    
                });
            }
        });
    });

    // one time action
    app.get('/insertFlightData', function(req, res) {
        // insert the data from json/flight.json into mongodb 
        fs.readFile('./json/flightData.json', 'utf8', function (err, data) {
            if (err) throw err;
            else {
                MongoClient.connect(DBurl, function (err, db) {
                    // console.log(data);
                    var flightData = JSON.parse(data);
                    var connectionError = false; // boolean to let us know the db connection status
                    // Exception Handling
                    try{
                        // check if db connection is established
                        assert.equal(null, err);
                    } catch(e) {
                        // Error connecting to database
                        connectionError = !connectionError; // because db connection failed
                        console.log("Unable to establish connection to Database: ", e);
                    } finally {
                        // if connection is successfull
                        if(!connectionError) {
                            assert.equal(null, err);
                            insertDocument(db, "flight_data", flightData, function () {
                                db.close();
                                res.send("inserted flights data into 'flight_data' collection");
                            });
                        } else { // if database connection failed
                            res.send("error establishing database connection. could'nt insert flights data");
                        } 
                    }
                    
                });
            }
        });
    });

    var insertDocument = function (db, collection, array, callback) {
        db.collection(collection).insertMany(array, function (err, result) {
            assert.equal(err, null);
            console.log("Inserted the array into " + collection + " collection.");
            callback();
        });
    }
    /**
     * SPACE APP END
     */
    
    /********************************************************************************************** */
    app.get('/proxy/*', function(req, res, next) {
        // look for request like http://localhost:8080/proxy/http://example.com/file?query=1
        var remoteUrl = getRemoteUrlFromParam(req);
        if (!remoteUrl) {
            // look for request like http://localhost:8080/proxy/?http%3A%2F%2Fexample.com%2Ffile%3Fquery%3D1
            remoteUrl = Object.keys(req.query)[0];
            if (remoteUrl) {
                remoteUrl = url.parse(remoteUrl);
            }
        }

        if (!remoteUrl) {
            return res.status(400).send('No url specified.');
        }

        if (!remoteUrl.protocol) {
            remoteUrl.protocol = 'http:';
        }

        var proxy;
        if (upstreamProxy && !(remoteUrl.host in bypassUpstreamProxyHosts)) {
            proxy = upstreamProxy;
        }

        // encoding : null means "body" passed to the callback will be raw bytes

        request.get({
            url : url.format(remoteUrl),
            headers : filterHeaders(req, req.headers),
            encoding : null,
            proxy : proxy
        }, function(error, response, body) {
            var code = 500;

            if (response) {
                code = response.statusCode;
                res.header(filterHeaders(req, response.headers));
            }

            res.status(code).send(body);
        });
    });


    var port = Number(process.env.PORT || 8080);
    var server = app.listen(port, function() {
        console.log('Cesium development server running locally.  Connect to http://localhost:'+port+'/')
    })
    
    server.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
            console.log('Error: Port %d is already in use, select a different port.', argv.port);
            console.log('Example: node server.js --port %d', argv.port + 1);
        } else if (e.code === 'EACCES') {
            console.log('Error: This process does not have permission to listen on port %d.', argv.port);
            if (argv.port < 1024) {
                console.log('Try a port number higher than 1024.');
            }
        }
        console.log(e);
        process.exit(1);
    });

    server.on('close', function() {
        console.log('Cesium development server stopped.');
    });

    var isFirstSig = true;
    process.on('SIGINT', function() {
        if (isFirstSig) {
            console.log('Cesium development server shutting down.');
            server.close(function() {
              process.exit(0);
            });
            isFirstSig = false;
        } else {
            console.log('Cesium development server force kill.');
            process.exit(1);
        }
    });

})();
