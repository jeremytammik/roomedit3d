// roomedit3d/www/js/extensions/Autodesk.ADN.Viewing.Extension.TransformTool.js
//
// Transform Tool viewer extension by Philippe Leefsma, August 2015

function realString( a ) {
  return a.toFixed( 2 );
}

function pointString( p ) {
  return '('
    + realString( p.x ) + ','
    + realString( p.y ) + ','
    + realString( p.z ) + ')';
}

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.TransformTool = function (viewer, options) {

  function TransformTool() {

    var _hitPoint = null;
    var _initialHitPoint = null;
    var _isDragging = false;
    var _isDirty = false;
    var _transformMesh = null;
    var _selectedFragProxyMap = {};
    var _transformControlTx = null;
    var _externalId = null;

    // Creates a dummy mesh to attach control to

    function createTransformMesh() {

      var material = new THREE.MeshPhongMaterial(
        { color: 0xff0000 });

      viewer.impl.matman().addMaterial(
        guid(),
        material,
        true);

      var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.0001, 5),
        material);

      sphere.position.set(0, 0, 0);

      return sphere;
    }

    // on translation change
    function onTxChange() {

      _isDirty = true;

      for(var fragId in _selectedFragProxyMap) {

        var fragProxy = _selectedFragProxyMap[fragId];

        var position = new THREE.Vector3(
          _transformMesh.position.x - fragProxy.offset.x,
          _transformMesh.position.y - fragProxy.offset.y,
          _transformMesh.position.z - fragProxy.offset.z);

        fragProxy.position = position;

        fragProxy.updateAnimTransform();
      }

      viewer.impl.sceneUpdated(true);
    }

    // on camera changed
    function onCameraChanged() {
      if(_transformControlTx) {
        _transformControlTx.update();
      }
    }

    // item selected callback
    function onSelectionChanged(event) {
      var dbId = event.dbIdArray[0];

      if(dbId) {
        viewer.getProperties(dbId, function(result){
          //console.log(result);
          _externalId = result.externalId;
        });
      }
      handleSelectionChanged(event.fragIdsArray);
    }

    function onAggregateSelectionChanged(event) {
      var fragIdsArray = [];

      if(event.selections && event.selections.length) {

        var selection = event.selections[0];

        fragIdsArray = selection.fragIdsArray;
      }
      handleSelectionChanged(fragIdsArray);
    }

    function handleSelectionChanged(fragIdsArray) {

      // component unselected

      if(!fragIdsArray.length) {
        _hitPoint = null;
        _externalId = null;
        _transformControlTx.visible = false;

        _transformControlTx.removeEventListener(
          'change', onTxChange);

        viewer.removeEventListener(
          Autodesk.Viewing.CAMERA_CHANGE_EVENT,
          onCameraChanged);

        return;
      }

      if(_hitPoint) {

        _initialHitPoint = new THREE.Vector3(
          _hitPoint.x, _hitPoint.y, _hitPoint.z );

        _selectedFragProxyMap = {};

        _transformControlTx.visible = true;
        _transformControlTx.setPosition(_hitPoint);
        _transformControlTx.addEventListener(
          'change', onTxChange);

        viewer.addEventListener(
          Autodesk.Viewing.CAMERA_CHANGE_EVENT,
          onCameraChanged);

        fragIdsArray.forEach(function (fragId) {

          var fragProxy = viewer.impl.getFragmentProxy(
            viewer.model,
            fragId);

          fragProxy.getAnimTransform();

          var offset = {
            x: _hitPoint.x - fragProxy.position.x,
            y: _hitPoint.y - fragProxy.position.y,
            z: _hitPoint.z - fragProxy.position.z
          };

          fragProxy.offset = offset;

          _selectedFragProxyMap[fragId] = fragProxy;
        });

        _hitPoint = null;
      }
    }

    // normalize screen coordinates
    function normalize(screenPoint) {

      var viewport = viewer.navigation.getScreenViewport();

      var n = {
        x: (screenPoint.x - viewport.left) / viewport.width,
        y: (screenPoint.y - viewport.top) / viewport.height
      };

      return n;
    }

    // get 3d hit point on mesh
    function getHitPoint(event) {

      var screenPoint = {
        x: event.clientX,
        y: event.clientY
      };

      var n = normalize(screenPoint);

      var hitPoint = viewer.utilities.getHitPoint(n.x, n.y);

      return hitPoint;
    }

    this.getNames = function() {
      return ['Autodesk.ADN.Viewing.Extension.TransformTool'];
    };

    this.getName = function() {
      return 'Autodesk.ADN.Viewing.Extension.TransformTool';
    };

    // activates tool
    this.activate = function() {

      viewer.select([]);

      var bbox = viewer.model.getBoundingBox();

      viewer.impl.createOverlayScene(
        'Autodesk.ADN.Viewing.Extension.TransformTool');

      _transformControlTx = new THREE.TransformControls(
        viewer.impl.camera,
        viewer.impl.canvas,
        "translate");

      _transformControlTx.setSize(
        bbox.getBoundingSphere().radius * 5);

      _transformControlTx.visible = false;

      viewer.impl.addOverlay(
        'Autodesk.ADN.Viewing.Extension.TransformTool',
        _transformControlTx);

      _transformMesh = createTransformMesh();

      _transformControlTx.attach(_transformMesh);

      viewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        onSelectionChanged);

      viewer.addEventListener(
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        onAggregateSelectionChanged);
    };

    // deactivate tool
    this.deactivate = function() {

      viewer.impl.removeOverlay(
        'Autodesk.ADN.Viewing.Extension.TransformTool',
        _transformControlTx);

      _transformControlTx.removeEventListener(
        'change',
        onTxChange);

      _transformControlTx = null;

      viewer.impl.removeOverlayScene(
        'Autodesk.ADN.Viewing.Extension.TransformTool');

      viewer.removeEventListener(
        Autodesk.Viewing.CAMERA_CHANGE_EVENT,
        onCameraChanged);

      viewer.removeEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        onSelectionChanged);

      viewer.removeEventListener(
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        onAggregateSelectionChanged);
    };

    this.update = function(t) {
      return false;
    };

    this.handleSingleClick = function(event, button) {
      return false;
    };

    this.handleDoubleClick = function(event, button) {
      return false;
    };

    this.handleSingleTap = function(event) {
      return false;
    };

    this.handleDoubleTap = function(event) {
      return false;
    };

    this.handleKeyDown = function(event, keyCode) {
      return false;
    };

    this.handleKeyUp = function(event, keyCode) {
      return false;
    };

    this.handleWheelInput = function(delta) {
      return false;
    };

    this.handleButtonDown = function(event, button) {

      _hitPoint = getHitPoint(event);

      console.log( 'button down: ' );
      console.log(_hitPoint);

      _isDragging = true;
      _isDirty = false;

      if (_transformControlTx.onPointerDown(event))
        return true;

      //return _transRotControl.onPointerDown(event);
      return false;
    };

    this.handleButtonUp = function(event, button) {

      if( _isDirty && _externalId && _initialHitPoint ) {

        //console.log( _hitPoint );

        //var offset = _hitPoint.sub( _initialHitPoint );
        var offset = _transformControlTx.position.sub( _initialHitPoint );

        console.log( 'button up: external id '
          + _externalId + ' offset by '
          + pointString( offset ) );

        var data = {
          externalId : _externalId,
          offset : offset
        }

        options.roomedit3dApi.postTransform(data);

        _hitPoint = null;
        _externalId = null;
        _initialHitPoint = null;
      }

      _isDragging = false;
      _isDirty = false;

      if (_transformControlTx.onPointerUp(event))
        return true;

      //return _transRotControl.onPointerUp(event);
      return false;
    };

    this.handleMouseMove = function(event) {

      if (_isDragging) {
        if (_transformControlTx.onPointerMove(event) ) {
          return true;
        }
        return false;
      }

      if (_transformControlTx.onPointerHover(event))
        return true;

      //return _transRotControl.onPointerHover(event);
      return false;
    };

    this.handleGesture = function(event) {
      return false;
    };

    this.handleBlur = function(event) {
      return false;
    };

    this.handleResize = function() {
    };
  }

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _self = this;

  _self.tool = null;

  // extension load callback
  _self.load = function () {

    _self.tool = new TransformTool();

    viewer.toolController.registerTool(_self.tool);
    viewer.toolController.activateTool(_self.tool.getName());

    console.log('Autodesk.ADN.Viewing.Extension.TransformTool loaded');

    return true;
  };

  // extension unload callback
  _self.unload = function () {

    viewer.toolController.deactivateTool(_self.tool.getName());

    console.log('Autodesk.ADN.Viewing.Extension.TransformTool unloaded');

    return true;
  };

  // generate a new random guid
  function guid() {

    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

    return guid;
  };
};

Autodesk.ADN.Viewing.Extension.TransformTool.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.TransformTool.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.TransformTool;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.TransformTool',
  Autodesk.ADN.Viewing.Extension.TransformTool);
