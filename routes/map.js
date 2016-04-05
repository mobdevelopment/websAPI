var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var location = require('mongoose').model('Location');
var passport = require('passport');
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

	location.count({}, function(err, count){
		console.log(count);
	});

	location.find({}).exec(function(err, locations){
		if (err){ return next(err); }

		var filteredlocations = [];
		locations.forEach(function(fetchedLocation) {
			distance = calcDistance(fetchedLocation.lat, fetchedLocation.lng, lat, lng);
			if (distance < 1000){
				filteredlocations.push(fetchedLocation);
			}
		});

		if (filteredlocations.length < 10) {
			var toAdd = 10 - filteredlocations.length;
			console.log(toAdd);

			var newlocations = [];
			for (var i = 0; i < toAdd; i++){
				var randomlocation = randomLocation(lat, lng);

				// random id = random
				// pokeapi/pokemon/:randomid

				var newlocation = //new location({
					{
					"lat": randomlocation.lat,
					"lng": randomlocation.lng,
					"pid": 0,
					"name": "Pikachu",
				};

				newlocations.push(newlocation);
			}

			location.collection.insert(newlocations, function (err, docs){
				if (err){
					console.log("err: " + err);
				} else {
					docs.ops.forEach(function(doc){
						filteredlocations.push(doc);
					});
					return res.json(filteredlocations);
				}
			});
		} else {
			console.log('niets toegevoegd');
			return res.json(filteredlocations);
		}
	});
	
	/*var results = {};

	// Test data
	// lat: 51,688596111632876
	// lng: 5,285614259464238
	var lat = 51.688596111632876;
	var lng = 5.285614259464238;

	randomLocation(lat, lng, function(randomLocation){
		results.result = randomLocation;
		res.json(results);
	})*/
});


// Pokemon catch at location method
router.post('/', function(req, res){
	var post = req.body;
	// Case 
	var catched = (post.catched == "true" ? true : false);

	if (catched){
		// Add to user
		res.status(418).json("Not yet implemented");
	} else {
		location.findById(post._id, function(err, foundLocation){
			newlocation = randomLocation(foundLocation.lat, foundLocation.lng);

			foundLocation.lat = newlocation.lat;
			foundLocation.lng = newlocation.lng;

			foundLocation.save();
			res.status(200).json(foundLocation);
		});
	}
});

// DEBUG ROUTE
router.get('/distance', function(req, res){
	var lat1 = 51.688596111632876;
	var lng1 = 5.285614259464238;
	var lat2 = 51.71306638607302;
	var lng2 = 5.357598065527396;
	var results = {};

	distance = calcDistance(lat1, lng1, lat2, lng2)
	
	//results.distance = difference;
	res.json(distance);
});

module.exports = router;
