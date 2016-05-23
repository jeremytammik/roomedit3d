// roomedit3d/routes/api/roomedit3d.js

var express = require('express');

module.exports = function(io) {

  var router = express.Router();

  router.post('/transform', function (req, res) {
    console.log(req.body);

    //req.body.externalId; // external id == Revit UniqueId
    //req.body.offset; // THREE.Vector3 offset x y z

    io.sockets.emit('transform', req.body);

    return res.send();
  });

  return router;
}
