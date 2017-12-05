// variables and constants

var showTrackingPoints  = false;
var showTrackingPath    = false;
var showElevation    = false;
var showFlightDetails   = false;
var trackingPoistions;

function getRandomDecimal(min, max) {
  return Math.random() * (max - min) + min;
}

var start = Cesium.JulianDate.fromDate(new Date());
var stop = Cesium.JulianDate.addSeconds(start, 6464515000, new Cesium.JulianDate());