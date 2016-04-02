var express = require('express');
var _ = require('underscore');
var router = express.Router();
var handleError;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Admin' });
});

module.exports = function (mongoose, errCallback){
	handleError = errCallback;
	return router;
};

//module.exports = router;
