var MongoClient = require('mongodb').MongoClient,
    ObjectID    = require('mongodb').ObjectID,
    _           = require('underscore');

class User {
    constructor(obj)
    {
        this._id       = null;
        this.name      = null;
        this.firstname = null;
        this.email     = null;
        this.password  = null;

        for (var fld in obj) {
            if (obj.hasOwnProperty(fld)) {
                this[fld] = obj[fld];
            }
        }
    }

    save()
    {
        MongoClient.connect('mongodb://localhost/rgpd', function(err, db) {

            if (err) {
                return console.log(err);
            }

            var collection = db.collection('users');

            if (! this._id) {
                collection.insert(this, {w : 1}, function(err, result) {
                    this.init(result.ops[0]);

                    if (_.isFunction(callback)) {
                        callback(this, err);
                    }
                });
            } else {
                collection.save(this, {w : 1}, function(err, result) {
                    this.init(result.ops);

                    if (_.isFunction(callback)) {
                        callback(this, err);
                    }
                });
            }
        });
    }

    remove()
    {
        MongoClient.connect('mongodb://localhost/rgpd', function(err, db) {
            if (err) {
                return console.log(err);
            }

            var collection = db.collection('users');

            collection.remove({ _id : this._id }, {w : 1}, function(err, result) {});
        });
    }

    static login(email, password, callback)
    {
        MongoClient.connect('mongodb://localhost/rgpd', function(err, db) {

            if (err) {
                return console.log(err);
            }

            var users = db.collection('users');

            users.findOne({email:email, password:password}, function(err, item) {
                var user = {}

                if (! err && item) {

                    user = new User();
                    user.init(item);
                }

                callback(user, err);
            });

        });
    }

    static findById(id, callback)
    {
        MongoClient.connect('mongodb://localhost/rgpd', function(err, db) {
            if (err) {
                return console.log(err);
            }

            var collection = db.collection('users'),
                obj_id = new ObjectID.createFromHexString(id);

            collection.findOne({_id:obj_id}, function(err, item) {
                var user = new User();
                user.init(item);

                callback(user);
            });
        });
    }
}

module.exports = User;
