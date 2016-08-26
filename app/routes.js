const mongoose = require('mongoose');
const User = require('../db/model.js');

module.exports = function (app) {

    app.get('/users', (req, res) => {

        const query = User.find({});
        query.exec(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

    app.post('/users', (req, res) => {
        const newuser = new User(req.body);

        newuser.save(function (err) {
            if (err)
                res.send(err);

            res.json(req.body);
        });
    });

    app.post('/query/', (req, res) => {

        // put all form data in corresponding variables
        const lat = req.body.latitude;
        const long = req.body.longitude;
        const distance = req.body.distance;
        const male = req.body.male;
        const female = req.body.female;
        const other = req.body.other;
        const minAge = req.body.minAge;
        const maxAge = req.body.maxAge;
        const favLang = req.body.favlang;
        const reqVerified = req.body.reqVerified;

        // Start a query on the User model
        let query = User.find({});

        // filter on distance
        if (distance) {

            // Use mongo geospatial query ability. (coordinates are set as [long, lat] )
            query = query.where('location').near({
                center: {
                    type: 'Point',
                    coordinates: [long, lat]
                },

                // Converting meters to km. Specifying spherical geometry because earth is still spherical....
                maxDistance: distance * 1000,
                spherical: true
            });
        }

        // filter the gender
        if (male || female || other) {
            query.or([{
                'gender': male
            }, {
                'gender': female
            }, {
                'gender': other
            }]);
        }

        // filter min age
        if (minAge) {
            query = query.where('age').gte(minAge);
        }

        // filter by max age
        if (maxAge) {
            query = query.where('age').lte(maxAge);
        }

        // filter language
        if (favLang) {
            query = query.where('favlang').equals(favLang);
        }

        // filter on html verified location
        if (reqVerified) {
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // execute query and return results
        query.exec((err, users) => {
            if (err)
                res.send(err);

            // If no errors, respond with a JSON of all users that meet the criteria
            res.json(users);
        });
    });
};
