let   logger = require('../../logger').get('APIv3::Accounts');
let dblogger = require('../../logger').get('APIv3::Accounts::DB');

const validator = require('./accounts/validate');
const bcrypt    = require('bcryptjs');
require('dotenv').config();


// #just mongoose things
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let url = 'mongodb+srv://'
	+ process.env.DB_USER
	+ ':'
	+ process.env.DB_PASS
	+ '@'
	+ process.env.DB_NAME
	+ '-wuepb.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
mongoose.connection.on('error', dblogger.error);
mongoose.connection.once('open', () => dblogger.info('Connected'));


// Define our schema...
let Account, Accounts;
const createDB = () => {
	// ...only if we haven't already. This is important in case this
	// function is run multiple times in a program.
	if(!mongoose.connection.models.hasOwnProperty('Account'))
		require('./accounts/schema');
	// Either way, define the names we will use below.
	Account = mongoose.models['Account'];
	// link; sometimes Accounts makes sense, and sometimes Account makes
	// sense
	Accounts = Account;
};


// Handles hashing anything a record might need hashed before storage.
const hashStuff = (accountDetails) => {
	if(accountDetails.password)
		accountDetails.password =
			bcrypt.hashSync(accountDetails.password, 10);
	return accountDetails;
};

/**
 * Every exposed function in this API has two things in common:
 * 	- They are all async: every method returns a promise
 * 	- Any errors thrown will take the form of an object with at least two
 * 	  keys, 'type' and 'message'
 * Any method that does not have an obvious value to return must return a
 * boolean (wrapped in a promise) indicating whether the operation was
 * successful.
 */


/**
 * Create an account. Accepts an object with all of the necessary
 * parameters.
 */
const create = async (accountDetails) => {
	/**
	 * Validate user data
	 */
	// they better at least pretend to give us a little data
	if (!accountDetails) throw {
		type: 'missing argument',
		message: 'Missing account description'
	};

	// Ensure that the date is a date object.
	accountDetails.dob = new Date(accountDetails.dob);

	// run validation
	await validate(accountDetails,
		Object.keys(Account.schema.paths).filter(x => x[0] != '_'));

	/**
	 * Secure user data
	 * Hash the password and anything else that needs hashing.
	 */
	accountDetails = hashStuff(accountDetails);

	/**
	 * Create user
	 * If we've gotten this far, we know the username is
	 * available and all the data is good. Create a new user.
	 */
	let account = new Account(accountDetails);
	account.save((err) => {
		if (err) {
			throw {
				type: 'db',
				message: err
			};
		}
	});
	return true; // if we made it this far, we deserve a treat
};


// get('xXx_EdgyName_xXx').then(user => {})
/**
 * Get all available information about a user, given their username.
 * Scrubs sensitive data such as passwords from the results.
 * Returns null if no such user exists.
 */
const get = async (username) => {
	if(!username) throw {
		type: 'missing argument',
		message: 'Missing username'
	};
	return Accounts.findOne(
		{"username": username}, // match by username
		(err) => {if(err) throw err;}
	).exec()
		.then((account) => {
			// .exec() turns the not-promise into a real promise
			if (account) {
				// Mongoose sticks a bunch of crap in the result, but we can get
				// rid of it with .toObject().
				// https://stackoverflow.com/q/48084655/6627273
				if(account.toObject) account = account.toObject();
				// Scrub sensitive data
				account.password = undefined;
				delete account.password; // not sure if this really works
			}
			return account;
		})
		.catch((err) => {
			if (err) throw {
				type: 'db',
				message: err
			};
		});
};


/**
 * Update the given user's information. Only change fields that are
 * provided. Updated data is subject to the same validation as data used
 * to create a new account.
 */
const update = async (username, changes) => {
	/**
	 * Validate user data
	 */
	if(!username) throw {
		type: 'missing argument',
		message: 'Missing username'
	}

	// if they didn't ask for any changes, skip the rest of the process
	if(!changes || Object.keys(changes).length == 0) return true;

	// Ensure that the date is a date object
	if(changes.dob) changes.dob = new Date(changes.dob);

	// Attempt to validate each key-value pair in the object of changes to
	// apply.
	await validate(changes);

	/**
	 * Secure user data
	 * Hash the password, if present, and anything else that needs hashing.
	 */
	changes = hashStuff(changes);

	/**
	 * Update user account
	 */
	return Accounts.updateOne({"username": username}, changes)
		.then((result) => !!result.ok); // return whether operation worked
};


/**
 * Remove a user account by username.
 * Why doesn't this method require a password before destroying data? For
 * that matter, why doesn't the update method require it either? This API
 * doesn't care about permissions; it assumes that if you can do
 * something, you're allowed to do it. Authorizing requests for changes
 * or access to user data is the responsibility of the caller of this
 * API.
 */
const remove = async (username) => {
	return Accounts.deleteOne({"username": username})
		.then((result) => !!result.ok); // return whether operation worked
};


/**
 * Check a username/password combination.
 * Returns true if the password belongs to the username, and false in all
 * other scenarios, including when the user does not exist.
 */
const checkPassword = async (username, password) => {
	let errors = {};
	if(!username) {
		errors.type = 'missing argument';
		errors.message = 'Missing argument';
		errors.username = 'Username is required but was not provided';
	}
	if(!password) {
		errors.type = 'missing argument';
		errors.message = 'Missing argument';
		errors.password = 'Password is required but was not provided';
	}
	if(Object.keys(errors).length > 0) throw errors;
	return Accounts.findOne(
		{"username": username},
		(err) => {if (err) throw err;}
	).exec()
		.then((account) => {
			if(!account) return false;
			return bcrypt.compareSync(password, account.password);
		})
		.catch((err) => {
			if (err) throw {
				type: 'db',
				message: err
			};
		});
};


/**
 * Get the answers stored with the given user account.
 */
const getAnswers = async (username) => {
	return get(username).then((account) => {
		return account.answers;
	});
};

/**
 * Allow the caller to validate an arbitrary set of data.
 * The `keys' parameter is optional. If present, the method will only
 * attempt to validate the keys in the array. If omitted, the method will
 * attempt to validate every key in the data.
 */
const validate = async (data, keys) => {
	if(keys === undefined || keys === null) keys = Object.keys(data);
	if(keys.constructor.name == 'String') keys = [keys];
	if(keys.constructor.name == 'Object') keys = Object.keys(keys);
	if(data.dob) data.dob = new Date(data.dob);
	errors = {};
	keys.forEach((key) => {
		let result = validator.validate(key, data[key]);
		if(result) {
			errors.type    = 'validation';
			errors.message = 'Parameters did not pass validation.'
			errors[key]  = result;
		}
	});

	// If we want to check the username...
	if(keys.indexOf('username') >= 0) {
		// ...check whether a user with the same name already exists.
		if(data.username) {
		await get(data.username).then((user) => {
			// If the search for a user with this name turns up something, tell
			// the caller that this username is taken.
			if (user) {
				errors.type     = 'validation';
				errors.message  = 'Parameters did not pass validation.'
				errors.username = `Username "${user.username}" is already taken`;
			}
		});
		} else {
				errors.type     = 'validation';
				errors.message  = 'Parameters did not pass validation.'
				errors.username = `Username is required but was not provided`;
		}
	}
	if(Object.keys(errors).length > 0) throw errors;
	return true;
};

createDB();
module.exports = {
	create,
	get,
	update,
	remove,
	checkPassword,
	getAnswers,
	validate
};
