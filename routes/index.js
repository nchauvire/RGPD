
let express = require('express'),
    router  = express.Router(),
    config  = require('../config.json'),
    crypto  = require('crypto'),
    User = require('../app/models/User'),
    Restaurant = require('../app/models/Restaurant'),
    url = require('url');

/* GET home page. */
router.get('/', (req, res, next) => {
  let session = req.session;
  const user = session.user;

  res.render('index', {title: 'Guide Gastronimique', user: user});
});
router.get('/subscribe', (req, res, next) => {
  res.render('subscribe', {title: 'Inscription'});
})
  .post('/create', (req, res, next) => {
    const user = new User;

    Object.assign(user, req.body);

    if (user.password !== req.body.confirm) {
      req.flash('error', 'vos mots de passes ne correspondent pas');
      res.redirect('/subscribe');
    }
    if (!user.validateEmail()) {
      req.flash('error', "Veuillez entrer une adresse email valide");
      res.redirect('/subscribe');
    }

    user.save(function (savedUser, err) {
      if (!err) {
        req.flash('success', 'Vous vous êtes bien enregistré');
        let session = req.session;
        session.auth = true;
        session.user = user;
        session.save();
        res.redirect('/');
      } else {
        req.flash('error', 'Une erreur est survenue, veuillez contacter sur support');
        res.redirect('/subscribe');
      }
    });
  });

router.get('/resetPassword', (req, res, next) => {
    res.render('resetPassword', {title: 'Mot de passe oublier'});
});
router.post('/resetPassword', (req, res, next) => {
    let email = req.body.email;

    User.findByEmail(email, (user, err) => {
        if (user !== undefined && user !== null) {
            // Crypt email to securlly pass her in url
            let cipher = crypto.createCipher('aes-256-cbc', config.password_secret);

            email  = cipher.update(email, 'utf8', 'hex');
            email += cipher.final('hex');

            res.redirect('/newPassword?key='+encodeURIComponent(email));
        }
    });
});

router.get('/newPassword', (req, res, next) => {
    let cryptedEmail = req.query.key,
        decipher     = crypto.createDecipher('aes-256-cbc', config.password_secret),
        email        = decipher.update(cryptedEmail, 'hex', 'utf8');

    email += decipher.final('utf8');

    res.render('newPassword', {title: 'Nouveau mot de passe', email: email});
});
router.post('/newPassword', (req, res, next) => {
    let email = req.body.email;

    User.findByEmail(email, (user, err) => {
        if (user !== undefined && user !== null) {
            user.password = req.body.password;
            user.confirm  = req.body.confirm;
            user.save();

            res.redirect('/singin');
        }
    });
});

// ACCOUNT AND USER
router.get('/account', (req, res, next) => {
  const session = req.session;

  if( session.user === undefined ){
    res.redirect('/');
  }

  User.findById(session.user._id, function (user) {
    if (user !== undefined && user !== null) {
      res.render('account', {
        title: 'mon compte',
        user: user
      });
    }
  })


})
  .get('/editUser', (req, res, next) => {
    let session = req.session;
    if (session.user === undefined) {
      res.redirect('/');
    }
    User.findById(session.user._id, function (user) {

      if (user !== undefined && user !== null) {
        res.render('editUser', {
          title: 'mon compte',
          user: user
        });
      }
    })
  })
  .post('/editUser', (req, res, next) => {
    let session = req.session;
    if (session.user === undefined) {
      res.redirect('/');
    }


    User.findById(session.user._id, function (user) {
      if (user !== undefined && user !== null) {

        Object.assign(user, req.body);
        if(req.body.newsletter){
          user.newsletter = true;
        }else{
          user.newsletter = false;
        }
        if (!user.validateEmail()) {
          req.flash('error', "Veuillez entrer une adresse email valide");
          res.redirect('/editUser');
        }else{
          user.save((user)=>{
            session.user = user;
            session.save();
            res.redirect('/account')
          })
        }

      }
    });





  });

router.get('/singin', (req, res, next) => {
  res.render('singin', {title: 'Connexion'})
})
  .post('/singin', (req, res, next) => {
    let email = req.body.email,
      password = req.body.password;

    User.login(email, password, function (user, err) {

      if (!err) {
        if (user instanceof User) {
          let session = req.session;
          session.auth = true;
          session.user = user;
          session.save();

          req.flash('success', 'Bienvenue, vous êtes connecté');
          res.redirect('/');
        } else {
          req.flash('error', 'Credentials invalid');
          res.redirect('/singin', 400, {title: 'Se connecter'});
        }
      } else {
        req.flash('error', 'Impossible de contact la BDD');
        res.redirect('/singin', 500, {title: 'Se connecter'});
      }
    });
  });


router.get('/drop', (req, res, next) => {
    res.render('drop', {title: 'Déposer un avis'})
})

router.get('/search', (req, res, next) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const name = query.term;

    Restaurant.searchByName(name, function(restaurants) {

        if (restaurants) {
             res.send(restaurants);
            return;
        }
        res.send();
    });




});


module.exports = router;
