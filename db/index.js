const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/geoLocation',{
  promiseLibrary: Promise
});
