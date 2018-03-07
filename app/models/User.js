let config      = require('../../config.json'),
    crypto      = require('crypto'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID    = require('mongodb').ObjectID,
    _           = require('underscore');

module.exports = class User {
    constructor(obj) {
        this._id = null;
        this.firstname = null;
        this.lastname = null;
        this.email = null;
        this.password = null;
        this.newsletter = false;

        this.init(obj);
    }

    init(obj) {
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                this[attr] = obj[attr];
            }
        }
    }

    save(callback)
    {
        if (! _.isNull(this.confirm)) {
            if (this.password == this.confirm) {
            this.password = crypto.createHmac('sha256', config.password_secret)
                                .update(this.password)
                                .digest('hex');
            }

            delete this.confirm;
        }

        if (! _.isNull(this.confirm)) {
        }

        MongoClient.connect('mongodb://localhost', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let collection = client.db('rgpd').collection('users');

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

    remove() {
        MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let collection = client.db('rgpd').collection('users');

            collection.remove({_id: this._id}, {w: 1}, (err, result) => {});
        });
    }

    validateEmail() {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.email).toLowerCase());
    }

    static login(email, password, callback)
    {
        password = crypto.createHmac('sha256', config.password_secret)
                    .update(password)
                    .digest('hex');

        MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let users = client.db('rgpd').collection('users');

            users.findOne({email: email, password: password}, (err, item) => {
                let user = {}

                if (!err && item) {
                    user = new User(item);
                }

                callback(user, err);
            });

        });
    }

    static findById(id, callback) {
        MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let collection = client.db('rgpd').collection('users')
            let obj_id = new ObjectID.createFromHexString(id);

            collection.findOne({_id: obj_id}, (err, item) => {
                let user = new User(item);

                callback(user);
            });
        });
    }

    static findByEmail(email, callback) {
        MongoClient.connect('mongodb://localhost/rgpd', (err, client) => {
            if (err) {
                return console.log(err);
            }

            let collection = client.db('rgpd').collection('users')

            collection.findOne({email: email}, (err, item) => {
                console.log(item);
                let user = new User(item);

                callback(user);
            });
        });
    }

    getUsername() {
        return this.firstname +' '+ this.lastname.charAt(0).toUpperCase()
    }
}

