let logger = require('../logger').get('API::Account');
let dblogger = require('../logger').get('API::Account::DB');
const validator = require('./accountsValidator');
require('dotenv').config();
console.log(process.env);

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@thedataexpress-wuepb.mongodb.net/test?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', dblogger.error);
db.once('open', dblogger.info);

const createDB = () => {
};

const create = (account) => {
	// Minimal input validation: ensure that all parameters are present
	// Proper validation occurs in account schema (accountSchema.js)
	if(!account) throw `Missing account description`;
	let params = [
		'username',
		'password',
		'email',
		'dob',
		'questions'
	];
	params.forEach((param) => {
		if(!account[param]) throw `Missing parameter ${param}`;
	});

	// TODO check whether username is taken

	if(account.date.constructor.name != 'Date')
		account.date = new Date(account.date);

	// Create a new user
};

const get = (username) => {
};

const update = (username, details) => {
};

const remove = (username) => {
};

module.exports = {
	create,
	get,
	update,
	remove
};
