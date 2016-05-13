var express = require('express');
var router = express.Router();
var controller = require('../controller/userController.js');
var location = require('mongoose').model('Location');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
	res.render('admin/index', {
		"title" : 'Pokemon locatie beheer'
	});
});

router.get('/locationlist', function(req, res){
	location.find({}).exec(function(e, docs){
		if(e) return res.status(500).json('error occured');

  		res.json(docs);
	})
});

router.post('/addlocation', function(req, res){
	console.log(req.body);
	location.collection.insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: '' } : { msg: err}
		);
	});
});

function isLoggedIn(req, res, next) {
	controller.checkToken(req,'supersecrethere',next, function(response){
		res.json(response);
	});
}

module.exports = router;

//module.exports = router;
