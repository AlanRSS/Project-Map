$(function() {

  'use strict';

// Initializing variables to store the map data
var map;
var allMarkers= [];
var infoWindow;
var length = Restaurants.length;
var clearMarkers;
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
	clearMarkers();
	for (var i = 0; i < length; i++) {
		addMarkerWithTimeout({lat: Restaurants[i].latitude, lng:  Restaurants[i].longitude }, Restaurants[i].title, Restaurants[i].type, 100 * i);	
	}
}

function toggleBounce() {
	var self = this;
	if (this.getAnimation() !== null) {
    	this.setAnimation(null);
	} 
	else {
    	this.setAnimation(google.maps.Animation.BOUNCE);
    	setTimeout(function() {
    			self.setAnimation(null);
    	}, 2100);
	}
}
	

	//Sets current selected array of allMarkers on the map



//Cleans the map of allMarkers
clearMarkers = function() {
	if (allMarkers.length > 0){
		for (var i = 0; i < length; i++) {
		    allMarkers[i].setMap(null);
	   	}
	}	
};

setTimeout(function() {
	setMapOnAll(map);
}, 2000);

});