let express = require('express');
let router = express.Router();
let User = require('../app/models/User');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Guide Gastronimique'});
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
      if (! user.validateEmail()) {
          req.flash('error', "Veuillez entrer une adresse email valide");
          res.redirect('/subscribe');
      }

      user.save(function(savedUser, err) {
          if (! err) {
              req.flash('success', 'Vous vous êtes bien enregistré');
              res.redirect('/');
          } else {
              req.flash('error', 'Une erreur est survenue, veuillez contacter sur support');
              res.redirect('/subscribe');
          }
      });
  });

module.exports = router;
