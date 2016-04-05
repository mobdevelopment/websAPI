var express = require('express');
var router = express.Router();
var controller = require('../controller/userController.js');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Admin' });
});

function isLoggedIn(req, res, next) {
	controller.checkToken(req,'supersecrethere',next, function(response){
		res.json(response);
	});
}

module.exports = router;

//module.exports = router;
