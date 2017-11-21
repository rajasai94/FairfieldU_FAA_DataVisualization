/** CONTENTS
 *  1. Get flights data from DB
 *  2. Add each flight to Map
 */

// Get flights data from DB
var flightsData;
getJSON('/getFlightsData', function (err, data) {
    if (err != null) {
        alert('Something went wrong: ' + err);
    } else {
        generateEntities(data)
        flightsData = data;
    }
});

/**
 *  FUNCTION: generateEntities
 *  Compute position and orientation for each given timestamp 
 *  and add the flight to cesium container
 */
// create a customized data model consisting flight ID and positions
var fullFlightDetails = []; // start => [] 
function generateEntities(flightsarray) {

    // make a list of just flight IDs
    var listOfFlights = []; // start => []
    for (var i = 0; i < flightsarray.length; i++) {
        if (listOfFlights.indexOf(flightsarray[i].ACID) == -1) {
            listOfFlights.push(flightsarray[i].ACID)
        }
    }
    console.log(listOfFlights); // result => ['Flight_1', 'Flight_2', ......, 'Flight_N']

    fullFlightDetails = [];
    for (var j = 0; j < listOfFlights.length; j++) {
        fullFlightDetails.push({
            "ACID": listOfFlights[j],
            "positions": []
        });
    }
    for (var i = 0; i < flightsarray.length; i++) {
        for (var j = 0; j < fullFlightDetails.length; j++) {
            if (fullFlightDetails[j].ACID == flightsarray[i].ACID) {
                fullFlightDetails[j].positions.push({
                    "TIME": flightsarray[i].TIME,
                    "LON": flightsarray[i].LON,
                    "LAT": flightsarray[i].LAT,
                    "ALTITUDE": flightsarray[i].ALTITUDE
                })
            }
        }
    }
    /** fullFlightDetails
     *  RESULT
     *  [{
     *    "ACID": "Flight_1",
     *    "positions": [{
     *          "TIME"    : TIME,
     *          "LON"     : LON,
     *          "LAT"     : LAT,
     *          "ALTITUDE": ALTITUDE
     *      }]
     *  },...............,{
     *    "ACID": "Flight_N",
     *    "positions": [{
     *          "TIME"    : TIME,
     *          "LON"     : LON,
     *          "LAT"     : LAT,
     *          "ALTITUDE": ALTITUDE
     *      }]
     *  }]
     */
    console.log(fullFlightDetails);

    /**
     * Compute position and orientation for each flight in "fullFlightDetails"
     */
    fullFlightDetails.forEach(function (flightItem) {


        var listItem =
            "<li class='flight-item'>" +
            "<i class='fa fa-plane'><\/i>\&nbsp;\&nbsp;\&nbsp;\&nbsp;<span onclick=\"focusOnPlane('" + flightItem.ACID + "')\">" + flightItem.ACID + "</span>" +
            "<i class='fa fa-times' onclick='resetCamera()'><\/i>" +
            "<\/li>";
        document.getElementById('flights-list').innerHTML += listItem;


        /**
         * Add positions for each timestamp to a cesium property
         */
        var flightProperty = new Cesium.SampledPositionProperty();
        for (var j = 0; j < flightItem.positions.length; j++) {
            var time = Cesium.JulianDate.addSeconds(start, flightItem.positions[j].TIME, new Cesium.JulianDate());
            var position = Cesium.Cartesian3.fromDegrees(flightItem.positions[j].LON, flightItem.positions[j].LAT, flightItem.positions[j].ALTITUDE);
            flightProperty.addSample(time, position);
        }
        var flightPosition = flightProperty;
        // console.log(flightPosition) // will have full positions data of aa flight

        /**
         * Add Orientation for each timestamp
         */
        var flightOrientation = new Cesium.CallbackProperty(function (time, result) {
            // console.log(time)

            // position1 = position at current timestamp
            var position1 = flightPosition.getValue(time);

            // position2 = position at (current timestamp + 1 second) 
            var position2 = flightPosition.getValue(Cesium.JulianDate.addSeconds(time, 1, new Cesium.JulianDate()));

            if (!Cesium.defined(position1) || !Cesium.defined(position2)) {
                // console.log("positions not defined");
                return result;
            }

            var normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(position1);

            // calculate the direction in which the flight should be facing
            // based on position1 & position2
            var direction = Cesium.Cartesian3.subtract(position2, position1, new Cesium.Cartesian3());
            Cesium.Cartesian3.normalize(direction, direction);
            var right = Cesium.Cartesian3.cross(direction, normal, new Cesium.Cartesian3());
            var up = Cesium.Cartesian3.cross(right, direction, new Cesium.Cartesian3());
            Cesium.Cartesian3.cross(direction, up, right);

            var basis = new Cesium.Matrix3();
            Cesium.Matrix3.setColumn(basis, 1, Cesium.Cartesian3.negate(right, right), basis);
            Cesium.Matrix3.setColumn(basis, 0, direction, basis);
            Cesium.Matrix3.setColumn(basis, 2, up, basis);

            return Cesium.Quaternion.fromRotationMatrix(basis);
        }, false);

        //Actually create the entity with our computed positions and orientation
        var entity = viewer.entities.add({
            id: flightItem.ACID,
            name: flightItem.ACID,
            position: flightPosition,
            orientation: flightOrientation,
            model: {
                uri: '../../../../Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
                scale: 1.0,
                minimumPixelSize: 50
            },
            path: {
                resolution: 1,
                material: Cesium.Color.HOTPINK,
                width: 0
            }
        });

        //Also set the availability of the entity to match our simulation time.
        entity.availability = new Cesium.TimeIntervalCollection();
        entity.availability.addInterval({
            start: start,
            stop: stop
        });
    }, this);
}


function flightClicked(item) {
    console.log("flight clicked");
    if (!$(item).parent().hasClass('flight-active')) {
        $('.view-modes').addClass('view-modes-active');
        $(item).parent().addClass('flight-active');
        $(item).parent().siblings().removeClass('flight-active');
    }
}

function hideFlights() {
    $('#flights-list').toggleClass('hide-flights-bar');
    $('#toggle').toggleClass('invert');
};

function toggleFlightData() {
    $('#flights-list').toggleClass('flights-list-active');
    $('#toggle-flight').toggleClass('rotate-180');
}