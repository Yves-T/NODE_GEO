GService.$inject = ['$rootScope', '$http'];

function GService($rootScope, $http) {

    var googleMapService = {};
    var locations = [];

    var selectedLat = 51.210321;
    var selectedLong = 4.388872;

    googleMapService.clickLat = 0;
    googleMapService.clickLong = 0;

    let lastMarker;
    let currentSelectedMarker;
    let icon;

    googleMapService.refresh = (latitude, longitude, filteredResults) => {

        // Clears the holding array of locations
        locations = [];

        // Set the selected lat and long equal to the ones provided on the refresh() call
        selectedLat = latitude;
        selectedLong = longitude;

        // If filtered results are provided in the refresh() call...
        if (filteredResults) {

            // Then convert the filtered results into map points.
            locations = convertToMapPoints(filteredResults);

            // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
            initialize(latitude, longitude, true);
        }

        // If no filter is provided in the refresh() call...
        else {

            // Perform an AJAX call to get all of the records in the db.
            $http.get('/users').success(function (response) {

                // Then convert the results into map points
                locations = convertToMapPoints(response);

                // Then initialize the map -- noting that no filter was used.
                initialize(latitude, longitude, false);
            }).error(function () {
            });
        }
    };

    // Private Inner Functions
    // --------------------------------------------------------------
    // Convert a JSON of users into map points
    var convertToMapPoints = response => {

        // Clear the locations holder
        var locations = [];

        // Loop through all of the JSON entries provided in the response
        for (var i = 0; i < response.length; i++) {
            var user = response[i];

            // Create popup windows for each record
            var contentString =
                '<p><b>Username</b>: ' + user.username +
                '<br><b>Age</b>: ' + user.age +
                '<br><b>Gender</b>: ' + user.gender +
                '<br><b>Favorite Language</b>: ' + user.favlang +
                '</p>';

            // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
            locations.push({
                latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                message: new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 320
                }),
                username: user.username,
                gender: user.gender,
                age: user.age,
                favlang: user.favlang
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

    // Initializes the map
    var initialize = (latitude, longitude, filter) => {

        // Uses the selected lat, long as starting point
        var myLatLng = {
            lat: selectedLat,
            lng: selectedLong
        };

        // If map has not been created already...
        if (!map) {

            // Create a new map and place in the index.html page
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: myLatLng
            });
        }

        if (filter) {
            icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        } else {
            icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        }

        // Loop through each location in the array and place a marker
        locations.forEach((n, i) => {
            var marker = new google.maps.Marker({
                position: n.latlon,
                map: map,
                title: "Big Map",
                icon
            });

            // For each marker created, add a listener that checks for clicks
            marker.addListener('click', e => {

                // When clicked, open the selected marker's message
                currentSelectedMarker = n;
                n.message.open(map, marker);
            });
        });

        // Set initial location as a bouncing red marker
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        lastMarker = new google.maps.Marker({
            position: initialLocation,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });


        map.panTo(new google.maps.LatLng(latitude, longitude));

        // Clicking on the Map moves the bouncing red marker
        google.maps.event.addListener(map, 'click', e => {
            var marker = new google.maps.Marker({
                position: e.latLng,
                animation: google.maps.Animation.BOUNCE,
                map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // When a new spot is selected, delete the old red bouncing marker
            if (lastMarker) {
                lastMarker.setMap(null);
            }

            // Create a new red bouncing marker and move to it
            lastMarker = marker;
            map.panTo(marker.position);

            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            $rootScope.$broadcast("clicked");
        });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
}

module.exports = GService;