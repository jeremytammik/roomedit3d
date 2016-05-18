// roomedit3d/server.js

var pkg = require( './package.json' );
var lmvConfig = require('./config/config-view-and-data');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Lmv = require('view-and-data');
var express = require('express');
var roomedit3dapi = require('./routes/api/roomedit3d');

var app = express();

app.use('/', express.static(__dirname + '/www/'));
app.use(favicon(__dirname + '/www/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var lmv = new Lmv(lmvConfig);

// async init of our token API

lmv.initialize().then(
  function() {
    app.use('/api/token',
      require('./routes/api/token')(lmv));
  }, function(error) {
    console.log(error);
  }
);

app.use('/api/roomedit3d', roomedit3dapi());

app.set('port', process.env.PORT || 3000);

var server = app.listen(
  app.get( 'port' ),
  function() {
    var a = server.address().port;
    console.log(
      'Roomedit3d server ' + pkg.version
      + ' listening at port ' + a + '.'
    );
  }
);
