let mongoose = require('mongoose');

const wrapErrorForMongoose = (func) => {
	return (...argv) => {
		try {
			return func(...argv);
		} catch(err) {
			return new mongoose.Error(err);
		}
	};
};

module.exports = {
	wrapErrorForMongoose
};
