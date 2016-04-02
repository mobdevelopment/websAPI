function init(mongoose){
	var userSchema = new mongoose.Schema({
		username: {type: String, required: true, index: { unique: true } },
		password: {type: String, required: true}
	});
	
	mongoose.model('User', userSchema);
}

module.exports = init;