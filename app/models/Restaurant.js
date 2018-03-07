let config      = require('../../config.json'),
    crypto      = require('crypto'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID    = require('mongodb').ObjectID,
    _           = require('underscore');

module.exports = class Restaurant {
    constructor() {
       this.name = null;
       this.borough = null;
    }



    static searchByName(name, callback) {
        MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let collection = client.db('rgpd').collection('restaurants');

            const result = [];

            collection.find({"name": new RegExp(name, 'i')}).toArray(function(err,data) {

                data.forEach(function(element) {
                    let restaurant = new Restaurant();
                    restaurant.name = element.name;
                    restaurant.borough = element.borough;
                    restaurant.cuisine = element.cuisine;
                    result.push(restaurant);
                });

                callback(result);
            });

        });
    }
}

