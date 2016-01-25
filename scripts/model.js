var ViewModel = function() {
	var self = this;

	self.locations = ko.observableArray( [] );
	self.expanded = ko.observable( false );
	self.searchVal = ko.observable();

	self.slide = function() {
		
		
	};
	//method binded to clear the map of markers
	self.hideMarkers = function(){
		clearMarkers();
	};

	//this method checks if the string of the title of the location contains the elements of the query
	self.Filter = function() {
		clearMarkers();
		currentMarkers=[];
	for (var i = length - 1; i >= 0; i--) {
		if(markers[i].title.toLowerCase().indexOf(self.searchVal().toLowerCase()) >= 0) {
			currentMarkers.push(markers[i]);
		}
	}
	setMapOn(map);
}
};
ko.applyBindings( new ViewModel());