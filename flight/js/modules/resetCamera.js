/** CONTENTS
 *  1. Close the Zoom view after selecting a flight
 */


function resetCamera() {
    removeTrackingPath();
    removeElevation();
    removeTrackingPoints();
    setTimeout(function() {
        removeTrackingPoints();
        selectedFlightID    = null;
        planeID             = undefined;
        showTrackingPoints  = false;
        showTrackingPath    = false;
        showElevation = false;
        pathPositions       = [];
        $('#show-points').prop('checked', false);
        $('#show-lines').prop('checked', false);
        $('.flight-item').removeClass('flight-active');
        $('.view-modes').removeClass('view-modes-active');
        viewer.homeButton.viewModel.command();
        if(!$('#option-content').hasClass('hide')){
            $('#option-content, #options-heading').addClass('hide')
        }
    }, 300);    
}