var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var passport = require('passport');
var controller = require('../controller/userController.js');

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

//isLoggedIn midleware checkt of user ingelogd is
router.get('/profile',isLoggedIn, function(req, res, next) {
	res.json(req.user);
});


router.get('/login', function(req, res, next) {
	res.render('users/login');
});

router.get('/signup', function(req, res, next) {
	res.render('users/signup');
});

router.post('/signup', passport.authenticate('local-signup'), function (req, res) {
		res.status(201).json({'message':'account created succesful'});
	});

router.post('/login', passport.authenticate('local-login'), function(req, res) {
    controller.getToken(req.user, 'supersecrethere', function(response) {
    	req.session.token = response.token;
        res.json(response);
    });
});

function isLoggedIn(req, res, next) {
	controller.checkToken(req,'supersecrethere',next, function(response){
		res.json(response);
	});
}

module.exports = router;
