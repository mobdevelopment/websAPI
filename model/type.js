var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
	tid: {type: Number, required: true, index: { unique: true } },
	name: {type: String, required: true, index: { unique: true } }
});

module.exports = mongoose.model('Type', typeSchema);