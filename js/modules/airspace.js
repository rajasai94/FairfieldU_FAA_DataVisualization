/** CONTENTS
 *  1. Toggle "airspace Checkbox"
 *  2. Add airspace
 *  3. Remove airspace
 */

// Show airspace CHECKBOX toggle function
$('#show-airspace').change(function() {
  if(this.checked) {
      console.log("checked");
      addAirspace();
  } else {
      console.log("unchecked");
      removeAirspace();
  }
});

// ADD AIRSPACE
var airSpace;
var airSpace1;
var airSpace2;
var airSpace3;
var airSpace4;
var addAirspace = function() {

  airSpace = viewer.entities.add({
      name : 'Red polygon on surface',
      polygon : {
          hierarchy : Cesium.Cartesian3.fromDegreesArray(
              [-102.0, 34.0,
              -104.0, 32.0,
              -107.0, 31.0,
              -104.0, 32.0,
              -102.0, 35.0]),
          material : Cesium.Color.RED.withAlpha(0.3)
      }
  });
  
  airSpace1 = viewer.entities.add({
      name : 'Red polygon on surface',
      polygon : {
          hierarchy : Cesium.Cartesian3.fromDegreesArray(
              [-103.8910, 40.7608,
              -104.9903, 39.7392,
              -94.5786, 39.0997,
              -96.7970, 32.7767,
              -95.3698, 29.7604,
              -105.9378, 35.6870,
              -103.8910, 40.7608]),
          material : Cesium.Color.RED.withAlpha(0.3)
      }
  });
  
  airSpace2 = viewer.entities.add({
      name : 'Red polygon on surface',
      polygon : {
          hierarchy : Cesium.Cartesian3.fromDegreesArray(
              [-122.4194, 37.7749,
              -119.7726, 36.7468,
              -119.3540, 38.6699,
              -119.8138, 39.5296,
              -122.4194, 37.7749]),
          material : Cesium.Color.RED.withAlpha(0.3)
      }
  });
  
  airSpace3 = viewer.entities.add({
      name : 'Red polygon on surface',
      polygon : {
          hierarchy : Cesium.Cartesian3.fromDegreesArray(
              [-112.759167,41.191667,
               -112.650833,41.116667,
              -112.650833,41.016667,
              -112.8425,40.916667,
              -114.000833,40.916667,
              -114.0425,40.925,
              -114.0425,41.141667,
              -113.834167,41.266667,
              -113.29636,41.230422,
              -112.759167,41.191667]),
          material : Cesium.Color.RED.withAlpha(0.3)
      }
  });
  
  airSpace4 = viewer.entities.add({
      name : 'Red polygon on surface',
      polygon : {
          hierarchy : Cesium.Cartesian3.fromDegreesArray(
              [-117.4260,47.6588,
               -111.0429,45.6770,
              -108.5007,45.7833,
              -112.0340,43.4917,
              -117.4260,47.6588]),
          material : Cesium.Color.RED.withAlpha(0.3)
      }
  });
}




// REMOVE SUAs
var removeAirspace = function() {
  viewer.entities.remove(airSpace);
  viewer.entities.remove(airSpace1);
  viewer.entities.remove(airSpace2);
  viewer.entities.remove(airSpace3);
  viewer.entities.remove(airSpace4);
}