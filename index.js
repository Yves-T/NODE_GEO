const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Promise = require('bluebird');
const app = express();
require('./db');

// Logging and Parsing
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(morgan('dev'));
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text()); // allows bodyParser to look at raw text
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

require('./app/routes.js')(app);

app.listen(port);
console.log('App listening on port ' + port);
