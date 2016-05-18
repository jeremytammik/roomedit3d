var express = require('express');

module.exports = function(lmv) {

    var router = express.Router();

    router.post('/transform', function (req, res) {
      console.log(req)
    });

    // implement a GET for the current transform?
    // no, use a socket connection instead.
    //router.get('/transform', function (req, res) {
    //});

    return router;
}

// in the browser, the extension calls POST server/api/roomedit3d/transform
// Revit add-in calls GET server/api/roomedit3d/transform
// better: Revit add-in connects with socket