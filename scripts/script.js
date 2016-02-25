$(function() {

  'use strict';

// Initializing variables to store the map data
var map 
var infoWindow;
var length = Restaurants.length;
var setMapOnAll;

//Initializing the map...
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: -8.8105614, lng: 13.2340159},
        zoom: 15
    });
}



//Sets all Markers down on the map
setMapOnAll = function(map) {
	//Inserts the data from the array MyLocations into the a allMarkers array
	for (var i = length - 1; i >= 0; i--) {
		addMarkerWithTimeout({lat: Restaurants[i].latitude, lng:  Restaurants[i].longitude }, Restaurants[i].title, Restaurants[i].type, 100 * i);	
	}
}
setTimeout(function() {
	setMapOnAll(map);
}, 2000);

});