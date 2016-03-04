// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

$(function() {
    'use strict';
    var initMarkers;
    var ViewModel = function() {

        //************ VARIABLES ************

        var self = this;

        //Used to store current markers on the occurrence of a filter
        var currentMarkers = [];

        self.locations = ko.observableArray([{
            title: 'Loading...'
        }]);
        self.searchVal = ko.observable();
        self.ItalyOn = ko.observable({
            bool: true,
            type: 'Italian'
        });
        self.PizzaOn = ko.observable({
            bool: true,
            type: 'Africano'
        });
        self.MediOn = ko.observable({
            bool: true,
            type: 'Mediteranian'
        });
        self.AfricaOn = ko.observable({
            bool: true,
            type: 'Pizza'
        });
        self.SushiOn = ko.observable({
            bool: true,
            type: 'Japonês'
        });


        //************ CLEANING ************

        //This functions sorts marker arrays (keeps the program cleaner in a way :P )
        self.sortMarkerList = function(array) {
            array.sort(function(a, b) {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });
        };

        //This is a Function deletes search query
        self.clearQuery = function() {
            self.filter('');
            self.searchVal('');
        };

        //Cleans the map of all markers
        self.clearMarkers = function() {
            currentMarkers = [];
            if (allMarkers.length > 0) {
                for (var i = allMarkers.length - 1; i >= 0; i--) {
                    allMarkers[i].setVisible(false);
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
                if (value !== undefined) {
                    self.clearMarkers();
                    currentMarkers = [];

                    /*Cycles through the array of all markers to find if the titles of the markers contain the search term
                    and adds the markers according to the result to the current markers that will be displayed on the map*/
                    for (var i = allMarkers.length - 1; i >= 0; i--) {
                        if (allMarkers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                            allMarkers[i].setVisible(true);
                            currentMarkers.push(allMarkers[i]);
                        }
                    }
                    self.sortMarkerList(currentMarkers);
                    self.locations(currentMarkers);
                } else {
                    self.clearMarkers();
                    for (var x = allMarkers.length - 1; x >= 0;x--) {
                        allMarkers[x].setVisible(true);
                        currentMarkers.push(allMarkers[x]);
                    }
                    self.locations(currentMarkers);
                }
            }
        });

        //This is a Function is used to filter restaurants using their type
        self.toggleType = function(data, event) {
            infoWindow.close();

            //Checking if the button is toggled or not
            if (event.target.value.bool === true) {

                //Cycling through all markers to exclude the restaurants with the type selected
                for (var i = allMarkers.length - 1; i >= 0; i--) {
                    if (allMarkers[i].type == event.target.value.type) {
                        allMarkers[i].setVisible(false);

                        //Styling for awesome user experience
                        $(event.target).parent().addClass('filter-off');
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
                $(event.target).parent().removeClass('filter-off');

                //Cycling through all markers to include the restaurants with the type selected
                for (var x = allMarkers.length - 1; x >= 0; x--) {
                    if (allMarkers[x].type == event.target.value.type) {
                        allMarkers[x].setVisible(true);
                        currentMarkers.push(allMarkers[x]);
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
        toggleBounce = function(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1400);
        };

        //************ AJAX Requests ************

        //This Function pulls venue data from 4Square
        self.pullFourSqInfo = function(query, contentStr) {
            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/search?near=luanda&query=' + query + '&client_id=KYMTQN4SEBBF2P112ZVGZ3ZN3MSE1HNGFFVYDVRLAVYBQOJP&client_secret=ELIA3I1ACIFBWYPTSX5KWEBOSV3MXLKUD0DUUWOZUZ0PFFLP&v=20160213&m=foursquare',

                success: function(data) {
                    /*In case of a successful connection the Function sotres the venue Id and builds the content string used to create the information window data
                    the venue Id is then used to call the Photo request Function*/
                    var ref = data.response.venues[0];

                    contentStr += '<div class="scroll-fix info-window">' +
                        '<h2>' + ref.name + '</h2>' +
                        '<p><h4>' + ref.categories[0].name + '</h4></p>';
                    for (var i = ref.location.formattedAddress.length - 1; i >= 0; i--) {
                        contentStr += '<p>' + ref.location.formattedAddress[i] + '</p>';
                    }

                    infoWindow.setContent(contentStr);
                    self.pullFourSqPhotos(ref.id, contentStr);
                },
                error: function(jqhxr, status, error) {
                    contentStr += '<div class="scroll-fix info-window"><h3>Error Loading the request</h3><br><h4>Please Try again</h4></div>';
                    infoWindow.setContent(contentStr);
                }
            });
        };

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
                        var photourl = '<div class= "box"><hr> <img class="img-responsive imginfo" src="' + ref.items[i].prefix + 'cap300' + ref.items[i].suffix + '"/></div>';
                        contentStr += photourl;
                    }
                    contentStr += '</div>';
                    infoWindow.setContent(contentStr);
                },
                error: function(jqhxr, status, error) {
                    contentStr += '<h3>Error Loading the pictures</h3><br><h4>Please Try again</h4></div>';
                     infoWindow.setContent(contentStr);
                }
            });
        };

        //This Function pull makes the calls off the AJAX functions, opens and closes the infoWindow it also contains a nice loader gif that keeps the user entertained while the data loads :P
        self.runInfo = function() {
            info(this);
            if(infoMarker == this) {
                toggleBounce(this);
            }
        };
      
        info = function(marker) {
           
            if ( infoMarker != marker) {
                marker.infoBool = true;
                var title = marker.title;
                var contentStr = '';
                infoWindow.setContent('<img src= "images/Loader.gif">');
                infoWindow.open(map, marker);
                self.pullFourSqInfo(title, contentStr);
                infoMarker = marker;
            } else {
                infoWindow.close();
                infoMarker = '';
            }
             
        };
        //************ DISPLAY ************
        self.toggleDisplayBool = false;
        self.toggleDisplay = function () {
            if (self.toggleDisplayBool === false){
                $('#listing').css('display', 'block');
                $('.search-bar').css('display', 'block');
                $('#menu-toggle').html('Hide Controls');
                self.toggleDisplayBool = true;
            }
            else
            {   
                $('#listing').css('display', 'none');
                $('.search-bar').css('display', 'none');
                $('#menu-toggle').html('Show Controls');
                self.toggleDisplayBool = false;
            }
        };
        //************ RUNNING ************
        //calling the markers down on a set timeout to make sure the browser has loaded and populated the markers variables(avoid google not found error)
        
        initMarkers = function() { 
                self.sortMarkerList(allMarkers);
                self.locations(allMarkers);
                console.log(self.locations());
                console.log(allMarkers);
                for (var i = allMarkers.length - 1; i >= 0; i--) {
                currentMarkers.push(allMarkers[i]);
            }
        }
    }

    //if the script loads successfully this function runs initiating the app functionalities and binding the ViewModel elements
    googleSuccess = function() {
            if (typeof google !== 'undefined') {
                initMap();
                MapIt();
                //becase I add the markers with a timeout, the list has to be updated later after all markers have been loaded into the map
                setTimeout(function() {
                    initMarkers();
                }, 2000)
                ko.applyBindings(new ViewModel());
            }
        }
});