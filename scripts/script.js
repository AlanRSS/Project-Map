//Collection of locations to be initialized when the map runs
var MyLocations = [
{
	latitude : -8.811645,
	longitude: 13.230324,
	title: "Rialto"

},
{
	latitude: -8.81495,
	longitude: 13.234965,
	title: "Epic Sana"

},
{
	latitude: -8.8105614,
	longitude: 13.2340159,
	title: "National Banc"
},
{
	latitude: -8.824754,
	longitude: 13.2382359,
	title: "Sagrada Família"
},
{
	latitude: -8.7645772,
	longitude: 13.2584397,
	title: "Coconuts Restaurante"	
}];
// Initializing variables to store the map data
var map;
var markers= [];
var length = MyLocations.length;
var clearMarkers;
var setMapOnAll;
var setMapOn;
var currentMarkers= [];


//Initializing the map...
function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -8.8105614, lng: 13.2340159},
        zoom: 15


      });
//Sets all markers down on the map
setMapOnAll = function(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//Sets current selected array of markers on the map
setMapOn = function (map) {
  for (var i = 0; i < currentMarkers.length; i++) {
    currentMarkers[i].setMap(map);
  }
}
for (var i = 0; i < length; i++) {
	markers[i] = Marker = new google.maps.Marker({
    position:{lat: MyLocations[i].latitude, lng: MyLocations[i].longitude} ,
    map: map,
    title: MyLocations[i].title
	});
}
//Cleans the map of markers
clearMarkers = function() {
  setMapOnAll(null);
};
}

   