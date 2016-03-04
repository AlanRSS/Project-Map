//************ VARIABLES ************
//Keeps the data of all markers
var allMarkers = [],
    map,
    info,
    infoMarker,
    infoBool = false,
    infoWindow,
    toggleBounce,
    googleSuccess,
    googleError,
    MapIt,
    initMap;

//Initializing google map 
$(function() {
    'use strict';

    var length = Restaurants.length;

    //Initializing the map...
    initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -8.8105614,
                lng: 13.2340159
            },
            zoom: 15
        });
    };


    //************ ADDING MARKERS ************

    //Adding a Marker to the map with a timeout so that the animation can be noted for every singular marker

    var addMarkerWithTimeout = function(position, title, type, timeout) {

        //Marker object and setting up the stage for the marker to be added
        setTimeout(function() {
            var marker = (new google.maps.Marker({
                position: position,
                map: map,
                animation: google.maps.Animation.DROP,
                title: title,
                type: type
            }));
            

            //triggers the information window pop open and bounce animation of the markers
            function markerClick() {
                info(marker);
                if(infoMarker == this) {
                     toggleBounce(marker);
                }
            }

            //adding an on click listener for the markers to trigger the masterClick Function
            marker.addListener('click', markerClick);

            //populate the allMarkers array
            allMarkers.push(marker);
        }, timeout);
    };

    //Sets all Markers down on the map
    var setMapOnAll = function(map) {

        //Inserts the data from the array MyLocations into the a allMarkers array
        for (var i = length - 1; i >= 0; i--) {
            addMarkerWithTimeout({
                lat: Restaurants[i].latitude,
                lng: Restaurants[i].longitude
            }, Restaurants[i].title, Restaurants[i].type, 100 * i);
        }
    };
    MapIt = function() {
        if (typeof google !== 'undefined') {
            setMapOnAll(map);
            infoWindow = new google.maps.InfoWindow({
                content: null
            });
        }
    }
    
});