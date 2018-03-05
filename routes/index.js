let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Express' });
});
router.get('/subscribe',(req, res, next) => {
    res.render('subscribe', { title: 'Inscription' });
});

router.post('/create',(req, res, next) => {
    console.log(res);
});

module.exports = router;
