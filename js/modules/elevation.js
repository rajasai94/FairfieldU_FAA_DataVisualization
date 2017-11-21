/** CONTENTS
 *  1. Toggle "Show Elevation Checkbox"
 *  2. Add Elevation Wall
 *  3. Remove Elevation Wall
 */

// "Show Elevation" CHECKBOX toggle function
// $('#show-elevation').change(function() {
//   if(this.checked) {
//       console.log("checked");
//       showElevation = true;
//       addElevation();
//   } else {
//       console.log("unchecked");
//       showElevation = false;
//       removeElevation();
//   }
// });

var elevationPosition = [];
var elevationLines = [];
var trackingElevation = undefined;



// ADD Elevation
var addElevation = function(lineColor) {
  elevationPosition = [];
  minimumHeights = [];
//    color change
//   var lineColor = new Cesium.Color(getRandomDecimal(0,1),getRandomDecimal(0,1),getRandomDecimal(0,1),0.3);
  if(showElevation && selectedFlightID != null) {
      flightsData.forEach(function(flightItem) {
        if(flightItem.ACID == selectedFlightID) {
            elevationPosition.push(flightItem.LON)
            elevationPosition.push(flightItem.LAT)
            elevationPosition.push(flightItem.ALTITUDE)
            minimumHeights.push(0.0);

            var tempLineEntity = viewer.entities.add({
                name : 'Plane tracking perpendicular line',
                polyline : {
                    positions : Cesium.Cartesian3.fromDegreesArrayHeights([
                        flightItem.LON, flightItem.LAT, flightItem.ALTITUDE, 
                        flightItem.LON, flightItem.LAT, 0.0
                    ]),
                    width : 1,
                    material : lineColor
                }
            });
            elevationLines.push(tempLineEntity);
        }
      });
    //   trackingElevation = viewer.entities.add({
    //       name : 'Plane tracking path',
    //       wall : {
    //           positions : Cesium.Cartesian3.fromDegreesArrayHeights(elevationPosition),
    //           minimumHeights: minimumHeights,
    //         //   material : new Cesium.Color(0.12,0.46,1,0.3)
    //           material : new Cesium.Color(getRandomDecimal(0,1),getRandomDecimal(0,1),getRandomDecimal(0,1),0.3)
    //       }
    //   });      
  } else {
      alert("please select a flight first");
      $('#show-lines').prop('checked', false);
  }
  
}

// Remove Elevation
var removeElevation = function() { 
    trackingElevation = undefined;
    elevationLines.forEach(function(elevationLine) {
        viewer.entities.remove(elevationLine);
    });
    elevationLines = [];
}