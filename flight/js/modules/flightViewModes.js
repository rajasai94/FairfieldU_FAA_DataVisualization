/** CONTENTS
 *  1. Top-Down View
 *  2. Side View
 *  3. Zoom in View
 */

// Top-Down View
function viewTopDown() {
    console.log('viewTopDown');
    viewer.trackedEntity    = undefined;
    viewer.zoomTo(viewer.entities.getById(selectedFlightID), new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
    // viewer.trackedEntity = viewer.entities.getById(selectedFlightID);
}

// Side View
function viewSide() {
    viewer.trackedEntity    = undefined;
    viewer.zoomTo(viewer.entities.getById(selectedFlightID), new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500));
}

// Zoom in View
function viewAircraft() {
    viewer.trackedEntity    = viewer.entities.getById(selectedFlightID);
}