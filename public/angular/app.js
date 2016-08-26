import config from './config';
angular.module('meanMapApp', [
    'geolocation',
    'ngRoute'
])
    .config(config);
require('./controllers');
require('./services');
