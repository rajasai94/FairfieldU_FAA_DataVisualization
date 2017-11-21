/** CONTENTS
 *  1. Toggle Labels with Co-ordinates
 */

var showCoordinates = false;
function viewCoordinates() {
    showCoordinates = !showCoordinates;
    if(showCoordinates) {
        addLabel();
    } else {
        viewer.entities.remove(labelEntity);
    }
}

var labelEntity
function addLabel() {
  labelEntity = viewer.entities.add({
      label : {
          show                : false,
          showBackground      : true,
          font                : '14px monospace',
          horizontalOrigin    : Cesium.HorizontalOrigin.LEFT,
          verticalOrigin      : Cesium.VerticalOrigin.TOP,
          pixelOffset         : new Cesium.Cartesian2(15, 0)
      }
  });
}
addLabel()

// Mouse over the globe to see the cartographic position
handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction(function(movement) {                
    var cartesian               = viewer.scene.pickPosition(movement.endPosition);
    if( cartesian && 
        showCoordinates ) {
        var cartographic        = Cesium.Cartographic.fromCartesian(cartesian);
        var longitudeString     = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
        var latitudeString      = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
        var heightString        = cartographic.height.toFixed(2);
        labelEntity.position    = cartesian;
        labelEntity.label.show  = true;
        labelEntity.label.text  =
            'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
            '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';

        labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);