var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var location = require('mongoose').model('Location');
var Pokemon = require('mongoose').model('Pokemon');
var passport = require('passport');
var async = require('async');
var http = require('http');
//var controller = require('../controller/userController.js');

if (typeof(Number.prototype.toRad) === "undefined"){
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
}

function randomLocation(userLat, userLng) {
	var radius = (1000/3)/111000;

	var u = Math.random();
	var v = Math.random();

	var w = radius * Math.sqrt(u);
	var t = 2 * Math.PI * v;
	var x = w * Math.cos(t);
	var y1 = w * Math.sin(t);

	var x1 = x / Math.cos(userLat);

	return {
		lat: y1 + userLat,
		lng: x1 + userLng
	};
}

function calcDistance(userLat, userLng, pokeLat, pokeLng){
	var R = 6371000;
	var phi1 = userLat.toRad();
	var phi2 = pokeLat.toRad();

	var deltaPhi = (pokeLat - userLat).toRad();
	var deltaLamba = (pokeLng - userLng).toRad();

	var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
			Math.cos(phi1) * Math.cos(phi2) *
			Math.sin(deltaLamba/2) * Math.sin(deltaLamba/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R *c;


	return d;
}

// Get pokemon at location
router.get('/', function(req, res){
	var startDate = new Date();

	if (!req.query.lat || !req.query.lng){
		res.status(400).json("Your location has not been included");
	}

	var lat = parseFloat(req.query.lat);
	var lng = parseFloat(req.query.lng);

	var requiredWithinRange = 10;

	location.find({}).exec(function(err, locations){
		if (err){ return next(err); }

		var filteredlocations = [];
		locations.forEach(function(fetchedLocation) {
			console.log(fetchedLocation);
			distance = calcDistance(fetchedLocation.lat, fetchedLocation.lng, lat, lng);
			if (distance < 1000){
				filteredlocations.push(fetchedLocation);
			}
		});

		if (filteredlocations.length < requiredWithinRange) {
			var toAdd = requiredWithinRange - filteredlocations.length;
			var completed = 0;

			var newlocations = [];
			for (var i = 0; i < toAdd; i++){
				var randomlocation = randomLocation(lat, lng);
				newlocations.push({
					lat: randomlocation.lat,
					lng: randomlocation.lng,
				});
			}

			var callbacks = 0;

			async.forEach(newlocations, function(item, callback){
				Pokemon.findOne().skip(Math.random() * 720).exec(function(err, result){
					item.pid = result.pid;
					item.name = result.name;

					location.collection.insert(item, function(err, docs){
						if (err) console.log("fout opgetreden: " + err);
					});
					locations.push(item);

					callbacks++;
					if (callbacks == toAdd){
						return res.status(200).json(locations);
					}
				});				
			});

		} else {
			return res.status(200).json(locations);
		}
	});
});


// Pokemon catch at location method
router.post('/', function(req, res){
	var post = req.body;

	if (req.user === undefined){
		res.status(401).json("No logged in user found");
	}

	var user = req.user;

	// Case 
	var catched = (post.caught == "true" ? true : false);

	if (catched){
		var pokemonId = post.pokemon.pid;

		Pokemon.findOne({ pid: pokemonId }).exec(function(err, doc){
		//Pokemon.findById(post._id, function(err, doc){
			//return res.json(user);
			user.pokemons.push(doc);

			user.save();

			return res.status(200).json(req.user);
		})
	} else {
		location.findById(post._id, function(err, foundLocation){
			newlocation = randomLocation(foundLocation.lat, foundLocation.lng);

			foundLocation.lat = newlocation.lat;
			foundLocation.lng = newlocation.lng;

			foundLocation.save();
			return res.status(200).json(foundLocation);
		});
	}
});

router.get('/pokedex', function(req, res){
	res.json(req.user);
});

// DEBUG ROUTE
router.get('/distance', function(req, res){
	var lat1 = 51.688596111632876;
	var lng1 = 5.285614259464238;
	var lat2 = 51.71306638607302;
	var lng2 = 5.357598065527396;
	var results = {};

	distance = calcDistance(lat1, lng1, lat2, lng2)
	res.json(distance);
});

module.exports = router;
