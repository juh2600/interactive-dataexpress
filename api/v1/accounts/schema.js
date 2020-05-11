const mongoose = require('mongoose');
const validator = require('./validate');
const { wrapErrorForMongoose } = require('../util');

const securityQuestionAnswerPair = mongoose.Schema({
	id: mongoose.Schema.Types.ObjectID,
	answer: String
});

const accountSchema = mongoose.Schema({
	username: {
		type: String,
		unique: ['Username is already taken'],
		required: [ validator.exist.username ],
		validate: {
			validator: wrapErrorForMongoose(validator.valid.username)
		}
	},

	password: {
		type: String,
		required: [ validator.exist.password ],
		validate: {
			validator: wrapErrorForMongoose(validator.valid.password)
		}
	},

	email: {
		type: String,
		required: [ validator.exist.email ],
		validate: {
			validator: wrapErrorForMongoose(validator.valid.email)
		}
	},

	dob: {
		type: Date,
		required: [ validator.exist.dob ],
		validate: {
			validator: wrapErrorForMongoose(validator.valid.dob)
		}
	},

	questions: {

		type: [{
			type: securityQuestionAnswerPair,
			required: [ validator.exist.question ],
			validate: {
				validator: wrapErrorForMongoose(validator.valid.question)
			}
		}],

		required: [
			validator.exist.questions
		],
		validate: {
			validator: wrapErrorForMongoose(validator.valid.questions)
		}
	}

});

module.exports = accountSchema;
