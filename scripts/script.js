//Collection of locations to be initialized when the map runs
var MyLocations = [

{
	latitude: -8.81495,
	longitude: 13.234965,
	title: "Epic Sana Luanda Hotel ",
	description: "Epic Sana Luanda",
	//content: content("Epic Sana Luanda Hotel ")

},

{
	latitude: -8.82704,
	longitude: 13.243614,
	title: "Largo da Independência de Angola",
	description: "Largo da Independência",
	//content: content("Largo da Independência de Angola")
},


{
	latitude: -8.8105614,
	longitude: 13.2340159,
	title: "Banco Nacional de Angola",
	description: "Banco Nacional de Angola",
	//content: content("Banco Nacional de Angola")
},
{
	latitude: -8.824754,
	longitude: 13.2382359,
	title: "Igreja da Sagrada Família",
	description: "Sagrada Família Luanda Angola",
	//content: content("Igreja da Sagrada Família")
},
{
	latitude: -8.7645772,
	longitude: 13.2584397,
	title: "Coconuts Restaurante",
	description: "Coconuts Restaurante Luanda Angola",
	//content: content("Coconuts Restaurante")
}];
/*
function content(title) {
	var x;
	$.ajax({
		url:'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1b5ad63f3251fe5249199e1a3d291987&text=%22'+ title +'%22&format=json&nojsoncallback=1',
		async: 'false',
		success: function(data){ 
			
			infoWindow.setContent('<IMG BORDER="0" ALIGN="Left" src= "https://farm' + data.photos.photo[0].farm + '.staticflickr.com/' + data.photos.photo[0].server + '/' + data.photos.photo[0].id + '_' + data.photos.photo[0].secret + '.jpg">');
				console.log(x);
				return x;
		}
	});
}
*/

// Initializing variables to store the map data
var map;
var allMarkers= [];
var infoWindow;
var length = MyLocations.length;
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
		addMarkerWithTimeout({lat: MyLocations[i].latitude, lng: MyLocations[i].longitude }, MyLocations[i].title, MyLocations[i].content, 300 * i);	
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

function addMarkerWithTimeout(position, title, content, timeout) {
	window.setTimeout(function() {
    	
 
    	var marker = (new google.maps.Marker({
			position: position,
			map: map,
			animation: google.maps.Animation.DROP,
			title: title,
			content: content
		}));

		
		infoWindow = new google.maps.InfoWindow({
    		content: null 
 		});
		marker.addListener('click', toggleBounce);
		marker.addListener('click', ViewModel.Info);
  		allMarkers.push(marker);
	}, timeout);
}

setTimeout(function() {
	setMapOnAll(map);
}, 2000);

