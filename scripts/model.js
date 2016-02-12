
var ViewModel = function() {
	var self = this;
	//initializing the variables
	self.locations = ko.observableArray();
	setTimeout(function() {self.locations(allMarkers);}, 4000); 
	self.searchVal = ko.observable();
	
	//method bound to clear the map 
	self.hideMarkers = function(){
		self.searchVal("");
		self.FilterB();
	};

	//this method checks if the string of the title of the location contains the elements of the query using a button
	
	self.FilterB = function(){
		if(self.searchVal() != undefined){
			clearMarkers();
			currentMarkers=[];
			for (var i = length - 1; i >= 0; i--){
				if(allMarkers[i].title.toLowerCase().indexOf(self.searchVal().toLowerCase()) >= 0) {
					allMarkers[i].setMap(map);
					currentMarkers.push(allMarkers[i]);
	    		}
			}
			self.locations(currentMarkers);
			loc = self.locations;
		}
	};
	//this method dinamically updates the markers as the user inputs the search term, I inserted both methods just to show the functionality but only one should be used as it is redundant
	self.Filter = ko.pureComputed({
        read: function () {
            return self.searchVal();
        },
        write: function (value) {
           if(value != undefined){
			clearMarkers();
			currentMarkers=[];
			for (var i = length - 1; i >= 0; i--){
				if(allMarkers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					allMarkers[i].setMap(map);
					currentMarkers.push(allMarkers[i]);
	    		}
			}
			self.locations(currentMarkers);
			loc = self.locations;
            }
        },
        
    });


 addMarkerWithTimeout = function(position, title, content, timeout) {
	window.setTimeout(function() {
    	
 
    	var marker = (new google.maps.Marker({
			position: position,
			map: map,
			animation: google.maps.Animation.DROP,
			title: title,
			content: content
		}));

		
		infoWindow = new google.maps.InfoWindow({
    		content: null ,
    		maxWidth: 500,
    		maxHeight: 200
 		});
		marker.addListener('click', toggleBounce);
		marker.addListener('click', self.info);
  		allMarkers.push(marker);
	}, timeout);
}


	self.info = function() {

		console.log(this);
		var title = this.title;
		$.ajax({
			url:'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1b5ad63f3251fe5249199e1a3d291987&text=%22'+ title +'%22&format=json&nojsoncallback=1',
			async: 'false',
			success: function(data){ 
				console.log(data);
				var contentStr = "";
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

		//var content = '<IMG BORDER="0" ALIGN="Left" src= "https://farm' + this.content.responseJSON.photos.photo[0].farm + '.staticflickr.com/' + this.content.responseJSON.photos.photo[0].server + '/' + this.content.responseJSON.photos.photo[0].id + '_' + this.content.responseJSON.photos.photo[0].secret + '.jpg">';
		//infoWindow.setContent(this.content);
		infoWindow.open(map, this);	
	}	
};

ko.applyBindings( new ViewModel());
