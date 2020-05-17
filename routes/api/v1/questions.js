const logger = require('logger').get('HTTP::APIv1::Questions');
const QuestionsAPI = require('../../../api/v1/questions.js');
const {respond, requirePresenceOfParameter} = require('../../util');

const getOne = (req, res) => {
	if(!requirePresenceOfParameter(req.params.question_id, 'question_id', res)) return;
	QuestionsAPI.getOne(req.params.question_id).then((question) => {
		res.json(question);
	}).catch((err) => {
		respond(500, `Error while fetching question ${req.params.question_id}: ${err}`, res);
	});
};

const getBank = (req, res) => {
	if(!requirePresenceOfParameter(req.params.question_bank, 'question_bank', res)) return;
	QuestionsAPI.getBank(req.params.question_bank).then((questions) => {
		res.json(questions);
	}).catch((err) => {
		respond(500, `Error while fetching question bank ${req.params.question_bank}: ${err}`, res);
	});
};

const routes = [

	{
		uri: '/api/v1/questions/:question_id',
		method: 'get',
		handler: getOne
	},

	{
		uri: '/api/v1/questions/banks/:question_bank',
		method: 'get',
		handler: getBank
	},

];

module.exports = { logger, routes }
