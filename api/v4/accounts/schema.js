const mongoose = require('mongoose');
const validator = require('./validate');
const { wrapErrorForMongoose } = require('../util');

const accountSchema = mongoose.Schema({
	username: {
		type: String,
		unique: ['Username is already taken'],
		required: true,
		validate: { validator: wrapErrorForMongoose(validator.valid.username) }
	},

	password: {
		type: String,
		required: true
		// Mongoose/MongoDB doesn't need to know squat about validating our
		// passwords, because it will only ever get hashed output from bcrypt.
	},

	email: {
		type: String,
		required: true,
		validate: { validator: wrapErrorForMongoose(validator.valid.email) }
	},

	dob: {
		type: Date,
		required: true,
		validate: { validator: wrapErrorForMongoose(validator.valid.dob) }
	},

	answers: {
		type: [Number],
		required: true,
		validate: { validator: wrapErrorForMongoose(validator.valid.answers) }
	},

	avatar_args: {
		type: [Number],
		required: true,
		validate: { validator: wrapErrorForMongoose(validator.valid.avatar_args) }
	}


});

module.exports = mongoose.model('Account', accountSchema);
