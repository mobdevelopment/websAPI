var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true, index: { unique: true } },
	password: {type: String, required: true},
	pokemons: [{ type: Schema.Types.ObjectId, ref: 'Pokemon'}]
});

userSchema.path('username').required(true, 'username cannot be empty');
userSchema.path('password').required(true, 'password cannot be empty');


userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);