var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('highscores/index', { title: 'highscores' });
});

router.get('/instrumenttest', function(req, res) {
	var db = req.db;
	var collection = db.get('instrumentscore');
	collection.find({}, {}, function(e, docs){
		res.json(docs);
	});
});

router.get('/listeningtest', function(req, res) {
	var db = req.db;
	var collection = db.get('listeningscore');
	collection.find({}, {}, function(e, docs){
		res.json(docs);
	});
});

module.exports = router;