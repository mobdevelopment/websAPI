var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('instruments/index', { title: 'Instrumenten interpertatie test' });
});

module.exports = router;