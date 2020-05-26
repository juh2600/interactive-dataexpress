let mongoose = require('mongoose');

// Wraps a given function in a try-catch block, but manipulates the caught error for compatibility with Mongoose nonsense.
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
