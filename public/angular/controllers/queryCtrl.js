QueryCtrl.$inject = ['$scope', '$rootScope', 'geolocation', 'gservice', 'queryService'];

function QueryCtrl($scope, $rootScope, geolocation, gservice, queryService) {
    $rootScope.page = "find";
    $scope.formData = {};
    let queryBody = {};
    let coords;

    geolocation.getLocation().then(function (data) {
        coords = {
            lat: data.coords.latitude,
            long: data.coords.longitude
        };

        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });

    $rootScope.$on("clicked", function () {

        $scope.$apply(function () {
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    $scope.queryUsers = function () {

        queryBody = {
            longitude: parseFloat($scope.formData.longitude),
            latitude: parseFloat($scope.formData.latitude),
            distance: parseFloat($scope.formData.distance),
            male: $scope.formData.male,
            female: $scope.formData.female,
            other: $scope.formData.other,
            minAge: $scope.formData.minage,
            maxAge: $scope.formData.maxage,
            favlang: $scope.formData.favlang,
            reqVerified: $scope.formData.verified
        };

        queryService.doQuery(queryBody)

            .success(queryResults => {

                console.log("QueryBody:");
                console.log(queryBody);
                console.log("QueryResults:");
                console.log(queryResults);

                $scope.queryCount = queryResults.length;
                gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);
            })
            .error(queryResults => {
                console.log('Error ' + queryResults);
            });
    };

}

module.exports = QueryCtrl;
