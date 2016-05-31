var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');
var Type = require('mongoose').model('Type');

function getType(req, res, callback) {
	var startDate = new Date();
	var options = {
		host: 'pokeapi.co',
		port: 80,
		path: '/api/v2/type/',
		method: 'GET'
	};
	if (req.params.id){
		options.path += req.params.id.toString() + '/'
	}
	console.log(options);

	http.get(options, function(response) {
		var d = '';

		response.on('data', function (chunk) {
					// console.log("Response:: "+chunk);
			d += chunk;
		});

		response.on('end', function () {

			var object = JSON.parse(d);
			// console.log("OBJECT:: "+object.results);
			if (req.params.id) {
				callback({
					results: object
					//requestTime: (new Date() - startDate)
				});
			} else {
				callback({
					results: object.results
					//requestTime: (new Date() - startDate)
				});
			}
		});
	})
}

router.get('/', function(req, res) {
	var startDate = new Date();
	var results = {};

	getType(req, res, function(types){
		var count = 0;
		types.results.forEach(function(type){

			count++;
			// Fetch every type
			Type.find({tid: count}, function(err, docs) {
				if (!docs || !docs.length){
					var typeModel = new Type({
						tid  : count,
						name : type.name
					});

					typeModel.save(function(err){
						//cb(err, type);
					});
				}
			});
		});
		
		results.results = types.results;

		results.totalRequestTime = (new Date() - startDate);
		res.json(results);
	});
});

router.get('/:id', function(req, res, next) {
	var startDate = new Date();
	var data = req.params.id;
	if (!data){
		return res.status(500).json("Not an valid id");
	}
	getType(req, res, function(types) {
		types.totalRequestTime = (new Date() - startDate);
		return res.status(200).json(types);
	});
});

function getPokemonByType(req, res, callback) {
	var startDate = new Date();
	var options = {
		host: 'pokeapi.co',
		port: 80,
		path: '/api/v2/type/',
		method: 'GET'
	};
	if (req.params.id){
		options.path += req.params.id.toString() + '/'
	}
	console.log(options);

	http.get(options, function(response) {
		var d = '';

		response.on('data', function (chunk) {
					// console.log("Response:: "+chunk);
			d += chunk;
		});

		response.on('end', function () {

			var object = JSON.parse(d);
			// console.log("OBJECT:: "+object.results);
			if (req.params.id) {
				callback({
					results: object.pokemon
					//requestTime: (new Date() - startDate)
				});
			} else {
				// callback({
				// 	results: object.results
				// 	//requestTime: (new Date() - startDate)
				// });
		console.log("Type:: error, id is compatible");
			}
		});
	})
}

router.get('/:id/pokemon', function(req, res, next) {
	var startDate = new Date();
	var data = req.params.id;
	if (!data){
		return res.status(500).json("Not an valid id");
	}
	getPokemonByType(req, res, function(types) {
		types.totalRequestTime = (new Date() - startDate);
		return res.status(200).json(types);
	});

});

module.exports = router;