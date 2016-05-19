// roomedit3d/routes/api/roomedit3d.js

var express = require('express');

module.exports = function(io) {

    var router = express.Router();

    router.post('/transform', function (req, res) {
      console.log(req.body);

      //req.body.externalId; // external id == Revit UniqueId
      //req.body.offset; // THREE.Vector3 offset x y z

      io.sockets.emit({
        msgId:'transform',
        data: req.body
      });

      return res.send();
    });

    // implement a GET for the current transform?
    // no, use a socket connection instead.
    //router.get('/transform', function (req, res) {
    //});

    return router;
}

// in the browser, the extension calls POST server/api/roomedit3d/transform
// Revit add-in calls GET server/api/roomedit3d/transform
// better: Revit add-in is notified by push via socket.io
