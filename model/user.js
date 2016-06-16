var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	local: {
		username: { type: String, required: false, index: { unique: true } },
		password: { type: String, required: false },
	},
	facebook: {
		id: { type: String, required: false },
		token: { type: String, required: false },
		email: { type: String, required: false },
		name: { type: String, required: false },
	},
	twitter: {
		id: { type: String, required: false },
		token: { type: String, required: false },
		displayName: { type: String, required: false },
		username: { type: String, required: false },
	},
	google: {
		id: { type: String, required: false },
		token: { type: String, required: false },
		email: { type: String, required: false },
		name: { type: String, required: false },
	},
	pokemons: [{ type: Schema.Types.ObjectId, ref: 'Pokemon'}],
	Admin: { type: Boolean, required: true, default: true }
});

// userSchema.path('username').required(true, 'username cannot be empty');
// userSchema.path('password').required(true, 'password cannot be empty');


userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

// userSchema.methods.hasAnyRole = function(role) {
// 	if(!Array.isArray)
// }

module.exports = mongoose.model('User', userSchema);