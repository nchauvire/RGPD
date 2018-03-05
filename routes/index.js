let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Guide Gastronimique'});
});
router.get('/subscribe', (req, res, next) => {
  res.render('subscribe', {title: 'Inscription'});
})

  .post('/create', (req, res, next) => {
    console.log(req.body.lastname);
  });

module.exports = router;
