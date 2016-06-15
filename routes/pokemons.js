var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');
var Pokemon = require('mongoose').model('Pokemon');

function getPokemon(req, res, callback){
	var startDate = new Date();
	var options = {
		host: 'pokeapi.co',
		port: 80,
		path: '/api/v2/pokemon/',
		method: 'GET'
	};
	if (req.params.name){
		options.path += req.params.name.toString() + '/'
	} else {
		options.path += '?limit=720'
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
			if (req.params.name) {
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

	getPokemon(req, res, function(pokemons){
		var count = 0;
		pokemons.results.forEach(function(pokemon){

			count++;
			// Fetch every pokemon
			Pokemon.find({pid: count}, function(err, docs) {
				if (!docs || !docs.length){
					var pokemonModel = new Pokemon({
						pid  : count,
						name : pokemon.name
					});

					pokemonModel.save(function(err){
						//cb(err, pokemon);
						//console.log('we saved ' + pokemonModel.pid + ":" + pokemonModel.name + ' to the db');

					});
				}
			});
			

			pokemon.isCatched = false;
			if (user = req.user){
				var isCatched = user.pokemons.filter(function(){
					return this.pid == count;
				});
				if (isCatched && isCatched.length) pokemon.isCatched = true;

			}
		});
		

		results.results = pokemons.results;

		results.totalRequestTime = (new Date() - startDate);
		res.json(results);
	});
});

router.get('/:name', function(req, res, next){
	var startDate = new Date();
	var data = req.params.name;
	if (!data){
		return res.status(500).json("Not an valid identifier");
	}

	getPokemon(req, res, function(pokemons) {
		pokemons.totalRequestTime = (new Date() - startDate);
		return res.status(200).json(pokemons);
	});
});

module.exports = router;