var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pokemonSchema = new Schema({
	name: {type: String, required: true, index: { unique: true } },
	password: {type: String, required: true}
});

mongoose.model('Pokemon', pokemonSchema);