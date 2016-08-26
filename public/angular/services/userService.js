UserService.$inject = ['$http'];

function UserService($http) {
    const userService = {};

    userService.createUser = userData => $http.post('/users', userData);

    return userService;
}

module.exports = UserService;
