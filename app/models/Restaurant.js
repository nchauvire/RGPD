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


  static findById(id, callback) {
    MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
      if (err) {
        return console.log(err);
      }

      let collection = client.db('rgpd').collection('restaurants');
      let obj_id = new ObjectID.createFromHexString(id);

      collection.findOne({_id: obj_id}, (err, item) => {
        let restaurant = new Restaurant(item);
        callback(restaurant);
      });
    });
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
                    restaurant._id = element._id;
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

