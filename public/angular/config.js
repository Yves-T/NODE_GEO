routing.$inject = ['$routeProvider'];

export default function routing($routeProvider) {
    $routeProvider.when('/join', {
        controller: 'addCtrl',
        templateUrl: 'partials/addForm.html',
    }).when('/find', {
        controller: 'queryCtrl',
        templateUrl: 'partials/queryForm.html',
    }).otherwise({redirectTo: '/join'});
}
