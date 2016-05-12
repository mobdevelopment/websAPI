var express = require('express');
var router = express.Router();
var controller = require('../controller/userController.js');
var location = require('mongoose').model('Location');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
	location.find({}).exec(function(e, docs){
		if(e) return res.status(500).json('error occured');

  		res.render('admin/index', {
			"locations" : docs
  		});
	})
});

function isLoggedIn(req, res, next) {
	controller.checkToken(req,'supersecrethere',next, function(response){
		res.json(response);
	});
}

module.exports = router;

//module.exports = router;
