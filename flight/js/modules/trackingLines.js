/** CONTENTS
 *  1. Toggle "Track Line Checkbox"
 *  2. Add Tracking Line
 *  3. Remove Tracking Line
 */

// "Show Track Lines" CHECKBOX toggle function
$('#show-lines').change(function() {
    if(this.checked) {
        console.log("checked");
        var lineColor = new Cesium.Color(getRandomDecimal(0,1),getRandomDecimal(0,1),getRandomDecimal(0,1),0.6);
        showTrackingPath = true;
        addTrackingPath(lineColor);
        showElevation = true;
        addElevation(lineColor);
    } else {
        console.log("unchecked");
        showTrackingPath = false;
        removeTrackingPath();
        showElevation = false;
        removeElevation();
    }
});

var pathPositions = [];
var trackingPath = undefined;

var addTrackingPath = function(lineColor) {
    pathPositions = [];
    if(showTrackingPath && selectedFlightID != null) {
        for(var i=0; i<flightsData.length; i++) {
            if(flightsData[i].ACID == selectedFlightID) {
                pathPositions.push(flightsData[i].LON)
                pathPositions.push(flightsData[i].LAT)
                pathPositions.push(flightsData[i].ALTITUDE)
            }
        }
        console.log(pathPositions);
        trackingPath = viewer.entities.add({
            name : 'Plane tracking path',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(pathPositions),
                width : 3,
                // material : new Cesium.Color(getRandomDecimal(0,1),getRandomDecimal(0,1),getRandomDecimal(0,1),0.9)
                material : lineColor
            }
        });
    } else {
        alert("please select a flight first");
        $('#show-lines').prop('checked', false);
    }
    
}

// Remove Tracking Line
var removeTrackingPath = function() {
    if(trackingPath) {
        viewer.entities.remove(trackingPath);
        trackingPath = undefined;
    }
}