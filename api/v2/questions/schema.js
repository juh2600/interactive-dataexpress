const mongoose = require('mongoose');
const validator = require('./validate');
const { wrapErrorForMongoose } = require('../util');

const questionSchema = mongoose.Schema({
	question: {
		type: String,
		unique: ['Question already exists'],
		required: [validator.exist.question],
		validate: {
			validator: validator.valid.question
		}
	},

	options: {
		type: [String]
	}
});


module.exports = questionSchema;
