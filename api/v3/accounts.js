let logger = require('../../logger').get('APIv2::Accounts');
let dblogger = require('../../logger').get('APIv2::Accounts::DB');

const validator = require('./accounts/validate');
const bcrypt = require('bcryptjs');
require('dotenv').config();


// #just mongoose things
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_NAME}-wuepb.mongodb.net/test?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
let db = mongoose.connection;
db.on('error', dblogger.error);
db.once('open', () => dblogger.info('Connected'));


// Define our schema...
	let Account, Accounts;
const createDB = () => {
	// ...only if we haven't already. This is important in case this function is run multiple times in a program.
		if(!db.models.hasOwnProperty('Accounts'))
	require('./accounts/schema');
	// Either way, define the names we will use below.
		Accounts = mongoose.models['Accounts'];
	Account = Accounts; // link; sometimes Accounts makes sense, and sometimes Account makes sense
};


// Handles hashing anything a record might need hashed before storage.
	const hashStuff = (accountDetails) => {
		if(accountDetails.password)
			accountDetails.password = bcrypt.hashSync(accountDetails.password, 10);
		return accountDetails;
	};


/** Create an account. Accepts an object with all of the necessary parameters, listed in the `let params' line below.
	*/
	const create = async (accountDetails) => {
		/** Validate user data
			*/
			// Ensure we were given _something_ for each parameter we need.
			if (!accountDetails) throw `Missing account description`;
		// Ensure that the date is a date object.
			if (accountDetails.dob && accountDetails.dob.constructor.name != 'Date')
		accountDetails.dob = new Date(accountDetails.dob);
		// Ensure that our parameters are valid, using our validation rules specified in `./accounts/validate'
		let params = [ 'username', 'password', 'email', 'dob', 'answers' ];
		params.forEach((param) => {
			if (!accountDetails[param]) throw `Missing parameter ${param}`;
			validator.validate(param, accountDetails[param]);
		});
		// Ensure that our answers array is in fact an array.
			if(!accountDetails.answers.forEach) throw `Answers need to be an array with length of at least ${process.env.ANSWER_COUNT}`;
		// Ensure that we have at least as many answers as we require.
			if(accountDetails.answers.length < process.env.ANSWER_COUNT) throw `Not enough answers: expected at least ${process.env.ANSWER_COUNT}; found ${accountDetails.answers.length}`;
		// If we want to validate our answers somehow, such as making sure they're within a valid range, we can do that here.
			accountDetails.answers.forEach((answer) => {
				validator.validate('answer', answer);
			});

		/** Secure user data
			*/
			// Hash the password and anything else that needs hashing.
			accountDetails = hashStuff(accountDetails);

		/** Create user
			*/
			// Check if a user with the same name already exists.
			return get(accountDetails.username).then((user) => {
				// If the search for a user with this name turns up something, tell the caller that this username is taken.
					if (user) throw `Username "${user.username}" is already taken`;
				// Otherwise, create a new user.
					let account = new Account(accountDetails);
				account.save((err) => { if (err) { throw err; } });
				return true; // This value is returned wrapped in a promise, for consistency with the rest of the API.
			});
	};


// get('xXx_EdgyName_xXx').then(user => {})
/** Get all available information about a user, given their username. Scrubs sensitive data such as passwords from the results.
	* Returns null if no such user exists.
	*/
	const get = async (username) => {
		return Accounts.findOne(
			{ "username": username }, // match by username
			(err, account) => {
				if (err) throw err;
				return account;
			}
		).exec().then((account) => { // .exec() turns the not-promise into a real promise: https://mongoosejs.com/docs/queries.html#queries-are-not-promises
			if (account) {
				// Scrub sensitive data
				account.password = undefined;
			}
			// Mongoose sticks a bunch of crap in the result, but we can get rid of it with .toObject().
				// https://stackoverflow.com/q/48084655/6627273
			if (account && account.toObject) return account.toObject();
			return account; // However, don't depend on the method being present---for example, if the result is null, we can't do the above.
		});
	};


/** Update the given user's information. Only change fields that are provided. Updated data is subject to the same validation
	* as data used to create a new account.
	*/
	const update = async (username, details) => {
		/** Validate user data
			*/
			// Ensure that the date is a date object
		if (details.dob && details.dob.constructor.name != 'Date')
			details.dob = new Date(details.dob);
		// Attempt to validate each key-value pair in the object of details to change.
			// If we cannot find a method to validate the pair, assume it is irrelevant and delete it.
			Object.keys(details).forEach((key) => {
				try {
					validator.validate(key, details[key]);
				} catch (err) {
					if (/Method not found/i.test(err))
						details[key] = undefined;
					else
						throw err;
				}
			});

		/** Secure user data
			*/
			// Hash the password, if present, and anything else that needs hashing.
			details = hashStuff(details);

		/** Update user account
			*/
			return Accounts.updateOne(
				{ "username": username },
				details
			).then((result) => !!result.ok); // Cast whatever that was to a boolean and return it wrapped in a promise, for consistency with the rest of the API.
	};


/** Remove a user account by username.
	* Why doesn't this method require a password before destroying data? For that matter, why doesn't the update method require it either?
	* This API doesn't care about permissions; it assumes that if you can do something, you're allowed to do it. Authorizing requests for
	* changes or access to user data is the responsibility of the caller of this API.
	*/
	const remove = async (username) => {
		return Accounts.deleteOne(
			{ "username": username }
		); // Return some meaningless information wrapped in a promise, for consistency with the rest of the API.
	};


/** Check a username/password combination.
	* Returns true if the password belongs to the username, and false in all other scenarios, including when the user does not exist.
	* Result is wrapped in a promise for consistency with the rest of the API.
	*/
	const checkPassword = async (username, password) => {
		return Accounts.findOne(
			{ "username": username },
			(err, account) => {
				if (err) throw err;
			}
		).exec().then((account) => {
			if(!account) return false;
			return bcrypt.compareSync(password, account.password);
		});
	};


/** Get the answers stored with the given user account.
	* Result is wrapped in a promise for consistency with the rest of the API.
	*/
	const getAnswers = async (username) => {
		return get(username).then((account) => {
			return account.answers;
		});
	};


	const getAnswerFrequency = async () => {
		return Accounts.find(
			(err, accounts) => {
				if (err) throw err;
				return accounts;
			}
		).exec().then((accounts) => { 
			let data = {questions:[
				{title: "When is Joe's birthday?", options:[{name:'Jan 09 1998', frequency: 0, correct: false}, {name:'Oct 03 1998', frequency: 0, correct: true}, {name:'Nov 11 1999', frequency: 0, correct: false}, {name:'May 14 1997', frequency: 0, correct: false} ]},
				{title: "When was the US Constitution signed?", options:[{name:'1783', frequency: 0, correct: false}, {name:'1776', frequency: 0, correct: false}, {name:'1787', frequency: 0, correct: true}, {name:'1912', frequency: 0, correct: false} ]},
				{title: "Who is the best Disney Princess?", options:[{name:'Mulan', frequency: 0, correct: true}, {name:'Rapunzel', frequency: 0, correct: false}, {name:'Ariel', frequency: 0, correct: false}, {name:'Cinderella', frequency: 0, correct: false} ]}
			]};
			accounts.forEach(account => {
				for(let i = 0; i < 3; i++) {
					data.questions[i].options[account.answers[i]].frequency += 1;
				}
			});
			return data;
		});
	};

createDB();
module.exports = {
	create,
	get,
	update,
	remove,
	checkPassword,
	getAnswers,
	getAnswerFrequency
};
