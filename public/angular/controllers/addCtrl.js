AddCtrl.$inject = ['$scope', '$rootScope', 'geolocation', 'gservice', 'userService'];

function AddCtrl($scope, $rootScope, geolocation, gservice, userService) {

    $scope.formData = {};

    $scope.showForm = true;
    $scope.showMessage = false;

    $rootScope.page = "join";

    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    $scope.formData.gender = "Female";

    function getLocation() {
        geolocation.getLocation().then(({coords}) => {

            coords = {
                lat: coords.latitude,
                long: coords.longitude
            };

            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

            $scope.formData.htmlverified = "Jawel! (Bedankt voor ons de echte data te geven!)";

            gservice.refresh(parseFloat($scope.formData.latitude), parseFloat($scope.formData.longitude));

        });
    }

    getLocation();

    $scope.refreshLocation = () => {
        getLocation();
    };

    $rootScope.$on("clicked", () => {

        $scope.$apply(() => {
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nee (Bedankt om mijn map te spammen...)";
        });
    });

    $scope.createUser = () => {

        const userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        userService.createUser(userData)
            .success(() => {

                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";

                $scope.showForm = false;
                $scope.showMessage = true;

                gservice.refresh(parseFloat($scope.formData.latitude), parseFloat($scope.formData.longitude));

            })
            .error(data => {
                console.log('Error: ' + data);
            });
    };
}

module.exports = AddCtrl;
