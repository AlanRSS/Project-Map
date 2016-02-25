
var ViewModel = function() {
	//Initializing variables
	var self = this;
	var currentMarkers = [];
	
	self.locations = ko.observableArray([{title: "Loading..."}]);
	self.searchVal = ko.observable();
	self.ItalyOn = ko.observable({bool:true, type:"Italian"});
	self.PizzaOn = ko.observable({bool:true, type:"Africano"});
	self.MediOn = ko.observable({bool:true, type:"Mediteranian"});
	self.AfricaOn = ko.observable({bool:true, type:"Pizza"});
	self.SushiOn = ko.observable({bool:true, type:"Japonês"});
	 
	// This is a Function Deletes Search Query
	self.clearQuery = function() {
		self.searchVal("");
		self.filter();
	};

	// This is a Function is used to filter the type of restaurants

	self.toggleType = function(data, event) {
		infoWindow.close();

		//Checking if the button is toggled or not
		if(event.target.value.bool == true) {
			//Cycling through all markers to exclude the restaurants with the type selected
			for (var i = allMarkers.length - 1; i >= 0; i--) {
				if(allMarkers[i].type == event.target.value.type) {
					allMarkers[i].setMap();
					//Styling for awesome user experience
					$(event.target).parent().addClass("filterOff");
					for (var z = currentMarkers.length - 1; z >= 0; z--) {
						if(currentMarkers[z].title == allMarkers[i].title) {
							currentMarkers.splice(z, 1);
						}
					}
				}
			}
			self.locations(currentMarkers);
			//toggle to Off
			event.target.value.bool = false;
		} 
		else {		
			//Styling Off
			$(event.target).parent().removeClass("filterOff");
			//Cycling through all markers to include the restaurants with the type selected
			for (var i = allMarkers.length - 1; i >= 0; i--) {
				if(allMarkers[i].type == event.target.value.type) {
					allMarkers[i].setMap(map);
					currentMarkers.push(allMarkers[i]);
				}
			}
			self.locations(currentMarkers);
			//toggle to On
			event.target.value.bool = true;
		}
	};

	//This Function filters the restaurants according to the selected map item on the list
	self.filterB = function() {
		infoWindow.close();
		if(self.searchVal() != undefined) {
			clearMarkers();
			currentMarkers = [];
			for (var i = length - 1; i >= 0; i--) {
				if(allMarkers[i].title.toLowerCase().indexOf(self.searchVal().toLowerCase()) >= 0) {
					allMarkers[i].setMap(map);
					currentMarkers.push(allMarkers[i]);
				}
			}
			self.locations(currentMarkers);
		}
	};

	var allMarkers= [];
	//this method dinamically updates the markers as the user inputs the search term, I inserted both methods just to show the functionality but only one should be used as it is redundant
	self.filter = ko.pureComputed({
	read: function () {
	return self.searchVal();
	},
	write: function (value) {
	if(value != undefined){
	clearMarkers();
	currentMarkers=[];
	for (var i = allMarkers.length - 1; i >= 0; i--){
	if(allMarkers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	allMarkers[i].setMap(map);
	currentMarkers.push(allMarkers[i]);
	}
	}
	self.locations(currentMarkers);
	}
	},
	});

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
	//Cleans the map of allMarkers
	clearMarkers = function() {
	if (allMarkers.length > 0){
	for (var i = allMarkers.length - 1; i >= 0; i--) {
	allMarkers[i].setMap(null);
	}
	}

	};

	addMarkerWithTimeout = function(position, title, type, timeout) {
	window.setTimeout(function() {

	var marker = (new google.maps.Marker({
	position: position,
	map: map,
	animation: google.maps.Animation.DROP,
	title: title,
	infoBool: false,
	type: type
	}));


	infoWindow = new google.maps.InfoWindow({
	content: null ,
	Width: 700
	});

	marker.addListener('click', toggleBounce);
	marker.addListener('click', self.info);
	allMarkers.push(marker);
	}, timeout);
	}

	self.pullFourSqInfo = function(query, contentStr){

	$.ajax({
	url: 'https://api.foursquare.com/v2/venues/search?near=luanda&query='+ query +'&client_id=KYMTQN4SEBBF2P112ZVGZ3ZN3MSE1HNGFFVYDVRLAVYBQOJP&client_secret=ELIA3I1ACIFBWYPTSX5KWEBOSV3MXLKUD0DUUWOZUZ0PFFLP&v=20160213&m=foursquare',
	success: function(data) {
	console.log(data);
	var ref =	data.response.venues[0];
	contentStr += '<div class="scrollFix">'+
	'<h2>' + ref.name + '</h2>' +
	'<p><h4>' + ref.categories[0].name + '</h4></p>'; 
	for (var i = ref.location.formattedAddress.length - 1; i >= 0; i--) {
	contentStr += '<p>' + ref.location.formattedAddress[i] + '</p>';
	}
	console.log(contentStr);
	infoWindow.setContent(contentStr);
	self.pullFourSqPhotos(ref.id, contentStr);
	}

	});
	}	
	self.pullFourSqPhotos = function(id, contentStr){
	var url = 'https://api.foursquare.com/v2/venues/' + id + '/photos?&client_id=KYMTQN4SEBBF2P112ZVGZ3ZN3MSE1HNGFFVYDVRLAVYBQOJP&client_secret=ELIA3I1ACIFBWYPTSX5KWEBOSV3MXLKUD0DUUWOZUZ0PFFLP&v=20160213&m=foursquare';
	$.ajax({
	url: url,
	success: function(data) {
	console.log(data);
	var ref =	data.response.photos;
	contentStr += '<div class="row">'; 
	for (var i = 3 - 1; i >= 0; i--) {
	var photourl = '<div class= "box"><hr> <img src="' + ref.items[i].prefix + 'cap300' + ref.items[i].suffix + '"/></div>';
	contentStr += photourl ;
	}
	contentStr +=  '</div>';
	infoWindow.setContent(contentStr);
	}


	});
	}


	self.pullFlickr = function(query, contentStr) {
	$.ajax({
	url:'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1b5ad63f3251fe5249199e1a3d291987&text=%22'+ query +'%22&format=json&nojsoncallback=1',
	async: 'false',
	success: function(data){ 
	console.log(data);

	if (data.photos.photo.length >= 3){
	for (var i = 2; i >= 0; i--) {
	contentStr += '<div class = "imagebox"><img class="img-responsive" src= "https://farm' + data.photos.photo[i].farm + '.staticflickr.com/' + data.photos.photo[i].server + '/' + data.photos.photo[i].id + '_' + data.photos.photo[i].secret + '.jpg"></div>';
	}
	}
	else{
	contentStr += '<img class="img-responsive" BORDER="0" ALIGN="Left" src= "https://farm' + data.photos.photo[0].farm + '.staticflickr.com/' + data.photos.photo[0].server + '/' + data.photos.photo[0].id + '_' + data.photos.photo[0].secret + '.jpg">';
	}


	infoWindow.setContent(contentStr);
	}
	});
	}

	self.info = function() {
	if(this.infoBool == false)
	{

	this.infoBool = true;
	console.log(this);
	var title = this.title;
	var contentStr = "";

	infoWindow.setContent('<img src= "images/Loader.gif">');
	infoWindow.open(map, this);


	self.pullFourSqInfo(title, contentStr);
	}
	else
	{
	infoWindow.close();
	this.infoBool = false;
	}
	}	
	setTimeout(function() {
		self.locations(allMarkers);
		for (var i = allMarkers.length - 1; i >= 0; i--) {
			currentMarkers.push(allMarkers[i]);
		};
	}, 4000);
};


ko.applyBindings( new ViewModel());
