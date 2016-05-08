var request = require('supertest');
var chai = require('chai');

var app = require('../app.js');

var route = "/pokemon/";

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if (err) return done(err);

			done(null, res);
		});
};

describe('Testing the pokemon route', function(){

	describe('without params', function(){
		it('should return all pokemons', function(done){

			makeRequest(route, 200, function(err, res){
				if (err) return done(err);

				chai.expect(res.body.results).to.not.be.undefined;
				done();

			});

			done();

		});
	});

	describe('no valid request', function(){
		it('should throw an internal server error aka 500', function(done){
			makeRequest(route+'notanid', 500, done);
		});
	})

});