const logger = require('logger').get('HTTP::APIv1::Accounts');
const AccountsAPI = require('../api/v1/accounts.js');
const {respond, requirePresenceOfParameter} = require('./util');

const createAccount = (req, res) => {
	let giveUp = false;
	['username', 'password', 'email', 'dob', 'questions'].forEach((param) => {
		if(!requirePresenceOfParameter(req.body[param], param, res))
			giveUp = true;
    });
    if(giveUp) return;
	AccountsAPI.create(req.body).then(() => {
		respond(204, 'Account created', res);
	}).catch((err) => {
		respond(500, `Error while creating account: ${err}`, res)
	});
};

const updateAccount = (req, res) => {
    if(!requirePresenceOfParameter(req.body.username, 'username', res)) return;
    if(!requirePresenceOfParameter(req.body.password, 'password', res)) return;
    if(!requirePresenceOfParameter(req.body.changes, 'changes', res)) return;
    AccountsAPI.checkPassword(req.body.username, req.body.password).then((ok) => {
        if(!ok) {
            respond(401, 'Username/password mismatch', res);
            return;
        }
        return AccountsAPI.update(req.body.username, req.body.changes);
    })
    .then(() => respond(204, 'Account updated', res))
    .catch((err) => respond(500, `Error while updating account: ${err}`, res));
};

const checkPassword = (req, res) => {
    if(!requirePresenceOfParameter(req.body.username, 'username', res)) return;
    if(!requirePresenceOfParameter(req.body.password, 'password', res)) return;
    AccountsAPI.checkPassword(req.body.username, req.body.password).then((ok) => {
        if(ok) respond(204, 'OK', res);
        else respond(401, 'Incorrect username/password', res);
    }).catch((err) => {respond(500, 'Error while checking password', res)});
};

const checkSecurityQuestion = (req, res) => {
    if(!requirePresenceOfParameter(req.body.username, 'username', res)) return;
    if(!requirePresenceOfParameter(req.body.question_id, 'question_id', res)) return;
    if(!requirePresenceOfParameter(req.body.answer, 'answer', res)) return;
    AccountsAPI.checkSecurityQuestion(req.body.username, req.body.question_id, req.body.answer).then((ok) => {
        if(ok) respond(204, 'OK', res);
        else respond(401, 'Incorrect username/question id/answer', res);
    }).catch((err) => {respond(500, 'Error while checking security question', res)});
};

const routes = [
    {
        uri: '/api/v1/accounts/create',
        method: 'post',
        handler: createAccount
    },

    {
        uri: '/api/v1/accounts/update',
        method: 'post',
        handler: updateAccount
    },

    {
        uri: '/api/v1/accounts/authenticate/password',
        method: 'post',
        handler: checkPassword
    },

    {
        uri: '/api/v1/accounts/authenticate/question',
        method: 'post',
        handler: checkSecurityQuestion
    }

];

module.exports = { logger, routes }
