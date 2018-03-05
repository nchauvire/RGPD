let express = require('express');
let router = express.Router();
let User = require('../app/models/User');

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
        res.redirect('/');
      } else {
        req.flash('error', 'Une erreur est survenue, veuillez contacter sur support');
        res.redirect('/subscribe');
      }
    });
  });

// ACCOUNT AND USER
router.get('/account', (req, res, next) => {
  const session = req.session;
  console.log("sesssion",session);
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
        console.log("req.body",req.body);
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

module.exports = router;
