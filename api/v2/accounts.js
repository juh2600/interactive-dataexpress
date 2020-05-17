let logger = require('../../logger').get('API::Accounts');
let dblogger = require('../../logger').get('API::Accounts::DB');
const validator = require('./accounts/validate');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

let Account, Accounts;
const createDB = () => {
	if(!db.models.hasOwnProperty('Accounts'))
		require('./accounts/schema')
	Accounts = mongoose.models['Accounts'];
	Account = Accounts; // link; sometimes Accounts makes sense, and sometimes Account makes sense
};

const hashStuff = (accountDetails) => {
	if(accountDetails.password)
		accountDetails.password = bcrypt.hashSync(accountDetails.password, 10);
	return accountDetails;
};

const create = async (accountDetails) => {
	if (!accountDetails) throw `Missing account description`;
	let params = [ 'username', 'password', 'email', 'dob', 'answers' ];
	if (accountDetails.dob && accountDetails.dob.constructor.name != 'Date')
		accountDetails.dob = new Date(accountDetails.dob);
	params.forEach((param) => {
		if (!accountDetails[param]) throw `Missing parameter ${param}`;
		validator.validate(param, accountDetails[param]);
	});
	
	if(!accountDetails.answers.forEach) throw `Answers need to be an array with length of at least ${process.env.ANSWER_COUNT}`;
	if(accountDetails.answers.length < process.env.ANSWER_COUNT) throw `Not enough answers: expected at least ${process.env.ANSWER_COUNT}; found ${accountDetails.answers.length}`;
	accountDetails.answers.forEach((answer) => {
		validator.validate('answer', answer);
	});

	accountDetails = hashStuff(accountDetails);

	return get(accountDetails.username).then((user) => {
		if (user) throw `Username "${user.username}" is already taken`;
		let account = new Account(accountDetails);
		account.save((err) => { if (err) { throw err; } });
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
		if (account && account.toObject) return account.toObject();
		return account;
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
	).exec().then((account) => {
		if(!account) return false;
		return bcrypt.compareSync(password, account.password);
	});
};

const getAnswers = async (username) => {
	return get(username).then(async (account) => {
		return account.answers;
	});
};

createDB();
module.exports = {
	create,
	get,
	update,
	remove,
	checkPassword,
	getAnswers
};
