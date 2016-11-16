var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var passport = require('passport');
var controller = require('../controller/userController.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('users/index');
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

router.get('/profileData',isLoggedIn, function(req, res, next) {
	console.log(req.user);
	res.render('users/profile', { user: req.user });
});

router.get('/login', function(req, res, next) {
	res.render('users/login');
});

router.get('/signup', function(req, res, next) {
	res.render('users/signup');
});

router.post('/signup', passport.authenticate('local-signup'), function (req, res) {
	console.log(res);
		res.status(201).json({'message':'account created succesful'});
	});

router.post('/login', passport.authenticate('local-login'), function (req, res) {
    controller.getToken(req.user.local, 'supersecrethere', function(response) {
    	req.session.token = response.token;
    	if (response.success)
    	{
    		if (req.user.Admin)
				res.redirect('/admin');
    		else
    			res.redirect('/');
    	}
        res.render('users/login');
    });
});
// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route got the facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/profileData',
	failureRedirect: '/'
}));

// =====================================
// TWITTER ROUTES ======================
// =====================================
// route for twitter authentication and login
router.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect : '/profileData',
	failureRedirect : '/'
}));


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',	passport.authenticate('google', {
	successRedirect : '/profileData',
	failureRedirect : '/'
}));


router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
})


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
router.get('/connect/local', function(req, res) {
    res.render('connect-local.jade', { message: req.flash('loginMessage') });
});

router.post('/connect/local', passport.authenticate('local-signup', {
	successRedirect : '/profileData', // redirect to the secure profile section
	failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
}));

// facebook -------------------------------

    // send to facebook to do the authentication
router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

// handle the callback after facebook has authorized the user
router.get('/connect/facebook/callback', passport.authorize('facebook', {
	successRedirect : '/profileData',
	failureRedirect : '/'
}));

// twitter --------------------------------

// send to twitter to do the authentication
router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

// handle the callback after twitter has authorized the user
router.get('/connect/twitter/callback',	passport.authorize('twitter', {
	successRedirect : '/profile',
	failureRedirect : '/'
}));

// google ---------------------------------

// send to google to do the authentication
router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

// the callback after google has authorized the user
router.get('/connect/google/callback',	passport.authorize('google', {
	successRedirect : '/profileData',
	failureRedirect : '/'
}));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
router.get('/unlink/local', function(req, res) {
	var user            = req.user;
	user.local.email    = undefined;
	user.local.password = undefined;
	user.save(function(err) {
		res.redirect('/profileData');
	});
});

// facebook -------------------------------
router.get('/unlink/facebook', function(req, res) {
	var user            = req.user;
	user.facebook.token = undefined;
	user.save(function(err) {
		res.redirect('/profileData');
	});
});

// twitter --------------------------------
router.get('/unlink/twitter', function(req, res) {
	var user           = req.user;
	user.twitter.token = undefined;
	user.save(function(err) {
		res.redirect('/profileData');
	});
});

// google ---------------------------------
router.get('/unlink/google', function(req, res) {
	var user          = req.user;
	user.google.token = undefined;
	user.save(function(err) {
		res.redirect('/profileData');
	});
});

function isLoggedIn(req, res, next) {
	controller.checkToken(req,'supersecrethere',next, function(response){
		res.json(response);
	});
}

module.exports = router;
