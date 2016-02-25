var ViewModel = function() {
    //'use strict';

    
    //************ VARIABLES ************

    var self = this;

    //Keeps the data of all markers
    var allMarkers = [];

    //Used to store current markers on the occurrence of a filter
    var currentMarkers = [];

    self.locations = ko.observableArray([{
        title: "Loading..."
    }]);
    self.searchVal = ko.observable();
    self.ItalyOn = ko.observable({
        bool: true,
        type: "Italian"
    });
    self.PizzaOn = ko.observable({
        bool: true,
        type: "Africano"
    });
    self.MediOn = ko.observable({
        bool: true,
        type: "Mediteranian"
    });
    self.AfricaOn = ko.observable({
        bool: true,
        type: "Pizza"
    });
    self.SushiOn = ko.observable({
        bool: true,
        type: "Japonês"
    });

    //************ ADDING MARKERS ************

    //Adding a Marker to the map with a timeout so that the animation can be noted for every singular marker
    addMarkerWithTimeout = function(position, title, type, timeout) {
        //Marker object and setting up the stage for the marker to be added
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
                content: null,
                Width: 700
            });
            marker.addListener('click', self.toggleBounce);
            marker.addListener('click', self.info);
            allMarkers.push(marker);
        }, timeout);
    };

    //************ CLEANING ************

    //This functions sorts marker arrays (keeps the program cleaner in a way :P )
    self.sortMarkerList = function(array) {
        array.sort(function(a, b) {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        });
    }

    //This is a Function deletes search query
    self.clearQuery = function() {
        self.filter(undefined);
    };

    //Cleans the map of all markers
    self.clearMarkers = function() {
        currentMarkers = [];
        if (allMarkers.length > 0) {
            for (var i = allMarkers.length - 1; i >= 0; i--) {
                allMarkers[i].setMap(null);
            }
        }
    };


    //************ FILTER ************

    //This Function dinamically updates the markers as the search term is changed
    self.filter = ko.pureComputed({
        read: function() {
            return self.searchVal();
        },

        write: function(value) {

            //in case the search term is invalid the query isnt processed
            if (value != undefined) {
                self.clearMarkers();
                currentMarkers = [];

                /*Cycles through the array of all markers to find if the titles of the markers contain the search term
                and adds the markers according to the result to the current markers that will be displayed on the map*/
                for (var i = allMarkers.length - 1; i >= 0; i--) {
                    if (allMarkers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        allMarkers[i].setMap(map);
                        currentMarkers.push(allMarkers[i]);
                    }
                }
                self.sortMarkerList(currentMarkers);
                self.locations(currentMarkers);
            } else {
                self.clearMarkers();
                for (var i = allMarkers.length - 1; i >= 0; i--) {
                    allMarkers[i].setMap(map);
                    currentMarkers.push(allMarkers[i]);
                }
                self.locations(currentMarkers);
            }
        }
    });

    //This is a Function is used to filter restaurants using their type
    self.toggleType = function(data, event) {
        infoWindow.close();

        //Checking if the button is toggled or not
        if (event.target.value.bool == true) {

            //Cycling through all markers to exclude the restaurants with the type selected
            for (var i = allMarkers.length - 1; i >= 0; i--) {
                if (allMarkers[i].type == event.target.value.type) {
                    allMarkers[i].setMap();

                    //Styling for awesome user experience
                    $(event.target).parent().addClass("filterOff");
                    for (var z = currentMarkers.length - 1; z >= 0; z--) {
                        if (currentMarkers[z].title == allMarkers[i].title) {
                            currentMarkers.splice(z, 1);
                        }
                    }
                }
            }
            self.sortMarkerList(currentMarkers);
            self.locations(currentMarkers);

            //toggle to Off
            event.target.value.bool = false;
        } else {

            //Styling Off
            $(event.target).parent().removeClass("filterOff");

            //Cycling through all markers to include the restaurants with the type selected
            for (var i = allMarkers.length - 1; i >= 0; i--) {
                if (allMarkers[i].type == event.target.value.type) {
                    allMarkers[i].setMap(map);
                    currentMarkers.push(allMarkers[i]);
                }
            }
            self.sortMarkerList(currentMarkers);
            self.locations(currentMarkers);

            //toggle to On
            event.target.value.bool = true;
        }
    };



    //************ ANIMATIONS ************

    //This Function toggles the animation of the markers bouncing on click
    self.toggleBounce = function() {
        var self = this;
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
        } else {
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.setAnimation(null);
            }, 2100);
        }
    }

    //************ AJAX Requests ************

    //This Function pulls venue data from 4Square
    self.pullFourSqInfo = function(query, contentStr) {
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search?near=luanda&query=' + query + '&client_id=KYMTQN4SEBBF2P112ZVGZ3ZN3MSE1HNGFFVYDVRLAVYBQOJP&client_secret=ELIA3I1ACIFBWYPTSX5KWEBOSV3MXLKUD0DUUWOZUZ0PFFLP&v=20160213&m=foursquare',

            success: function(data) {
                /*In case of a successful connection the Function sotres the venue Id and builds the content string used to create the information window data
                the venue Id is then used to call the Photo request Function*/
                var ref = data.response.venues[0];

                contentStr += '<div class="scrollFix">' +
                    '<h2>' + ref.name + '</h2>' +
                    '<p><h4>' + ref.categories[0].name + '</h4></p>';
                for (var i = ref.location.formattedAddress.length - 1; i >= 0; i--) {
                    contentStr += '<p>' + ref.location.formattedAddress[i] + '</p>';
                }

                infoWindow.setContent(contentStr);
                self.pullFourSqPhotos(ref.id, contentStr);
            }
        });
    }

    //This Function pulls venue photos from 4Square
    self.pullFourSqPhotos = function(id, contentStr) {
        //Creating query Url using the id passed by the pullFoursqInfo Function
        var url = 'https://api.foursquare.com/v2/venues/' + id + '/photos?&client_id=KYMTQN4SEBBF2P112ZVGZ3ZN3MSE1HNGFFVYDVRLAVYBQOJP&client_secret=ELIA3I1ACIFBWYPTSX5KWEBOSV3MXLKUD0DUUWOZUZ0PFFLP&v=20160213&m=foursquare';
        $.ajax({
            url: url,
            success: function(data) {
                var ref = data.response.photos;
                contentStr += '<div class="row">';
                //Maximum nuumber of photos pulled to 3 so we dont overpopulate the information window
                for (var i = 3 - 1; i >= 0; i--) {
                    var photourl = '<div class= "box"><hr> <img src="' + ref.items[i].prefix + 'cap300' + ref.items[i].suffix + '"/></div>';
                    contentStr += photourl;
                }
                contentStr += '</div>';
                infoWindow.setContent(contentStr);
            }
        });
    }

    //This Function pulls photos from Flickr using the query(marker title) but due to the lack of consistent data on Flickr from my country I opted to exclusively use 4square
    self.pullFlickr = function(query, contentStr) {
        $.ajax({
            url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1b5ad63f3251fe5249199e1a3d291987&text=%22' + query + '%22&format=json&nojsoncallback=1',
            async: 'false',
            success: function(data) {
                if (data.photos.photo.length >= 3) {
                    for (var i = 2; i >= 0; i--) {
                        contentStr += '<div class = "imagebox"><img class="img-responsive" src= "https://farm' + data.photos.photo[i].farm + '.staticflickr.com/' + data.photos.photo[i].server + '/' + data.photos.photo[i].id + '_' + data.photos.photo[i].secret + '.jpg"></div>';
                    }
                } else {
                    contentStr += '<img class="img-responsive" BORDER="0" ALIGN="Left" src= "https://farm' + data.photos.photo[0].farm + '.staticflickr.com/' + data.photos.photo[0].server + '/' + data.photos.photo[0].id + '_' + data.photos.photo[0].secret + '.jpg">';
                }
                infoWindow.setContent(contentStr);
            }
        });
    }

    //This Function pull makes the calls off the AJAX functions, opens and closes the infoWindow it also contains a nice loader gif that keeps the user entertained while the data loads :P
    self.info = function() {
        if (this.infoBool == false) {
            this.infoBool = true;
            var title = this.title;
            var contentStr = "";
            infoWindow.setContent('<img src= "images/Loader.gif">');
            infoWindow.open(map, this);
            self.pullFourSqInfo(title, contentStr);
        } else {
            infoWindow.close();
            this.infoBool = false;
        }
    }

    //calling the markers down on a set timeout to make sure the browser has loaded and populated the markers variables(avoid google not found error)
    setTimeout(function() {
        self.sortMarkerList(allMarkers);
        self.locations(allMarkers);
        for (var i = allMarkers.length - 1; i >= 0; i--) {
            currentMarkers.push(allMarkers[i]);
        };
    }, 4000);
};

ko.applyBindings(new ViewModel());