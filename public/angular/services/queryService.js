QueryService.$inject = ['$http'];

function QueryService($http) {
    const queryService = {};

    queryService.doQuery = queryBody => $http.post('/query', queryBody);

    return queryService;
}

module.exports = QueryService;
