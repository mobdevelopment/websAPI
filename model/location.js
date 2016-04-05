var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
	lat: {type: Number, required: true},
	lng: {type: Number, required: true},
	pid: {type: Number, required: true},
	name: {type: String, required: true}
});

module.exports = mongoose.model('Location', locationSchema);