var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/loginFailure', function(req, res, next) {
	res.status(401);
	res.send('Failed to authenticate');
});

router.get('/loginSuccess', function(req, res, next) {
	res.redirect('/admin');
})

module.exports = router;
