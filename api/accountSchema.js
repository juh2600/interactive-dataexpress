const mongoose = require('mongoose');
const { wrapErrorForMongoose } = require('./util');

const accountSchema = mongoose.Schema({
	username: {
		type: String,
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
			id: mongoose.Schema.Types.ObjectID,
			answer: {
				type: String,
				required: [ validator.exist.question ],
				validate: {
					validator: wrapErrorForMongoose(validator.valid.question)
				}
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
