/** CONTENTS
 *  1. Enable Click action on a Flight
 *  2. Zoom in onto the place on click
 *  3. Show Options and data
 */

 // ACTION on click
 function action(click) {
    var pickedObject    = scene.pick(click.position);
    console.log("clicked", pickedObject);
    if (Cesium.defined(pickedObject)) {
        console.log(pickedObject)
        for(var i=0; i<flightsData.length; i++) {
            if(flightsData[i].ACID == pickedObject.id.id) {


                removeTrackingPath();
                showElevation = false;
                removeElevation();
                removeTrackingPoints();
                selectedFlightID    = null;
                planeID             = undefined;
                showTrackingPoints  = false;
                showTrackingPath    = false;
                pathPositions       = [];
                $('#show-points').prop('checked', false);
                $('#show-lines').prop('checked', false);
                $('.flight-item').removeClass('flight-active');
                $('.view-modes').removeClass('view-modes-active');


                selectedFlightID = pickedObject.id.id;
                focusOnPlane(selectedFlightID);
                var selectedFlightData = fullFlightDetails.filter(function(flight) {
                    return flight.ACID == selectedFlightID;
                });
                var e = viewer.entities.getById(selectedFlightID);
                console.log(clock.currentTime.secondsOfDay, Cesium.JulianDate.addSeconds(Cesium.JulianDate.fromDate(new Date()), 300, new Cesium.JulianDate()));
                //  e.position.getValue(<time>)
                var tempPosition = e.position.getValue(clock.currentTime.secondsOfDay);
                var afterFive  = Cesium.JulianDate.addSeconds(Cesium.JulianDate.fromDate(new Date()), 300, new Cesium.JulianDate());
                var tempPosition2 = e.position.getValue(afterFive.secondsOfDay);
                // var tempPosition3 = e.position.getValue(Cesium.JulianDate.addSeconds(clock.currentTime.secondsOfDay, -300, new Cesium.JulianDate()));
                console.log("tempPosition: ", tempPosition);
                console.log("tempPosition2: ", tempPosition2);
                // console.log(tempPosition3);
                $('#flight-name').text(selectedFlightID);
                $('.view-modes').addClass('view-modes-active');
                if($('#option-content').hasClass('hide')){
                    $('#option-content, #options-heading').removeClass('hide')
                }
                if(!$('.description-container').hasClass('description-container-active')) {
                    $('.description-container').addClass('description-container-active');
                }                
                break;
            }
        }        
    }
}

var selectedFlightID;
// CAMERA Zoom onto Plane
function focusOnPlane(id) {
    console.log("id: ", id);
    selectedFlightID        = id;
    var e = viewer.entities.getById(id);
    // viewer.trackedEntity    = e;
    // e.position.setInterpolationOptions({
    //     interpolationDegree: 1,
    //     interpolationAlgorithm: Cesium.LinearApproximation
    //     // interpolationDegree: 2,
    //     // interpolationAlgorithm: Cesium.HermitePolynomialApproximation
    // });
    viewer.zoomTo(e, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
}

// Listent to Left Click event 
 var clickHandler        = new Cesium.ScreenSpaceEventHandler(scene.canvas);
 clickHandler.setInputAction(action, Cesium.ScreenSpaceEventType.LEFT_CLICK);