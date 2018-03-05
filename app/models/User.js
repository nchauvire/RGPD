var MongoClient = require('mongodb').MongoClient,
    ObjectID    = require('mongodb').ObjectID,
    _           = require('underscore');

module.exports = class User {
    constructor(obj)
    {
        this._id        = null;
        this.firstname  = null;
        this.lastname   = null;
        this.email      = null;
        this.password   = null;
        this.newsletter = false;

        this.init(obj);
    }

    init(obj)
    {
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                this[attr] = obj[attr];
            }
        }
    }

    save(callback)
    {
        MongoClient.connect('mongodb://localhost', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let collection = client.db('rgpd').collection('users');

            console.log(this);
            if (! this._id) {
                collection.insert(this, {w : 1}, (err, result) => {
                    this.init(result.ops[0]);

                    if (_.isFunction(callback)) {
                        callback(this, err);
                    }
                });
            } else {
                collection.save(this, {w : 1}, (err, result) => {
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
        MongoClient.connect('mongodb://localhost/rgpd', (err, db) => {
            if (err) {
                return console.log(err);
            }

            var collection = client.db('rgpd').collection('users');

            collection.remove({ _id : this._id }, {w : 1}, function(err, result) {});
        });
    }

    validateEmail()
    {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.email).toLowerCase());
    }


    static login(email, password, callback)
    {
        MongoClient.connect('mongodb://localhost/rgpd', (err, db) => {

            if (err) {
                return console.log(err);
            }

            var users = client.db('rgpd').collection('users');

            users.findOne({email:email, password:password}, (err, item) => {
                var user = {}

                if (! err && item) {
                    user = new User(item);
                }

                callback(user, err);
            });

        });
    }

    static findById(id, callback)
    {
        MongoClient.connect('mongodb://localhost/rgpd', (err, db) => {
            if (err) {
                return console.log(err);
            }

            var collection = client.db('rgpd').collection('users'),
                obj_id = new ObjectID.createFromHexString(id);

            collection.findOne({_id:obj_id}, (err, item) => {
                var user = new User(item);

                callback(user);
            });
        });
    }
}

