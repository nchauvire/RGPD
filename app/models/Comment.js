let config = require('../../config.json'),
  MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID,
  _ = require('underscore'),
  User = require('./User'),
  moment = require('moment');
  Restaurant = require('./Restaurant');

module.exports = class Comment {
  constructor(obj) {
    this._id = null;
    this.userId = null;
    this.restaurantId = null;
    this.date = null;
    this.rate = null;
    this.message = null;

    this.init(obj);
  }

  init(obj) {
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        this[attr] = obj[attr];
      }
    }
  }

  save(callback) {

    MongoClient.connect('mongodb://localhost', (err, client) => {
      if (err) {
        return console.log(err);
      }

      if (_.isNull(this.date)) {
        this.date = new Date();
      }

      let collection = client.db('rgpd').collection('comments');

      if (!this._id) {

        this.restaurantId = new ObjectID(this.restaurantId);
        this.userId = new ObjectID(this.userId);
        collection.insert(this, {w: 1}, (err, result) => {
          this.init(result.ops[0]);
          if (_.isFunction(callback)) {
            callback(this, err);
          }
        });
      } else {
        collection.save(this, {w: 1}, (err, result) => {
          this.init(result.ops);

          if (_.isFunction(callback)) {
            callback(this, err);
          }
        });
      }
    });
  }

  remove() {
    MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
      if (err) {
        return console.log(err);
      }

      let collection = client.db('rgpd').collection('comments');

      collection.remove({_id: this._id}, {w: 1}, (err, result) => {
      });
    });
  }

  static findById(id, callback) {
    MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
      if (err) {
        return console.log(err);
      }

      let collection = client.db('rgpd').collection('comments')
      let obj_id = new ObjectID.createFromHexString(id);

      collection.findOne({_id: obj_id}, (err, item) => {
        let comment = new Comment(item);

        callback(comment);
      });
    });
  }

  static findAll(params, callback) {
    MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
        if (err) {
          return console.log(err);
        }

        let collection = client.db('rgpd').collection('comments')
          .aggregate([
            {
              $lookup: {
                from: "restaurants",
                localField: "restaurantId",
                foreignField: "_id",
                as: "restaurant"
              },
            }, {$unwind: "$restaurant"},
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
              },
            },{   $unwind:"$user" }
          ]);

        const today =  moment();
        collection.toArray((error, comments) => {
          comments.map((comment)=>{
            let date = moment(comment.date);
            let ecart = moment.duration(today.diff(date));
            if(ecart.asHours() < 24){
              comment.since = 'aujourd\'hui';
            }else{
              comment.since = 'il y a '+ ecart.asDays()+' jours';
            }

            comment.user = new User(comment.user);
            comment.user.username = comment.user.getUsername();
          });
          callback(comments)
        });
        /*.toArray((err, item) => {
        let comments = [];
  /*
        item.map((comment) => {
          Restaurant.findById(comment.restaurantId,(resto)=>{
            comment.restaurant = resto
          });
          User.findById(comment.userId,(usr)=>{
            comment.user = usr;
          });
          comments.push(comment);
        });*/
        // callback(comments);
        // });
      }
    )
    ;
  }
}

