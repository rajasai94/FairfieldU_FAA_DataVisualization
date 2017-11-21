/** CONTENTS
 *  1. Toggle "Track Points Checkbox"
 *  2. Add Tracking Points
 *  3. Remove Tracking Points
 */


// "Show Track Points" CHECKBOX toggle function
$('#show-points').change(function() {
    if(this.checked) {
        console.log("checked");
        showTrackingPoints = true;
        addTrackingPoints();
    } else {
        console.log("unchecked");
        showTrackingPoints = false;
        removeTrackingPoints();
    }
});

var flightTrackingPoints = {};
var newFlightList = [];

// Filter out all the trackingPoints that are to be added
function addTrackingPoints() {
    if(showTrackingPoints && selectedFlightID != null) {  
        newFlightList = flightsData.filter(function(singleFlight) {
            return singleFlight.ACID == selectedFlightID;
        });
        atp();
    } else {
        alert("please select a flight first");
        $('#show-points').prop('checked', false);
    }
}

// ADD the tracking Points
function atp() {
    for(var i= 0; i < newFlightList.length; i=i+4) {
        // Create a circle.
        var name = newFlightList[i].ACID+i.toString();
        flightTrackingPoints[name] = viewer.entities.add({
            name : name,
            position: Cesium.Cartesian3.fromDegrees(newFlightList[i].LON, newFlightList[i].LAT, newFlightList[i].ALTITUDE),
            ellipsoid : {
                radii : new Cesium.Cartesian3(100.0, 100.0, 100.0),
                material : new Cesium.Color(0.19,0.22,0.23,0.7),
                outline : false,
                minimumRadius: 100.0,
            }
        });    
    }
}

// REMOVE the tracking points
function removeTrackingPoints() {
    if(!showTrackingPoints && selectedFlightID != null) {
        for(var i=0; i<newFlightList.length; i++) {
            if(newFlightList[i].ACID == selectedFlightID) {
                var name = newFlightList[i].ACID+i.toString();
                if(flightTrackingPoints[name]) {
                    viewer.entities.remove(flightTrackingPoints[name]);
                    delete flightTrackingPoints[name];
                }
            }
        }
    }
}