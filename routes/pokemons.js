var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

function getPokemon(req, res, callback){
	var startDate = new Date();
	var options = {
		host: 'pokeapi.co',
		port: 80,
		path: '/api/v2/pokemon/',
		method: 'GET'
	};

	if (req.params.id){
		options.path += req.params.id;
	} else {
		options.path += '?limit=720'
	}

	http.get(options, function(response) {
		var content = '';

		response.on('data', function (chunk) {
			content += chunk;
		});

		response.on('end', function () {
			var object = JSON.parse(content);

			callback({
				results: object.results
				//requestTime: (new Date() - startDate)
			});
		});
	});
}

router.get('/', function(req, res) {
	var startDate = new Date();
	var results = {};

	getPokemon(req, res, function(pokemons){
		pokemons.results.forEach(function(pokemon){
			// Fetch every pokemon
			pokemon.isCatched = false;
		});
		results.results = pokemons.results;

		results.totalRequestTime = (new Date() - startDate);
		res.json(results);
	});
});

router.get('/:id', function(req, res, next){
	if (data !== parseInt(req.params.id)){
		res.status(500);
		res.json("Not an valid id");
	}

	getPokemon(req, res, function(pokemons) {
		results.totalRequestTime = (new Date() - startDate);
		res.json(results);
	});
});

module.exports = router;