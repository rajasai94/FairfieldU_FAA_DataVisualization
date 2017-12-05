/** CONTENTS
 *  1. Enable HTML toggle to show/hide "Boundaries list"
 *  2. Get Boundaries DATA from DB
 *  3. Generate HTML menu for the Data
 *  4. Click action on each boundary name
 */

// Enable HTML toggle to show/hide "Boundaries list"
function toggleBoundaryData() {
    $('#boundaries-list').toggleClass('boundaries-list-active');
    $('#toggle-boundary').toggleClass('rotate-180');
}

// Get Boundaries DATA from DB
var boundaries;
getJSON('/getBoundariesData',function(err, data) {
  if (err != null) {
    alert('Something went wrong: ' + err);
  } else {
    console.log("boundaries data: ",data);
    boundaries = data;
    listBoundaries(boundaries);
  }
});

// Generate HTML menu for the Data
function listBoundaries(boundaries) {
    for(var i=0; i<boundaries.length; i++) {
        var listItem = 
            "<li class='boundary-item' id='"+ boundaries[i].properties.name +"' onclick=\"viewBoundary('"+ boundaries[i].properties.name +"')\">"+
                boundaries[i].properties.name+
            "<\/li>";
        document.getElementById("boundaries-list").innerHTML += listItem;
    }
}


// Click action on each boundary name in the menu
function viewBoundary(name) {
    for(var b=0; b<boundaries.length; b++) {
        if(name == boundaries[b].properties.name) {
            var tempID = "#"+boundaries[b].properties.name;            
            if(boundaries[b].entity) { // remove boundary
                viewer.entities.remove(boundaries[b].entity);
                delete boundaries[b].entity;
                if($(tempID).hasClass('boundary-visible')) {
                    $(tempID).removeClass('boundary-visible');
                }
            } else { //add boundary
                var boundaryPositions = [];
                for(var i=0; i< boundaries[b].geometry.coordinates.length; i++) {
                    boundaryPositions.push(boundaries[b].geometry.coordinates[i]['0'])
                    boundaryPositions.push(boundaries[b].geometry.coordinates[i]['1'])
                    boundaryPositions.push(boundaries[b].geometry.coordinates[i]['2'])
                }
                boundaries[b].entity = viewer.entities.add({
                    name : boundaries[b].properties.name,
                    polyline : {
                        positions : Cesium.Cartesian3.fromDegreesArrayHeights(boundaryPositions),
                        width : 5,
                        material : new Cesium.PolylineOutlineMaterialProperty({
                            color : new Cesium.Color(getRandomDecimal(0,1),getRandomDecimal(0,1),getRandomDecimal(0,1),1)
                        })
                    }
                });
                if(!$(tempID).hasClass('boundary-visible')) {
                    $(tempID).addClass('boundary-visible');
                }
            }
        }
    }    
}