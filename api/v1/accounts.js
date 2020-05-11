let logger = require('../../logger').get('API::Account');
let dblogger = require('../../logger').get('API::Account::DB');
const validator = require('./accounts/validate');
require('dotenv').config();

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@thedataexpress-wuepb.mongodb.net/test?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
let db = mongoose.connection;
db.on('error', dblogger.error);
db.once('open', () => dblogger.info('Connected'));

let Account, Accounts;
const createDB = () => {
	Accounts = mongoose.model('Accounts', require('./accounts/schema'));
	Account = Accounts; // link; sometimes Accounts makes sense, and sometimes Account makes sense
};

const create = (accountDetails) => {
	// Minimal input validation: ensure that all parameters are present
	// Proper validation occurs in account schema (accountSchema.js)
	// Just kidding; mongoose validation actin' wack, so we do it here
	if(!accountDetails) throw `Missing account description`;
	let params = [
		'username',
		'password',
		'email',
		'dob',
		'questions'
	];
	params.forEach((param) => {
		if(!accountDetails[param]) throw `Missing parameter ${param}`;
		validator.validate(param, accountDetails[param]);
	});
	console.log(accountDetails);
	accountDetails.questions.forEach((question) => {
		validator.validate('question', question);
	});

	// TODO check whether username is taken

	if(accountDetails.dob.constructor.name != 'Date')
		accountDetails.dob = new Date(accountDetails.dob);

	// Create a new user
	let account = new Account(accountDetails);
	account.save((err) => {
		// attempt to make error pretty, if we know what it is
		if(err) {
			// these indicate that the username is already taken
			if(err.code == 11000 && err.keyValue.hasOwnProperty('username'))
				// simple, user-readable message
				throw `Username '${err.keyValue.username}' already taken`;
			// we don't know what the error is, so just mongo-barf
			throw err;
		}
		// if there's no error, there's nothing to do
	});
	// if we got this far, then the user was created successfully. be happy
	return true;
};

// returns a not-promise:
//   https://mongoosejs.com/docs/queries.html#queries-are-not-promises
// just treat it like one; i.e.:
//   get('xXx_EdgyName_xXx').then(user => {})
const get = (username) => {
	return Accounts.findOne(
		{"username": username},
		(err, account) => {
			if(err) throw err;
			return account;
		}
	).exec();
};

const update = (username, details) => {
};

const remove = (username) => {
};

createDB();
module.exports = {
	create,
	get,
	update,
	remove
};
