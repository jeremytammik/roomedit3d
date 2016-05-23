// roomedit3d/www/js/roomedit3dapiclient.js

var Roomedit3dApiClient = function(args) {

  var _apiUrl = args.baseUrl;

  this.postTransform = function(data) {
    return fetch(_apiUrl + '/transform', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
}
