/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2014 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////
var lmvConfig = require('./config/config-view-and-data');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Lmv = require('view-and-data');
var express = require('express');

var app = express();

app.use('/', express.static(__dirname + '/www/'));
app.use(favicon(__dirname + '/www/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var lmv = new Lmv(lmvConfig);

//async init of our token API
lmv.initialize().then(

  function() {

    app.use('/api/token', require('./routes/api/token')(lmv));

  }, function(error) {

    console.log(error);
  });

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {

    console.log('Server listening on: ');
    console.log(server.address());
});
