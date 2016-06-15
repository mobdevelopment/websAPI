var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
	tid: {type: Number, required: true, index: { unique: true } },
	name: {type: String, required: true, index: { unique: true } }
});

typeSchema.path('tid').required(true, 'type id cannot be empty');
typeSchema.path('name').required(true, 'type name cannot be empty');


module.exports = mongoose.model('Type', typeSchema);