var express = require('express');
var router = express.Router();
var controller = require('../controller/userController.js');
var location = require('mongoose').model('Location');
var user = require('mongoose').model('User');
var auth = require('../controller/auth');

/* GET home page. */
router.get('/', isLoggedIn, auth.isAllowed('Admin'), function(req, res, next) {
	res.render('admin/index', {
		"title" : 'Pokemon locatie beheer'
	});
});

router.get('/users', isLoggedIn, auth.isAllowed('Admin'), function(req, res, next) {
	res.render('admin/users', {
		"title" : 'Gebruikersbeheer',
	});
});

router.get('/userlist', auth.isAllowed('Admin'), function(req, res){
	user.find({}).exec(function(e, docs){
		if(e) return res.status(500).json('error occured');

		res.json(docs);
	})
});

router.post('/user', auth.isAllowed('Admin'), function(req, res){
	console.log('\033[2J'); // Clear the console
	console.log(req.body);

	var newuser = new user();

	newuser.local.username = req.body.username;
	newuser.local.password = newuser.generateHash(req.body.password);
	newuser.Admin = (req.body.Admin == 'on' ? true : false);

	newuser.save(function(err, doc){
		res.status(200).send((err === null) ? { msg: '' } : { msg: err});
	});
});

router.delete('/user/:id', auth.isAllowed('Admin'), function(req, res){
	var userToDelete = req.params.id;
	user.remove({ '_id' : userToDelete }).exec(function(err){
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err});
	});
});

router.get('/locationlist', auth.isAllowed('Admin'), function(req, res){
	location.find({}).exec(function(e, docs){
		if(e) return res.status(500).json('error occured');

  		res.json(docs);
	})
});

router.post('/addlocation', auth.isAllowed('Admin'), function(req, res){
	console.log(req.body);

	var newlocation = new location(req.body);

	newlocation.save(function(err, doc){
		res.status(200).send((err === null) ? { msg: '' } : { msg: err});
	});
});

router.delete('/deletelocation/:id', auth.isAllowed('Admin'), function(req, res){
	var locationToDelete = req.params.id;
	location.remove({ 'pid' : locationToDelete}).exec(function(err){
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
	});
});

function isLoggedIn(req, res, next) {
	controller.checkToken(req,'supersecrethere',next, function(response){
		res.json(response);
	});
}

module.exports = router;
