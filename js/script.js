// Load Cesium container

var imageryProviders = Cesium.createDefaultImageryProviderViewModels();
var selectedImageryProviderIndex = 5; 

var viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox                         : false,
    selectionIndicator              : false,
    shadows                         : true,
    imageryProviderViewModels       : imageryProviders,
    selectedImageryProviderViewModel: imageryProviders[selectedImageryProviderIndex]
});
var clock = new Cesium.Clock();

var canvas                          = viewer.canvas;
var scene                           = viewer.scene;
var camera                          = viewer.camera;
var controller                      = scene.screenSpaceCameraController;


$(document).ready(function(){
    $('.collapsible').collapsible();
});