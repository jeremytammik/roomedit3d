// roomedit3d/www/js/viewer.js

// Get token from our REST API URL.
// Current View & Data API requires a synchronous method

var getToken = function () {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", '/api/token', false);
  xhr.send(null);
  var response = JSON.parse(xhr.responseText);
  return response.access_token;
};

// On html document loaded

function onload() {

  //Tip: use http://models.autodesk.io to quickly upload models'
  var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YmFyY2Vsb25hMi9yb29tZWRpdDNkLnJ2dA=='; // Roomedit3d.rvt

  //List of Supported Languages:
  // Chinese Simplified: zh-cn
  // Chinese Traditional: zh-tw
  // Czech: cs
  // English: en
  // French: fr
  // German: de
  // Italian: it
  // Japanese: ja
  // Korean: ko
  // Polish: pl
  // Portuguese Brazil: pt-br
  // Russian: ru
  // Spanish: es
  // Turkish: tr

  var options = {
    language:'en', //default - en
    env: 'AutodeskProduction',
    getAccessToken: getToken,
    refreshToken: getToken,
    urn: Autodesk.Viewing.Private.getParameterByName('urn') || urn
  };

  Autodesk.Viewing.Initializer(options, function () {
    initializeViewer('viewer', 'urn:' + options.urn);
  });
}

// Initialize viewer and load model

function initializeViewer(containerId, urn) {

  Autodesk.Viewing.Document.load(urn, function (model) {

    var rootItem = model.getRootItem();

    // Grab all 3D items
    var geometryItems3d = Autodesk.Viewing.Document.getSubItemsWithProperties(
      rootItem,
      { 'type': 'geometry', 'role': '3d' },
      true);

    // Grab all 2D items
    var geometryItems2d = Autodesk.Viewing.Document.getSubItemsWithProperties(
      rootItem,
      { 'type': 'geometry', 'role': '2d' },
      true);

    var domContainer = document.getElementById(containerId);

    //UI-less Version: viewer without any Autodesk buttons and commands
    //viewer = new Autodesk.Viewing.Viewer3D(domContainer);

    //GUI Version: viewer with controls
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer);

    viewer.initialize();

    viewer.setLightPreset(8);

    //Button events
    var loadBtn = document.getElementById('loadBtn');

    loadBtn.addEventListener("click", function(){
      loadExtension(viewer);
    });

    var unloadBtn = document.getElementById('unloadBtn');

    unloadBtn.addEventListener("click", function(){
      unloadExtension(viewer);
    });

    // Illustrates how to listen to events
    // Geometry loaded is fired once the model is fully loaded
    // It is safe to perform operation involving model structure at this point
    viewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      onGeometryLoaded);

    var options = {
      globalOffset: {
        x: 0, y: 0, z: 0
      }
    }

    // Pick the first 3D item ortherwise first 2D item
    var viewablePath = (geometryItems3d.length ?
      geometryItems3d[0] :
      geometryItems2d[0]);

    viewer.loadModel(
      model.getViewablePath(viewablePath),
      options);

  }, function(err) {

    logError(err);
  });
}


// Model Geometry loaded callback

function onGeometryLoaded(event) {

  var viewer = event.target;

  viewer.removeEventListener(
    Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    onGeometryLoaded);

  //alert('Geometry Loaded!');
}

// Load custom extension

var toolname = new Roomedit3dTranslationTool()

function loadExtension(viewer) {

  var options = {
    roomedit3dApi : new Roomedit3dApiClient({
      baseUrl : '/api/roomedit3d',
      port : 3000
    })
  };

  var res = viewer.loadExtension(
    roomedit3d_toolname,
    options);
}

// Unload custom extension

function unloadExtension(viewer) {
  var res = viewer.unloadExtension(
    roomedit3d_toolname );
}

// Log viewer errors with more explicit message

function logError(err) {

  switch(err){

    case 1: //Autodesk.Viewing.ErrorCode.UNKNOWN_FAILURE
      console.log('An unknown failure has occurred.');
      break;

    case 2: //Autodesk.Viewing.ErrorCode.BAD_DATA
      console.log('Bad data (corrupted or malformed) was encountered.');
      break;

    case 3: //Autodesk.Viewing.ErrorCode.NETWORK_FAILURE
      console.log('A network failure was encountered.');
      break;

    case 4: //Autodesk.Viewing.ErrorCode.NETWORK_ACCESS_DENIED
      console.log('Access was denied to a network resource (HTTP 403).');
      break;

    case 5: //Autodesk.Viewing.ErrorCode.NETWORK_FILE_NOT_FOUND
      console.log('A network resource could not be found (HTTP 404).');
      break;

    case 6: //Autodesk.Viewing.ErrorCode.NETWORK_SERVER_ERROR
      console.log('A server error was returned when accessing a network resource (HTTP 5xx).');
      break;

    case 7: //Autodesk.Viewing.ErrorCode.NETWORK_UNHANDLED_RESPONSE_CODE
      console.log('An unhandled response code was returned when accessing a network resource (HTTP everything else).');
      break;

    case 8: //Autodesk.Viewing.ErrorCode.BROWSER_WEBGL_NOT_SUPPORTED
      console.log('Browser error: WebGL is not supported by the current browser.');
      break;

    case 9: //Autodesk.Viewing.ErrorCode.BAD_DATA_NO_VIEWABLE_CONTENT
      console.log('There is nothing viewable in the fetched document.');
      break;

    case 10: //Autodesk.Viewing.ErrorCode.BROWSER_WEBGL_DISABLED
      console.log('Browser error: WebGL is supported, but not enabled.');
      break;

    case 11: //Autodesk.Viewing.ErrorCode.RTC_ERROR
      console.log('Collaboration server error');
      break;
  }
}
