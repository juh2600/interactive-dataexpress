let logger = require('../../logger').get('API::Accounts');
let dblogger = require('../../logger').get('API::Accounts::DB');
const validator = require('./accounts/validate');
const bcrypt = require('bcryptjs');
const QuestionsAPI = require('./questions');
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

const hashStuff = (accountDetails) => {
	if(accountDetails.password)
		accountDetails.password = bcrypt.hashSync(accountDetails.password, 10);
	return accountDetails;
};

const create = async (accountDetails) => {
	// Minimal input validation: ensure that all parameters are present
	// Proper validation occurs in account schema (accountSchema.js)
	// Just kidding; mongoose validation actin' wack, so we do it here
	if (!accountDetails) throw `Missing account description`;
	let params = [
		'username',
		'password',
		'email',
		'dob',
		'questions'
	];
	if (accountDetails.dob && accountDetails.dob.constructor.name != 'Date')
		accountDetails.dob = new Date(accountDetails.dob);
	params.forEach((param) => {
		if (!accountDetails[param]) throw `Missing parameter ${param}`;
		validator.validate(param, accountDetails[param]);
	});
	if(!accountDetails.questions.forEach) throw `Questions need to be an array with length of at least ${process.env.MIN_SECURITY_QUESTIONS}`;
	if(accountDetails.questions.length < process.env.MIN_SECURITY_QUESTIONS) throw `Not enough questions: expected at least ${process.env.MIN_SECURITY_QUESTIONS}; found ${accountDetails.questions.length}`;
	accountDetails.questions.forEach((question) => {
		validator.validate('question', question);
	});

	// accountDetails.password = bcrypt.hashSync(accountDetails.password, 10);
	// for (let q in accountDetails.questions) {
	// 	accountDetails.questions[q].answer = bcrypt.hashSync(accountDetails.questions[q].answer, 10);
	// }
	accountDetails = hashStuff(accountDetails);

	return get(accountDetails.username).then((user) => {
		if (user) throw `Username "${user.username}" is already taken`;
		let account = new Account(accountDetails);
		account.save((err) => {
			// attempt to make error pretty, if we know what it is
			if (err) {
				// we don't know what the error is, so just mongo-barf
				throw err;
			}
			// if there's no error, there's nothing to do
		});
		// if we got this far, then the user was created successfully. be happy
		return true;
	});

	// Create a new user
};

//   get('xXx_EdgyName_xXx').then(user => {})
const get = async (username) => {
	return Accounts.findOne(
		{ "username": username },
		(err, account) => {
			if (err) throw err;
			return account;
		}
	).exec().then((account) => {
		if (account) {
			account.password = undefined;
		}
		return account.toObject();
	});
};

const update = async (username, details) => {
	if (details.dob && details.dob.constructor.name != 'Date')
		details.dob = new Date(details.dob);
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

	details = hashStuff(details);

	return Accounts.updateOne(
		{ "username": username },
		details
	).then((result) => !!result.ok);
};

const remove = async (username) => {
	return Accounts.deleteOne(
		{ "username": username }
	);
};

const checkPassword = async (username, password) => {
	return Accounts.findOne(
		{ "username": username },
		(err, account) => {
			if (err) throw err;
		}
	).exec().then((account) => bcrypt.compareSync(password, account.password));
};

const getSecurityQuestions = async (username) => {
	return get(username).then(async (account) => {
		let qs = [];
		for(let q in account.questions) {
			await QuestionsAPI
				.getOne(account.questions[q])
				.then(q => { qs.push(q); });
		}
		return qs;
	});
};

createDB();
module.exports = {
	create,
	get,
	update,
	remove,
	checkPassword,
	getSecurityQuestions
};
