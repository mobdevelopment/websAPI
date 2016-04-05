var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pokemonSchema = new Schema({
	pid: {type: Number, required: true, index: { unique: true } },
	name: {type: String, required: true, index: { unique: true } }
});

module.exports = mongoose.model('Pokemon', pokemonSchema);