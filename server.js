// roomedit3d/server.js
//
// main entry point for the roomedit3d real-time BIM
// updater https://github.com/jeremytammik/roomedit3d
//
// Copyright 2016 by Jeremy Tammik, Autodesk Inc.

var pkg = require( './package.json' );
var lmvConfig = require('./config/config-view-and-data');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Lmv = require('view-and-data');
var express = require('express');
var app = express();
//var http = require('http').Server(app);
var io = require('socket.io');
var tokenapi = require('./routes/api/token');
var roomedit3d = require('./routes/api/roomedit3d');

app.use('/', express.static(__dirname + '/www/'));
app.use(favicon(__dirname + '/www/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var lmv = new Lmv(lmvConfig);

// async init of our token API

lmv.initialize().then(
  function() {
    app.use('/api/token',tokenapi(lmv));
  }, function(error) {
    console.log(error);
  }
);

app.set('port', process.env.PORT || 3000);

var server = app.listen(
  app.get( 'port' ),
  function() {
    var a = server.address().port;

    console.log(
      'Roomedit3d server ' + pkg.version
      + ' listening at port ' + a + '.'
    );

    //var socketSvc = new SocketSvc(server);
    //app.use('/api/roomedit3d', roomedit3d(socketSvc));

    var io2 = io(server);

    io2.on('connection', function(client){
      console.log('a client connected to the roomedit3d socket');
    });

    app.use('/api/roomedit3d', roomedit3d(io2));

    //socket.on('connection', function (client) {
    //  client.emit('roomedit3d', { hello: 'world' });
    //});
  }
);
