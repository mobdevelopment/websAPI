var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

function getPokemon(callback){
	var startDate = new Date();
	var options = {
		host: 'pokeapi.co',
		port: 80,
		path: '/api/v2/pokemon/?limit=720',
		method: 'GET'
	};

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

	getPokemon(function(pokemons){
		pokemons.results.forEach(function(pokemon){
			// Fetch every pokemon
			pokemon.isCatched = false;
		});
		results.results = pokemons.results;

		results.totalRequestTime = (new Date() - startDate);
		res.json(results);
	});
});

module.exports = router;