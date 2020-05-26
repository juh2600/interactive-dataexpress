const API_VERSION = 'v4'
const logger = require('../../../logger').get(`HTTP::API${API_VERSION}::Accounts`);
const AccountsAPI = require(`../../../api/${API_VERSION}/accounts.js`);
const {respond, respondJSON} = require('../../util');

const createAccount = (req, res) => {
	AccountsAPI.create(req.body).then(() => {
		respond(201, 'Account created', res);
	}).catch((err) => {
		if(err.type == 'validation') {
			respond(400, err, res);
		} else {
			logger.error(JSON.stringify(err, null, '\t'));
			respond(500, err, res);
		}
	});
};

const updateAccount = (req, res) => {
	AccountsAPI.checkPassword(req.body.username, req.body.password)
		.then((ok) => {
			if(ok) {
				// good user/pass combo, go ahead and attempt the update
				AccountsAPI.update(req.body.username, req.body.changes)
					.then((ok) => {
						if(ok) respond(204, 'Account updated', res);
						else {
							// this should never happen; it means the update step
							// returned false instead of throwing an error
							logger.error(
								'Updating account returned not OK instead of throwing');
							respond(500,
								'Internal error occurred while updating account', res);
						}
					}).catch((err) => {
						// if we get here, the update step threw an error
						if(err.type == 'validation') {
							// input didn't pass validation; return object containing
							// messages from backend
							respond(400, err, res);
						} else {
							// something else went wrong
							logger.error(JSON.stringify(err, null, '\t'));
							respond(500, err, res);
						}
					});
			} else {
				// bad user/pass combo
				respond(401, {
					'type': 'authentication',
					'message': 'Username/password mismatch'
				}, res);
			}
		}).catch((err) => {
			// something went wrong while checking the password
			// this shouldn't happen
			if(err.type == 'missing argument') {
				respond(400, err, res);
			} else {
				logger.error(JSON.stringify(err, null, '\t'));
				respond(500, err, res);
			}
		});
};

const checkPassword = (req, res) => {
	AccountsAPI.checkPassword(req.body.username, req.body.password)
		.then((ok) => {
			if(ok) respond(204, null, res);
			else respond(401, {
				'type': 'authentication',
				'message': 'Username/password mismatch'
			}, res);
	}).catch((err) => {
		logger.error(JSON.stringify(err, null, '\t'));
		respond(500, err, res);
	});
};

const validate = (req, res) => {
	AccountsAPI.validate(req.body)
		.then((ok) => {
			if(ok) {
				respond(204, null, res);
			} else {
				logger.error(
					'Validating input returned not OK instead of throwing');
				respond(500,
					'Internal error occurred while validating input', res);
			}
	}).catch((err) => {
		if(err.type == 'validation') {
			respond(200, err, res);
		} else {
			logger.error(JSON.stringify(err, null, '\t'));
			respond(500, err, res);
		}
	});
};

const routes = [
	{
		uri: `/api/${API_VERSION}/accounts/create`,
		method: 'post',
		handler: createAccount
	},

	{
		uri: `/api/${API_VERSION}/accounts/update`,
		method: 'post',
		handler: updateAccount
	},

	{
		uri: `/api/${API_VERSION}/accounts/authenticate/password`,
		method: 'post',
		handler: checkPassword
	},

	{
		uri: `/api/${API_VERSION}/accounts/validate`,
		method: 'post',
		handler: validate
	}

];

module.exports = { logger, routes };
